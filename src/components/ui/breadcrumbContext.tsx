import { createContext, useContext, useEffect } from 'react';

export interface PageCrumb {
  title: string;
  back?: { to: string; label: string };
}

/** O layout que mostra o caminho no topo passa o setter; sem ele, a página mostra o "voltar" de sempre. */
export const BreadcrumbContext = createContext<((crumb: PageCrumb | null) => void) | null>(null);

/** A página conta ao layout onde está. Devolve se o caminho aparece no topo. */
export const usePageCrumb = (title: string, back?: PageCrumb['back']) => {
  const setCrumb = useContext(BreadcrumbContext);
  const backTo = back?.to;
  const backLabel = back?.label;
  useEffect(() => {
    if (!setCrumb) return;
    setCrumb({ title, back: backTo && backLabel ? { to: backTo, label: backLabel } : undefined });
    return () => setCrumb(null);
  }, [setCrumb, title, backTo, backLabel]);
  return Boolean(setCrumb);
};
