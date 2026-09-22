import { MILESTONE_ORDER } from '@/domain/project-lifecycle';
import type { IsoDate, Milestone, MilestoneId, PlanSection, Project } from '@/domain/types';
import { ORGANIZATIONS } from './organizations';
import { generatePlan, generateWorkload } from './plans';

type MilestoneSeed = { dueAt: IsoDate; doneAt?: IsoDate; note?: string };

const milestones = (seeds: Record<MilestoneId, MilestoneSeed>): Milestone[] => MILESTONE_ORDER.map((id) => ({ id, ...seeds[id] }));

const contactOf = (organizationId: string) => {
  const organization = ORGANIZATIONS.find((candidate) => candidate.id === organizationId);
  if (!organization) throw new Error(`Organização ${organizationId} não está no seed.`);
  return { ...organization.contact };
};

/** Projetos de semestres passados guardam só o essencial do plano registrado. */
const archivedPlan = (title: string, summary: string): PlanSection[] => [
  { title: 'Título do projeto', limit: 150, text: title },
  { title: 'Resumo', limit: 1500, text: summary },
];

export const PROJECTS: Project[] = [
  // Em andamento: já registrado no SIGAA, próxima etapa é a entrega parcial.
  {
    id: 'mesa-2026-2',
    demandId: 'mesa',
    title: 'Estoque à vista: doações do banco de alimentos',
    organization: { id: 'mesa-brasil-recife', name: 'Mesa Brasil Recife', type: 'Organização social' },
    contact: contactOf('mesa-brasil-recife'),
    disciplineId: 'ds',
    disciplineName: 'Desenvolvimento de Software',
    semester: '2026.2',
    teams: 2,
    createdAt: '2026-07-22',
    sigaaCode: 'PJ-2026-0412',
    milestones: milestones({
      plan: { dueAt: '2026-07-29', doneAt: '2026-07-24' },
      kickoff: {
        dueAt: '2026-08-05',
        doneAt: '2026-08-06',
        note: 'Visita ao centro de distribuição com as duas equipes. A vitrine vai mostrar só itens com mais de três dias de validade.',
      },
      sigaa: { dueAt: '2026-09-12', doneAt: '2026-08-10' },
      midterm: { dueAt: '2026-10-09' },
      final: { dueAt: '2026-11-27' },
      closing: { dueAt: '2026-12-04' },
    }),
    plan: generatePlan('mesa'),
    workload: generateWorkload('mesa'),
  },
  // Em planejamento: plano confirmado, falta a reunião de abertura.
  {
    id: 'casa-2026-2',
    demandId: 'casa',
    title: 'Histórico que acompanha: registro de atendimento das jovens',
    organization: { id: 'casa-de-passagem', name: 'Casa de Passagem', type: 'Organização social' },
    contact: contactOf('casa-de-passagem'),
    disciplineId: 'es1',
    disciplineName: 'Engenharia de Software 1',
    semester: '2026.2',
    teams: 2,
    createdAt: '2026-08-17',
    milestones: milestones({
      plan: { dueAt: '2026-08-24', doneAt: '2026-08-20' },
      kickoff: { dueAt: '2026-08-31' },
      sigaa: { dueAt: '2026-09-12' },
      midterm: { dueAt: '2026-10-09' },
      final: { dueAt: '2026-11-27' },
      closing: { dueAt: '2026-12-04' },
    }),
    plan: generatePlan('casa'),
    workload: generateWorkload('casa'),
  },
  // Concluídos: o resultado de cada um está no histórico da organização.
  {
    id: 'hc-2025-2',
    demandId: 'hc-triagem',
    title: 'Triagem de encaminhamentos no ambulatório',
    organization: { id: 'hospital-das-clinicas', name: 'Hospital das Clínicas', type: 'Órgão público' },
    contact: contactOf('hospital-das-clinicas'),
    disciplineId: 'ds-2025-2',
    disciplineName: 'Desenvolvimento de Software',
    semester: '2025.2',
    teams: 2,
    createdAt: '2025-07-28',
    sigaaCode: 'PJ-2025-0877',
    milestones: milestones({
      plan: { dueAt: '2025-08-04', doneAt: '2025-08-01' },
      kickoff: { dueAt: '2025-08-11', doneAt: '2025-08-08' },
      sigaa: { dueAt: '2025-09-06', doneAt: '2025-08-20' },
      midterm: { dueAt: '2025-10-03', doneAt: '2025-10-03' },
      final: { dueAt: '2025-11-21', doneAt: '2025-11-21' },
      closing: { dueAt: '2025-11-28', doneAt: '2025-11-27' },
    }),
    plan: archivedPlan(
      'Triagem de encaminhamentos no ambulatório',
      'Painel que ordena os encaminhamentos do ambulatório por prioridade clínica e tempo de espera.',
    ),
    workload: [],
    outcome: { summary: 'Painel de triagem em uso pela equipe do ambulatório desde janeiro.', adoption: 'in-use' },
  },
  {
    id: 'recife-2025-1',
    demandId: 'recife-fluxo',
    title: 'Mapeamento do fluxo de atendimento de campo',
    organization: { id: 'prefeitura-do-recife', name: 'Prefeitura do Recife', type: 'Órgão público' },
    contact: contactOf('prefeitura-do-recife'),
    disciplineId: 'es1-2025-1',
    disciplineName: 'Engenharia de Software 1',
    semester: '2025.1',
    teams: 2,
    createdAt: '2025-03-10',
    sigaaCode: 'PJ-2025-0213',
    milestones: milestones({
      plan: { dueAt: '2025-03-17', doneAt: '2025-03-14' },
      kickoff: { dueAt: '2025-03-24', doneAt: '2025-03-21' },
      sigaa: { dueAt: '2025-04-05', doneAt: '2025-03-28' },
      midterm: { dueAt: '2025-05-16', doneAt: '2025-05-16' },
      final: { dueAt: '2025-07-04', doneAt: '2025-07-04' },
      closing: { dueAt: '2025-07-11', doneAt: '2025-07-10' },
    }),
    plan: archivedPlan(
      'Mapeamento do fluxo de atendimento de campo',
      'Levantamento e documentação do fluxo de atendimento das equipes de campo nas seis regionais.',
    ),
    workload: [],
    outcome: { summary: 'Fluxo de atendimento documentado e validado com as seis regionais.', adoption: 'partial' },
  },
  {
    id: 'grio-2024-2',
    demandId: 'varzea-registro',
    title: 'Registro comunitário de pontos de alagamento',
    organization: { id: 'coletivo-grio', name: 'Coletivo Griô', type: 'Organização social' },
    contact: contactOf('coletivo-grio'),
    disciplineId: 'ds-2024-2',
    disciplineName: 'Desenvolvimento de Software',
    semester: '2024.2',
    teams: 1,
    createdAt: '2024-08-12',
    sigaaCode: 'PJ-2024-0655',
    milestones: milestones({
      plan: { dueAt: '2024-08-19', doneAt: '2024-08-16' },
      kickoff: { dueAt: '2024-08-26', doneAt: '2024-08-24' },
      sigaa: { dueAt: '2024-09-07', doneAt: '2024-09-02' },
      midterm: { dueAt: '2024-10-11', doneAt: '2024-10-11' },
      final: { dueAt: '2024-11-29', doneAt: '2024-11-29' },
      closing: { dueAt: '2024-12-06', doneAt: '2024-12-05' },
    }),
    plan: archivedPlan(
      'Registro comunitário de pontos de alagamento',
      'Primeira versão do mapa de pontos de alagamento, alimentada pelo próprio coletivo.',
    ),
    workload: [],
    outcome: { summary: 'Mapa comunitário mantido pelo coletivo e usado em duas audiências públicas.', adoption: 'in-use' },
  },
];
