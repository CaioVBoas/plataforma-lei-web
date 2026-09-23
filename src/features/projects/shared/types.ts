import type { IsoDate, MilestoneId, ProjectOutcome } from '@/domain/types';

export interface AdoptDemandInput {
  demandId: string;
  disciplineId: string;
  teams: number;
}

export interface CompleteMilestoneInput {
  projectId: string;
  milestoneId: MilestoneId;
  doneAt: IsoDate;
  note?: string;
  sigaaCode?: string;
  outcome?: ProjectOutcome;
}

export interface UpdatePlanSectionInput {
  projectId: string;
  sectionIndex: number;
  text: string;
}
