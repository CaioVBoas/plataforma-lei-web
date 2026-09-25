import type { Discipline } from '@/domain/types';

export interface DisciplineWithUsage extends Discipline {
  /** Projetos que ocupam vaga agora, calculados a partir dos projetos. */
  activeProjects: number;
  /** Só disciplinas do semestre atual recebem demandas (regra 4). */
  isCurrent: boolean;
}

/** Os docentes da disciplina têm ações próprias; o formulário cuida só da turma. */
export type DisciplineInput = Omit<Discipline, 'id' | 'semester' | 'coTeachers'>;
