import type { Project } from '@/domain/types';
import { getOrganization } from '@/features/organizations/organizationsApi';
import { api, mocksEnabled } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/projects';
import { mockRequest } from '@/mocks/mockRequest';
import type { AdoptDemandInput, CompleteMilestoneInput, UpdatePlanSectionInput } from '../types';
import { outcomeToApi, projectFromApi, type ApiProject } from './projectsContract';

/**
 * A API devolve só o `partnerId` no projeto. Nome, tipo e contato vêm do perfil
 * da organização, que libera o contato justamente por existir projeto (regra 6).
 */
const withOrganizations = async (projects: Project[]): Promise<Project[]> => {
  const ids = [...new Set(projects.map((project) => project.organization.id))];
  const details = new Map(
    await Promise.all(
      ids.map(async (id) => {
        try {
          return [id, await getOrganization(id)] as const;
        } catch {
          return [id, undefined] as const;
        }
      }),
    ),
  );
  return projects.map((project) => {
    const detail = details.get(project.organization.id);
    if (!detail) return project;
    const { id, name, type, logo } = detail.organization;
    return { ...project, organization: { id, name, type, logo }, contact: detail.contact ?? project.contact };
  });
};

const one = async (request: Promise<{ data: ApiProject }>): Promise<Project> => {
  const { data } = await request;
  const [project] = await withOrganizations([projectFromApi(data)]);
  return project;
};

export const getProjects = () =>
  mocksEnabled
    ? mockRequest(() => server.listProjects())
    : api.get<ApiProject[]>('/projects').then((response) => withOrganizations(response.data.map(projectFromApi)));

export const getProject = (id: string) =>
  mocksEnabled ? mockRequest(() => server.getProject(id)) : one(api.get<ApiProject>(`/projects/${id}`));

export const adoptDemand = (input: AdoptDemandInput) =>
  mocksEnabled
    ? mockRequest(() => server.adoptDemand(input))
    : one(api.post<ApiProject>('/projects/adopt', { demandId: Number(input.demandId), courseId: Number(input.disciplineId), teams: input.teams }));

/** A API responde 204, sem corpo. */
export const withdrawProject = (id: string): Promise<void> =>
  mocksEnabled ? mockRequest(() => server.withdrawProject(id)) : api.delete(`/projects/${id}/withdraw`).then(() => undefined);

/** As seções são identificadas pela posição, começando em 1. */
export const updatePlanSection = (input: UpdatePlanSectionInput) =>
  mocksEnabled
    ? mockRequest(() => server.updatePlanSection(input))
    : one(api.patch<ApiProject>(`/projects/${input.projectId}/plan`, { sections: [{ order: input.sectionIndex + 1, text: input.text }] }));

export const updateTeams = ({ projectId, teams }: { projectId: string; teams: number }) =>
  mocksEnabled
    ? mockRequest(() => server.updateTeams(projectId, teams))
    : one(api.patch<ApiProject>(`/projects/${projectId}/teams`, { teams }));

/** A data de conclusão é a do servidor. */
export const completeMilestone = (input: CompleteMilestoneInput) => {
  if (mocksEnabled) return mockRequest(() => server.completeMilestone(input));
  const { projectId, milestoneId, note, sigaaCode, outcome } = input;
  return one(
    api.patch<ApiProject>(`/projects/${projectId}/milestones/${milestoneId}`, {
      ...(note?.trim() && { note: note.trim() }),
      ...(sigaaCode?.trim() && { sigaaCode: sigaaCode.trim() }),
      ...(outcome && { outcome: outcomeToApi({ ...outcome, summary: outcome.summary.trim() }) }),
    }),
  );
};
