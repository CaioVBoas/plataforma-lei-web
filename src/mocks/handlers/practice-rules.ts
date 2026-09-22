import type { Practice, PracticeChange } from '@/types/practice';

const without = (list: string[], name: string) => list.filter((item) => item !== name);
const withItem = (list: string[], name: string) => (list.includes(name) ? list : [...list, name]);

/** Mesma regra para a prática do docente e a de cada disciplina. */
export const applyPracticeChange = (practice: Practice, change: PracticeChange): Practice => {
  const { name } = change;
  switch (change.action) {
    case 'confirm-inferred':
      return {
        ...practice,
        inferred: practice.inferred.filter((item) => item.name !== name),
        confirmed: withItem(practice.confirmed, name),
      };
    case 'discard-inferred':
      return { ...practice, inferred: practice.inferred.filter((item) => item.name !== name) };
    case 'remove-confirmed':
      return { ...practice, confirmed: without(practice.confirmed, name) };
    case 'remove-excluded':
      return { ...practice, excluded: without(practice.excluded, name) };
    case 'add-confirmed':
      return { ...practice, confirmed: withItem(practice.confirmed, name), excluded: without(practice.excluded, name) };
    case 'add-excluded':
      return { ...practice, excluded: withItem(practice.excluded, name), confirmed: without(practice.confirmed, name) };
  }
};

/** Frase registrada no histórico de correções do perfil. */
export const describePracticeChange = (change: PracticeChange) => {
  const { name } = change;
  switch (change.action) {
    case 'confirm-inferred':
      return `Confirmou ${name} como prática sua`;
    case 'discard-inferred':
      return `Descartou ${name} da leitura automática`;
    case 'remove-confirmed':
      return `Removeu ${name} das práticas confirmadas`;
    case 'remove-excluded':
      return `Deixou de recusar demandas de ${name}`;
    case 'add-confirmed':
      return `Adicionou ${name} como prática sua`;
    case 'add-excluded':
      return `Marcou ${name} como não conduzo`;
  }
};
