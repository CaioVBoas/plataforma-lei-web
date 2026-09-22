import { useCallback, useRef, useState } from 'react';
import { useDismiss } from './use-dismiss';

/** Estado de abertura de menus e popovers, já fechando no clique fora e no Escape. */
export const usePopover = <Element extends HTMLElement = HTMLDivElement>() => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<Element>(null);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((isOpen) => !isOpen), []);
  useDismiss(containerRef, open, close);
  return { open, toggle, close, containerRef };
};
