/**
 * Entidades do produto, compartilhadas pelo backend simulado e pelas telas.
 * O modelo completo e as regras estão em docs/fluxos.md.
 */

/** Data no formato do input date, "2026-09-12". Fica em ISO para ordenar e comparar sem conversão. */
export type IsoDate = string;

export interface SemesterCalendar {
  id: string;
  startsAt: IsoDate;
  endsAt: IsoDate;
  /** Depois desta data nenhuma demanda nova entra em disciplina do semestre. */
  linkDeadline: IsoDate;
  midtermAt: IsoDate;
  finalAt: IsoDate;
  /** Data de referência. Na demonstração fica fixa para os prazos fazerem sentido. */
  today: IsoDate;
}

export interface OrganizationRef {
  id: string;
  name: string;
  type: string;
}

/** Só aparece para quem já tem projeto com a organização (regra 6 do docs/fluxos.md). */
export interface OrganizationContact {
  focalName: string;
  focalRole: string;
  email: string;
  channel: string;
}

export interface OrganizationHistoryEntry {
  title: string;
  semester: string;
  disciplineName: string;
  teacherName: string;
  /** Texto do encerramento do projeto (regra 10): o que ficou com a organização. */
  result: string;
}

export interface Organization extends OrganizationRef {
  location: string;
  about: string;
  audience: string;
  site: string;
  meetingCadence: string;
  onSiteVisit: string;
  history: OrganizationHistoryEntry[];
}

export type ScopeFit = 'fits' | 'needs-cut';

/**
 * Em que altura do curso a turma está. A demanda não pode pedir mais do que a
 * turma dá conta (RN-03 do levantamento de requisitos).
 */
export type CourseLevel = 'intro' | 'intermediate' | 'advanced';

/** O que pesa na rotina da disciplina antes de aceitar. */
export type DemandConstraint = 'on-site' | 'sensitive-data' | 'confidential';

/**
 * Pergunta do docente à organização antes de decidir. Nesta versão o L.E.I.
 * repassa; pergunta e resposta ficam na demanda para quem vier depois.
 */
export interface DemandQuestion {
  id: string;
  teacherName: string;
  /** Calculado pelo backend a partir de quem pergunta. */
  mine: boolean;
  askedAt: IsoDate;
  text: string;
  answer?: { text: string; answeredAt: IsoDate; by: string };
}

/** Indicação pessoal do L.E.I.: o docente chega pelo e-mail direto na demanda. */
export interface DemandInvitation {
  from: string;
  message: string;
  sentAt: IsoDate;
}

/** Aberta no cardápio, guardada por um docente enquanto ele decide, ou já em projeto. */
export type DemandStatus = 'open' | 'reserved' | 'in-project';

export interface Reservation {
  teacherName: string;
  /** Calculado pelo backend a partir de quem pergunta. */
  mine: boolean;
  /** Último dia da reserva. No dia seguinte a demanda volta ao cardápio. */
  until: IsoDate;
}

/** Solução parecida que já existe, para a turma não começar do zero. */
export interface Reference {
  name: string;
  description: string;
  url: string;
}

export interface Demand {
  id: string;
  organization: OrganizationRef;
  /** Nome curto, como a demanda é chamada no dia a dia. */
  title: string;
  /** O problema em uma frase, do ponto de vista de quem sofre com ele. */
  problem: string;
  description: string;
  affectedPublic: string;
  skills: string[];
  level: CourseLevel;
  constraints: DemandConstraint[];
  scopeFit: ScopeFit;
  scopeNote: string;
  meetingCadence: string;
  /** O que a organização põe na mesa: dados, visita, tempo da equipe. */
  offers: string[];
  publishedAt: IsoDate;
  status: DemandStatus;
  reservation?: Reservation;
  /** O docente pediu aviso caso a reserva de outra pessoa acabe. */
  watching: boolean;
  references: Reference[];
  questions: DemandQuestion[];
  /** Só vem para o docente indicado. */
  invitation?: DemandInvitation;
}

/** Docente que divide a disciplina e os projetos dela. */
export interface CoTeacher {
  email: string;
  /** Vazio enquanto o convite não foi aceito. */
  name?: string;
}

export interface Discipline {
  id: string;
  name: string;
  code: string;
  semester: string;
  level: CourseLevel;
  students: number;
  teamSize: number;
  /** Quem divide a disciplina com o docente. Todos veem e editam os projetos dela. */
  coTeachers: CoTeacher[];
  /** Quantos projetos a turma comporta ao mesmo tempo. */
  projectSlots: number;
  /** O que a disciplina trabalha. É a base da compatibilidade com as demandas. */
  skills: string[];
}

export type MilestoneId = 'plan' | 'kickoff' | 'sigaa' | 'midterm' | 'final' | 'closing';

export interface Milestone {
  id: MilestoneId;
  dueAt: IsoDate;
  doneAt?: IsoDate;
  note?: string;
}

export interface PlanSection {
  title: string;
  /** Limite de caracteres do campo correspondente no SIGAA. */
  limit: number;
  text: string;
}

export interface WorkloadRow {
  activity: string;
  hours: number;
  participants: string;
}

export type OutcomeAdoption = 'in-use' | 'partial' | 'not-used';

export interface ProjectOutcome {
  summary: string;
  adoption: OutcomeAdoption;
}

export interface Project {
  id: string;
  demandId: string;
  title: string;
  organization: OrganizationRef;
  contact: OrganizationContact;
  disciplineId: string;
  disciplineName: string;
  semester: string;
  teams: number;
  createdAt: IsoDate;
  milestones: Milestone[];
  plan: PlanSection[];
  workload: WorkloadRow[];
  sigaaCode?: string;
  outcome?: ProjectOutcome;
}

export interface Account {
  name: string;
  email: string;
  department: string;
  phone: string;
  /** Enquanto for falso, o Início convida para o tutorial. */
  tutorialSeen: boolean;
}
