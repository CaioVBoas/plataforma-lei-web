import type { Discipline } from '@/features/disciplines/types';
import type { LinkDisciplinePayload } from '@/features/matchmaking/types';
import type { Proposal, SaveProposalPayload } from '@/features/proposals/types';
import { isoToBrDate } from '@/utils/format';
import { db, findOrThrow } from '../db';
import { generateSections, generateWorkload } from '../seed/proposals';
import { DEMO_TODAY } from '../seed/semester';
import { createProjectFromProposal } from './projects';

const findProposal = (id: string) => findOrThrow(db.proposals, id, 'Proposta');

export const listProposals = (): Proposal[] => db.proposals;

export const getProposal = (id: string): Proposal => findProposal(id);

export const saveProposal = ({ id, sections, workload }: SaveProposalPayload) => {
  const proposal = findProposal(id);
  proposal.sections = sections;
  proposal.workload = workload;
  proposal.lastEditedOn = DEMO_TODAY;
};

/** "Pronta" significa que nenhum campo obrigatório do SIGAA está vazio. */
export const markProposalReady = ({ id, sections, workload }: SaveProposalPayload) => {
  if (sections.some((section) => !section.text.trim())) {
    throw new Error('Preencha todas as seções antes de marcar como pronta.');
  }
  saveProposal({ id, sections, workload });
  findProposal(id).status = 'ready';
};

/**
 * A plataforma não acessa o SIGAA: a data de registro é declarada pelo docente.
 * Registrar é o que coloca o projeto em execução, então o projeto nasce aqui.
 */
export const registerProposal = (id: string, isoDate: string): string => {
  if (!isoDate) throw new Error('Informe a data em que você registrou no SIGAA.');
  const proposal = findProposal(id);
  proposal.status = 'registered';
  proposal.registeredOn = isoToBrDate(isoDate);
  proposal.waitingDays = 0;
  proposal.projectId ??= createProjectFromProposal(proposal);
  return proposal.projectId;
};

export const toggleProposalArchive = (id: string) => {
  const proposal = findProposal(id);
  if (proposal.status === 'registered') throw new Error('Proposta registrada vira projeto e não pode ser arquivada.');
  proposal.archived = !proposal.archived;
};

/** Toda proposta nasce de um vínculo; vincular de novo a mesma demanda só troca a disciplina. */
export const createProposalFromLink = (payload: LinkDisciplinePayload, discipline: Discipline): string => {
  const existing = db.proposals.find((proposal) => proposal.demandId === payload.demandId && !proposal.archived);
  if (existing) {
    existing.disciplineId = discipline.id;
    existing.disciplineName = discipline.name;
    existing.plannedTeams = payload.teams;
    existing.teamSize = payload.teamSize;
    return existing.id;
  }

  const demand = findOrThrow(db.demands, payload.demandId, 'Demanda');
  const sections = generateSections(payload.demandId);
  const proposal: Proposal = {
    id: `pr${db.proposals.length + 1}`,
    title: sections[0]?.text || demand.problem,
    partnerName: demand.organizationName,
    originSummary: demand.problem,
    demandId: payload.demandId,
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    status: 'draft',
    archived: false,
    lastEditedOn: DEMO_TODAY,
    generatedAt: `${DEMO_TODAY} às 09:52`,
    waitingDays: 0,
    plannedTeams: payload.teams,
    teamSize: payload.teamSize,
    sections,
    workload: generateWorkload(payload.demandId),
  };
  db.proposals.push(proposal);
  return proposal.id;
};
