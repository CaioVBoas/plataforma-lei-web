import { daysBetween } from '@/domain/calendar';
import type { DisciplineMatch } from '@/domain/matching';
import type { Demand, IsoDate, ScopeFit } from '@/domain/types';
import type { StatusTone } from '@/components/ui/status-label';

/** Publicada há até uma semana: aparece como nova. */
const NEW_FOR_DAYS = 7;

export const isNew = (demand: Demand, today: IsoDate) => daysBetween(demand.publishedAt, today) <= NEW_FOR_DAYS;

export const SCOPE_COPY: Record<ScopeFit, { label: string; tone: StatusTone }> = {
  fits: { label: 'Cabe no semestre', tone: 'neutral' },
  'needs-cut': { label: 'Precisa de recorte', tone: 'caution' },
};

/** "Combina com Desenvolvimento de Software" ou a melhor cobertura parcial, sem percentual inventado. */
export const matchLine = (best: DisciplineMatch | undefined, demand: Demand) => {
  if (!best) return 'Cadastre suas disciplinas para ver se combina';
  const coverage = `${best.covered.length} de ${demand.skills.length} competências`;
  return best.fits ? `Combina com ${best.discipline.name}, ${coverage}` : `Não combina com suas disciplinas`;
};
