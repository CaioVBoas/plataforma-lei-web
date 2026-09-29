import * as server from '@/mocks/handlers/disciplines';
import { mockRequest } from '@/mocks/mockRequest';
import type { DisciplineInput } from './types';

export const getDisciplines = () => mockRequest(() => server.listDisciplines());

export const getDiscipline = (id: string) => mockRequest(() => server.getDiscipline(id));

export const createDiscipline = (input: DisciplineInput) => mockRequest(() => server.createDiscipline(input));

export const updateDiscipline = ({ id, input }: { id: string; input: DisciplineInput }) =>
  mockRequest(() => server.updateDiscipline(id, input));

export const removeDiscipline = (id: string) => mockRequest(() => server.removeDiscipline(id));

export const getSkillCatalog = () => mockRequest(() => server.listSkillCatalog());

export const inviteCoTeacher = ({ id, email }: { id: string; email: string }) => mockRequest(() => server.inviteCoTeacher(id, email));

export const removeCoTeacher = ({ id, email }: { id: string; email: string }) => mockRequest(() => server.removeCoTeacher(id, email));
