import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/query-states';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/form-controls';
import { GroupedList } from '@/components/ui/grouped-list';
import { Page } from '@/components/ui/page';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { formatShortDate, isLinkWindowOpen } from '@/domain/calendar';
import { rankDisciplines } from '@/domain/matching';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { useCurrentDisciplines } from '@/features/disciplines/hooks/use-disciplines';
import { paths } from '@/routes/paths';
import { normalizeText } from '@/utils/format';
import { DemandRow } from '../components/demand-row';
import { useOpenDemands } from '../hooks/use-demands';

type Scope = 'minhas' | 'todas';

const TITLE = 'Demandas';
const SUBTITLE = 'Problemas reais de organizações parceiras, prontos para virar o projeto de uma turma sua.';

export const DemandsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope: Scope = searchParams.get('ver') === 'todas' ? 'todas' : 'minhas';
  const search = searchParams.get('busca') ?? '';

  const { data: demands } = useOpenDemands();
  const { data: disciplines } = useCurrentDisciplines();
  const { data: calendar } = useCalendar();

  // Filtro e busca moram na URL para que voltar do detalhe devolva a mesma lista.
  const updateParams = (next: { ver?: Scope; busca?: string }) => {
    const params = new URLSearchParams(searchParams);
    if (next.ver !== undefined) params.set('ver', next.ver);
    if (next.busca !== undefined) params.set('busca', next.busca);
    if (params.get('ver') === 'minhas') params.delete('ver');
    if (!params.get('busca')) params.delete('busca');
    setSearchParams(params, { replace: true });
  };

  const ranked = useMemo(
    () =>
      (demands ?? [])
        .map((demand) => ({ demand, best: rankDisciplines(demand, disciplines ?? [])[0] }))
        .sort((a, b) => Number(b.best?.fits ?? false) - Number(a.best?.fits ?? false)),
    [demands, disciplines],
  );

  if (!demands || !disciplines || !calendar) {
    return (
      <Page title={TITLE} subtitle={SUBTITLE}>
        <LoadingState />
      </Page>
    );
  }

  const fitting = ranked.filter(({ best }) => best?.fits);
  const inScope = scope === 'minhas' ? fitting : ranked;
  const term = normalizeText(search.trim());
  const visible = term
    ? inScope.filter(({ demand }) => normalizeText(`${demand.title} ${demand.problem} ${demand.organization.name} ${demand.skills.join(' ')}`).includes(term))
    : inScope;

  const renderEmpty = () => {
    if (term) return <EmptyState title="Nada encontrado" description={`Nenhuma demanda com "${search}".`} />;
    if (disciplines.length === 0) {
      return (
        <EmptyState
          title="Cadastre suas disciplinas primeiro"
          description="A lista mostra as demandas que combinam com o que suas turmas trabalham."
          action={
            <Link to={paths.newDiscipline} className={buttonClassName({ variant: 'primary' })}>
              Cadastrar disciplina
            </Link>
          }
        />
      );
    }
    return (
      <EmptyState
        title="Nenhuma demanda combina agora"
        description="Novas demandas chegam toda semana. Você também pode ver todas e revisar as competências das suas disciplinas."
        action={
          <Button variant="secondary" onClick={() => updateParams({ ver: 'todas' })}>
            Ver todas as demandas
          </Button>
        }
      />
    );
  };

  return (
    <Page title={TITLE} subtitle={SUBTITLE}>
      {!isLinkWindowOpen(calendar) && (
        <p className="mb-6 rounded-lg bg-caution-soft px-4 py-3 text-sm text-caution">
          O prazo para levar demandas para as turmas de {calendar.id} terminou em {formatShortDate(calendar.linkDeadline)}. Você ainda pode explorar.
        </p>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          label="Quais demandas mostrar"
          value={scope}
          onChange={(ver) => updateParams({ ver })}
          options={[
            { value: 'minhas', label: 'Para minhas disciplinas', count: fitting.length },
            { value: 'todas', label: 'Todas', count: ranked.length },
          ]}
        />
        <SearchInput
          aria-label="Buscar demandas"
          placeholder="Buscar demandas"
          value={search}
          onChange={(event) => updateParams({ busca: event.target.value })}
          containerClassName="w-full sm:w-[320px]"
        />
      </div>

      {visible.length > 0 ? (
        <GroupedList>
          {visible.map(({ demand, best }) => (
            <DemandRow key={demand.id} demand={demand} best={best} today={calendar.today} />
          ))}
        </GroupedList>
      ) : (
        renderEmpty()
      )}
    </Page>
  );
};
