import { useCallback, useEffect, useState } from 'react';
import { BADGES, LESSONS, LEVELS } from '../data/tunisianCurriculum';
import {
  ActivityEntry,
  BadgeDefinition,
  LevelInfo,
  RewardNotification,
  StudentProgress,
  SubjectId,
} from '../types/curriculum';

const STORAGE_KEY = 'manarat_khamisa_progress_v2';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const createInitialProgress = (): StudentProgress => {
  const today = getTodayKey();
  return {
    studentName: 'ياسين بن علي',
    schoolGovernorate: 'تونس — السنة الخامسة ابتدائي',
    points: 115,
    streakDays: 3,
    lastActiveDate: today,
    completedLessons: {
      'math-fractions': {
        bestScore: 3,
        totalQuestions: 4,
        attempts: 1,
        lastCompletedAt: today,
      },
    },
    completedSteps: {
      'math-fractions': [0, 1, 2],
      'science-circuit': [0],
    },
    unlockedBadges: {
      'first-step': today,
    },
    equippedBadgeId: 'first-step',
    expressChallengesCompleted: 0,
    activityLog: [
      {
        id: 'seed-1',
        lessonId: 'math-fractions',
        title: 'الأعداد الكسرية والمقارنة',
        subjectId: 'math',
        score: 3,
        total: 4,
        pointsEarned: 85,
        date: today,
        mode: 'lesson',
      },
    ],
  };
};

function evaluateNewBadges(candidate: StudentProgress): BadgeDefinition[] {
  const completedCount = Object.keys(candidate.completedLessons).length;
  const newlyUnlocked: BadgeDefinition[] = [];

  for (const badge of BADGES) {
    if (candidate.unlockedBadges[badge.id]) continue;

    let meets = false;
    switch (badge.id) {
      case 'first-step':
        meets = completedCount >= 1;
        break;
      case 'perfect-score':
        meets = Object.values(candidate.completedLessons).some(
          (c) => c.totalQuestions > 0 && c.bestScore >= c.totalQuestions
        );
        break;
      case 'lazy-breaker':
        meets = candidate.expressChallengesCompleted >= 1;
        break;
      case 'science-explorer':
        meets =
          LESSONS.filter(
            (l) => l.subjectId === 'science' && candidate.completedLessons[l.id]
          ).length >= 2;
        break;
      case 'math-knight':
        meets =
          LESSONS.filter(
            (l) => l.subjectId === 'math' && candidate.completedLessons[l.id]
          ).length >= 2;
        break;
      case 'bilingual-star': {
        const hasAr = LESSONS.some(
          (l) => l.subjectId === 'arabic' && candidate.completedLessons[l.id]
        );
        const hasFr = LESSONS.some(
          (l) => l.subjectId === 'french' && candidate.completedLessons[l.id]
        );
        meets = hasAr && hasFr;
        break;
      }
      case 'points-250':
        meets = candidate.points >= 250;
        break;
      case 'master-500':
        meets = candidate.points >= 500;
        break;
    }

    if (meets) {
      newlyUnlocked.push(badge);
    }
  }

  return newlyUnlocked;
}

export function getLevelInfo(points: number): LevelInfo {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (points >= lvl.minPoints) {
      current = lvl;
    }
  }
  return current;
}

