import React, { useState } from 'react';
import { Volume2, Languages } from 'lucide-react';

type VerbKey = 'parler' | 'finir' | 'etre' | 'avoir';
type PronounIdx = 0 | 1 | 2 | 3 | 4 | 5;

const PRONOUNS = ['Je / J’', 'Tu', 'Il / Elle', 'Nous', 'Vous', 'Ils / Elles'];

const CONJUGATIONS: Record<
  VerbKey,
  {
    label: string;
    group: string;
    forms: { stem: string; ending: string; full: string; example: string; arabic: string }[];
  }
> = {
  parler: {
    label: 'parler (يتكلم)',
    group: '1er groupe (-er)',
    forms: [
      { stem: 'Je parl', ending: 'e', full: 'Je parle', example: 'Je parle avec mon camarade.', arabic: 'أتكلم مع زميلي.' },
      { stem: 'Tu parl', ending: 'es', full: 'Tu parles', example: 'Tu parles doucement en classe.', arabic: 'تتكلم بهدوء في القسم.' },
      { stem: 'Il parl', ending: 'e', full: 'Il parle', example: 'Il parle de la Tunisie.', arabic: 'يتحدث عن تونس.' },
      { stem: 'Nous parl', ending: 'ons', full: 'Nous parlons', example: 'Nous parlons français et arabe.', arabic: 'نتكلم الفرنسية والعربية.' },
      { stem: 'Vous parl', ending: 'ez', full: 'Vous parlez', example: 'Vous parlez très bien.', arabic: 'تتكلمون جيداً جداً.' },
      { stem: 'Elles parl', ending: 'ent', full: 'Elles parlent', example: 'Elles parlent du projet.', arabic: 'يتحدثن عن المشروع.' },
    ],
  },
  finir: {
    label: 'finir (يُنهي)',
    group: '2ème groupe (-ir)',
    forms: [
      { stem: 'Je fin', ending: 'is', full: 'Je finis', example: 'Je finis mon exercice vite.', arabic: 'أُنهي تمريني بسرعة.' },
      { stem: 'Tu fin', ending: 'is', full: 'Tu finis', example: 'Tu finis ton dessin.', arabic: 'تُنهي رسمك.' },
      { stem: 'Elle fin', ending: 'it', full: 'Elle finit', example: 'Elle finit son livre.', arabic: 'تُنهي كتابها.' },
      { stem: 'Nous fin', ending: 'issons', full: 'Nous finissons', example: 'Nous finissons la révision.', arabic: 'نُنهي المراجعة.' },
      { stem: 'Vous fin', ending: 'issez', full: 'Vous finissez', example: 'Vous finissez à midi.', arabic: 'تُنهون عند منتصف النهار.' },
      { stem: 'Ils fin', ending: 'issent', full: 'Ils finissent', example: 'Ils finissent le jeu.', arabic: 'يُنهون اللعبة.' },
    ],
  },
  etre: {
    label: 'être (يكون)',
    group: 'Auxiliaire essentiel',
    forms: [
      { stem: 'Je ', ending: 'suis', full: 'Je suis', example: 'Je suis élève en 5ème année.', arabic: 'أنا تلميذ في السنة الخامسة.' },
      { stem: 'Tu ', ending: 'es', full: 'Tu es', example: 'Tu es très curieux.', arabic: 'أنت فضولي (محب للاطلاع) جداً.' },
      { stem: 'Elle ', ending: 'est', full: 'Elle est', example: 'Elle est prête pour le défi.', arabic: 'هي مستعدة للتحدي.' },
      { stem: 'Nous ', ending: 'sommes', full: 'Nous sommes', example: 'Nous sommes dans la cour.', arabic: 'نحن في ساحة المدرسة.' },
      { stem: 'Vous ', ending: 'êtes', full: 'Vous êtes', example: 'Vous êtes attentifs.', arabic: 'أنتم منتبهون.' },
      { stem: 'Ils ', ending: 'sont', full: 'Ils sont', example: 'Ils sont contents.', arabic: 'هم سعداء.' },
    ],
  },
  avoir: {
    label: 'avoir (يملك)',
    group: 'Auxiliaire essentiel',
    forms: [
      { stem: 'J’', ending: 'ai', full: 'J’ai', example: 'J’ai un cartable bleu.', arabic: 'لديّ محفظة زرقاء.' },
      { stem: 'Tu ', ending: 'as', full: 'Tu as', example: 'Tu as une bonne idée.', arabic: 'لديك فكرة جيدة.' },
      { stem: 'Il ', ending: 'a', full: 'Il a', example: 'Il a dix ans.', arabic: 'عمره عشر سنوات.' },
      { stem: 'Nous ', ending: 'avons', full: 'Nous avons', example: 'Nous avons cours de sciences.', arabic: 'لدينا حصة إيقاظ علمي.' },
      { stem: 'Vous ', ending: 'avez', full: 'Vous avez', example: 'Vous avez réussi !', arabic: 'لقد نجحتم!' },
      { stem: 'Elles ', ending: 'ont', full: 'Elles ont', example: 'Elles ont des cahiers neufs.', arabic: 'لديهن كراسات جديدة.' },
    ],
  },
};

export const FrenchVerbLab: React.FC = () => {
  const [verbKey, setVerbKey] = useState<VerbKey>('parler');
  const [pronounIdx, setPronounIdx] = useState<PronounIdx>(3);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const verb = CONJUGATIONS[verbKey];
  const current = verb.forms[pronounIdx];

  const speakFrench = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeakingText(text);
      setTimeout(() => setSpeakingText(null), 1200);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    utter.rate = 0.9;
    setSpeakingText(text);
    utter.onend = () => setSpeakingText(null);
    utter.onerror = () => setSpeakingText(null);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-indigo-700" aria-hidden="true" />
          <span className="font-semibold text-slate-900">
            {verb.label} ·{' '}
            <span className="text-sm text-indigo-700" dir="ltr">
              {verb.group}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => speakFrench(current.example)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Volume2 className="w-4 h-4" aria-hidden="true" />
          {speakingText ? 'جاري النطق...' : 'استمع للنطق الفرنسي'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(['parler', 'finir', 'etre', 'avoir'] as VerbKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setVerbKey(key)}
            className={`px-3 py-2 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
              verbKey === key
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {CONJUGATIONS[key].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        <div className="md:col-span-5 grid grid-cols-2 gap-2">
          {PRONOUNS.map((p, idx) => (
            <button
              key={p}
              type="button"
              dir="ltr"
              onClick={() => setPronounIdx(idx as PronounIdx)}
              className={`px-3 py-2.5 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
                pronounIdx === idx
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-center space-y-3">
          <div className="text-xs font-medium text-slate-500">التصريف والنهاية المميّزة:</div>
          <div dir="ltr" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            <span>{current.stem}</span>
            <span className="text-indigo-600 underline decoration-2 underline-offset-4">
              {current.ending}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div dir="ltr" className="text-base font-medium text-slate-800">
              {current.example}
            </div>
            <div className="text-sm text-slate-600">{current.arabic}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
