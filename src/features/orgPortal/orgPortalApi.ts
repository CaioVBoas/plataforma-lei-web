import { apiClient } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/orgPortal';
import { mockRequest } from '@/mocks/mockRequest';
import type { Demand, DemandSubmission } from '@/domain/types';
import type {
  OrgAccountInput,
  OrgDemandDetail,
  OrgDemandSummary,
  OrgImagesInput,
  OrgProfileInput,
  SaveDraftPayload,
} from './types';

export const getOrgAccount = () => mockRequest(() => server.getAccount());

export const updateOrgAccount = (input: OrgAccountInput) => mockRequest(() => server.updateAccount(input));

export const markOrgTutorialSeen = () => mockRequest(() => server.markTutorialSeen());

export const getOrgProfile = () => mockRequest(() => server.getProfile());

export const updateOrgProfile = (input: OrgProfileInput) => mockRequest(() => server.updateProfile(input));

export const updateOrgImages = (input: OrgImagesInput) => mockRequest(() => server.updateImages(input));

export const getOrgDemands = async (): Promise<OrgDemandSummary[]> => {
  const response = await apiClient.get<OrgDemandSummary[]>('/org-portal/demands');
  return response.data;
};

export const getOrgDemand = async (id: string): Promise<OrgDemandDetail> => {
  const response = await apiClient.get<OrgDemandDetail>(`/org-portal/demands/${id}`);
  return response.data;
};

export const saveDraft = async (payload: SaveDraftPayload): Promise<DemandSubmission> => {
  const response = await apiClient.post<DemandSubmission>('/org-portal/demands/draft', payload);
  return response.data;
};

export const submitForReview = async (payload: SaveDraftPayload): Promise<DemandSubmission> => {
  const response = await apiClient.post<DemandSubmission>('/org-portal/demands/submit', payload);
  return response.data;
};

export const deleteDraft = async (id: string): Promise<{ id: string }> => {
  const response = await apiClient.delete<{ id: string }>(`/org-portal/demands/draft/${id}`);
  return response.data;
};

export const answerQuestion = async (payload: {
  demandId: string;
  questionId: string;
  text: string;
}): Promise<Demand> => {
  const response = await apiClient.post<Demand>(
    `/org-portal/demands/${payload.demandId}/questions/${payload.questionId}/answer`,
    { text: payload.text },
  );
  return response.data;
};

export const getOrgQuestions = async (): Promise<Demand[]> => {
  const response = await apiClient.get<Demand[]>('/org-portal/demands/questions');
  return response.data;
};

export const getOrgProjects = () => mockRequest(() => server.listProjects());

export const getOrgProject = (id: string) => mockRequest(() => server.getProject(id));
