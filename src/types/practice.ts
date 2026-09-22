/**
 * Prática é o conjunto de competências que alimenta o cálculo de
 * compatibilidade. Existe no perfil do docente e em cada disciplina, com as
 * mesmas três listas.
 */
export interface InferredPractice {
  name: string;
  /** Frase que explica de onde a leitura automática tirou a sugestão. */
  origin: string;
}

export interface Practice {
  confirmed: string[];
  inferred: InferredPractice[];
  excluded: string[];
}

export type PracticeChange =
  | { action: 'confirm-inferred'; name: string }
  | { action: 'discard-inferred'; name: string }
  | { action: 'remove-confirmed'; name: string }
  | { action: 'remove-excluded'; name: string }
  | { action: 'add-confirmed'; name: string }
  | { action: 'add-excluded'; name: string };
