import type { NewLogEntryPayload, Project } from '@/features/projects/types';
import type { Proposal } from '@/features/proposals/types';
import { db, findOrThrow } from '../db';
import { DEMAND_CONTEXT } from '../seed/demands';
import { CURRENT_USER } from '../seed/profile';
import { DEMO_TODAY } from '../seed/semester';

const SCHEDULE_WEEKS = 12;
const WEEKLY_HOURS_PER_TEAM = 20;

const findProject = (id: string) => findOrThrow(db.projects, id, 'Projeto');

export const listProjects = (): Project[] => db.projects;

export const getProject = (id: string): Project => findProject(id);

/** Registro de andamento conta a semana corrente como acompanhada; o parceiro é notificado. */
export const addLogEntry = ({ projectId, kind, text }: NewLogEntryPayload) => {
  if (!text.trim()) throw new Error('Escreva o que a equipe fez antes de registrar.');
  const project = findProject(projectId);
  project.detail.log.unshift({ author: CURRENT_USER.name, kind, date: DEMO_TODAY, text: text.trim(), attachments: [] });
  const currentWeek = Math.max(0, project.elapsedWeeks - 1);
  project.weeklyLog = project.weeklyLog.map((logged, week) => (week === currentWeek ? true : logged));
  project.lastUpdate = `Última atualização por você, em ${DEMO_TODAY.slice(0, 5)}`;
};

export const prepareReport = (id: string) => {
  const { completion } = findProject(id);
  if (completion) completion.report = 'sent';
};

export const publishOnShowcase = (id: string) => {
  const { completion } = findProject(id);
  if (completion) completion.publishedOnShowcase = true;
};

/** Projeto recém-registrado: ainda sem equipes nem registros, com a formação de equipes como primeiro prazo. */
export const createProjectFromProposal = (proposal: Proposal): string => {
  const demand = findOrThrow(db.demands, proposal.demandId, 'Demanda');
  const context = DEMAND_CONTEXT[proposal.demandId];
  const project: Project = {
    id: `p${db.projects.length + 1}`,
    stage: 'running',
    title: proposal.sections[0]?.text || proposal.title,
    disciplineName: proposal.disciplineName,
    partnerName: demand.organizationName,
    demandId: demand.id,
    proposalId: proposal.id,
    teamsFormed: 0,
    teamsPlanned: proposal.plannedTeams,
    students: 0,
    hours: 0,
    plannedHours: proposal.plannedTeams * WEEKLY_HOURS_PER_TEAM * SCHEDULE_WEEKS,
    weeksLeft: SCHEDULE_WEEKS,
    weeklyLog: Array<boolean>(SCHEDULE_WEEKS).fill(false),
    elapsedWeeks: 0,
    lastUpdate: `Criado a partir da proposta registrada em ${proposal.registeredOn}`,
    detail: {
      problem: demand.description,
      goals: [],
      agreedDeliverable: proposal.sections[5]?.text ?? '',
      milestones: [
        { week: 'Semana 1', label: 'Início com o parceiro', done: false },
        { week: 'Semana 4', label: 'Levantamento validado', done: false },
        { week: 'Semana 8', label: 'Primeira entrega parcial', done: false },
        { week: 'Semana 12', label: 'Entrega e apresentação ao parceiro', done: false },
      ],
      focalName: context?.focalName ?? 'A definir',
      focalRole: context?.focalRole ?? '',
      channel: context?.channel ?? 'A combinar',
      healthLabel: 'Aguardando início',
      healthNote: 'Forme as equipes para começar o acompanhamento semanal.',
      healthTone: 'ok',
      deadlines: [{ label: 'Formar as equipes', date: '12/09', note: `A proposta prevê ${proposal.plannedTeams} equipes de ${proposal.teamSize} estudantes.`, urgent: true }],
      teams: [],
      log: [],
      hoursColumns: [],
      hoursRows: [],
      plannedHours: 0,
    },
  };
  db.projects.push(project);
  return project.id;
};
