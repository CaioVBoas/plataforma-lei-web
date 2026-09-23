import { daysBetween, isLinkWindowOpen } from '@/domain/calendar';
import { freeSlots, maxTeams } from '@/domain/discipline-rules';
import { isMyReservation } from '@/domain/reservation';
import { buildMilestones, canWithdraw, emptyPlanSections, isPlanLocked, nextMilestone } from '@/domain/project-lifecycle';
import type { Project } from '@/domain/types';
import type { AdoptDemandInput, CompleteMilestoneInput, UpdatePlanSectionInput } from '@/features/projects/types';
import { db, findOrThrow, RuleError } from '../db';
import { generatePlan, generateWorkload } from '../seed/plans';
import { withUsage } from './disciplines';

const NOT_FOUND = 'Projeto não encontrado.';

export const listProjects = (): Project[] => db.projects;

export const getProject = (id: string) => findOrThrow(db.projects, id, NOT_FOUND);

/** Levar uma demanda reservada para a disciplina: as regras 1, 3, 4 e 5 do docs/fluxos.md são checadas aqui. */
export const adoptDemand = ({ demandId, disciplineId, teams }: AdoptDemandInput): Project => {
  const demand = findOrThrow(db.demands, demandId, 'Demanda não encontrada.');
  const discipline = withUsage(findOrThrow(db.disciplines, disciplineId, 'Disciplina não encontrada.'));

  if (!isMyReservation(demand)) throw new RuleError('Reserve a demanda antes de levar para uma disciplina.');
  if (!discipline.isCurrent) throw new RuleError(`Só disciplinas de ${db.calendar.id} recebem demandas.`);
  if (freeSlots(discipline) === 0) {
    throw new RuleError(`${discipline.name} não tem vaga. Aumente as vagas da disciplina ou escolha outra.`);
  }
  if (!isLinkWindowOpen(db.calendar)) throw new RuleError('O prazo para levar demandas para disciplinas deste semestre terminou.');
  if (teams < 1 || teams > maxTeams(discipline)) {
    throw new RuleError('O número de equipes precisa caber na turma.');
  }

  const { contact } = findOrThrow(db.organizations, demand.organization.id, 'Organização não encontrada.');
  const plan = generatePlan(demand.id);
  const project: Project = {
    id: `${demand.id}-${db.calendar.id.replace('.', '-')}`,
    demandId: demand.id,
    title: plan[0]?.text || demand.title,
    organization: demand.organization,
    contact: { ...contact },
    disciplineId: discipline.id,
    disciplineName: discipline.name,
    semester: discipline.semester,
    teams,
    createdAt: db.calendar.today,
    milestones: buildMilestones(db.calendar),
    plan,
    workload: generateWorkload(demand.id),
  };

  demand.status = 'in-project';
  demand.reservation = undefined;
  db.projects.unshift(project);
  return project;
};

/** Regra 7: desistir só antes do registro no SIGAA, e a demanda volta para o cardápio. */
export const withdrawProject = (id: string) => {
  const project = getProject(id);
  if (!canWithdraw(project)) throw new RuleError('Depois do registro no SIGAA não é possível desistir pela plataforma.');
  const demand = db.demands.find((candidate) => candidate.id === project.demandId);
  if (demand) {
    demand.status = 'open';
    demand.reservation = undefined;
  }
  db.projects = db.projects.filter((candidate) => candidate.id !== id);
};

export const updatePlanSection = ({ projectId, sectionIndex, text }: UpdatePlanSectionInput): Project => {
  const project = getProject(projectId);
  if (isPlanLocked(project)) throw new RuleError('O plano já foi registrado no SIGAA e não muda mais por aqui.');
  const section = project.plan[sectionIndex];
  if (!section) throw new RuleError('Seção do plano não encontrada.');
  if (text.length > section.limit) throw new RuleError(`${section.title} passa do limite de ${section.limit} caracteres do SIGAA.`);
  section.text = text;
  if (sectionIndex === 0 && text.trim()) project.title = text.trim();
  return project;
};

export const updateTeams = (projectId: string, teams: number): Project => {
  const project = getProject(projectId);
  const discipline = findOrThrow(db.disciplines, project.disciplineId, 'Disciplina não encontrada.');
  if (teams < 1 || teams > maxTeams(discipline)) throw new RuleError('O número de equipes precisa caber na turma.');
  project.teams = teams;
  return project;
};

/** As etapas seguem a ordem fixa; cada uma tem a sua exigência antes de ser marcada. */
export const completeMilestone = ({ projectId, milestoneId, doneAt, note, sigaaCode, outcome }: CompleteMilestoneInput): Project => {
  const project = getProject(projectId);
  const next = nextMilestone(project.milestones);

  if (!next || next.id !== milestoneId) throw new RuleError('Conclua as etapas na ordem.');
  if (daysBetween(db.calendar.today, doneAt) > 0) throw new RuleError('A data não pode estar no futuro.');

  if (milestoneId === 'plan') {
    const empty = emptyPlanSections(project);
    if (empty.length > 0) throw new RuleError(`Preencha ${empty.map((section) => section.title).join(', ')} antes de confirmar o plano.`);
  }

  if (milestoneId === 'closing') {
    if (!outcome?.summary.trim()) throw new RuleError('Conte em poucas linhas o que ficou com a organização.');
    project.outcome = { summary: outcome.summary.trim(), adoption: outcome.adoption };
    // Regra 10: o resultado vai para o histórico da organização.
    const organization = db.organizations.find((candidate) => candidate.id === project.organization.id);
    organization?.history.unshift({
      title: project.title,
      semester: project.semester,
      disciplineName: project.disciplineName,
      teacherName: db.account.name,
      result: project.outcome.summary,
    });
  }

  if (milestoneId === 'sigaa' && sigaaCode?.trim()) project.sigaaCode = sigaaCode.trim();

  next.doneAt = doneAt;
  if (note?.trim()) next.note = note.trim();
  return project;
};
