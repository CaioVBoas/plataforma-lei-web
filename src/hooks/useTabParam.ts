import { useSearchParams } from 'react-router-dom';

/**
 * Aba ativa guardada na URL (`?aba=`): voltar, recarregar ou mandar o link
 * abre a mesma aba. A primeira da lista é a padrão e não aparece na URL.
 */
export const useTabParam = <Tab extends string>(tabs: readonly Tab[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('aba');
  const tab = tabs.find((candidate) => candidate === requested) ?? tabs[0];

  const setTab = (next: Tab) =>
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        if (next === tabs[0]) params.delete('aba');
        else params.set('aba', next);
        return params;
      },
      { replace: true },
    );

  return [tab, setTab] as const;
};
