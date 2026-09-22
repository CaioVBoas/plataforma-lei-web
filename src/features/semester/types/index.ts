/** Faixa de contexto do portal: semestre corrente e o prazo institucional mais próximo. */
export interface SemesterContext {
  current: string;
  nextDeadline: string;
  daysLeft: number;
}
