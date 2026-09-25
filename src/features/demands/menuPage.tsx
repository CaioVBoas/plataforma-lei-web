import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { SearchInput } from '@/components/ui/formControls';
import { Page } from '@/components/ui/page';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { formatShortDate, isLinkWindowOpen } from '@/domain/calendar';
import { rankDisciplines } from '@/domain/matching';
import { isMyReservation, MAX_ACTIVE_RESERVATIONS, RESERVATION_DAYS } from '@/domain/reservation';
import type { Demand } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useCurrentDisciplines } from '@/features/disciplines/useDisciplines';
import { paths } from '@/routes/paths';
import { normalizeText } from '@/utils/format';
import { DemandCard } from './components/demandCard';
import { useMenu } from './useDemands';

type Scope = 'turmas' | 'reservas' | 'todas';

const TITLE = 'Cardápio';
const SUBTITLE = 'Problemas reais de organizações parceiras, prontos para virar o projeto de uma turma sua.';

/** Livres primeiro, depois as suas reservas, e por último as reservadas por colegas. */
const availabilityRank = (demand: Demand) => (demand.status === 'open' ? 0 : isMyReservation(demand) ? 1 : 2);

export const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('ver');
  const scope: Scope = requested === 'reservas' || requested === 'todas' ? requested : 'turmas';
  const search = searchParams.get('busca') ?? '';

  const { data: demands } = useMenu();
  const { data: disciplines } = useCurrentDisciplines();
  const { data: calendar } = useCalendar();

  // Filtro e busca moram na URL para que voltar do detalhe devolva o mesmo cardápio.
  const updateParams = (next: { ver?: Scope; busca?: string }) => {
    const params = new URLSearchParams(searchParams);
    if (next.ver !== undefined) params.set('ver', next.ver);
    if (next.busca !== undefined) params.set('busca', next.busca);
    if (params.get('ver') === 'turmas') params.delete('ver');
    if (!params.get('busca')) params.delete('busca');
    setSearchParams(params, { replace: true });
  };

  const ranked = useMemo(
    () =>
      (demands ?? [])
        .map((demand) => ({ demand, best: rankDisciplines(demand, disciplines ?? [])[0] }))
        .sort((a, b) => availabilityRank(a.demand) - availabilityRank(b.demand) || Number(b.best?.fits ?? false) - Number(a.best?.fits ?? false)),
    [demands, disciplines],
  );

  if (!demands || !disciplines || !calendar) {
    return (
      <Page title={TITLE} subtitle={SUBTITLE}>
        <LoadingState />
      </Page>
    );
  }

  const byScope = {
    turmas: ranked.filter(({ best }) => best?.fits),
    reservas: ranked.filter(({ demand }) => isMyReservation(demand)),
    todas: ranked,
  };
  const term = normalizeText(search.trim());
  const visible = byScope[scope].filter(
    ({ demand }) => !term || normalizeText(`${demand.title} ${demand.problem} ${demand.organization.name} ${demand.skills.join(' ')}`).includes(term),
  );

  const renderEmpty = () => {
    if (term) return <EmptyState title="Nada encontrado" description={`Nenhuma demanda com "${search}".`} />;
    if (scope === 'reservas') {
      return (
        <EmptyState
          title="Nenhuma reserva"
          description={`Reservar guarda uma demanda por ${RESERVATION_DAYS} dias enquanto você decide. Ninguém mais consegue levá-la nesse tempo.`}
        />
      );
    }
    if (disciplines.length === 0) {
      return (
        <EmptyState
          title="Cadastre suas disciplinas primeiro"
          description="O cardápio mostra as demandas que combinam com o que suas turmas trabalham."
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
        description="Novas demandas chegam toda semana. Você também pode ver o cardápio inteiro e revisar as competências das suas disciplinas."
        action={
          <Button variant="secondary" onClick={() => updateParams({ ver: 'todas' })}>
            Ver o cardápio inteiro
          </Button>
        }
      />
    );
  };

  return (
    <Page title={TITLE} subtitle={SUBTITLE}>
      {!isLinkWindowOpen(calendar) && (
        <p className="mb-6 rounded-lg bg-caution-soft px-4 py-3 text-sm text-caution">
          O prazo para levar demandas para as turmas de {calendar.id} terminou em {formatShortDate(calendar.linkDeadline)}. Você ainda pode explorar e reservar.
        </p>
      )}

      <div className="mb-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line">
        <UnderlineTabs
          bordered={false}
          label="Quais demandas mostrar"
          value={scope}
          onChange={(ver) => updateParams({ ver })}
          options={[
            { value: 'turmas', label: 'Para minhas turmas', count: byScope.turmas.length },
            { value: 'reservas', label: 'Minhas reservas', count: byScope.reservas.length },
            { value: 'todas', label: 'Todas', count: byScope.todas.length },
          ]}
        />
        <SearchInput
          aria-label="Buscar no cardápio"
          placeholder="Buscar no cardápio"
          value={search}
          onChange={(event) => updateParams({ busca: event.target.value })}
          containerClassName="mb-2 w-full sm:w-[280px]"
        />
      </div>
      <p className="mb-6 text-[13px] text-ink-2">
        Você tem {byScope.reservas.length} de {MAX_ACTIVE_RESERVATIONS} reservas. Cada uma guarda a demanda por {RESERVATION_DAYS} dias enquanto você decide.
      </p>

      {visible.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {visible.map(({ demand, best }) => (
            <li key={demand.id}>
              <DemandCard demand={demand} best={best} today={calendar.today} />
            </li>
          ))}
        </ul>
      ) : (
        renderEmpty()
      )}
    </Page>
  );
};
