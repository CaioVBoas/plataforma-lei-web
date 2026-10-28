import type {
  IsoDate,
  Milestone,
  MilestoneId,
  OutcomeAdoption,
  PlanSection,
  Project,
  ProjectOutcome,
  WorkloadRow,
} from '@/domain/types';
import type { OrgProjectDetail } from '@/features/orgPortal/types';

/**
 * Contrato do plataforma-lei-api (módulos projects e org-portal). Os ids são
 * numéricos e a adoção usa snake_case, então tudo passa por aqui antes de
 * chegar às telas, que trabalham com ids em texto e a adoção em kebab-case.
 */
type ApiAdoption = 'in_use' | 'partial' | 'not_used';

interface ApiMilestone {
  step: MilestoneId;
  dueAt: string;
  doneAt: string | null;
  note?: string | null;
}

export interface ApiProject {
  id: number;
  demandId: number;
  title: string;
  teams: number;
  sigaaCode: string | null;
  outcomeSummary: string | null;
  outcomeAdoption: ApiAdoption | null;
  createdAt: string;
  course: { id: number; name: string; semester: string };
  demand: { id: number; title: string; partnerId: number };
  milestones: ApiMilestone[];
  proposalSections: { title: string; limit: number; text: string; order: number }[];
  workloads: WorkloadRow[];
}

export interface ApiOrgProject {
  id: number;
  title: string;
  teams: number;
  outcomeSummary: string | null;
  outcomeAdoption: ApiAdoption | null;
  milestones: ApiMilestone[];
  course: { name: string; code: string; semester: string };
  professor: { name: string; department: string | null; phone: string | null; email: string };
  coTeachers?: string[];
  demand: { id: number; title: string };
}

const ADOPTION_FROM_API: Record<ApiAdoption, OutcomeAdoption> = {
  in_use: 'in-use',
  partial: 'partial',
  not_used: 'not-used',
};

const ADOPTION_TO_API: Record<OutcomeAdoption, ApiAdoption> = {
  'in-use': 'in_use',
  partial: 'partial',
  'not-used': 'not_used',
};

/** O backend devolve data e hora; as telas comparam só o dia. */
const toIsoDate = (value: string): IsoDate => value.slice(0, 10);

const toMilestone = (milestone: ApiMilestone): Milestone => ({
  id: milestone.step,
  dueAt: toIsoDate(milestone.dueAt),
  ...(milestone.doneAt && { doneAt: toIsoDate(milestone.doneAt) }),
  ...(milestone.note && { note: milestone.note }),
});

const toOutcome = (summary: string | null, adoption: ApiAdoption | null): ProjectOutcome | undefined =>
  summary && adoption ? { summary, adoption: ADOPTION_FROM_API[adoption] } : undefined;

export const outcomeToApi = (outcome: ProjectOutcome) => ({
  summary: outcome.summary,
  adoption: ADOPTION_TO_API[outcome.adoption],
});

export const projectFromApi = (project: ApiProject): Project => {
  const plan: PlanSection[] = [...project.proposalSections]
    .sort((a, b) => a.order - b.order)
    .map(({ title, limit, text }) => ({ title, limit, text }));
  const outcome = toOutcome(project.outcomeSummary, project.outcomeAdoption);
  return {
    id: String(project.id),
    demandId: String(project.demand.id),
    title: project.title,
    // A API não devolve a organização nem o contato dela no projeto do docente.
    organization: { id: String(project.demand.partnerId), name: 'Organização parceira', type: '' },
    contact: { focalName: '', focalRole: '', email: '', channel: '' },
    disciplineId: String(project.course.id),
    disciplineName: project.course.name,
    semester: project.course.semester,
    teams: project.teams,
    createdAt: toIsoDate(project.createdAt),
    milestones: project.milestones.map(toMilestone),
    plan,
    workload: project.workloads.map(({ activity, hours, participants }) => ({ activity, hours, participants })),
    ...(project.sigaaCode && { sigaaCode: project.sigaaCode }),
    ...(outcome && { outcome }),
  };
};

export const orgProjectFromApi = (project: ApiOrgProject): OrgProjectDetail => {
  const outcome = toOutcome(project.outcomeSummary, project.outcomeAdoption);
  return {
    id: String(project.id),
    demandId: String(project.demand.id),
    title: project.title,
    disciplineName: project.course.name,
    semester: project.course.semester,
    teams: project.teams,
    teacherName: project.professor.name,
    teacherEmail: project.professor.email,
    ...(project.professor.phone && { teacherPhone: project.professor.phone }),
    coTeachers: project.coTeachers ?? [],
    hasDemand: true,
    milestones: project.milestones.map(toMilestone),
    ...(outcome && { outcome }),
  };
};
