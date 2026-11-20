import React, { useState } from 'react';
import {
  CheckCircle2,
  Play,
  FlaskConical,
  Calculator,
  BookOpen,
  Languages,
} from 'lucide-react';
import { GRADES, LESSONS, SUBJECTS } from '../data/tunisianCurriculum';
import { GradeLevel, Lesson, StudentProgress, SubjectId } from '../types/curriculum';

interface SubjectBrowserProps {
  progress: StudentProgress;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onSelectLesson: (lesson: Lesson) => void;
  initialSubject?: SubjectId | 'all';
}

export const SubjectBrowser: React.FC<SubjectBrowserProps> = ({
  progress,
  selectedGrade,
  onSelectGrade,
  onSelectLesson,
  initialSubject = 'all',
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>(initialSubject);
  const [selectedTrimester, setSelectedTrimester] = useState<string>('all');
  const [scienceImgFailed, setScienceImgFailed] = useState(false);
  const [mathImgFailed, setMathImgFailed] = useState(false);

  const activeGradeMeta = GRADES.find((g) => g.grade === selectedGrade) ?? GRADES[2];

  const filteredLessons = LESSONS.filter((lesson) => {
    const matchGrade = lesson.grade === selectedGrade;
    const matchSubject = selectedSubject === 'all' || lesson.subjectId === selectedSubject;
    const matchTrimester =
      selectedTrimester === 'all' || lesson.trimester === selectedTrimester;
    return matchGrade && matchSubject && matchTrimester;
  });

  const subjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'math':
        return <Calculator className="w-4 h-4 text-sky-700 shrink-0" aria-hidden="true" />;
      case 'science':
        return <FlaskConical className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />;
      case 'arabic':
        return <BookOpen className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />;
      case 'french':
        return <Languages className="w-4 h-4 text-indigo-700 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="space-y-4 pb-5 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
              المواد الأساسية ودروس {activeGradeMeta.label}
            </h2>
            <p className="text-sm text-slate-600">
              أكمل خطوات الاستكشاف (+15 نقطة للخطوة) والتمارين لفتح الأوسمة الافتراضية ({activeGradeMeta.subtitle}).
            </p>
          </div>

          {/* Grade Tabs (3rd to 6th Primary) */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-sky-50 rounded-xl border border-sky-200">
            {GRADES.map((g) => {
              const active = g.grade === selectedGrade;
              return (
                <button
                  key={g.grade}
                  type="button"
                  onClick={() => onSelectGrade(g.grade)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-sky-900 hover:bg-white'
                  }`}
                >
                  {g.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedSubject === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              جميع المواد
            </button>
            {(['math', 'science', 'arabic', 'french'] as SubjectId[]).map((sid) => (
              <button
                key={sid}
                type="button"
                onClick={() => setSelectedSubject(sid)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedSubject === sid
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {SUBJECTS[sid].name}
              </button>
            ))}
          </div>

          <select
            aria-label="تصفية حسب الثلاثي"
            value={selectedTrimester}
            onChange={(e) => setSelectedTrimester(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
          >
            <option value="all">كل الثلاثيات</option>
            <option value="الثلاثي الأول">الثلاثي الأول</option>
            <option value="الثلاثي الثاني">الثلاثي الثاني</option>
            <option value="الثلاثي الثالث">الثلاثي الثالث</option>
          </select>
        </div>
      </div>

      {selectedSubject === 'all' && selectedTrimester === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-interactive bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch">
            <div className="sm:col-span-5 bg-slate-100 min-h-[160px]">
              {!scienceImgFailed ? (
                <img
                  src="/src/assets/images/subject_science_lab_1795189780009.jpg"
                  alt="مختبر الإيقاظ العلمي التفاعلي"
                  referrerPolicy="no-referrer"
                  onError={() => setScienceImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                  <FlaskConical className="w-10 h-10 text-emerald-600" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="sm:col-span-7 p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-emerald-700">
                  الإيقاظ العلمي · مختبرات محاكاة بصرية
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900">
                  المادة، النبات، الكهرباء والقلب
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  اكتشف حالات المادة في الثالثة، نمو النبتة في الرابعة، والدارة والقلب في الخامسة والسادسة لفتح «وسام عالم المختبر».
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubject('science')}
                className="self-start text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-4 cursor-pointer"
              >
                تصفّح دروس الإيقاظ العلمي
              </button>
            </div>
          </div>

          <div className="card-interactive bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch">
            <div className="sm:col-span-5 bg-slate-100 min-h-[160px]">
              {!mathImgFailed ? (
                <img
                  src="/src/assets/images/subject_math_geometry_1795189780076.jpg"
                  alt="مختبر الرياضيات والهندسة"
                  referrerPolicy="no-referrer"
                  onError={() => setMathImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sky-50">
                  <Calculator className="w-10 h-10 text-sky-600" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="sm:col-span-7 p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-sky-700">
                  الرياضيات · نماذج بصرية فورية
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900">
                  المعداد، الكسور، الهندسة والنسب المئوية
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  من المعداد في الثالثة إلى المحيط والكسور ثم نسب التخفيض لمناظرة السادسة لفتح «وسام فارس الرياضيات».
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubject('math')}
                className="self-start text-xs font-semibold text-sky-700 hover:text-sky-900 underline underline-offset-4 cursor-pointer"
              >
                تصفّح دروس الرياضيات
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredLessons.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
          <p className="text-slate-600 text-sm">
            لا توجد دروس مطابقة لهذا التصفية في {activeGradeMeta.shortLabel}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubject('all');
              setSelectedTrimester('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg cursor-pointer"
          >
            عرض جميع دروس {activeGradeMeta.shortLabel}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLessons.map((lesson) => {
            const subject = SUBJECTS[lesson.subjectId];
            const completion = progress.completedLessons[lesson.id];
            const stepsDone = (progress.completedSteps[lesson.id] || []).length;
            const stepPercent = Math.round((stepsDone / lesson.steps.length) * 100);

            return (
              <article
                key={lesson.id}
                className="card-interactive bg-white border border-slate-200 hover:border-sky-300 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className={`h-1.5 w-full ${subject.barColor}`} />

                <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-lg ${subject.accentBg} border ${subject.accentBorder} flex items-center justify-center shrink-0`}
                        >
                          {subjectIcon(lesson.subjectId)}
                        </span>
                        <span className={`font-semibold shrink-0 ${subject.accentText}`}>
                          {subject.name}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="shrink-0">{activeGradeMeta.shortLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{lesson.trimester}</span>
                      </div>
                      <span className="font-mono tabular-nums shrink-0">
                        {lesson.durationMinutes} دق
                      </span>
                    </div>

                    <h3 className="text-lg font-display font-bold text-slate-900 leading-snug">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{lesson.subtitle}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${completion ? 'bg-emerald-500' : subject.barColor} transition-all duration-300`}
                        style={{ width: `${completion ? 100 : stepPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {completion ? (
                          <>
                            <CheckCircle2
                              className="w-4 h-4 text-emerald-600 shrink-0"
                              aria-hidden="true"
                            />
                            <span className="text-emerald-800 font-semibold font-mono tabular-nums">
                              مكتمل ({completion.bestScore}/{completion.totalQuestions})
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-500 font-mono tabular-nums">
                            الاستكشاف: {stepsDone}/{lesson.steps.length}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectLesson(lesson)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" aria-hidden="true" />
                        {completion ? 'مراجعة الدرس' : 'ابدأ المختبر'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
