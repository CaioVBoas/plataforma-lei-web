import type { Discipline } from '@/features/disciplines/types';
import type { Proposal, SaveProposalPayload } from '@/features/proposals/types';
import { isoToBrDate } from '@/utils/format';
import { db, findOrThrow } from '../db';
import { generateSections, generateWorkload } from '../seed/proposals';
import { DEMO_TODAY } from '../seed/semester';

const findProposal = (id: string) => findOrThrow(db.proposals, id, 'Rascunho');

export const listProposals = (): Proposal[] => db.proposals;

export const getProposal = (id: string): Proposal => findProposal(id);

export const saveProposal = ({ id, sections, workload }: SaveProposalPayload) => {
  const proposal = findProposal(id);
  proposal.sections = sections;
  proposal.workload = workload;
  proposal.lastEditedOn = DEMO_TODAY;
};

/** A plataforma não acessa o SIGAA: a data de registro é declarada pelo docente. */
export const registerProposal = (id: string, isoDate: string) => {
  if (!isoDate) throw new Error('Informe a data em que você registrou no SIGAA.');
  const proposal = findProposal(id);
  proposal.status = 'registered';
  proposal.registeredOn = isoToBrDate(isoDate);
};

export const toggleProposalArchive = (id: string) => {
  const proposal = findProposal(id);
  proposal.archived = !proposal.archived;
};

export const createProposalFromDemand = (demandId: string, discipline: Discipline): string => {
  const existing = db.proposals.find((proposal) => proposal.demandId === demandId && !proposal.archived);
  if (existing) {
    existing.disciplineId = discipline.id;
    existing.disciplineName = discipline.name;
    return existing.id;
  }

  const demand = findOrThrow(db.demands, demandId, 'Demanda');
  const sections = generateSections(demandId);
  const proposal: Proposal = {
    id: `pr${db.proposals.length + 1}`,
    title: sections[0]?.text || demand.problem,
    partnerName: demand.organizationName,
    originSummary: demand.problem,
    demandId,
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    status: 'draft',
    archived: false,
    lastEditedOn: DEMO_TODAY,
    generatedAt: `${DEMO_TODAY} às 09:52`,
    waitingDays: 0,
    sections,
    workload: generateWorkload(demandId),
  };
  db.proposals.push(proposal);
  return proposal.id;
};
