import type {
  CompetencyReading,
  Demand,
  DemandDetail,
  LinkDisciplinePayload,
  MatchExplanation,
  MessageRecipient,
} from '@/features/matchmaking/types';
import { capitalize } from '@/utils/format';
import { db, findOrThrow } from '../db';
import { COLLEAGUES, COMPETENCY_CATALOG, DEMAND_CONTEXT, MATCH_BASE, READINGS } from '../seed/demands';
import { ORGANIZATIONS } from '../seed/organizations';
import { DEMO_TODAY } from '../seed/semester';
import { getDiscipline } from './disciplines';
import { createProposalFromLink } from './proposals';

/** Disciplina de referência do cenário: a explicação semeada foi escrita para ela. */
const PRIMARY_DISCIPLINE_ID = 'ds';
const RESERVATION_BUSINESS_DAYS = 5;

const findDemand = (id: string) => findOrThrow(db.demands, id, 'Demanda');

export const listDemands = (): Demand[] => db.demands;

export const getDemandDetail = (id: string): DemandDetail => {
  const demand = findDemand(id);
  const context = DEMAND_CONTEXT[id];
  const organization = ORGANIZATIONS.find((candidate) => candidate.id === demand.organizationId);
  const onSiteVisit = organization?.onSiteVisit.replace(/^Recebe a turma\s*(e\s+)?/i, '').trim();

  return {
    ...demand,
    where: context.where,
    since: context.since,
    references: context.references,
    focalName: context.focalName,
    focalRole: context.focalRole,
    channel: context.channel,
    partnershipSince: organization ? capitalize(organization.partnershipSince) : 'Primeira demanda trazida ao CIn',
    completedWithCin: organization?.completedProjects.length ?? 0,
    onSiteVisit: onSiteVisit ? capitalize(onSiteVisit) : 'A combinar com o ponto focal',
    conversation: [...context.conversation, ...(db.sentMessages[id] ?? [])],
  };
};

export const getMatchExplanation = (id: string, disciplineId: string): MatchExplanation => {
  const demand = findDemand(id);
  const base = MATCH_BASE[id];
  let matches = base.matches;
  let gaps = base.gaps;

  // Enquanto o modelo real não existe, a outra disciplina "perde" as práticas que só a principal cobre.
  if (disciplineId !== PRIMARY_DISCIPLINE_ID && matches.length > 1) {
    const moved = matches.slice(-Math.min(2, matches.length - 1));
    matches = matches.slice(0, matches.length - moved.length);
    gaps = [
      ...moved.map((line) => ({ competency: line.competency, reason: 'A prática correspondente está na sua outra disciplina, não nesta.' })),
      ...gaps,
    ];
  }

  return {
    disciplineId,
    percent: demand.matchByDiscipline[disciplineId] ?? 0,
    matches,
    gaps,
    weights: [
      {
        label: 'Correspondência de competências',
        percent: 60,
        note: `${matches.length} de ${matches.length + gaps.length} competências da demanda têm par na sua prática.`,
      },
      { label: 'Compatibilidade de nível', percent: 25, note: 'A demanda pede trabalho de nível intermediário, o mesmo da turma cadastrada.' },
      {
        label: 'Viabilidade no semestre',
        percent: 15,
        note:
          demand.viability === 'fits'
            ? 'O escopo estimado cabe na janela de execução da disciplina.'
            : 'O escopo estimado exige recorte para caber na janela da disciplina.',
      },
    ],
  };
};

export const getCompetencyReading = (id: string): CompetencyReading => {
  const demand = findDemand(id);
  const discarded = db.discardedReadings[id] ?? [];

  return {
    segments: READINGS[id].segments.map((segment) => {
      if (!segment.competency || discarded.includes(segment.competency)) return { text: segment.text };
      const confirmed = demand.competencies.some((item) => item.name === segment.competency && item.confirmed);
      return { ...segment, confirmed };
    }),
    ignoredExcerpts: READINGS[id].ignoredExcerpts,
    manualAssociations: db.manualAssociations[id] ?? [],
  };
};

export const listCompetencyCatalog = () => COMPETENCY_CATALOG;

/** Docentes do CIn que podem ser convidados para coordenar junto. */
export const listColleagues = () => COLLEAGUES;

export const reserveDemand = (id: string) => {
  const demand = findDemand(id);
  if (demand.status !== 'available') throw new Error('Esta demanda não está mais disponível para reserva.');
  demand.status = 'reserved-by-me';
  demand.reservationDaysLeft = RESERVATION_BUSINESS_DAYS;
  db.releasedReservations = db.releasedReservations.filter((demandId) => demandId !== id);
  db.expiredReservations = db.expiredReservations.filter((item) => item.demandId !== id);
};

export const releaseReservation = (id: string) => {
  const demand = findDemand(id);
  demand.status = 'available';
  demand.reservationDaysLeft = undefined;
  if (!db.releasedReservations.includes(id)) db.releasedReservations.push(id);
};

export const confirmCompetency = (id: string, name: string) => {
  const demand = findDemand(id);
  const existing = demand.competencies.find((item) => item.name === name);
  if (existing) existing.confirmed = true;
  else demand.competencies.push({ name, confirmed: true });
};

export const removeCompetency = (id: string, name: string) => {
  const demand = findDemand(id);
  demand.competencies = demand.competencies.filter((item) => item.name !== name);
  db.manualAssociations[id] = (db.manualAssociations[id] ?? []).filter((item) => item.competency !== name);
  if (READINGS[id].segments.some((segment) => segment.competency === name)) {
    db.discardedReadings[id] = [...(db.discardedReadings[id] ?? []), name];
  }
};

const assertNewCompetency = (id: string, name: string) => {
  if (findDemand(id).competencies.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
    throw new Error(`${name} já está na lista desta demanda.`);
  }
};

/** Competência adicionada pelo docente entra confirmada e também no perfil de prática dele. */
export const addCompetency = (id: string, name: string) => {
  assertNewCompetency(id, name);
  findDemand(id).competencies.push({ name, confirmed: true });
  if (!db.practice.confirmed.includes(name)) db.practice.confirmed.push(name);
};

export const associateExcerpt = (id: string, excerpt: string, competency: string) => {
  assertNewCompetency(id, competency);
  findDemand(id).competencies.push({ name: competency, confirmed: true });
  db.manualAssociations[id] = [...(db.manualAssociations[id] ?? []), { competency, excerpt }];
};

export const sendQuestion = (id: string, recipient: MessageRecipient, text: string) => {
  findDemand(id);
  db.sentMessages[id] = [
    ...(db.sentMessages[id] ?? []),
    { author: 'Você', role: '', date: DEMO_TODAY.slice(0, 5), text, mine: true },
  ];
  if (recipient === 'partner') db.unansweredQuestions.add(id);
};

/** Vincular gera (ou reaproveita) o rascunho da proposta e devolve o id dele. */
export const linkDiscipline = (payload: LinkDisciplinePayload) => {
  const demand = findDemand(payload.demandId);
  if (demand.status !== 'reserved-by-me' && demand.status !== 'linked') {
    throw new Error('Reserve a demanda antes de vincular a uma disciplina.');
  }
  const discipline = getDiscipline(payload.disciplineId);
  // Vincular encerra a reserva: a demanda sai do cardápio e das reservas ativas.
  demand.status = 'linked';
  demand.reservationDaysLeft = undefined;
  return createProposalFromLink(payload, discipline);
};
