import { matchDiscipline, type DemandMatch } from '@/domain/matching';
import { isMyReservation } from '@/domain/reservation';
import type { Demand, Discipline } from '@/domain/types';
import type { MatchMakerView } from '@/routes/paths';

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

/** Com várias competências marcadas, a demanda precisa cobrir todas. */
export const filterBySkills = (items: DemandMatch[], skills: string[]) =>
  skills.length === 0 ? items : items.filter(({ match }) => skills.every((skill) => match.covered.includes(skill)));
