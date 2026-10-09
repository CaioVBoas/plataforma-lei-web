import { projectStage } from './projectLifecycle';
import type { Demand, DemandDraft, DemandSubmission, Milestone, SubmissionStage } from './types';

/**
 * Regras da demanda do lado da organização: o que é preciso para enviar à
 * triagem, quando ainda dá para editar e como cada pedido aparece para ela.
 */

export const SUBMISSION_LIMITS = {
  title: 80,
  problem: 220,
  description: 2000,
  affectedPublic: 160,
  expectedOutcome: 600,
  meetingCadence: 120,
  offer: 200,
  maxOffers: 6,
  maxReferences: 3,
  answer: 1000,
} as const;

export const EMPTY_DRAFT: DemandDraft = {
  title: '',
  problem: '',
  description: '',
  affectedPublic: '',
  expectedOutcome: '',
  skills: [],
  constraints: [],
  meetingCadence: '',
  offers: [],
  references: [],
};

/** Campos que a triagem precisa para ler a demanda, com o nome que a organização vê no formulário. */
const REQUIRED_TEXT: { field: keyof DemandDraft; label: string }[] = [
  { field: 'title', label: 'Nome da demanda' },
  { field: 'problem', label: 'O problema em uma frase' },
  { field: 'description', label: 'Contexto' },
  { field: 'affectedPublic', label: 'Quem sente o problema' },
  { field: 'expectedOutcome', label: 'O que ajudaria ao fim do semestre' },
  { field: 'meetingCadence', label: 'Reuniões com a turma' },
];

/** O que falta para enviar à triagem. Lista vazia quando dá para enviar. */
export const missingForReview = (draft: DemandDraft): string[] => {
  const missing = REQUIRED_TEXT.filter(({ field }) => !String(draft[field]).trim()).map(({ label }) => label);
  if (!draft.offers.some((offer) => offer.trim())) missing.push('O que vocês oferecem à turma');
  return missing;
};

/** Na triagem o texto está com o L.E.I.; rascunho e demanda devolvida voltam para a organização. */
export const canEditSubmission = (submission: Pick<DemandSubmission, 'stage'>) => submission.stage !== 'in-review';

/** Só rascunho pode ser apagado: o que já foi enviado fica registrado. */
export const canDeleteSubmission = (submission: Pick<DemandSubmission, 'stage'>) => submission.stage === 'draft';

/** Onde o pedido da organização está, do rascunho à conclusão do projeto. */
export type OrgDemandStage = SubmissionStage | 'open' | 'reserved' | 'in-project' | 'done';

/** A demanda publicada que virou projeto passa a "concluída" quando o projeto encerra. */
export const publishedStage = (demand: Pick<Demand, 'status'>, projectMilestones?: Milestone[]): OrgDemandStage => {
  if (demand.status !== 'in-project') return demand.status;
  return projectMilestones && projectStage(projectMilestones) === 'done' ? 'done' : 'in-project';
};

export const unansweredQuestions = (demand: Pick<Demand, 'questions'>) => demand.questions.filter((question) => question.replies.length === 0);
