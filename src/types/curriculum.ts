export type SubjectId = 'math' | 'science' | 'arabic' | 'french';

export type SimulationType =
  | 'fractions'
  | 'geometry'
  | 'circuit'
  | 'photosynthesis'
  | 'heart'
  | 'sentence'
  | 'hamza'
  | 'french_verbs';

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  frenchName: string;
  description: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  barColor: string;
}

export interface DiscoveryStep {
  title: string;
  instruction: string;
  takeaway: string;
}

export interface ChoiceExercise {
  id: string;
  type: 'choice';
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  ltr?: boolean;
}

export interface OrderExercise {
  id: string;
  type: 'order';
  prompt: string;
  tokens: string[];
  correctOrder: string[];
  hint: string;
  explanation: string;
  ltr?: boolean;
}

export interface ClassifyItem {
  id: string;
  label: string;
  targetBin: 'A' | 'B';
}

export interface ClassifyExercise {
  id: string;
  type: 'classify';
  prompt: string;
  binALabel: string;
  binBLabel: string;
  items: ClassifyItem[];
  hint: string;
  explanation: string;
  ltr?: boolean;
}

export interface FillBlankExercise {
  id: string;
  type: 'fill_blank';
  prompt: string;
  beforeBlank: string;
  afterBlank: string;
  choices: string[];
  correctChoice: string;
  hint: string;
  explanation: string;
  ltr?: boolean;
}

export type Exercise =
  | ChoiceExercise
  | OrderExercise
  | ClassifyExercise
  | FillBlankExercise;

export interface Lesson {
  id: string;
  subjectId: SubjectId;
  title: string;
  subtitle: string;
  trimester: 'الثلاثي الأول' | 'الثلاثي الثاني' | 'الثلاثي الثالث';
  durationMinutes: number;
  simType: SimulationType;
  simTitle: string;
  simDescription: string;
  steps: DiscoveryStep[];
  exercises: Exercise[];
}

export interface LessonCompletion {
  bestScore: number;
  totalQuestions: number;
  attempts: number;
  lastCompletedAt: string;
}

export interface ActivityEntry {
  id: string;
  lessonId: string;
  title: string;
  subjectId: SubjectId;
  score: number;
  total: number;
  pointsEarned: number;
  date: string;
  mode: 'lesson' | 'express';
}

export type BadgeIconKind =
  | 'launch'
  | 'perfect'
  | 'lightning'
  | 'science'
  | 'math'
  | 'bilingual'
  | 'treasure'
  | 'beacon';

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  requirementText: string;
  bonusPoints: number;
  icon: BadgeIconKind;
  theme: 'sky' | 'amber' | 'emerald' | 'indigo' | 'rose';
}

export interface LevelInfo {
  level: number;
  title: string;
  minPoints: number;
  nextMinPoints: number | null;
}

export interface RewardNotification {
  id: string;
  pointsEarned: number;
  reason: string;
  unlockedBadges: BadgeDefinition[];
}

export interface StudentProgress {
  studentName: string;
  schoolGovernorate: string;
  points: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessons: Record<string, LessonCompletion>;
  completedSteps: Record<string, number[]>;
  unlockedBadges: Record<string, string>; // badgeId -> ISO date unlocked
  equippedBadgeId: string | null;
  expressChallengesCompleted: number;
  activityLog: ActivityEntry[];
}
