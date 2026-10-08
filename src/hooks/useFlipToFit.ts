import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Painel que abre embaixo de um botão: se não couber à direita da tela,
 * passa a se alinhar pela direita do botão, para nunca sair da tela.
 */
export const useFlipToFit = <Element extends HTMLElement = HTMLDivElement>(open: boolean) => {
  const panelRef = useRef<Element>(null);
  const [alignRight, setAlignRight] = useState(false);

  useLayoutEffect(() => {
    if (!open) {
      setAlignRight(false);
      return;
    }
    const panel = panelRef.current;
    if (panel && panel.getBoundingClientRect().right > document.documentElement.clientWidth - 8) setAlignRight(true);
  }, [open]);

  return { panelRef, alignClassName: alignRight ? 'right-0 left-auto' : 'left-0' };
};
