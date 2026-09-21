export interface Project {
  id: string;
  title: string;
  description: string;
  area: string;
  requiredSkills: string[];
  vacancies: number;
  status: 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  organizationId: string;
  createdAt: string;
}
