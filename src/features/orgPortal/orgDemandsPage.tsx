import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { cardGridClassName } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/emptyState';
import { FilterDropdown } from '@/components/ui/filterDropdown';
import { SearchInput } from '@/components/ui/formControls';
import { BellIcon, CheckIcon, FolderIcon, ListIcon, PencilIcon, TrayIcon } from '@/components/ui/icons';
import { InfoBanner } from '@/components/ui/infoBanner';
import { MonthPicker } from '@/components/ui/monthPicker';
import { Page } from '@/components/ui/page';
import { useCalendar } from '@/features/calendar/useCalendar';
import type { OrgDemandsTab, OrgDemandsView } from '@/routes/paths';
import { normalizeText } from '@/utils/format';
import { OrgDemandCard } from './components/orgDemandCard';
import { SubmitDemandLink } from './components/submitDemandLink';
import type { OrgDemandSummary } from './types';
import { useOrgDemands } from './useOrgPortal';
import { demandGuidance } from './utils/demandGuidance';
import { VIEW_LABELS, VIEW_STAGES } from './utils/orgPresentation';

const VIEWS = Object.keys(VIEW_STAGES) as OrgDemandsView[];
const TABS: OrgDemandsTab[] = ['vez', 'todas', ...VIEWS];

const TAB_LABELS: Record<OrgDemandsTab, string> = { vez: 'Sua vez', todas: 'Todas', ...VIEW_LABELS };

const TAB_ICONS: Record<OrgDemandsTab, typeof BellIcon> = {
  vez: BellIcon,
  todas: ListIcon,
  preparo: PencilIcon,
  cardapio: TrayIcon,
  projeto: FolderIcon,
  concluidas: CheckIcon,
};

/** Uma frase por aba, logo abaixo dela: o que aparece aqui e por quê. */
const TAB_HELP: Record<OrgDemandsTab, string> = {
  vez: 'O que espera por vocês: rascunho, ajuste ou pergunta.',
  todas: 'Todas, da mais nova para a mais antiga.',
  preparo: 'Rascunhos, em leitura no L.E.I. e com ajuste pedido.',
  cardapio: 'Aprovadas. Os docentes já podem ver e escolher.',
  projeto: 'Uma turma está trabalhando nelas agora.',
  concluidas: 'Já terminaram. Veja o que ficou com vocês.',
};

const EMPTY: Record<OrgDemandsTab, string> = {
  vez: 'Tudo em dia. Quando algo precisar de vocês, aparece aqui.',
  todas: 'Nenhuma demanda ainda.',
  preparo: 'Nenhum rascunho nem demanda na triagem.',
  cardapio: 'Quando o L.E.I. aprova uma demanda, ela entra no cardápio e aparece aqui.',
  projeto: 'Quando um docente leva uma demanda para a disciplina, ela vira projeto e aparece aqui.',
  concluidas: 'Os projetos encerrados ficam aqui.',
};

const inTab = (demand: OrgDemandSummary, tab: OrgDemandsTab) =>
  tab === 'todas' || (tab === 'vez' ? demandGuidance(demand).yourTurn : VIEW_STAGES[tab].includes(demand.stage));

const TITLE = 'Demandas';
const SUBTITLE = 'Os problemas que vocês pediram para uma turma do CIn resolver, e em que pé está cada um.';

export const OrgDemandsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: demands } = useOrgDemands();
  const { data: calendar } = useCalendar();
  const [search, setSearch] = useState('');

  if (!demands) {
    return (
      <Page title={TITLE} subtitle={SUBTITLE}>
        <LoadingState />
      </Page>
    );
  }

  if (demands.length === 0) {
    return (
      <Page title={TITLE} subtitle={SUBTITLE}>
        <EmptyState
          title="Nenhuma demanda ainda"
          description="Contem um problema e uma turma do CIn ajuda a resolver."
          action={<SubmitDemandLink />}
        />
      </Page>
    );
  }

  const count = (tab: OrgDemandsTab) => demands.filter((demand) => inTab(demand, tab)).length;
  const requested = searchParams.get('ver') as OrgDemandsTab | null;
  // Sem escolha, abre no que espera por vocês; se nada espera, em todas.
  const tab: OrgDemandsTab = requested && TABS.includes(requested) ? requested : count('vez') > 0 ? 'vez' : 'todas';
  const month = searchParams.get('mes') ?? '';
  const months = [...new Set(demands.map((demand) => demand.date.slice(0, 7)))].sort();
  const term = normalizeText(search.trim());
  const inMonth = (demand: OrgDemandSummary) => !month || demand.date.startsWith(month);
  // Quem busca pelo nome quer achar a demanda onde ela estiver: a busca procura em todas as situações.
  const visible = term
    ? demands.filter((demand) => inMonth(demand) && normalizeText(`${demand.title} ${demand.problem}`).includes(term))
    : demands.filter((demand) => inMonth(demand) && inTab(demand, tab));
  const filtering = Boolean(requested) || Boolean(month) || Boolean(term);
  const setParam = (key: string, value: string) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  const TabIcon = TAB_ICONS[tab];

  return (
    <Page title={TITLE} subtitle={SUBTITLE} actions={<SubmitDemandLink />}>
      <div role="search" aria-label="Filtrar demandas" className="mb-5 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
        <SearchInput
          aria-label="Buscar demandas"
          placeholder="Buscar pelo nome da demanda"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          containerClassName="sm:w-[18rem]"
        />
        <FilterDropdown
          label="Mostrar"
          icon={<TabIcon size={20} />}
          value={tab}
          onChange={(next) => setParam('ver', next)}
          options={TABS.map((key) => ({ value: key, label: TAB_LABELS[key], count: count(key) }))}
        />
        <MonthPicker label="Mês" value={month} onChange={(value) => setParam('mes', value)} available={months} current={calendar?.today.slice(0, 7) ?? ''} />
        {filtering && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSearchParams({}, { replace: true });
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-body font-medium text-accent hover:bg-accent-soft"
          >
            Limpar filtros
          </button>
        )}
      </div>
      <InfoBanner className="mb-8">{term ? `Buscando "${search.trim()}" em todas as demandas.` : TAB_HELP[tab]}</InfoBanner>

      {visible.length > 0 ? (
        <ul className={cardGridClassName}>
          {visible.map((demand) => (
            <li key={demand.id}>
              <OrgDemandCard demand={demand} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={term ? 'Nada encontrado' : month ? 'Nada neste mês' : `Nada em "${TAB_LABELS[tab]}"`}
          description={term ? `Nenhuma demanda com "${search.trim()}".` : month ? 'Escolha outro mês ou limpe os filtros.' : EMPTY[tab]}
        />
      )}
    </Page>
  );
};
