import * as server from '@/mocks/handlers/orgPortal';
import { mockRequest } from '@/mocks/mockRequest';
import type { OrgAccountInput, OrgProfileInput, SaveDraftPayload } from './types';

export const getOrgAccount = () => mockRequest(() => server.getAccount());

export const updateOrgAccount = (input: OrgAccountInput) => mockRequest(() => server.updateAccount(input));

export const getOrgProfile = () => mockRequest(() => server.getProfile());

export const updateOrgProfile = (input: OrgProfileInput) => mockRequest(() => server.updateProfile(input));

export const getOrgDemands = () => mockRequest(() => server.listDemands());

export const getOrgDemand = (id: string) => mockRequest(() => server.getDemand(id));

export const saveDraft = (payload: SaveDraftPayload) => mockRequest(() => server.saveDraft(payload));

export const submitForReview = (payload: SaveDraftPayload) => mockRequest(() => server.submitForReview(payload));

export const deleteDraft = (id: string) => mockRequest(() => server.deleteDraft(id));

export const answerQuestion = (payload: { demandId: string; questionId: string; text: string }) => mockRequest(() => server.answerQuestion(payload));

export const getOrgProjects = () => mockRequest(() => server.listProjects());

export const getOrgProject = (id: string) => mockRequest(() => server.getProject(id));
