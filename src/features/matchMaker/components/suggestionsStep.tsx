import { useId, useRef, useState } from 'react';
import type { Project } from '@/domain/types';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/emptyState';
import { FilterBar } from '@/components/ui/filterBar';
import { FilterDropdown } from '@/components/ui/filterDropdown';
import { SearchInput } from '@/components/ui/formControls';
import { BookmarkIcon, LayersIcon } from '@/components/ui/icons';
import { FactGrid } from '@/components/ui/page';
import { rankDemandsFor } from '@/domain/matching';
import { isMyReservation, MAX_ACTIVE_RESERVATIONS } from '@/domain/reservation';
import type { Demand, SemesterCalendar } from '@/domain/types';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { LEVEL_COPY, slotsLabel } from '@/features/disciplines/utils/disciplinePresentation';
import { useTabParam } from '@/hooks/useTabParam';
import type { MatchMakerView } from '@/routes/paths';
import { cardGridClassName } from '@/components/ui/card';
import { pluralize } from '@/utils/format';
import { useStage } from '../hooks';
import { resultsStage } from '../utils/stageCopy';
import { ALL_SKILLS, filterableSkills, filterBySearch, filterBySkill, itemsForView, MATCH_MAKER_VIEWS, myReservationsFor, VIEW_HELP } from '../utils/matchMakerPresentation';
import type { StageState } from './mascotStage';
import { MatchPanel } from './matchPanel';
import { SuggestionCard } from './suggestionCard';

interface SuggestionsStepProps {
  discipline: DisciplineWithUsage;
  disciplines: DisciplineWithUsage[];
  menu: Demand[];
  calendar: SemesterCalendar;
  onStage: (stage: StageState) => void;
  /** O mascote pula: uma reserva foi feita. */
  onReserved: () => void;
  /** A demanda virou projeto: a página conduz a transição até ele. */
  onAdopted: (project: Project, demandTitle: string) => void;
}

const EMPTY_COPY: Record<MatchMakerView, { title: string; description: string }> = {
  combinam: { title: 'Nenhuma demanda combina agora', description: 'Revise as competências da turma na página da disciplina, se ela trabalha mais coisas, ou veja as que combinam em parte.' },
  parte: { title: 'Nada combina em parte', description: 'Todas as demandas que têm algo em comum com a turma já estão em "Combinam".' },
  reservas: { title: 'Você não tem reservas', description: 'Reserve uma sugestão para guardá-la por alguns dias enquanto decide.' },
};

