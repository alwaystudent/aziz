import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Compass, Sparkles, Flame, CheckCircle2, Award } from 'lucide-react';
import { BADGES } from '../data/tunisianCurriculum';
import { LevelInfo, StudentProgress } from '../types/curriculum';
import { BadgeMedallion } from './BadgeMedallion';

interface HeroSectionProps {
  progress: StudentProgress;
  completedCount: number;
  totalLessons: number;
  earnedBadgesCount: number;
  levelInfo: LevelInfo;
  onExploreSubjects: () => void;
  onStartExpress: () => void;
  onOpenProgress: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  progress,
  completedCount,
  totalLessons,
  earnedBadgesCount,
  levelInfo,
  onExploreSubjects,
  onStartExpress,
  onOpenProgress,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [mascotFailed, setMascotFailed] = useState(false);

  const equippedBadge = BADGES.find((b) => b.id === progress.equippedBadgeId) ?? null;

  const levelProgressPercent =
    levelInfo.nextMinPoints === null
      ? 100
      : Math.min(
          100,
          Math.round(
            ((progress.points - levelInfo.minPoints) /
              (levelInfo.nextMinPoints - levelInfo.minPoints)) *
              100
          )
        );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 py-2">
          <div className="space-y-4">
            <div className="text-xs font-semibold text-sky-700">
              منهج الجمهورية التونسية · السنة الخامسة ابتدائي
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-display font-extrabold text-slate-900 leading-[1.2] text-balance">
              افهم دروس الخامسة بالتجربة واللعب، واجمع النقاط والأوسمة
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              مختبرات تفاعلية في الرياضيات والإيقاظ العلمي، وألعاب لغوية في العربية والفرنسية مصممة في مهمات قصيرة من 4 دقائق تمنحك نقاطاً فورية وأوسمة افتراضية مع كل إنجاز.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onExploreSubjects}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                استكشف الدروس والمختبرات
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onStartExpress}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                جرّب تحدي 3 دقائق السريع
              </button>
            </div>
          </div>

          {/* Adjacent Companion + Equipped Badge Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                {!mascotFailed ? (
                  <img
                    src="/src/assets/images/mascot_fanak_fox_1795189779395.jpg"
                    alt="فنك الذكي"
                    referrerPolicy="no-referrer"
                    onError={() => setMascotFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Compass className="w-6 h-6 text-amber-600" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-bold text-slate-900">
                    مرحباً {progress.studentName} · المستوى {levelInfo.level}: {levelInfo.title}
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-700 tabular-nums">
                    {progress.points} نقطة
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {levelInfo.nextMinPoints !== null
                    ? `بقي ${levelInfo.nextMinPoints - progress.points} نقطة للوصول إلى المستوى ${
                        levelInfo.level + 1
                      }.`
                    : 'أنت في أعلى مستوى على الإطلاق! واصل جمع الأوسمة.'}
                </p>
              </div>
              {equippedBadge && <BadgeMedallion badge={equippedBadge} unlocked size="sm" />}
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[280px] sm:min-h-[340px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            {!heroImgFailed ? (
              <img
                src="/src/assets/images/hero_tunisian_learning_1795189781389.jpg"
                alt="مكتب تعليمي مشمس مطل على العمارة التونسية والبحر المتوسط"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-sky-50 to-slate-100">
                <BookOpen className="w-12 h-12 text-sky-600 mb-3" aria-hidden="true" />
                <div className="font-display font-bold text-slate-800">منصة منارة الخامسة</div>
                <div className="text-sm text-slate-500 mt-1">تعلّم بالمحاكاة والألعاب التفاعلية</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-width 4-Column Motivation & Progress KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-slate-500">مجموع النقاط</div>
            <div className="mt-1 text-2xl font-mono font-bold text-slate-900 tabular-nums">
              {progress.points}
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-amber-500 shrink-0" aria-hidden="true" />
        </div>

        <button
          type="button"
          onClick={onOpenProgress}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 text-right flex items-center justify-between gap-3 transition-colors cursor-pointer"
        >
          <div>
            <div className="text-xs font-medium text-slate-500">الأوسمة الافتراضية</div>
            <div className="mt-1 text-2xl font-mono font-bold text-amber-700 tabular-nums">
              {earnedBadgesCount} / {BADGES.length}
            </div>
          </div>
          <Award className="w-6 h-6 text-amber-600 shrink-0" aria-hidden="true" />
        </button>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-slate-500">الدروس المنجزة</div>
            <div className="mt-1 text-2xl font-mono font-bold text-slate-900 tabular-nums">
              {completedCount} / {totalLessons}
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-slate-500">أيام المواظبة</div>
            <div className="mt-1 text-2xl font-mono font-bold text-slate-900 tabular-nums">
              {progress.streakDays} أيام
            </div>
          </div>
          <Flame className="w-6 h-6 text-orange-500 shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};
