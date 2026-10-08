import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { cardGridClassName } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/emptyState';
import { SearchInput } from '@/components/ui/formControls';
import { InfoBanner } from '@/components/ui/infoBanner';
import { Page } from '@/components/ui/page';
import { ChoiceBar } from '@/components/ui/choiceBar';
import { Hint } from '@/components/ui/hint';
import { BellIcon, CheckIcon, FolderIcon, ListIcon, PencilIcon, TrayIcon } from '@/components/ui/icons';
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
  vez: 'Só as demandas que esperam algo de vocês: terminar um rascunho, fazer um ajuste ou responder um docente.',
  todas: 'Todas as demandas de vocês, da mais recente para a mais antiga.',
  preparo: 'Rascunhos, demandas que o L.E.I. está lendo e as que voltaram com pedido de ajuste.',
  cardapio: 'Demandas aprovadas. Os docentes do CIn já podem ver, perguntar e escolher uma para a turma.',
  projeto: 'Uma turma está trabalhando nestas demandas neste semestre.',
  concluidas: 'Projetos que já terminaram, com o que ficou com vocês.',
};

const EMPTY: Record<OrgDemandsTab, string> = {
  vez: 'Nada esperando por vocês agora. Quando o L.E.I. pedir um ajuste ou um docente perguntar algo, aparece aqui.',
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
          description="Contem um problema real da organização. O L.E.I. ajuda a transformar em projeto para uma turma do CIn."
          action={<SubmitDemandLink />}
        />
      </Page>
    );
  }

  const count = (tab: OrgDemandsTab) => demands.filter((demand) => inTab(demand, tab)).length;
  const requested = searchParams.get('ver') as OrgDemandsTab | null;
  // Sem aba pedida, abre no que espera por vocês; se nada espera, em todas.
  const tab: OrgDemandsTab = requested && TABS.includes(requested) ? requested : count('vez') > 0 ? 'vez' : 'todas';
  const term = normalizeText(search.trim());
  // Quem busca pelo nome quer achar a demanda onde ela estiver: a busca vale para todas as abas.
  const visible = term
    ? demands.filter((demand) => normalizeText(`${demand.title} ${demand.problem}`).includes(term))
    : demands.filter((demand) => inTab(demand, tab));

  return (
    <Page title={TITLE} subtitle={SUBTITLE} actions={<SubmitDemandLink />}>
      <ChoiceBar
        label="Quais demandas mostrar"
        value={tab}
        onChange={(next) => setSearchParams({ ver: next }, { replace: true })}
        options={TABS.map((key) => {
          const Icon = TAB_ICONS[key];
          return { value: key, label: TAB_LABELS[key], icon: <Icon size={20} />, count: count(key) };
        })}
        className="mb-4"
      />
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <SearchInput
          aria-label="Buscar demandas"
          placeholder="Buscar pelo nome da demanda"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          containerClassName="w-full sm:w-[24rem]"
          className="h-11 border-line-strong! bg-surface text-[15px]"
        />
        <Hint>Digite uma palavra do nome. A busca procura em todas as demandas.</Hint>
      </div>
      <InfoBanner className="mb-6">{term ? `Buscando "${search.trim()}" em todas as demandas.` : TAB_HELP[tab]}</InfoBanner>

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
          title={term ? 'Nada encontrado' : `Nada em "${TAB_LABELS[tab]}"`}
          description={term ? `Nenhuma demanda com "${search.trim()}".` : EMPTY[tab]}
        />
      )}
    </Page>
  );
};
