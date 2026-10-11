import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** O React Router não rola até a âncora da URL: faz isso quando o conteúdo já está na tela. */
export const useScrollToHash = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    // Um hash digitado à mão, como "#%", não decodifica: aí vale o texto literal.
    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      /* fica o literal */
    }
    document.getElementById(id)?.scrollIntoView();
  }, [hash]);
};
