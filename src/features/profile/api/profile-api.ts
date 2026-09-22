import { mockRequest } from '@/mocks/mock-request';
import * as server from '@/mocks/handlers/profile';
import type { PracticeChange } from '@/types/practice';
import type { AccountUpdate, OnboardingAnswers, PastProject, ThemeStance } from '../types';

export const getAccount = () => mockRequest(() => server.getAccount());

export const updateAccount = (update: AccountUpdate) => mockRequest(() => server.updateAccount(update));

export const getPractice = () => mockRequest(() => server.getPractice());

export const changePractice = (change: PracticeChange) => mockRequest(() => server.changePractice(change));

export const setThemeStance = (theme: string, stance: ThemeStance | null) => mockRequest(() => server.setThemeStance(theme, stance));

export const addPastProject = (project: PastProject) => mockRequest(() => server.addPastProject(project));

export const completeOnboarding = (answers: OnboardingAnswers) => mockRequest(() => server.completeOnboarding(answers));
