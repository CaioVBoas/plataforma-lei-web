import { matchDiscipline, type DemandMatch } from '@/domain/matching';
import { isMyReservation } from '@/domain/reservation';
import type { Demand, Discipline } from '@/domain/types';
import type { MatchMakerView } from '@/routes/paths';
import { normalizeText } from '@/utils/format';

export const MATCH_MAKER_VIEWS = ['combinam', 'parte', 'reservas'] as const satisfies readonly MatchMakerView[];

export const VIEW_HELP: Record<MatchMakerView, string> = {
  combinam: 'A turma cobre pelo menos metade das competências e a demanda cabe na altura do curso.',
  parte: 'A turma cobre menos da metade. Dá para levar, mas a janela pede que você confirme.',
  reservas: 'Demandas que você guardou. Leve para uma disciplina ou libere para os colegas.',
};

/** As reservas do docente ficam todas à vista, combinem ou não com a turma escolhida. */
export const myReservationsFor = (menu: Demand[], discipline: Discipline): DemandMatch[] =>
  menu.filter(isMyReservation).map((demand) => ({ demand, match: matchDiscipline(demand, discipline) }));

export const itemsForView = (view: MatchMakerView, suggestions: DemandMatch[], reservations: DemandMatch[]) => {
  if (view === 'reservas') return reservations;
  return suggestions.filter(({ match }) => match.fits === (view === 'combinam'));
};

/** Só competências que a turma trabalha e que alguma demanda da lista pede: todo chip leva a algum resultado. */
export const filterableSkills = (items: DemandMatch[]) => [...new Set(items.flatMap(({ match }) => match.covered))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

/** Valor do filtro de competência que não filtra nada. */
export const ALL_SKILLS = 'todas';

/** Só as demandas cuja competência pedida a turma já cobre. */
export const filterBySkill = (items: DemandMatch[], skill: string) => (skill === ALL_SKILLS ? items : items.filter(({ match }) => match.covered.includes(skill)));

/** Busca pelo nome da demanda ou da organização, sem acento nem caixa. */
export const filterBySearch = (items: DemandMatch[], search: string) => {
  const term = normalizeText(search.trim());
  return term ? items.filter(({ demand }) => normalizeText(`${demand.title} ${demand.organization.name}`).includes(term)) : items;
};
