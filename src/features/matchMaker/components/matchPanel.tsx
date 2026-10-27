import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { ConfirmDialog } from '@/components/ui/confirmDialog';
import { CoverageMeter } from '@/components/ui/coverageMeter';
import { ArrowRightIcon, BookmarkIcon, UndoIcon } from '@/components/ui/icons';
import { Monogram } from '@/components/ui/monogram';
import { Tag } from '@/components/ui/tag';
import { WarningNote } from '@/components/ui/warningNote';
import { formatShortDate, isLinkWindowOpen } from '@/domain/calendar';
import { freeSlots } from '@/domain/disciplineRules';
import type { DemandMatch } from '@/domain/matching';
import { MAX_ACTIVE_RESERVATIONS, RESERVATION_DAYS } from '@/domain/reservation';
import type { Project, SemesterCalendar } from '@/domain/types';
import { AdoptDemandModal } from '@/features/demands/components/adoptDemandModal';
import { SkillChecklist } from '@/features/demands/components/skillsCoverage';
import { useReleaseReservation, useReserveDemand } from '@/features/demands/useDemands';
import { CONSTRAINT_COPY, daysLeftLabel, SCOPE_COPY } from '@/features/demands/utils/demandPresentation';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { LEVEL_COPY } from '@/features/disciplines/utils/disciplinePresentation';
import { paths } from '@/routes/paths';
import { Mascot } from '@/components/ui/mascot';
import { cn } from '@/utils/cn';
import { joinWithAnd } from '@/utils/format';

const Fine = ({ children }: { children: ReactNode }) => <p className="mt-3 text-small text-ink-3">{children}</p>;

interface MatchPanelProps {
  item: DemandMatch;
  discipline: DisciplineWithUsage;
  /** Todas as turmas do semestre, para a janela de levar poder trocar de turma. */
  disciplines: DisciplineWithUsage[];
  calendar: SemesterCalendar;
  reservedCount: number;
  onShowReservations: () => void;
  onReserved: () => void;
  onAdopted: (project: Project, demandTitle: string) => void;
}

/**
 * A coluna da decisão do Match Maker: por que a demanda combina com a turma e
 * a única ação do momento. O caminho é o do cardápio (reservar, pensar, levar),
 * então a regra de reserva e o prazo de vinculação valem aqui do mesmo jeito.
 */
