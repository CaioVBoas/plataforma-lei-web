import { mockRequest } from '@/mocks/mock-request';
import * as server from '@/mocks/handlers/disciplines';
import type { PracticeChange } from '@/types/practice';
import type { DisciplineUpdate, NewDisciplinePayload } from '../types';

export const getDisciplines = () => mockRequest(() => server.listDisciplines());

export const getDiscipline = (disciplineId: string) => mockRequest(() => server.getDiscipline(disciplineId));

export const getDisciplineCatalog = () => mockRequest(() => server.searchCatalog());

export const createDiscipline = (payload: NewDisciplinePayload) => mockRequest(() => server.createDiscipline(payload));

export const updateDiscipline = (disciplineId: string, update: DisciplineUpdate) =>
  mockRequest(() => server.updateDiscipline(disciplineId, update));

export const changeDisciplinePractice = (disciplineId: string, change: PracticeChange) =>
  mockRequest(() => server.changeDisciplinePractice(disciplineId, change));

export const archiveDiscipline = (disciplineId: string) => mockRequest(() => server.archiveDiscipline(disciplineId));