export function useStudentProgress() {
  const [progress, setProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as StudentProgress;
      }
    } catch {
      // Fallback to initial state
    }
    return createInitialProgress();
  });

  const [rewardNotification, setRewardNotification] =
    useState<RewardNotification | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const dismissRewardNotification = useCallback(() => {
    setRewardNotification(null);
  }, []);

  const markStepCompleted = useCallback((lessonId: string, stepIndex: number) => {
    setProgress((prev) => {
      const existing = prev.completedSteps[lessonId] || [];
      if (existing.includes(stepIndex)) return prev;

      const today = getTodayKey();
      const basePoints = 15;
      let nextState: StudentProgress = {
        ...prev,
        points: prev.points + basePoints,
        completedSteps: {
          ...prev.completedSteps,
          [lessonId]: [...existing, stepIndex],
        },
      };

      const unlockedNow = evaluateNewBadges(nextState);
      let bonusSum = 0;
      if (unlockedNow.length > 0) {
        const nextUnlocked = { ...nextState.unlockedBadges };
        for (const b of unlockedNow) {
          nextUnlocked[b.id] = today;
          bonusSum += b.bonusPoints;
        }
        nextState = {
          ...nextState,
          points: nextState.points + bonusSum,
          unlockedBadges: nextUnlocked,
          equippedBadgeId: nextState.equippedBadgeId ?? unlockedNow[0].id,
        };
      }

      setRewardNotification({
        id: `${Date.now()}`,
        pointsEarned: basePoints + bonusSum,
        reason: 'إتمام خطوة استكشاف في المختبر التفاعلي',
        unlockedBadges: unlockedNow,
      });

      return nextState;
    });
  }, []);

  const recordLessonResult = useCallback(
    (
      lessonId: string,
      title: string,
      subjectId: SubjectId,
      score: number,
      total: number,
      pointsFromExercises: number,
      mode: 'lesson' | 'express' = 'lesson'
    ) => {
      const today = getTodayKey();
      setProgress((prev) => {
        const isNewDay = prev.lastActiveDate !== today;
        const prevLesson = prev.completedLessons[lessonId];

        const updatedLessons =
          mode === 'lesson'
            ? {
                ...prev.completedLessons,
                [lessonId]: {
                  bestScore: Math.max(prevLesson?.bestScore ?? 0, score),
                  totalQuestions: total,
                  attempts: (prevLesson?.attempts ?? 0) + 1,
                  lastCompletedAt: today,
                },
              }
            : prev.completedLessons;

        let nextState: StudentProgress = {
          ...prev,
          points: prev.points + pointsFromExercises,
          streakDays: isNewDay ? prev.streakDays + 1 : prev.streakDays,
          lastActiveDate: today,
          completedLessons: updatedLessons,
          expressChallengesCompleted:
            mode === 'express'
              ? prev.expressChallengesCompleted + 1
              : prev.expressChallengesCompleted,
        };

        // Evaluate newly unlocked virtual badges (including cascade if bonus crosses 250/500)
        const unlockedNow = evaluateNewBadges(nextState);
        let badgeBonusTotal = 0;
        if (unlockedNow.length > 0) {
          const nextUnlocked = { ...nextState.unlockedBadges };
          for (const b of unlockedNow) {
            nextUnlocked[b.id] = today;
            badgeBonusTotal += b.bonusPoints;
          }
          nextState = {
            ...nextState,
            points: nextState.points + badgeBonusTotal,
            unlockedBadges: nextUnlocked,
            equippedBadgeId: nextState.equippedBadgeId ?? unlockedNow[0].id,
          };
          // Re-check point-threshold badges after badge bonus
          const extraUnlocked = evaluateNewBadges(nextState);
          if (extraUnlocked.length > 0) {
            for (const eb of extraUnlocked) {
              nextState.unlockedBadges[eb.id] = today;
              badgeBonusTotal += eb.bonusPoints;
              nextState.points += eb.bonusPoints;
              unlockedNow.push(eb);
            }
          }
        }

        const totalAwarded = pointsFromExercises + badgeBonusTotal;
        const newEntry: ActivityEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          lessonId,
          title,
          subjectId,
          score,
          total,
          pointsEarned: totalAwarded,
          date: today,
          mode,
        };

        nextState = {
          ...nextState,
          activityLog: [newEntry, ...prev.activityLog].slice(0, 20),
        };

        setRewardNotification({
          id: `${Date.now()}`,
          pointsEarned: totalAwarded,
          reason:
            mode === 'express'
              ? `إتمام تحدي 3 دقائق (${score}/${total})`
              : `إتمام تمارين درس «${title}» (${score}/${total})`,
          unlockedBadges: unlockedNow,
        });

        return nextState;
      });
    },
    []
  );

  const equipBadge = useCallback((badgeId: string) => {
    setProgress((prev) => {
      if (!prev.unlockedBadges[badgeId]) return prev;
      return {
        ...prev,
        equippedBadgeId: badgeId,
      };
    });
  }, []);

  const updateStudentProfile = useCallback(
    (studentName: string, schoolGovernorate: string) => {
      setProgress((prev) => ({
        ...prev,
        studentName: studentName.trim() || prev.studentName,
        schoolGovernorate: schoolGovernorate.trim() || prev.schoolGovernorate,
      }));
    },
    []
  );

  const resetProgress = useCallback(() => {
    setProgress((prev) => ({
      studentName: prev.studentName,
      schoolGovernorate: prev.schoolGovernorate,
      points: 0,
      streakDays: 1,
      lastActiveDate: getTodayKey(),
      completedLessons: {},
      completedSteps: {},
      unlockedBadges: {},
      equippedBadgeId: null,
      expressChallengesCompleted: 0,
      activityLog: [],
    }));
    setRewardNotification(null);
  }, []);

  const completedCount = Object.keys(progress.completedLessons).length;
  const totalLessons = LESSONS.length;
  const overallMasteryPercent = Math.round((completedCount / totalLessons) * 100);
  const levelInfo = getLevelInfo(progress.points);
  const earnedBadges = Object.keys(progress.unlockedBadges);

  const subjectStats = (subjectId: SubjectId) => {
    const subjectLessons = LESSONS.filter((l) => l.subjectId === subjectId);
    const doneLessons = subjectLessons.filter((l) => progress.completedLessons[l.id]);
    const totalQuestions = doneLessons.reduce(
      (acc, l) => acc + (progress.completedLessons[l.id]?.totalQuestions ?? 0),
      0
    );
    const totalScore = doneLessons.reduce(
      (acc, l) => acc + (progress.completedLessons[l.id]?.bestScore ?? 0),
      0
    );
    const accuracy =
      totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    const completionPercent = Math.round(
      (doneLessons.length / subjectLessons.length) * 100
    );
    return {
      totalLessons: subjectLessons.length,
      completedLessons: doneLessons.length,
      accuracy,
      completionPercent,
    };
  };

  return {
    progress,
    completedCount,
    totalLessons,
    overallMasteryPercent,
    subjectStats,
    earnedBadges,
    levelInfo,
    rewardNotification,
    dismissRewardNotification,
    markStepCompleted,
    recordLessonResult,
    equipBadge,
    updateStudentProfile,
    resetProgress,
  };
}
