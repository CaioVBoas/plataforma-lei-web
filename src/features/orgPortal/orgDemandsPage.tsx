import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { EmptyState } from '@/components/ui/emptyState';
import { FilterSelect, SearchInput } from '@/components/ui/formControls';
import { GroupCard } from '@/components/ui/groupCard';
import { Page } from '@/components/ui/page';
import { Tag } from '@/components/ui/tag';
import type { OrgDemandsView } from '@/routes/paths';
import { normalizeText, pluralize } from '@/utils/format';
import { OrgDemandRow } from './components/orgDemandRow';
import { SubmitDemandLink } from './components/submitDemandLink';
import type { OrgDemandSummary } from './types';
import { useOrgDemands } from './useOrgPortal';
import { VIEW_LABELS, VIEW_STAGES } from './utils/orgPresentation';

const VIEWS = Object.keys(VIEW_STAGES) as OrgDemandsView[];

/** O que cada grupo guarda, em uma linha, e o que dizer quando está vazio. */
const GROUP_COPY: Record<OrgDemandsView, { subtitle: string; empty: string }> = {
  preparo: { subtitle: 'Rascunhos, na triagem do L.E.I. ou com ajuste pedido', empty: 'Nenhum pedido em preparo.' },
  cardapio: { subtitle: 'À vista dos docentes do CIn', empty: 'Quando o L.E.I. aprova uma demanda, ela aparece aqui.' },
  projeto: { subtitle: 'Uma turma está trabalhando nelas', empty: 'Quando um docente leva uma demanda para a turma, ela aparece aqui.' },
  concluidas: { subtitle: 'Projetos encerrados, com o que ficou com vocês', empty: 'Os projetos encerrados ficam aqui.' },
};

/** O resumo à direita do grupo: o que pede atenção primeiro, senão quantos há. */
const groupStatus = (view: OrgDemandsView, demands: OrgDemandSummary[]) => {
  const changes = demands.filter((demand) => demand.stage === 'needs-changes').length;
  const questions = demands.reduce((sum, demand) => sum + demand.unanswered, 0);
  if (view === 'preparo' && changes > 0) return <Tag pill tone="caution">{pluralize(changes, 'ajuste pedido', 'ajustes pedidos')}</Tag>;
  if (questions > 0) return <Tag pill tone="accent">{pluralize(questions, 'pergunta sem resposta', 'perguntas sem resposta')}</Tag>;
  return <Tag pill>{pluralize(demands.length, 'demanda', 'demandas')}</Tag>;
};

const TITLE = 'Demandas';
const SUBTITLE = 'O que vocês pediram ao CIn e em que pé está cada pedido.';

export const OrgDemandsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('ver') as OrgDemandsView | null;
  const filter: OrgDemandsView | 'todas' = requested && VIEWS.includes(requested) ? requested : 'todas';
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
          description="Conte um problema real da sua organização. O L.E.I. ajuda a transformar em projeto para uma turma do CIn."
          action={<SubmitDemandLink />}
        />
      </Page>
    );
  }

  const term = normalizeText(search.trim());
  const matches = (demand: OrgDemandSummary) => !term || normalizeText(`${demand.title} ${demand.problem}`).includes(term);
  const groups = VIEWS.filter((view) => filter === 'todas' || view === filter).map((view) => ({
    view,
    items: demands.filter((demand) => VIEW_STAGES[view].includes(demand.stage) && matches(demand)),
  }));
  const found = groups.some((group) => group.items.length > 0);

  return (
    <Page title={TITLE} subtitle={SUBTITLE} actions={<SubmitDemandLink />}>
      <div className="mb-5 flex flex-wrap gap-3">
        <SearchInput
          aria-label="Buscar demandas"
          placeholder="Buscar demanda"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          containerClassName="min-w-0 flex-[1_1_320px]"
          className="h-10 border-line-strong bg-surface"
        />
        <FilterSelect
          label="Situação"
          value={filter}
          onChange={(next) => setSearchParams(next === 'todas' ? {} : { ver: next }, { replace: true })}
          options={[{ value: 'todas', label: 'Todas' }, ...VIEWS.map((view) => ({ value: view, label: VIEW_LABELS[view] }))]}
          className="w-full sm:w-[230px]"
        />
      </div>

      {!found && term ? (
        <EmptyState title="Nada encontrado" description={`Nenhuma demanda com "${search.trim()}".`} />
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map(({ view, items }) => (
            <GroupCard
              key={view}
              index={VIEWS.indexOf(view) + 1}
              title={VIEW_LABELS[view]}
              subtitle={GROUP_COPY[view].subtitle}
              status={items.length > 0 ? groupStatus(view, items) : undefined}
              defaultOpen={items.length > 0}
            >
              {items.length > 0 ? (
                items.map((demand) => <OrgDemandRow key={demand.id} demand={demand} />)
              ) : (
                <li className="px-4 py-4 text-sm text-ink-3 sm:px-6">{term ? 'Nada com essa busca neste grupo.' : GROUP_COPY[view].empty}</li>
              )}
            </GroupCard>
          ))}
        </div>
      )}
    </Page>
  );
};
