import * as server from '@/mocks/handlers/projects';
import { mockRequest } from '@/mocks/mockRequest';
import type { AdoptDemandInput, CompleteMilestoneInput, UpdatePlanSectionInput } from '../types';

export const getProjects = () => mockRequest(() => server.listProjects());

export const getProject = (id: string) => mockRequest(() => server.getProject(id));

export const adoptDemand = (input: AdoptDemandInput) => mockRequest(() => server.adoptDemand(input));

export const withdrawProject = (id: string) => mockRequest(() => server.withdrawProject(id));

export const updatePlanSection = (input: UpdatePlanSectionInput) => mockRequest(() => server.updatePlanSection(input));

export const updateTeams = ({ projectId, teams }: { projectId: string; teams: number }) =>
  mockRequest(() => server.updateTeams(projectId, teams));

export const completeMilestone = (input: CompleteMilestoneInput) => mockRequest(() => server.completeMilestone(input));
