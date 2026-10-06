import type { OrgDemandStage } from '@/domain/submission';
import type {
  Demand,
  DemandDraft,
  DemandSubmission,
  IsoDate,
  Milestone,
  Organization,
  OrganizationContact,
  OrgAccount,
  ProjectOutcome,
  SubmissionReview,
} from '@/domain/types';

/** Um pedido da organização na lista: rascunho, em triagem, no cardápio, em projeto ou concluído. */
export interface OrgDemandSummary {
  id: string;
  title: string;
  problem: string;
  stage: OrgDemandStage;
  /** Último movimento: edição do rascunho, envio, publicação. */
  date: IsoDate;
  unanswered: number;
  reservation?: { teacherName: string; until: IsoDate };
  projectId?: string;
  review?: SubmissionReview;
  /** A demanda saiu da plataforma; resta o projeto. */
  archived?: boolean;
}

/** Projeto visto pela organização: as etapas e quem é o docente, sem o plano interno da disciplina. */
export interface OrgProjectSummary {
  id: string;
  demandId: string;
  title: string;
  disciplineName: string;
  semester: string;
  teams: number;
  teacherName: string;
  milestones: Milestone[];
  outcome?: ProjectOutcome;
}

export interface OrgProjectDetail extends OrgProjectSummary {
  teacherEmail: string;
  teacherPhone?: string;
  /** Colegas que dividem a disciplina. */
  coTeachers: string[];
  /** A demanda que originou o projeto, quando ainda está na plataforma. */
  hasDemand: boolean;
}

export type OrgDemandDetail =
  | { kind: 'submission'; stage: OrgDemandStage; submission: DemandSubmission }
  | { kind: 'published'; stage: OrgDemandStage; demand: Demand; project?: OrgProjectSummary };

export interface OrgProfile {
  organization: Organization;
  contact: OrganizationContact;
}

/** O nome e o histórico não mudam por aqui: o nome passa pelo L.E.I. e o histórico vem dos projetos. */
export type OrgProfileInput = Omit<Organization, 'id' | 'name' | 'history' | 'logo' | 'cover'> & { contact: OrganizationContact };

/** Logo e capa mudam na hora, sem esperar o Salvar do formulário. Texto vazio remove. */
export type OrgImagesInput = Partial<Pick<Organization, 'logo' | 'cover'>>;

export type OrgAccountInput = Pick<OrgAccount, 'name' | 'position' | 'phone'>;

export interface SaveDraftPayload {
  id?: string;
  draft: DemandDraft;
}

export interface OrgSignupPayload {
  organizationName: string;
  organizationType: string;
  location: string;
  name: string;
  position: string;
  email: string;
  password: string;
}
