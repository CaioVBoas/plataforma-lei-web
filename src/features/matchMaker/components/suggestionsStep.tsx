import { useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChoiceChips } from '@/components/ui/choiceChips';
import { EmptyState } from '@/components/ui/emptyState';
import { BookmarkIcon, CloseIcon, LayersIcon } from '@/components/ui/icons';
import { FactGrid, Page } from '@/components/ui/page';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { rankDemandsFor } from '@/domain/matching';
import { isMyReservation, MAX_ACTIVE_RESERVATIONS } from '@/domain/reservation';
import type { Demand, SemesterCalendar } from '@/domain/types';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { LEVEL_COPY, slotsLabel } from '@/features/disciplines/utils/disciplinePresentation';
import { useTabParam } from '@/hooks/useTabParam';
import { paths, type MatchMakerView } from '@/routes/paths';
import { cardGridClassName } from '@/components/ui/card';
import { pluralize } from '@/utils/format';
import { filterableSkills, filterBySkills, itemsForView, MATCH_MAKER_VIEWS, myReservationsFor, VIEW_HELP } from '../utils/matchMakerPresentation';
import { MatchPanel } from './matchPanel';
import { SuggestionCard } from './suggestionCard';

interface SuggestionsStepProps {
  discipline: DisciplineWithUsage;
  disciplines: DisciplineWithUsage[];
  menu: Demand[];
  calendar: SemesterCalendar;
}

const EMPTY_COPY: Record<MatchMakerView, { title: string; description: string }> = {
  combinam: { title: 'Nenhuma demanda combina agora', description: 'Revise as competências da turma na página da disciplina, se ela trabalha mais coisas, ou veja as que combinam em parte.' },
  parte: { title: 'Nada combina em parte', description: 'Todas as demandas que têm algo em comum com a turma já estão em "Combinam".' },
  reservas: { title: 'Você não tem reservas', description: 'Reserve uma sugestão para guardá-la por alguns dias enquanto decide.' },
};

/** Segunda pergunta: qual destas demandas é a da turma. Lista à esquerda, o porquê e a ação à direita. */
export const SuggestionsStep = ({ discipline, disciplines, menu, calendar }: SuggestionsStepProps) => {
  const groupName = useId();
  const panelRef = useRef<HTMLElement>(null);
  const [view, setViewParam] = useTabParam(MATCH_MAKER_VIEWS);
  const [skills, setSkills] = useState<string[]>([]);
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
  const items = filterBySkills(viewItems, skills);
  // Sem escolha (ou com a escolhida fora da lista), vale a primeira: o painel nunca fica vazio com sugestões na tela.
  const selected = items.find(({ demand }) => demand.id === selectedId) ?? items[0];

  // Trocar de recorte zera os filtros: uma competência marcada antes poderia não existir no novo recorte.
  const setView = (next: MatchMakerView) => {
    setSkills([]);
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
    <Page
      title="Match Maker"
      eyebrow={discipline.name}
      subtitle={`Demandas que combinam com o que ${discipline.name} trabalha. Escolha uma para ver o porquê.`}
      back={{ to: paths.matchMaker(), label: 'Escolher outra turma' }}
    >
      <FactGrid
        columns={3}
        items={[
          { label: 'Vagas de projeto', value: `${slotsLabel(discipline)} de ${discipline.projectSlots}` },
          { label: 'Altura do curso', value: `${LEVEL_COPY[discipline.level].label}, ${LEVEL_COPY[discipline.level].periods}` },
          { label: 'Suas reservas', value: `${reservedCount} de ${MAX_ACTIVE_RESERVATIONS}` },
        ]}
      />

      <UnderlineTabs
        label="Recorte das sugestões"
        value={view}
        onChange={setView}
        className="mt-10"
        options={[
          { value: 'combinam', label: 'Combinam', count: counts.combinam },
          { value: 'parte', label: 'Combinam em parte', count: counts.parte },
          { value: 'reservas', label: 'Minhas reservas', count: counts.reservas },
        ]}
      />
      <p className="mt-3 text-small text-ink-2">{VIEW_HELP[view]}</p>

      {skillOptions.length > 1 && (
        <div className="mt-6">
          <p className="mb-2 text-small font-medium text-ink-2">Só demandas que pedem</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <ChoiceChips label="Competências da turma" options={skillOptions} value={skills} onChange={setSkills} />
            {skills.length > 0 && (
              <Button variant="plain" size="sm" onClick={() => setSkills([])}>
                <CloseIcon size={16} />
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      )}

      <p role="status" className="sr-only">
        {pluralize(items.length, 'sugestão', 'sugestões')}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="min-w-0">
          {items.length === 0 ? (
            <EmptyState
              icon={view === 'reservas' ? <BookmarkIcon size={48} variant="duotone" /> : <LayersIcon size={48} variant="duotone" />}
              title={skills.length > 0 ? 'Nenhuma demanda pede tudo isso' : EMPTY_COPY[view].title}
              description={skills.length > 0 ? 'Tire alguma competência do filtro para ver mais sugestões.' : EMPTY_COPY[view].description}
              action={
                skills.length > 0 ? (
                  <Button variant="secondary" onClick={() => setSkills([])}>
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
                {items.map((item) => (
                  <li key={item.demand.id}>
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
            />
          )}
        </aside>
      </div>
    </Page>
  );
};
