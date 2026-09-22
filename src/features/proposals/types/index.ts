export type ProposalStatus = 'draft' | 'ready' | 'registered';

export interface ProposalSection {
  title: string;
  /** Limite de caracteres imposto pelo campo correspondente no SIGAA. */
  limit: number;
  text: string;
  /** Pendência institucional que o texto sozinho não resolve. */
  institutionalNote?: string;
}

export interface WorkloadRow {
  activity: string;
  hours: string;
  participants: string;
}

export interface Proposal {
  id: string;
  title: string;
  partnerName: string;
  originSummary: string;
  demandId: string;
  disciplineId: string;
  disciplineName: string;
  status: ProposalStatus;
  archived: boolean;
  lastEditedOn: string;
  generatedAt: string;
  /** Dias parada como "pronta" sem registro no SIGAA. */
  waitingDays: number;
  registeredOn?: string;
  sections: ProposalSection[];
  workload: WorkloadRow[];
}

export interface SaveProposalPayload {
  id: string;
  sections: ProposalSection[];
  workload: WorkloadRow[];
}
