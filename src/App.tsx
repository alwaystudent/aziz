import { useState } from 'react';
import { TopBar, AppView } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { SubjectBrowser } from './components/SubjectBrowser';
import { LessonWorkspace } from './components/LessonWorkspace';
import { ExpressChallenge } from './components/ExpressChallenge';
import { ProgressDashboard } from './components/ProgressDashboard';
import { RewardToast } from './components/RewardToast';
import { useStudentProgress } from './hooks/useStudentProgress';
import { Lesson } from './types/curriculum';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const {
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
  } = useStudentProgress();

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: AppView) => {
    setActiveView(view);
    if (view !== 'lesson') {
      setActiveLesson(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar activeView={activeView} onNavigate={handleNavigate} />

      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection
              progress={progress}
              completedCount={completedCount}
              totalLessons={totalLessons}
              earnedBadgesCount={earnedBadges.length}
              levelInfo={levelInfo}
              onExploreSubjects={() => handleNavigate('subjects')}
              onStartExpress={() => handleNavigate('express')}
              onOpenProgress={() => handleNavigate('progress')}
            />

            <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-6 border-y border-slate-200">
                <div className="space-y-1">
                  <h2 className="text-base font-display font-bold text-slate-900">
                    01. جلسات قصيرة من 4 دقائق
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    كل مفهوم مقسّم إلى 3 خطوات خفيفة وسريعة حتى لا يشعر التلميذ بالملل أو ثقل الواجبات.
                  </p>
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-display font-bold text-slate-900">
                    02. جرّب بيدك قبل أن تحفظ
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    أسلاك كهربائية، كسور ملوّنة، نبتة تنمو، وميزان للهمزة تجعل القواعد واضحة في لحظات.
                  </p>
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-display font-bold text-slate-900">
                    03. نظام نقاط وأوسمة افتراضية
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    كل مهمة استكشاف أو تمرين صحيح يمنحك نقاطاً فورية ترفع مستواك وتفتح لك أوسمة افتراضية مشوّقة.
                  </p>
                </div>
              </div>
            </section>

            <SubjectBrowser
              progress={progress}
              onSelectLesson={handleSelectLesson}
            />
          </>
        )}

        {activeView === 'subjects' && (
          <SubjectBrowser
            progress={progress}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {activeView === 'lesson' && activeLesson && (
          <LessonWorkspace
            lesson={activeLesson}
            completedStepIndices={progress.completedSteps[activeLesson.id] || []}
            onStepComplete={markStepCompleted}
            onLessonComplete={(score, total, points) =>
              recordLessonResult(
                activeLesson.id,
                activeLesson.title,
                activeLesson.subjectId,
                score,
                total,
                points,
                'lesson'
              )
            }
            onExit={() => handleNavigate('subjects')}
          />
        )}

        {activeView === 'express' && (
          <ExpressChallenge
            onComplete={(score, total, points) =>
              recordLessonResult(
                'express-challenge',
                'تحدي 3 دقائق الشامل',
                'math',
                score,
                total,
                points,
                'express'
              )
            }
            onExit={() => handleNavigate('home')}
          />
        )}

        {activeView === 'progress' && (
          <ProgressDashboard
            progress={progress}
            completedCount={completedCount}
            totalLessons={totalLessons}
            overallMasteryPercent={overallMasteryPercent}
            subjectStats={subjectStats}
            earnedBadges={earnedBadges}
            levelInfo={levelInfo}
            onEquipBadge={equipBadge}
            onUpdateProfile={updateStudentProfile}
            onResetProgress={resetProgress}
            onSelectLesson={handleSelectLesson}
          />
        )}
      </main>

      <RewardToast
        notification={rewardNotification}
        onDismiss={dismissRewardNotification}
        onViewBadges={() => handleNavigate('progress')}
      />

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            منارة الخامسة — دروس وتمارين تفاعلية وفق برنامج السنة الخامسة ابتدائي بالجمهورية التونسية
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate('subjects')}
              className="hover:text-slate-900 cursor-pointer"
            >
              المواد والدروس
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('express')}
              className="hover:text-slate-900 cursor-pointer"
            >
              تحدي 3 دقائق
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('progress')}
              className="hover:text-slate-900 cursor-pointer"
            >
              التقدّم والأوسمة
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
