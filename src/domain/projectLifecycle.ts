import { addDays, daysBetween, earliest } from './calendar';
import type { IsoDate, Milestone, MilestoneId, Project, SemesterCalendar } from './types';

/** As seis etapas, sempre nesta ordem (seção 3 do docs/fluxos.md). */
export const MILESTONE_ORDER: MilestoneId[] = ['plan', 'kickoff', 'sigaa', 'midterm', 'final', 'closing'];

export type ProjectStage = 'planning' | 'running' | 'done';

const PLAN_REVIEW_DAYS = 7;
const KICKOFF_DAYS = 14;

/** Prazos de um projeto que acabou de nascer, derivados do calendário do semestre. */
export const buildMilestones = (calendar: SemesterCalendar): Milestone[] => {
  const dueDates: Record<MilestoneId, IsoDate> = {
    plan: earliest(addDays(calendar.today, PLAN_REVIEW_DAYS), calendar.linkDeadline),
    kickoff: earliest(addDays(calendar.today, KICKOFF_DAYS), calendar.linkDeadline),
    sigaa: calendar.linkDeadline,
    midterm: calendar.midtermAt,
    final: calendar.finalAt,
    closing: calendar.endsAt,
  };
  return MILESTONE_ORDER.map((id) => ({ id, dueAt: dueDates[id] }));
};

const isDone = (milestones: Milestone[], id: MilestoneId) => Boolean(milestones.find((milestone) => milestone.id === id)?.doneAt);

/** O estado nunca é guardado: sai das etapas concluídas. */
export const projectStage = (milestones: Milestone[]): ProjectStage => {
  if (isDone(milestones, 'closing')) return 'done';
  if (isDone(milestones, 'sigaa')) return 'running';
  return 'planning';
};

export const nextMilestone = (milestones: Milestone[]) => milestones.find((milestone) => !milestone.doneAt);

export const completedCount = (milestones: Milestone[]) => milestones.filter((milestone) => milestone.doneAt).length;

export const isOverdue = (milestone: Milestone, today: IsoDate) => !milestone.doneAt && daysBetween(today, milestone.dueAt) < 0;

/** Regra 7: depois do registro no SIGAA, o compromisso é institucional. */
export const canWithdraw = (project: Pick<Project, 'milestones'>) => projectStage(project.milestones) === 'planning';

/** Regra 8: o plano registrado é o texto oficial. */
export const isPlanLocked = (project: Pick<Project, 'milestones'>) => isDone(project.milestones, 'sigaa');

export const emptyPlanSections = (project: Pick<Project, 'plan'>) => project.plan.filter((section) => !section.text.trim());

/** Projetos que ainda ocupam vaga na disciplina: todos menos os concluídos. */
export const occupiesSlot = (project: Pick<Project, 'milestones'>) => projectStage(project.milestones) !== 'done';