export const MatchPanel = ({ item, discipline, disciplines, calendar, reservedCount, onShowReservations, onReserved, onAdopted }: MatchPanelProps) => {
  const { demand, match } = item;
  const toast = useToast();
  const reserve = useReserveDemand();
  const release = useReleaseReservation();
  const [adopting, setAdopting] = useState(false);
  const [releasing, setReleasing] = useState(false);

  const mine = Boolean(demand.reservation?.mine);
  const scope = SCOPE_COPY[demand.scopeFit];
  const windowOpen = isLinkWindowOpen(calendar);
  const hasSlot = freeSlots(discipline) > 0;
  const canTake = windowOpen && hasSlot && !match.aboveLevel;
  const reserveLimitReached = reservedCount >= MAX_ACTIVE_RESERVATIONS;
  const error = [reserve, release].find((mutation) => mutation.isError)?.error;

  // Explica por que "Levar" está desligado, na ordem em que o docente consegue resolver.
  const blockedReason = !windowOpen
    ? `O prazo de ${calendar.id} para levar demandas terminou em ${formatShortDate(calendar.linkDeadline)}.`
    : match.aboveLevel
      ? `Esta demanda pede mais do que a altura do curso de ${discipline.name}, que está no ${LEVEL_COPY[discipline.level].label.toLowerCase()}.`
      : !hasSlot
        ? `${discipline.name} está sem vaga de projeto. Libere uma vaga na disciplina para levar.`
        : undefined;

  return (
    // A chave na demanda reinicia a entrada ao trocar de sugestão: o clique ganha resposta visível.
    <div key={demand.id} className={cn('animate-rise-in rounded-lg border bg-surface p-5', mine ? 'border-reserve-dot/40' : 'border-line')}>
      {mine && demand.reservation ? (
        <Tag tone="reserve">Sua reserva, {daysLeftLabel(demand.reservation.until, calendar.today)}</Tag>
      ) : (
        <Tag tone="positive">Livre no cardápio</Tag>
      )}

      <div className="mt-3 flex items-center gap-2.5">
        <Monogram name={demand.organization.name} logo={demand.organization.logo} size="sm" />
        <p className="min-w-0 truncate text-small font-semibold text-ink-2">{demand.organization.name}</p>
      </div>
      <h3 className="mt-2.5 text-h4">{demand.title}</h3>
      <p className="mt-1.5 text-small text-ink-2">{demand.problem}</p>

      <div className="mt-5 border-t border-line pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-small font-medium text-ink">Por que combina com {discipline.name}</p>
          <CoverageMeter covered={match.covered.length} total={demand.skills.length} fits={match.fits} />
        </div>
        <SkillChecklist skills={demand.skills} covered={new Set(match.covered)} className="mt-3" />
        <p className="mt-3 text-small text-ink-3">
          <span className={scope.tone === 'caution' ? 'text-caution' : undefined}>{scope.label}</span>
          {demand.constraints.map((constraint) => ` · ${CONSTRAINT_COPY[constraint].label}`).join('')}
        </p>
      </div>

      {!match.fits && !match.aboveLevel && (
        <WarningNote role="status" title="Esta demanda não serve bem para a turma" className="mt-4">
          A turma cobre {match.covered.length} de {demand.skills.length} competências e não trabalha {joinWithAnd(match.missing)}. Dá para levar, mas o resultado com a organização fica por sua conta.
        </WarningNote>
      )}

      {mine ? (
        <>
          <Button variant="primary" size="lg" fullWidth className="mt-5" disabled={!canTake} onClick={() => setAdopting(true)}>
            Levar para {discipline.name}
            <ArrowRightIcon size={16} />
          </Button>
          <Button variant="secondary" fullWidth className="mt-2" disabled={release.isPending} onClick={() => setReleasing(true)}>
            <UndoIcon size={16} />
            Liberar reserva
          </Button>
          {demand.reservation && <Fine>Ninguém mais consegue levar esta demanda até {formatShortDate(demand.reservation.until)}.</Fine>}
          {blockedReason && <Fine>{blockedReason}</Fine>}
        </>
      ) : (
        <>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="mt-5"
            disabled={reserve.isPending || reserveLimitReached}
            onClick={() => reserve.mutate(demand.id, { onSuccess: () => {
                  onReserved();
                  toast.show(`Reservada por ${RESERVATION_DAYS} dias. Quando decidir, leve para ${discipline.name}.`);
                },
              })
            }
          >
            {reserve.isPending ? <Mascot tone="branco" pose="walk" size="xs" /> : <BookmarkIcon size={16} />}
            {reserve.isPending ? 'Reservando' : `Reservar por ${RESERVATION_DAYS} dias`}
          </Button>
          {reserveLimitReached ? (
            <>
              <Fine>
                Você já tem {MAX_ACTIVE_RESERVATIONS} reservas. Libere uma ou leve alguma para uma disciplina antes de reservar outra.
              </Fine>
              <Button variant="plain" size="sm" className="mt-2" onClick={onShowReservations}>
                Ver minhas reservas
              </Button>
            </>
          ) : (
            <Fine>A reserva guarda a demanda só para você enquanto decide. Dá para liberar a qualquer momento.</Fine>
          )}
        </>
      )}

      {error && (
        <p role="alert" className="mt-3 text-small text-critical">
          {error.message}
        </p>
      )}

      <Link to={paths.demand(demand.id)} className={cn(textLinkClassName, 'mt-4 inline-block text-small')}>
        Ver a demanda completa
      </Link>

      {releasing && (
        <ConfirmDialog
          icon={<UndoIcon size={26} />}
          title="Liberar a reserva?"
          description="A demanda volta para o cardápio e outro docente pode reservar. Se mudar de ideia, você precisa reservar de novo, se ela ainda estiver livre."
          confirmLabel="Sim, liberar"
          confirmIcon={<UndoIcon size={20} />}
          cancelLabel="Não, manter"
          pending={release.isPending}
          pendingLabel="Liberando"
          error={release.error?.message}
          onConfirm={() =>
            release.mutate(demand.id, {
              onSuccess: () => {
                setReleasing(false);
                toast.show('Reserva liberada. A demanda voltou para o cardápio.');
              },
            })
          }
          onClose={() => setReleasing(false)}
        />
      )}
      {adopting && <AdoptDemandModal demand={demand} disciplines={disciplines} calendar={calendar} initialDisciplineId={discipline.id} onAdopted={(project) => onAdopted(project, demand.title)} onClose={() => setAdopting(false)} />}
    </div>
  );
};
