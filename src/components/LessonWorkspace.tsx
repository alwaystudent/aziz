import React, { useState } from 'react';
import {
  ArrowRight,
  FlaskConical,
  Gamepad2,
  CheckCircle2,
  Circle,
  ChevronLeft,
} from 'lucide-react';
import { Lesson } from '../types/curriculum';
import { GRADES, SUBJECTS } from '../data/tunisianCurriculum';
import { SimulationStage } from './simulations/SimulationStage';
import { ExerciseEngine } from './ExerciseEngine';

interface LessonWorkspaceProps {
  lesson: Lesson;
  completedStepIndices: number[];
  onStepComplete: (lessonId: string, stepIndex: number) => void;
  onLessonComplete: (score: number, total: number, pointsEarned: number) => void;
  onExit: () => void;
}

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({
  lesson,
  completedStepIndices,
  onStepComplete,
  onLessonComplete,
  onExit,
}) => {
  const [activeTab, setActiveTab] = useState<'lab' | 'exercises'>('lab');
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const subject = SUBJECTS[lesson.subjectId];
  const gradeMeta = GRADES.find((g) => g.grade === lesson.grade);
  const currentStep = lesson.steps[activeStepIdx];
  const isStepDone = completedStepIndices.includes(activeStepIdx);

  const handleCompleteStep = () => {
    onStepComplete(lesson.id, activeStepIdx);
    if (activeStepIdx + 1 < lesson.steps.length) {
      setActiveStepIdx(activeStepIdx + 1);
    } else {
      setActiveTab('exercises');
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-700 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            العودة إلى قائمة الدروس
          </button>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className={`font-semibold ${subject.accentText}`}>{subject.name}</span>
            {gradeMeta && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-slate-700">{gradeMeta.label}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{lesson.trimester}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{lesson.durationMinutes} دقائق</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 text-balance">
            {lesson.title}
          </h1>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('lab')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'lab'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-sky-600" aria-hidden="true" />
            المختبر التفاعلي
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exercises')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'exercises'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-600" aria-hidden="true" />
            تمارين التطبيق ({lesson.exercises.length})
          </button>
        </div>
      </div>

      {activeTab === 'lab' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">
                {lesson.simTitle}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">{lesson.simDescription}</p>
            </div>
            <SimulationStage simType={lesson.simType} />
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-display font-bold text-slate-900">
                مهمات الاستكشاف السريعة
              </h2>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {completedStepIndices.length} / {lesson.steps.length}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {lesson.steps.map((step, idx) => {
                const done = completedStepIndices.includes(idx);
                const active = activeStepIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStepIdx(idx)}
                    className={`p-3 rounded-xl border text-right transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      active
                        ? 'bg-sky-50 border-sky-300 text-sky-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      )}
                      <span className="text-sm font-semibold truncate">
                        {idx + 1}. {step.title}
                      </span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-semibold text-sky-700">
                المهمة {activeStepIdx + 1}: جرّب بنفسك في المختبر
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                {currentStep.instruction}
              </p>
              <div className="pt-3 border-t border-slate-200 space-y-1">
                <div className="text-xs font-semibold text-emerald-800">القاعدة الذهبية:</div>
                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                  {currentStep.takeaway}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleCompleteStep}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
              >
                {isStepDone
                  ? activeStepIdx + 1 < lesson.steps.length
                    ? 'الانتقال للمهمة التالية'
                    : 'ابدأ التمارين الممتعة الآن'
                  : 'فهمت! اجمع 15 نقطة وانتقل للتالي'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('exercises')}
                className="w-full py-2 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                انتقل مباشرة إلى التمارين
              </button>
            </div>
          </aside>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <ExerciseEngine
            exercises={lesson.exercises}
            onComplete={onLessonComplete}
            onBackToSim={() => setActiveTab('lab')}
            modeLabel={`تمارين: ${lesson.title}`}
          />
        </div>
      )}
    </section>
  );
};
