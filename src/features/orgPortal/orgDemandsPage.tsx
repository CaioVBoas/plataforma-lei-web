import { useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { EmptyState } from '@/components/ui/emptyState';
import { ItemList } from '@/components/ui/itemList';
import { Page } from '@/components/ui/page';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import type { OrgDemandsView } from '@/routes/paths';
import { OrgDemandRow } from './components/orgDemandRow';
import { SubmitDemandLink } from './components/submitDemandLink';
import { useOrgDemands } from './useOrgPortal';
import { VIEW_LABELS, VIEW_STAGES } from './utils/orgPresentation';

const VIEWS = Object.keys(VIEW_STAGES) as OrgDemandsView[];

const EMPTY: Record<OrgDemandsView, string> = {
  preparo: 'Rascunhos, demandas na triagem do L.E.I. e as que voltaram com pedido de ajuste aparecem aqui.',
  cardapio: 'Quando o L.E.I. aprova uma demanda, ela entra no cardápio e os docentes passam a ver.',
  projeto: 'Quando um docente leva uma demanda para a disciplina, ela vira projeto e aparece aqui.',
  concluidas: 'Os projetos encerrados ficam aqui, com o que a turma entregou.',
};

const TITLE = 'Demandas';
const SUBTITLE = 'O que vocês pediram ao CIn e em que pé está cada pedido.';

export const OrgDemandsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('ver') as OrgDemandsView | null;
  const view: OrgDemandsView = requested && VIEWS.includes(requested) ? requested : 'preparo';
  const { data: demands } = useOrgDemands();

  if (!demands) {
    return (
      <Page title={TITLE} subtitle={SUBTITLE}>
        <LoadingState />
      </Page>
    );
  }

  const byView = Object.fromEntries(VIEWS.map((key) => [key, demands.filter((demand) => VIEW_STAGES[key].includes(demand.stage))])) as Record<
    OrgDemandsView,
    typeof demands
  >;
  const visible = byView[view];

  return (
    <Page title={TITLE} subtitle={SUBTITLE} actions={<SubmitDemandLink />}>
      <UnderlineTabs
        label="Quais demandas mostrar"
        value={view}
        onChange={(next) => setSearchParams(next === 'preparo' ? {} : { ver: next }, { replace: true })}
        options={VIEWS.map((key) => ({ value: key, label: VIEW_LABELS[key], count: byView[key].length }))}
      />
      {visible.length > 0 ? (
        <ItemList flush>
          {visible.map((demand) => (
            <OrgDemandRow key={demand.id} demand={demand} />
          ))}
        </ItemList>
      ) : (
        <div className="mt-6">
          <EmptyState
            title={demands.length === 0 ? 'Nenhuma demanda ainda' : `Nada em "${VIEW_LABELS[view]}"`}
            description={demands.length === 0 ? 'Conte um problema real da sua organização. O L.E.I. ajuda a transformar em projeto para uma turma do CIn.' : EMPTY[view]}
            action={demands.length === 0 ? <SubmitDemandLink /> : undefined}
          />
        </div>
      )}
    </Page>
  );
};
