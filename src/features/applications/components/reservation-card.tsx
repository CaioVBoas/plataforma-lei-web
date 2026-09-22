import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { CircleArrowIcon, CirclePauseIcon, ClockIcon, ListIcon, MessageIcon, WarningIcon } from '@/components/ui/icons';
import { SignalPill, type SignalTone } from '@/components/ui/signal-pill';
import { organizationLine } from '@/features/matchmaking/utils/demand-presentation';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import type { Reservation } from '../types';

interface StatusView {
  label: string;
  tone: SignalTone;
  icon: ReactNode;
}

const statusOf = (reservation: Reservation, lastDay: boolean): StatusView => {
  if (reservation.kind === 'expired') return { label: 'Expirada', tone: 'muted', icon: <CirclePauseIcon size={15} /> };
  if (reservation.kind === 'released') return { label: 'Liberada', tone: 'muted', icon: <CircleArrowIcon size={15} /> };
  if (lastDay) return { label: 'Último dia', tone: 'danger', icon: <ClockIcon size={15} strokeWidth={1.8} /> };
  return { label: 'Reserva ativa', tone: 'info', icon: <ClockIcon size={15} strokeWidth={1.8} /> };
};

const deadlineOf = (reservation: Reservation) => {
  if (reservation.kind === 'active') return pluralize(reservation.daysLeft, 'dia útil', 'dias úteis');
  if (reservation.kind === 'released') return 'No cardápio';
  return reservation.demandAvailable ? 'Voltou ao cardápio' : 'Com outro docente';
};

interface ReservationCardProps {
  reservation: Reservation;
  onRelease: (demandId: string) => void;
  onReserveAgain: (demandId: string) => void;
  busy: boolean;
}

export const ReservationCard = ({ reservation, onRelease, onReserveAgain, busy }: ReservationCardProps) => {
  const lastDay = reservation.kind === 'active' && reservation.daysLeft <= 1;
  const status = statusOf(reservation, lastDay);
  const canReserveAgain = reservation.kind !== 'active' && reservation.demandAvailable;

  return (
    <article
      className={cn(
        'relative rounded-2xl border bg-n-0 px-6 py-[22px] animate-card-entra',
        'transition-[border-color,box-shadow,transform] duration-[260ms] ease-suave hover:-translate-y-0.5 hover:border-n-300 hover:shadow-card-hover',
        lastDay ? 'border-erro-borda' : 'border-n-200',
        reservation.kind === 'expired' && 'opacity-70',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2.5">
        <p className="min-w-0 flex-[1_1_320px] text-[13px] text-n-500">{organizationLine(reservation)}</p>
        <SignalPill tone={status.tone} icon={status.icon}>
          {status.label}
        </SignalPill>
      </div>

      <h2 className="mt-3 max-w-[76ch] text-lg leading-[1.35] font-bold tracking-[-.01em] text-pretty text-n-800">
        <Link to={paths.demand(reservation.demandId)} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:shadow-none focus-visible:after:shadow-focus">
          {reservation.problem}
        </Link>
      </h2>

      <div className="mt-3.5 flex flex-wrap gap-x-3 gap-y-2.5">
        <SignalPill icon={<ListIcon size={15} />}>{reservation.intendedDiscipline}</SignalPill>
        <SignalPill tone={lastDay ? 'danger' : 'neutral'} icon={<ClockIcon size={15} strokeWidth={1.8} />}>
          {deadlineOf(reservation)}
        </SignalPill>
      </div>

      {lastDay && (
        <p className="mt-3.5 flex items-center gap-2 text-sm font-medium text-erro-texto">
          <WarningIcon size={15} />
          Expira amanhã
        </p>
      )}
      {reservation.hasUnansweredQuestion && (
        <p className="mt-3.5 flex items-center gap-2 text-sm text-n-600">
          <MessageIcon size={15} className="text-n-500" />
          Pergunta sem resposta
        </p>
      )}

      <div className="relative z-10 mt-[18px] flex flex-wrap items-center gap-2.5">
        {reservation.kind === 'active' && (
          <>
            <Link to={paths.linkDemand(reservation.demandId)} className={buttonClassName({ variant: 'primary' })}>
              Vincular a uma disciplina
            </Link>
            <Link to={paths.demand(reservation.demandId)} className={buttonClassName({ variant: 'secondary' })}>
              Pedir esclarecimento
            </Link>
            <Button variant="ghost" disabled={busy} onClick={() => onRelease(reservation.demandId)}>
              Liberar reserva
            </Button>
          </>
        )}
        {canReserveAgain && (
          <Button variant="primary" disabled={busy} onClick={() => onReserveAgain(reservation.demandId)}>
            Reservar de novo
          </Button>
        )}
        {reservation.kind === 'expired' && !reservation.demandAvailable && (
          <Button variant="secondary" disabled>
            Já reservada por outro docente
          </Button>
        )}
      </div>
    </article>
  );
};
