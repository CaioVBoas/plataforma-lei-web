import type { OrgAccount } from '@/domain/types';
import { mapOrgTypeToTipoParceiro, mapTipoParceiroToOrgType, type TipoParceiro } from '@/features/auth/types';
import { api, mocksEnabled } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/orgPortal';
import { mockRequest } from '@/mocks/mockRequest';
import type { OrgAccountInput, OrgImagesInput, OrgProfile, OrgProfileInput, SaveDraftPayload } from './types';

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

export const getOrgDemands = () => mockRequest(() => server.listDemands());

export const getOrgDemand = (id: string) => mockRequest(() => server.getDemand(id));

export const saveDraft = (payload: SaveDraftPayload) => mockRequest(() => server.saveDraft(payload));

export const submitForReview = (payload: SaveDraftPayload) => mockRequest(() => server.submitForReview(payload));

export const deleteDraft = (id: string) => mockRequest(() => server.deleteDraft(id));

export const answerQuestion = (payload: { demandId: string; questionId: string; text: string }) => mockRequest(() => server.answerQuestion(payload));

export const getOrgQuestions = () => mockRequest(() => server.listQuestionDemands());

export const getOrgProjects = () => mockRequest(() => server.listProjects());

export const getOrgProject = (id: string) => mockRequest(() => server.getProject(id));
