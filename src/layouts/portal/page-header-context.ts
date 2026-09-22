import { createContext, useContext, useEffect } from 'react';

export interface PageHeader {
  title: string;
  subtitle: string;
}

export const PageHeaderContext = createContext<((header: PageHeader) => void) | null>(null);

/**
 * Cada página declara o próprio título; o cabeçalho fixo do portal o exibe.
 * Mantém o título perto de quem conhece o conteúdo, e não num mapa de rotas.
 */
export const usePageHeader = (title: string, subtitle: string) => {
  const setHeader = useContext(PageHeaderContext);
  if (!setHeader) throw new Error('usePageHeader precisa estar dentro do PortalLayout.');

  useEffect(() => {
    setHeader({ title, subtitle });
    document.title = `${title} · Aperta o PLEI`;
  }, [setHeader, title, subtitle]);
};
