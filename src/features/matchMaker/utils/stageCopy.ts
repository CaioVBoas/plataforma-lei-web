import { formatShortDate } from '@/domain/calendar';
import type { DemandMatch } from '@/domain/matching';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { slotsLabel } from '@/features/disciplines/utils/disciplinePresentation';
import type { MatchMakerView } from '@/routes/paths';
import { joinWithAnd, pluralize } from '@/utils/format';
import type { StageState } from '../components/mascotStage';

/** Quanto cada passo da busca fica na tela. A soma é o tempo total; "Ver agora" pula. */
export const SEARCH_STEP_MS = 650;
export const SEARCH_STEPS = 3;

export const OPENING_STAGE: StageState = {
  tone: 'working',
  pose: 'walk',
  title: 'Abrindo o cardápio',
  text: 'Buscando as turmas do semestre e as demandas livres.',
};

export const NO_DISCIPLINE_STAGE: StageState = {
  tone: 'identity',
  pose: 'idle',
  title: 'Antes, uma turma',
  text: 'Cadastre as disciplinas que você leciona neste semestre para comparar com as demandas.',
};

export const chooseStage = (discipline: DisciplineWithUsage | undefined, fits: number): StageState =>
  discipline
    ? {
        tone: 'identity',
        pose: 'idle',
        title: discipline.name,
        text: `${pluralize(fits, 'demanda combina', 'demandas combinam')} com o que a turma trabalha, e ${slotsLabel(discipline)}. Escolha Ver sugestões para continuar.`,
      }
    : { tone: 'identity', pose: 'idle', title: 'Qual turma vai receber um projeto?', text: 'Escolha uma turma e o PLEI mostra as demandas que combinam com ela.' };

export interface SearchFacts {
  skills: number;
  menu: number;
  fits: number;
  partial: number;
}

/** O que cada passo da busca conta. Todos os números vêm dos dados que a pessoa cadastrou. */
export const searchStage = (step: number, discipline: DisciplineWithUsage, facts: SearchFacts): StageState => {
  const titles = [`Lendo o que ${discipline.name} trabalha`, 'Comparando com o cardápio', 'Contando o que combina', 'Pronto'];
  const texts = [
    `${pluralize(facts.skills, 'competência registrada', 'competências registradas')} por você na disciplina.`,
    `${pluralize(facts.menu, 'demanda', 'demandas')} no cardápio, cada uma com as competências que pede.`,
    'A regra é a mesma do cardápio: pelo menos metade das competências, na altura do curso.',
    `${pluralize(facts.fits, 'combina', 'combinam')} e ${pluralize(facts.partial, 'combina em parte', 'combinam em parte')}.`,
  ];
  const index = Math.min(step, titles.length - 1);
  return { tone: 'working', pose: step >= SEARCH_STEPS ? 'idle' : 'walk', title: titles[index], text: texts[index] };
};

const EMPTY_STAGE: Record<MatchMakerView, Pick<StageState, 'title' | 'text'>> = {
  combinam: { title: 'Nada combina por enquanto', text: 'Veja as que combinam em parte ou revise as competências da turma.' },
  parte: { title: 'Nada combina em parte', text: 'Tudo o que tem algo em comum com a turma já aparece em Combinam.' },
  reservas: { title: 'Nenhuma reserva sua', text: 'Reserve uma sugestão para guardá-la enquanto decide.' },
};

/** O palco acompanha a sugestão escolhida: azul para agir, laranja quando ela já é sua reserva. */
export const resultsStage = (selected: DemandMatch | undefined, view: MatchMakerView, discipline: DisciplineWithUsage): StageState => {
  if (!selected) return { tone: 'identity', pose: 'idle', ...EMPTY_STAGE[view] };
  const { demand, match } = selected;
  const total = demand.skills.length;
  if (demand.reservation?.mine) {
    return {
      tone: 'reserve',
      pose: 'idle',
      title: `Reservada até ${formatShortDate(demand.reservation.until)}`,
      text: 'Ninguém mais consegue levar esta demanda. Leve para a turma ou libere quando decidir.',
    };
  }
  return {
    tone: 'action',
    pose: 'think',
    title: match.fits ? `Combina com ${discipline.name}` : `Combina em parte com ${discipline.name}`,
    text: match.fits
      ? `${demand.title} pede ${total} competências e a turma cobre ${match.covered.length}.`
      : `A turma cobre ${match.covered.length} de ${total}. Falta ${joinWithAnd(match.missing)}.`,
  };
};
