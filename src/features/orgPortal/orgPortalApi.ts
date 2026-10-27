import type { Demand, DemandSubmission, OrgAccount } from '@/domain/types';
import { mapOrgTypeToTipoParceiro, mapTipoParceiroToOrgType, type TipoParceiro } from '@/features/auth/types';
import { api, apiClient, mocksEnabled } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/orgPortal';
import { mockRequest } from '@/mocks/mockRequest';
import type {
  OrgAccountInput,
  OrgDemandDetail,
  OrgDemandSummary,
  OrgImagesInput,
  OrgProfile,
  OrgProfileInput,
  SaveDraftPayload,
} from './types';

/** O backend trafega o tipo como enum; a tela mostra o rótulo do seletor. */
type ApiOrgProfile = Omit<OrgProfile, 'organization'> & {
  organization: Omit<OrgProfile['organization'], 'type'> & { type: TipoParceiro };
};

const toOrgProfile = ({ organization, contact }: ApiOrgProfile): OrgProfile => ({
  organization: { ...organization, type: mapTipoParceiroToOrgType(organization.type) },
  contact,
});

export const getOrgAccount = () =>
  mocksEnabled
    ? mockRequest(() => server.getAccount())
    : api.get<OrgAccount>('/org-portal/account').then((response) => response.data);

/** Parcial: só o que mudou, para não sobrescrever o ponto focal salvo pelo perfil (no backend são as mesmas colunas). */
export const updateOrgAccount = (input: Partial<OrgAccountInput>) =>
  mocksEnabled
    ? mockRequest(() => server.updateAccount({ ...server.getAccount(), ...input }))
    : api.patch<OrgAccount>('/org-portal/account', input).then((response) => response.data);

export const markOrgTutorialSeen = () =>
  mocksEnabled
    ? mockRequest(() => server.markTutorialSeen())
    : api.patch<OrgAccount>('/org-portal/account', { tutorialSeen: true }).then((response) => response.data);

export const getOrgProfile = () =>
  mocksEnabled
    ? mockRequest(() => server.getProfile())
    : api.get<ApiOrgProfile>('/org-portal/profile').then((response) => toOrgProfile(response.data));

export const updateOrgProfile = (input: OrgProfileInput) =>
  mocksEnabled
    ? mockRequest(() => server.updateProfile(input))
    : api
        .patch<ApiOrgProfile>('/org-portal/profile', { ...input, type: mapOrgTypeToTipoParceiro(input.type) })
        .then((response) => toOrgProfile(response.data));

export const updateOrgImages = (input: OrgImagesInput) =>
  mocksEnabled
    ? mockRequest(() => server.updateImages(input))
    : api.patch<ApiOrgProfile>('/org-portal/profile/images', input).then((response) => toOrgProfile(response.data));

export const getOrgDemands = async (): Promise<OrgDemandSummary[]> => {
  if (mocksEnabled) return mockRequest(() => server.listDemands());
  const response = await apiClient.get<OrgDemandSummary[]>('/org-portal/demands');
  return response.data;
};

export const getOrgDemand = async (id: string): Promise<OrgDemandDetail> => {
  if (mocksEnabled) return mockRequest(() => server.getDemand(id));
  const response = await apiClient.get<OrgDemandDetail>(`/org-portal/demands/${id}`);
  return response.data;
};

export const saveDraft = async (payload: SaveDraftPayload): Promise<DemandSubmission> => {
  if (mocksEnabled) return mockRequest(() => server.saveDraft(payload));
  const response = await apiClient.post<DemandSubmission>('/org-portal/demands/draft', payload);
  return response.data;
};

export const submitForReview = async (payload: SaveDraftPayload): Promise<DemandSubmission> => {
  if (mocksEnabled) return mockRequest(() => server.submitForReview(payload));
  const response = await apiClient.post<DemandSubmission>('/org-portal/demands/submit', payload);
  return response.data;
};

export const deleteDraft = async (id: string): Promise<{ id: string }> => {
  if (mocksEnabled) return mockRequest(() => server.deleteDraft(id));
  const response = await apiClient.delete<{ id: string }>(`/org-portal/demands/draft/${id}`);
  return response.data;
};

export const answerQuestion = async (payload: {
  demandId: string;
  questionId: string;
  text: string;
}): Promise<Demand> => {
  if (mocksEnabled) return mockRequest(() => server.answerQuestion(payload));
  const response = await apiClient.post<Demand>(
    `/org-portal/demands/${payload.demandId}/questions/${payload.questionId}/answer`,
    { text: payload.text },
  );
  return response.data;
};

export const getOrgQuestions = async (): Promise<Demand[]> => {
  if (mocksEnabled) return mockRequest(() => server.listQuestionDemands());
  const response = await apiClient.get<Demand[]>('/org-portal/demands/questions');
  return response.data;
};

export const getOrgProjects = () => mockRequest(() => server.listProjects());

export const getOrgProject = (id: string) => mockRequest(() => server.getProject(id));
