import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { CheckIcon } from '@/components/ui/icons';
import { formatShortDate, isLinkWindowOpen } from '@/domain/calendar';
import { freeSlots } from '@/domain/discipline-rules';
import type { DisciplineMatch } from '@/domain/matching';
import { RESERVATION_DAYS } from '@/domain/reservation';
import type { SemesterCalendar } from '@/domain/types';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { useReleaseReservation, useReserveDemand, useToggleWatch } from '../hooks/use-demands';
import type { DemandDetail } from '../types';
import { daysLeftLabel } from '../utils/demand-presentation';

const Panel = ({ tone = 'default', children }: { tone?: 'default' | 'reserve'; children: ReactNode }) => (
  <div className={cn('rounded-lg border p-5', tone === 'reserve' ? 'border-reserve-dot/40 bg-reserve-soft' : 'border-line')}>{children}</div>
);

const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn('text-[13px] font-medium text-ink-3', className)}>{children}</p>
);

const Fine = ({ children }: { children: ReactNode }) => <p className="mt-3 text-[13px] leading-relaxed text-ink-3">{children}</p>;

interface DecisionPanelProps {
  detail: DemandDetail;
  best: DisciplineMatch<DisciplineWithUsage> | undefined;
  calendar: SemesterCalendar;
  hasDisciplines: boolean;
  onAdopt: () => void;
}

/**
 * A coluna da decisão. O caminho é sempre o mesmo: reservar, pensar com calma
 * e levar para a disciplina. Cada estado tem uma única ação primária.
 */
export const DecisionPanel = ({ detail, best, calendar, hasDisciplines, onAdopt }: DecisionPanelProps) => {
  const toast = useToast();
  const reserve = useReserveDemand();
  const release = useReleaseReservation();
  const watch = useToggleWatch();
  const { demand } = detail;
  const failed = [reserve, release, watch].find((mutation) => mutation.isError)?.error;

  if (detail.projectId) {
    return (
      <Panel>
        <p className="text-headline">Esta demanda é um projeto seu</p>
        <p className="mt-1 text-sm text-ink-2">Acompanhe as etapas e o plano no projeto.</p>
        <Link to={paths.project(detail.projectId)} className={cn(buttonClassName({ variant: 'primary', fullWidth: true }), 'mt-4')}>
          Abrir projeto
        </Link>
      </Panel>
    );
  }

  const error = failed && (
    <p role="alert" className="mt-3 text-[13px] text-critical">
      {failed.message}
    </p>
  );

  if (demand.status === 'reserved' && demand.reservation?.mine) {
    const windowOpen = isLinkWindowOpen(calendar);
    return (
      <Panel tone="reserve">
        <Eyebrow className="text-reserve">Sua reserva, {daysLeftLabel(demand.reservation.until, calendar.today)}</Eyebrow>
        <p className="mt-1 text-headline">Guardada para você até {formatShortDate(demand.reservation.until)}</p>
        <p className="mt-1 text-sm text-ink-2">Ninguém mais consegue levar esta demanda enquanto a reserva valer.</p>
        <Button variant="primary" size="lg" fullWidth className="mt-5" disabled={!windowOpen} onClick={onAdopt}>
          Levar para uma disciplina
        </Button>
        <Button
          variant="plain"
          size="sm"
          fullWidth
          className="mt-2"
          disabled={release.isPending}
          onClick={() => release.mutate(demand.id, { onSuccess: () => toast.show('Reserva liberada. A demanda voltou para o cardápio.') })}
        >
          Liberar reserva
        </Button>
        {!windowOpen && <Fine>O prazo de {calendar.id} para levar demandas terminou em {formatShortDate(calendar.linkDeadline)}.</Fine>}
        {error}
      </Panel>
    );
  }

  if (demand.status === 'reserved' && demand.reservation) {
    return (
      <Panel>
        <Eyebrow>Reservada</Eyebrow>
        <p className="mt-1 text-headline">{demand.reservation.teacherName} está avaliando esta demanda</p>
        <p className="mt-1 text-sm text-ink-2">
          A reserva vale até {formatShortDate(demand.reservation.until)}. Se não virar projeto, a demanda volta para o cardápio.
        </p>
        <Button variant="secondary" size="lg" fullWidth className="mt-5" disabled={watch.isPending} onClick={() => watch.mutate(demand.id)}>
          {demand.watching ? (
            <>
              <CheckIcon size={15} />
              Aviso ligado
            </>
          ) : (
            'Avise-me se liberar'
          )}
        </Button>
        <Fine>
          {demand.watching
            ? 'Você recebe um aviso quando ela voltar para o cardápio. Clique de novo para desligar.'
            : 'Se a reserva acabar sem virar projeto, você recebe um aviso quando a demanda voltar para o cardápio.'}
        </Fine>
        {error}
      </Panel>
    );
  }

  const anySlot = best ? freeSlots(best.discipline) > 0 : false;

  return (
    <Panel>
      <Eyebrow>Livre no cardápio</Eyebrow>
      <p className="mt-1 text-headline">
        {!hasDisciplines ? 'Nenhuma turma cadastrada ainda' : best?.fits ? `Combina com ${best.discipline.name}` : 'Não combina com suas turmas'}
      </p>
      {best && hasDisciplines && (
        <p className="mt-1 text-sm text-ink-2">
          Cobre {best.covered.length} de {demand.skills.length} competências pedidas{anySlot ? '.' : ', mas a turma está sem vaga.'}
        </p>
      )}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        className="mt-5"
        disabled={reserve.isPending}
        onClick={() => reserve.mutate(demand.id, { onSuccess: () => toast.show(`Reservada por ${RESERVATION_DAYS} dias. Quando decidir, leve para uma disciplina.`) })}
      >
        Reservar por {RESERVATION_DAYS} dias
      </Button>
      <Fine>A reserva guarda a demanda só para você enquanto decide. Dá para liberar a qualquer momento.</Fine>
      {error}
    </Panel>
  );
};
