import type { Practice } from '@/types/practice';

export type ThemeStance = 'interest' | 'excluded';

export interface PastProject {
  title: string;
  year: string;
  partnerName: string;
  competencies: string[];
}

export interface Correction {
  text: string;
  date: string;
}

/** O que a plataforma entende que o docente pratica; alimenta o cálculo de compatibilidade. */
export interface PracticeProfile extends Practice {
  themes: Record<string, ThemeStance>;
  pastProjects: PastProject[];
  corrections: Correction[];
}

export type PrivacySetting = 'partnersSeeContact' | 'partnersSeeProjects' | 'studentsSeePractice' | 'studentsSeeEmail';

export interface Account {
  name: string;
  department: string;
  email: string;
  phone: string;
  preferredChannel: string;
  publicProfileLink: string;
  projectsPerSemester: number;
  receivingPaused: boolean;
  /** Enquanto for falso, o cardápio convida para o onboarding de prática. */
  onboardingCompleted: boolean;
  privacy: Record<PrivacySetting, boolean>;
  currentDevice: string;
  lastAccess: string;
}

export type AccountUpdate = Partial<Omit<Account, 'email' | 'publicProfileLink' | 'currentDevice' | 'lastAccess' | 'onboardingCompleted'>>;

export interface OnboardingAnswers {
  practices: Record<string, string[]>;
  themes: Record<string, ThemeStance>;
  historySource: 'mark' | 'paste' | 'skip';
  history: string[];
  pastSummary: string;
}
