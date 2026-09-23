import type { Discipline } from '@/domain/types';

export interface DisciplineWithUsage extends Discipline {
  /** Projetos que ocupam vaga agora, calculados a partir dos projetos. */
  activeProjects: number;
  /** Só disciplinas do semestre atual recebem demandas (regra 4). */
  isCurrent: boolean;
}

export type DisciplineInput = Omit<Discipline, 'id' | 'semester'>;