/** Segunda pergunta: qual destas demandas é a da turma. Lista à esquerda, o porquê e a ação à direita. */
export const SuggestionsStep = ({ discipline, disciplines, menu, calendar, onStage, onReserved, onAdopted }: SuggestionsStepProps) => {
  const groupName = useId();
  const panelRef = useRef<HTMLElement>(null);
  const [view, setViewParam] = useTabParam(MATCH_MAKER_VIEWS);
  const [skill, setSkill] = useState(ALL_SKILLS);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>();

  const suggestions = rankDemandsFor(menu, discipline);
  const reservations = myReservationsFor(menu, discipline);
  const reservedCount = menu.filter(isMyReservation).length;
  const counts: Record<MatchMakerView, number> = {
    combinam: itemsForView('combinam', suggestions, reservations).length,
    parte: itemsForView('parte', suggestions, reservations).length,
    reservas: reservations.length,
  };

  const viewItems = itemsForView(view, suggestions, reservations);
  const skillOptions = filterableSkills(viewItems);
  const items = filterBySearch(filterBySkill(viewItems, skill), search);
  const narrowing = skill !== ALL_SKILLS || search.trim() !== '';
  // Sem escolha (ou com a escolhida fora da lista), vale a primeira: o painel nunca fica vazio com sugestões na tela.
  const selected = items.find(({ demand }) => demand.id === selectedId) ?? items[0];

  // O palco acompanha o que está escolhido: vermelho para agir, âmbar se já é reserva sua.
  useStage(onStage, resultsStage(selected, view, discipline));

  // Trocar de recorte zera a competência: a escolhida antes poderia não existir no novo recorte.
  const setView = (next: MatchMakerView) => {
    setSkill(ALL_SKILLS);
    setSelectedId(undefined);
    setViewParam(next);
  };

  const select = (id: string) => {
    setSelectedId(id);
    // Em tela estreita o painel fica abaixo da lista: leva o olhar até ele.
    if (window.matchMedia('(max-width: 1023px)').matches) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      panelRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className="mt-8 mb-8">
        <FactGrid
          columns={3}
          items={[
            { label: 'Vagas de projeto', value: `${slotsLabel(discipline)} de ${discipline.projectSlots}` },
            { label: 'Altura do curso', value: `${LEVEL_COPY[discipline.level].label}, ${LEVEL_COPY[discipline.level].periods}` },
            { label: 'Suas reservas', value: `${reservedCount} de ${MAX_ACTIVE_RESERVATIONS}` },
          ]}
        />
      </div>

      <FilterBar
        label="Filtrar sugestões"
        className="mb-3"
        onClear={narrowing || view !== 'combinam' ? () => {
          setSearch('');
          setView('combinam');
        } : undefined}
      >
        <SearchInput aria-label="Buscar sugestão" placeholder="Buscar pelo nome da demanda ou da organização" value={search} onChange={(event) => setSearch(event.target.value)} />
        <FilterDropdown
          label="Mostrar"
          value={view}
          onChange={setView}
          options={[
            { value: 'combinam', label: 'Combinam', count: counts.combinam },
            { value: 'parte', label: 'Combinam em parte', count: counts.parte },
            { value: 'reservas', label: 'Minhas reservas', count: counts.reservas },
          ]}
        />
        {skillOptions.length > 1 && (
          <FilterDropdown
            label="Competência"
            value={skill}
            onChange={setSkill}
            options={[{ value: ALL_SKILLS, label: 'Todas' }, ...skillOptions.map((name) => ({ value: name, label: name }))]}
          />
        )}
      </FilterBar>
      <p className="text-small text-ink-2">{VIEW_HELP[view]}</p>

      <p role="status" className="sr-only">
        {pluralize(items.length, 'sugestão', 'sugestões')}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="min-w-0">
          {items.length === 0 ? (
            <EmptyState
              icon={view === 'reservas' ? <BookmarkIcon size={48} variant="duotone" /> : <LayersIcon size={48} variant="duotone" />}
              title={narrowing ? 'Nada com esses filtros' : EMPTY_COPY[view].title}
              description={narrowing ? 'Mude a busca ou a competência para ver mais sugestões.' : EMPTY_COPY[view].description}
              action={
                narrowing ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearch('');
                      setSkill(ALL_SKILLS);
                    }}
                  >
                    Limpar filtros
                  </Button>
                ) : view === 'combinam' && counts.parte > 0 ? (
                  <Button variant="secondary" onClick={() => setView('parte')}>
                    Ver as que combinam em parte
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div role="radiogroup" aria-label="Sugestões para a turma">
              <ul className={cardGridClassName}>
                {items.map((item, index) => (
                  <li key={item.demand.id} className="animate-rise-in [animation-fill-mode:backwards]" style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}>
                    <SuggestionCard item={item} today={calendar.today} name={groupName} selected={item.demand.id === selected?.demand.id} onSelect={() => select(item.demand.id)} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside ref={panelRef} aria-label="Detalhe da sugestão" className="scroll-mt-20 lg:sticky lg:top-20 lg:self-start">
          {selected && (
            <MatchPanel
              item={selected}
              discipline={discipline}
              disciplines={disciplines}
              calendar={calendar}
              reservedCount={reservedCount}
              onShowReservations={() => setView('reservas')}
              onReserved={onReserved}
              onAdopted={onAdopted}
            />
          )}
        </aside>
      </div>
    </>
  );
};
