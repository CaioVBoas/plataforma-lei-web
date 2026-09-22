import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/form-controls';
import { SearchIcon } from '@/components/ui/icons';
import { SelectMenu } from '@/components/ui/select-menu';
import { ToggleChip } from '@/components/ui/toggle-chip';
import { useCurrentDisciplines } from '@/features/disciplines/hooks/use-disciplines';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { pluralize } from '@/utils/format';
import { DemandCard } from '../components/demand-card';
import { useDemandActions } from '../hooks/use-demand-actions';
import { useDemands } from '../hooks/use-demands';
import type { Demand } from '../types';
import { rankDisciplines } from '../utils/demand-presentation';
import { filterDemands, type DemandSegment } from '../utils/filter-demands';

const SEGMENTS: { value: DemandSegment; label: string }[] = [
  { value: 'all', label: 'Todas as demandas' },
  { value: 'new', label: 'Novas' },
  { value: 'mine', label: 'Reservadas por mim' },
  { value: 'no-interest', label: 'Sem interessados' },
];

const DemandMenu = ({ demands }: { demands: Demand[] }) => {
  // A busca vive na URL para que "Ver demandas abertas" de uma organização chegue já filtrado.
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('busca') ?? '';
  const [segment, setSegment] = useState<DemandSegment>('all');
  const [fitsOnly, setFitsOnly] = useState(true);
  const { data: disciplines = [] } = useCurrentDisciplines();
  const { runPrimaryAction, releaseReservation, isBusy } = useDemandActions();

  const setSearch = (value: string) => setSearchParams(value ? { busca: value } : {}, { replace: true });
  const visible = filterDemands(demands, { search, segment, fitsOnly });
  const hiddenByViability = fitsOnly ? demands.filter((demand) => demand.viability === 'does-not-fit').length : 0;

  const clearFilters = () => {
    setSearch('');
    setSegment('all');
    setFitsOnly(false);
  };

  return (
    <div>
      <div className="mb-12">
        <div className="flex flex-wrap items-center gap-2.5">
          <SearchInput
            aria-label="Buscar demandas"
            placeholder="Buscar organização, problema ou competência"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            containerClassName="min-w-0 flex-[1_1_280px]"
          />
          <SelectMenu
            label="Situação da demanda"
            value={segment}
            neutralValue="all"
            onChange={setSegment}
            options={SEGMENTS.map((option) => ({
              ...option,
              count: filterDemands(demands, { search, segment: option.value, fitsOnly }).length,
            }))}
          />
          <ToggleChip selected={fitsOnly} onClick={() => setFitsOnly((current) => !current)}>
            Só o que cabe no semestre
          </ToggleChip>
          <span className="ml-auto shrink-0 text-[13px] text-n-600 tabular-nums">{pluralize(visible.length, 'demanda', 'demandas')}</span>
        </div>
        {hiddenByViability > 0 && (
          <div className="mt-3 flex flex-wrap items-baseline gap-1.5 text-[13px] text-n-500">
            <span>
              {hiddenByViability === 1 ? '1 demanda oculta por não caber' : `${hiddenByViability} demandas ocultas por não caberem`} no semestre
            </span>
            <Button variant="outline-accent" size="sm" onClick={() => setFitsOnly(false)}>
              mostrar mesmo assim
            </Button>
          </div>
        )}
      </div>

      {visible.length > 0 ? (
        <div className="flex flex-col gap-4">
          {visible.map((demand) => (
            <DemandCard
              key={demand.id}
              demand={demand}
              bestMatch={rankDisciplines(demand, disciplines)[0]}
              onPrimaryAction={runPrimaryAction}
              onRelease={releaseReservation}
              busy={isBusy}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<SearchIcon size={26} className="text-azul-500" />}
          title="Nenhuma demanda com esses filtros"
          description={`O cardápio tem ${pluralize(demands.length, 'demanda aberta', 'demandas abertas')} neste semestre. Solte o filtro de viabilidade para ver as que exigem recorte.`}
          action={
            <Button variant="secondary" size="lg" onClick={clearFilters}>
              Limpar filtros
            </Button>
          }
        />
      )}
    </div>
  );
};

export const DemandMenuPage = () => {
  usePageHeader('Cardápio de demandas', 'Problemas reais de parceiros que combinam com o que você ensina');
  const demandsQuery = useDemands();
  return <QueryView query={demandsQuery} loadingLabel="Carregando o cardápio">{(demands) => <DemandMenu demands={demands} />}</QueryView>;
};
