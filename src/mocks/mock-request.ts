const SIMULATED_LATENCY_MS = 180;

/**
 * Simula uma chamada HTTP ao backend: responde de forma assíncrona e devolve
 * uma cópia, para que o cache do React Query nunca compartilhe referência com
 * o banco em memória.
 */
export const mockRequest = <Result>(handler: () => Result): Promise<Result> =>
  new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(structuredClone(handler()));
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Não deu para concluir. Tente de novo em instantes.'));
      }
    }, SIMULATED_LATENCY_MS);
  });
