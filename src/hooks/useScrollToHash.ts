import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** O React Router não rola até a âncora da URL: faz isso quando o conteúdo já está na tela. */
export const useScrollToHash = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash]);
};
