import { useCallback, useEffect, useRef, useState } from 'react';

const FEEDBACK_DURATION_MS = 2200;

/**
 * Copia texto e guarda qual chave foi copiada por último, para o botão
 * mostrar "Copiado" por alguns segundos.
 */
export const useCopyToClipboard = <Key extends string | number = string>() => {
  const [copiedKey, setCopiedKey] = useState<Key | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async (key: Key, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Sem permissão de área de transferência o feedback visual ainda orienta o docente.
    }
    setCopiedKey(key);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopiedKey(null), FEEDBACK_DURATION_MS);
  }, []);

  return { copiedKey, copy };
};
