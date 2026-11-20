import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TopBar, AppView } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { SubjectBrowser } from './components/SubjectBrowser';
import { LessonWorkspace } from './components/LessonWorkspace';
import { ExpressChallenge } from './components/ExpressChallenge';
import { ProgressDashboard } from './components/ProgressDashboard';
import { RewardToast } from './components/RewardToast';
import { GRADES } from './data/tunisianCurriculum';
import { useStudentProgress } from './hooks/useStudentProgress';
import { Lesson } from './types/curriculum';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    progress,
    daysAbsent,
    showReturnReminder,
    completedCount,
    totalLessons,
    overallCompletedCount,
    overallTotalLessons,
    overallMasteryPercent,
    subjectStats,
    gradeStats,
    earnedBadges,
    levelInfo,
    rewardNotification,
    setSelectedGrade,
    dismissRewardNotification,
    dismissReturnReminder,
    claimReturnBonus,
    simulateAbsence,
    markStepCompleted,
    recordLessonResult,
    equipBadge,
    updateStudentProfile,
    updateStudentName,
    resetProgress,
  } = useStudentProgress();

  const activeGradeMeta =
    GRADES.find((g) => g.grade === progress.selectedGrade) ?? GRADES[2];

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
    <div className="min-h-screen flex flex-col text-slate-900">
      <TopBar activeView={activeView} onNavigate={handleNavigate} />

      <main className="flex-1">
        <motion.div
          key={activeView === 'lesson' ? `lesson-${activeLesson?.id}` : activeView}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeView === 'home' && (
            <>
              <HeroSection
                progress={progress}
                selectedGrade={progress.selectedGrade}
                onSelectGrade={setSelectedGrade}
                completedCount={completedCount}
                totalLessons={totalLessons}
                earnedBadgesCount={earnedBadges.length}
                levelInfo={levelInfo}
                showReturnReminder={showReturnReminder}
                daysAbsent={daysAbsent}
                onClaimReturnAndExpress={() => {
                  claimReturnBonus();
                  handleNavigate('express');
                }}
                onClaimReturnAndSubjects={() => {
                  claimReturnBonus();
                  handleNavigate('subjects');
                }}
                onDismissReturnReminder={dismissReturnReminder}
                onSaveStudentName={updateStudentName}
                onExploreSubjects={() => handleNavigate('subjects')}
                onStartExpress={() => handleNavigate('express')}
                onOpenProgress={() => handleNavigate('progress')}
              />

              <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-6 border-y border-slate-200/80 bg-white/60 rounded-2xl px-5">
                  <div className="space-y-1">
                    <h2 className="text-base font-display font-bold text-slate-900">
                      01. جميع السنوات من الثالثة إلى السادسة
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      مسار متكامل يرافق التلميذ التونسي من السنة الثالثة إلى التحضير لمناظرة السادسة في مهمات خفيفة لا تسبب الملل.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-display font-bold text-slate-900">
                      02. جرّب بيدك قبل أن تحفظ
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      معداد المنازل، حالات المادة، الكسور الملوّنة، الدارة الكهربائية، وحاسبة النسبة المئوية تجعل الفهم فورياً.
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
                selectedGrade={progress.selectedGrade}
                onSelectGrade={setSelectedGrade}
                onSelectLesson={handleSelectLesson}
              />
            </>
          )}

          {activeView === 'subjects' && (
            <SubjectBrowser
              progress={progress}
              selectedGrade={progress.selectedGrade}
              onSelectGrade={setSelectedGrade}
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
                  activeLesson.grade,
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
              selectedGrade={progress.selectedGrade}
              onSelectGrade={setSelectedGrade}
              onComplete={(score, total, points) =>
                recordLessonResult(
                  `express-challenge-g${progress.selectedGrade}`,
                  `تحدي 3 دقائق الشامل (${activeGradeMeta.shortLabel})`,
                  'math',
                  progress.selectedGrade,
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
              selectedGrade={progress.selectedGrade}
              onSelectGrade={setSelectedGrade}
              completedCount={completedCount}
              totalLessons={totalLessons}
              overallCompletedCount={overallCompletedCount}
              overallTotalLessons={overallTotalLessons}
              overallMasteryPercent={overallMasteryPercent}
              subjectStats={subjectStats}
              gradeStats={gradeStats}
              earnedBadges={earnedBadges}
              levelInfo={levelInfo}
              onEquipBadge={equipBadge}
              onUpdateProfile={updateStudentProfile}
              onResetProgress={resetProgress}
              onSimulateAbsence={() => {
                simulateAbsence(3);
                handleNavigate('home');
              }}
              onSelectLesson={handleSelectLesson}
            />
          )}
        </motion.div>
      </main>

      <RewardToast
        notification={rewardNotification}
        onDismiss={dismissRewardNotification}
        onViewBadges={() => handleNavigate('progress')}
      />

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            منارة التعلّم — دروس وتمارين تفاعلية وفق برنامج السنوات الثالثة إلى السادسة ابتدائي بالجمهورية التونسية
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
