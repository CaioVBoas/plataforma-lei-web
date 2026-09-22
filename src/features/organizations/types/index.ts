export interface CompletedPartnership {
  title: string;
  semester: string;
  disciplineName: string;
  teacherName: string;
  deliverable: string;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  location: string;
  themes: string[];
  partnershipSince: string;
  summary: string;
  presentation: string;
  area: string;
  audience: string;
  teamSize: string;
  site: string;
  focalName: string;
  focalRole: string;
  followUp: string;
  channel: string;
  onSiteVisit: string;
  completedProjects: CompletedPartnership[];
}

export interface OpenDemandSummary {
  id: string;
  problem: string;
  affectedPublic: string;
  publishedDaysAgo: number;
}

/** Organização como a lista precisa: com a contagem de demandas abertas já calculada. */
export interface OrganizationWithDemands extends Organization {
  openDemands: OpenDemandSummary[];
}
