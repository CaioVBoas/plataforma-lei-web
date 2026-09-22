import type { Discipline } from '@/features/disciplines/types';
import type { Demand, DemandStatus, Viability } from '../types';

export const VIABILITY_LABEL: Record<Viability, string> = {
  fits: 'Cabe no semestre',
  tight: 'Apertado',
  'does-not-fit': 'Não cabe',
};

export type DemandActionKind = 'reserve' | 'join-queue' | 'link' | 'open-proposal';

interface DemandAction {
  label: string;
  kind: DemandActionKind;
}

/** A ação principal muda com a situação da demanda, mas o nome acompanha o fluxo do começo ao fim. */
export const DEMAND_ACTION: Record<DemandStatus, DemandAction> = {
  available: { label: 'Tenho interesse', kind: 'reserve' },
  'reserved-by-me': { label: 'Continuar', kind: 'link' },
  // Rótulo diferente de "Tenho interesse": aqui o docente entra na fila, não reserva.
  'reserved-by-other': { label: 'Avise-me se liberar', kind: 'join-queue' },
  linked: { label: 'Abrir proposta', kind: 'open-proposal' },
};

/** Texto de apoio ao lado da ação principal no detalhe da demanda. */
export const DEMAND_ACTION_HINT: Record<DemandStatus, string[]> = {
  available: ['A reserva vale por 5 dias úteis.', 'Você decide depois de conversar com a organização, se precisar.'],
  'reserved-by-me': ['Reservada para você.', 'Vincular a uma disciplina gera a proposta e encerra a reserva.'],
  'reserved-by-other': ['Outro docente está decidindo sobre esta demanda.', 'Se ele liberar, você é avisado primeiro.'],
  linked: ['Vinculada a uma disciplina sua.', 'A proposta está em Propostas, pronta para revisar e registrar.'],
};

/** Faixas semânticas do termômetro; abaixo de 50% a demanda não é recomendada. */
export const matchBandLabel = (percent: number) => {
  if (percent >= 85) return 'Match altíssimo';
  if (percent >= 70) return 'Bom match';
  if (percent >= 50) return 'Vale explorar';
  return 'Combinação fraca';
};

export interface DisciplineMatch {
  discipline: Discipline;
  percent: number;
}

/** Disciplinas do docente ordenadas da mais para a menos compatível com a demanda. */
export const rankDisciplines = (demand: Demand, disciplines: Discipline[]): DisciplineMatch[] =>
  disciplines
    .map((discipline) => ({ discipline, percent: demand.matchByDiscipline[discipline.id] ?? 0 }))
    .sort((a, b) => b.percent - a.percent);

export const organizationLine = (demand: Pick<Demand, 'organizationName' | 'organizationType'>) =>
  `${demand.organizationName} · ${demand.organizationType}`;
