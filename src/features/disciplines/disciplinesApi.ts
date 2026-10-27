import { api, mocksEnabled } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/disciplines';
import { mockRequest } from '@/mocks/mockRequest';
import type { DisciplineInput, DisciplineWithUsage } from './types';

export const getDisciplines = () =>
  mocksEnabled
    ? mockRequest(() => server.listDisciplines())
    : api.get<DisciplineWithUsage[]>('/disciplines').then((response) => response.data);

export const getDiscipline = (id: string) =>
  mocksEnabled
    ? mockRequest(() => server.getDiscipline(id))
    : api.get<DisciplineWithUsage>(`/disciplines/${id}`).then((response) => response.data);

export const createDiscipline = (input: DisciplineInput) =>
  mocksEnabled
    ? mockRequest(() => server.createDiscipline(input))
    : api.post<DisciplineWithUsage>('/disciplines', input).then((response) => response.data);

export const updateDiscipline = ({ id, input }: { id: string; input: DisciplineInput }) =>
  mocksEnabled
    ? mockRequest(() => server.updateDiscipline(id, input))
    : api.patch<DisciplineWithUsage>(`/disciplines/${id}`, input).then((response) => response.data);

/** A API responde 204, sem corpo. */
export const removeDiscipline = (id: string): Promise<void> =>
  mocksEnabled ? mockRequest(() => server.removeDiscipline(id)) : api.delete(`/disciplines/${id}`).then(() => undefined);

export const getSkillCatalog = () =>
  mocksEnabled
    ? mockRequest(() => server.listSkillCatalog())
    : api.get<string[]>('/skills/catalog').then((response) => response.data);

export const inviteCoTeacher = ({ id, email }: { id: string; email: string }) =>
  mocksEnabled
    ? mockRequest(() => server.inviteCoTeacher(id, email))
    : api.post<DisciplineWithUsage>(`/disciplines/${id}/co-teachers`, { email }).then((response) => response.data);

/** O e-mail vai no caminho: `encodeURIComponent` preserva o `@` e o `+`. */
export const removeCoTeacher = ({ id, email }: { id: string; email: string }) =>
  mocksEnabled
    ? mockRequest(() => server.removeCoTeacher(id, email))
    : api.delete<DisciplineWithUsage>(`/disciplines/${id}/co-teachers/${encodeURIComponent(email)}`).then((response) => response.data);
