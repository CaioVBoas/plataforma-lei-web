export type ProjectStage = 'running' | 'completed';

export type ReportStatus = 'pending' | 'sent' | 'approved';

export type LogEntryKind = 'one-off' | 'ongoing';

export interface Milestone {
  week: string;
  label: string;
  done: boolean;
}

export interface InstitutionalDeadline {
  label: string;
  date: string;
  note: string;
  urgent: boolean;
}

export interface TeamMember {
  name: string;
  enrollment: string;
  hours: string;
  concurrentProjects: number;
  availability: string;
}

export interface Team {
  name: string;
  scope: string;
  members: TeamMember[];
}

export interface LogEntry {
  author: string;
  kind: LogEntryKind;
  date: string;
  text: string;
  attachments: string[];
}

export interface HoursRow {
  name: string;
  enrollment: string;
  values: string[];
}

export interface ProjectDetail {
  problem: string;
  goals: string[];
  agreedDeliverable: string;
  milestones: Milestone[];
  focalName: string;
  focalRole: string;
  channel: string;
  healthLabel: string;
  healthNote: string;
  healthTone: 'ok' | 'attention';
  deadlines: InstitutionalDeadline[];
  teams: Team[];
  log: LogEntry[];
  hoursColumns: string[];
  hoursRows: HoursRow[];
  plannedHours: number;
}

export interface Completion {
  date: string;
  semester: string;
  certifiedHours: number;
  report: ReportStatus;
  publishedOnShowcase: boolean;
}

export interface Project {
  id: string;
  stage: ProjectStage;
  title: string;
  disciplineName: string;
  partnerName: string;
  /** Projetos anteriores à plataforma não têm demanda nem rascunho de origem. */
  demandId?: string;
  proposalId?: string;
  teamsFormed: number;
  teamsPlanned: number;
  students: number;
  hours: number;
  plannedHours: number;
  weeksLeft: number;
  /** Uma posição por semana do cronograma; true quando houve registro de andamento. */
  weeklyLog: boolean[];
  elapsedWeeks: number;
  lastUpdate: string;
  completion?: Completion;
  detail: ProjectDetail;
}

export interface NewLogEntryPayload {
  projectId: string;
  kind: LogEntryKind;
  text: string;
  hours: string;
}
