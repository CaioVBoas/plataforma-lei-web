import type { IsoDate, MilestoneId, ProjectOutcome } from '@/domain/types';

export interface AdoptDemandInput {
  demandId: string;
  disciplineId: string;
  teams: number;
}

export interface CompleteMilestoneInput {
  projectId: string;
  milestoneId: MilestoneId;
  /** Só o modo demonstração usa: com a API, a data é a do servidor. */
  doneAt?: IsoDate;
  note?: string;
  sigaaCode?: string;
  outcome?: ProjectOutcome;
}

export interface UpdatePlanSectionInput {
  projectId: string;
  sectionIndex: number;
  text: string;
}
