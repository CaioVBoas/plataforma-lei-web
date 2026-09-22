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
  'reserved-by-other': { label: 'Tenho interesse', kind: 'join-queue' },
  accepted: { label: 'Abrir proposta', kind: 'open-proposal' },
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
