import type { Proposal, ProposalSection } from '../types';

/** Rascunho "pronto" parado há mais de uma semana merece lembrete. */
export const LATE_READY_DAYS = 7;

/** Carga horária de extensão prevista pelas disciplinas do CIn. */
export const EXPECTED_EXTENSION_HOURS = 60;

export type ProposalListStatus = Proposal['status'] | 'archived';

export const listStatusOf = (proposal: Proposal): ProposalListStatus => (proposal.archived ? 'archived' : proposal.status);

export const STATUS_LABEL: Record<ProposalListStatus, string> = {
  draft: 'Em edição',
  ready: 'Pronto para registro',
  registered: 'Registrado',
  archived: 'Arquivado',
};

export const STATUS_TEXT_CLASS: Record<ProposalListStatus, string> = {
  draft: 'text-n-500',
  ready: 'text-n-800',
  registered: 'text-n-600',
  archived: 'text-n-400',
};

export const isLateReady = (proposal: Proposal) =>
  !proposal.archived && proposal.status === 'ready' && proposal.waitingDays > LATE_READY_DAYS;

/** Formato de cópia e de download: título da seção seguido do texto, na ordem do SIGAA. */
export const sectionsAsText = (sections: ProposalSection[]) =>
  sections.map((section) => `${section.title}\n\n${section.text.trim()}`).join('\n\n\n');

export const sectionPendingMessage = (section: ProposalSection) =>
  section.text.trim().length === 0 ? 'Campo obrigatório no SIGAA ainda vazio.' : section.institutionalNote;
