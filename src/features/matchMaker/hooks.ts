import { useEffect, useState } from 'react';
import type { StageState } from './components/mascotStage';
import { SEARCH_STEP_MS, SEARCH_STEPS } from './utils/stageCopy';

/**
 * Anda um passo a cada SEARCH_STEP_MS enquanto a busca está ativa e avisa quando acaba.
 * Reinicia quando a turma muda (`resetKey`). Com `active` falso fica no zero.
 */
export const useSearchSequence = (active: boolean, resetKey: string, onDone: () => void) => {
  const [progress, setProgress] = useState({ key: resetKey, step: 0 });
  const step = progress.key === resetKey ? progress.step : 0;

  useEffect(() => {
    if (!active) return;
    // Um passo a mais que a contagem: o último é o "Pronto", que fica um instante na tela.
    const timer = window.setTimeout(() => {
      if (step >= SEARCH_STEPS) onDone();
      else setProgress({ key: resetKey, step: step + 1 });
    }, SEARCH_STEP_MS);
    return () => window.clearTimeout(timer);
  }, [active, resetKey, step, onDone]);

  return step;
};

/** As etapas contam ao palco o que está acontecendo; só os valores simples entram nas dependências. */
export const useStage = (onStage: (stage: StageState) => void, stage: StageState) => {
  const { tone, pose, title, text } = stage;
  useEffect(() => {
    onStage({ tone, pose, title, text });
  }, [onStage, tone, pose, title, text]);
};
