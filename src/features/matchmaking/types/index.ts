/** Viabilidade no semestre: três estados fechados, sem escala contínua. */
export type Viability = 'fits' | 'tight' | 'does-not-fit';

export type DemandStatus = 'available' | 'reserved-by-me' | 'reserved-by-other' | 'accepted';

export interface DemandCompetency {
  name: string;
  /** Falso enquanto for só leitura automática da descrição do parceiro. */
  confirmed: boolean;
}

export interface Demand {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationType: string;
  problem: string;
  affectedPublic: string;
  description: string;
  viability: Viability;
  viabilityNote: string;
  followUpCadence: string;
  publishedDaysAgo: number;
  hasNoInterested: boolean;
  status: DemandStatus;
  reservedBy?: string;
  reservationDaysLeft?: number;
  competencies: DemandCompetency[];
  /** Percentual de compatibilidade por id de disciplina do docente. */
  matchByDiscipline: Record<string, number>;
}

export interface PartnerReference {
  name: string;
  description: string;
  url: string;
}

export interface ConversationMessage {
  author: string;
  role: string;
  date: string;
  text: string;
  mine: boolean;
}

export type MessageRecipient = 'partner' | 'lei';

export interface DemandDetail extends Demand {
  where: string;
  since: string;
  references: PartnerReference[];
  focalName: string;
  focalRole: string;
  channel: string;
  partnershipSince: string;
  completedWithCin: number;
  onSiteVisit: string;
  conversation: ConversationMessage[];
}

export interface MatchLine {
  competency: string;
  practice: string;
  source: string;
}

export interface GapLine {
  competency: string;
  reason: string;
}

export interface MatchWeight {
  label: string;
  percent: number;
  note: string;
}

export interface MatchExplanation {
  disciplineId: string;
  percent: number;
  matches: MatchLine[];
  gaps: GapLine[];
  weights: MatchWeight[];
}

export type ReadingConfidence = 'alta' | 'média' | 'baixa';

/** Trecho da descrição; os que viraram competência trazem a leitura e seu estado. */
export interface ReadingSegment {
  text: string;
  competency?: string;
  confidence?: ReadingConfidence;
  confirmed?: boolean;
}

export interface ManualAssociation {
  competency: string;
  excerpt: string;
}

/** Como a leitura automática transformou a descrição do parceiro em competências. */
export interface CompetencyReading {
  segments: ReadingSegment[];
  ignoredExcerpts: string[];
  manualAssociations: ManualAssociation[];
}

export interface Colleague {
  id: string;
  name: string;
  area: string;
}

export interface LinkDisciplinePayload {
  demandId: string;
  disciplineId: string;
  teams: number;
  teamSize: string;
  invitedColleagues: string[];
}
