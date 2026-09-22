import type { Account, AccountUpdate, OnboardingAnswers, PastProject, PracticeProfile, ThemeStance } from '@/features/profile/types';
import type { PracticeChange } from '@/types/practice';
import { db } from '../db';
import { DEMO_TODAY } from '../seed/semester';
import { applyPracticeChange, describePracticeChange } from './practice-rules';

/** Toda correção de prática fica no histórico, para o docente saber por que o cardápio mudou. */
const recordCorrection = (text: string) => {
  db.practice.corrections.unshift({ text, date: DEMO_TODAY });
};

export const getAccount = (): Account => db.account;

export const updateAccount = (update: AccountUpdate) => {
  Object.assign(db.account, update);
};

export const getPractice = (): PracticeProfile => db.practice;

export const changePractice = (change: PracticeChange) => {
  db.practice = { ...db.practice, ...applyPracticeChange(db.practice, change) };
  recordCorrection(describePracticeChange(change));
};

export const setThemeStance = (theme: string, stance: ThemeStance | null) => {
  const themes = { ...db.practice.themes };
  if (stance) themes[theme] = stance;
  else delete themes[theme];
  db.practice.themes = themes;
};

export const addPastProject = (project: PastProject) => {
  if (!project.title.trim()) throw new Error('Dê um título ao projeto antes de registrar.');
  db.practice.pastProjects.push(project);
  project.competencies.forEach((name) => {
    if (!db.practice.confirmed.includes(name)) db.practice.confirmed.push(name);
  });
  recordCorrection(`Registrou o projeto ${project.title}`);
};

export const completeOnboarding = (answers: OnboardingAnswers) => {
  const marked = Object.values(answers.practices).flat();
  marked.forEach((name) => {
    if (!db.practice.confirmed.includes(name)) db.practice.confirmed.push(name);
  });
  db.practice.themes = { ...db.practice.themes, ...answers.themes };
  recordCorrection('Respondeu o onboarding de prática docente');
};
