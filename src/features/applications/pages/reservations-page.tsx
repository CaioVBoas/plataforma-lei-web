import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { useToast } from '@/components/feedback/toast-context';
import { buttonClassName } from '@/components/ui/button-styles';
import { EmptyState } from '@/components/ui/empty-state';
import { BookmarkIcon } from '@/components/ui/icons';
import { UnderlineTabs } from '@/components/ui/underline-tabs';
import { useReleaseReservation, useReserveDemand } from '@/features/matchmaking/hooks/use-demands';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { ReservationCard } from '../components/reservation-card';
import { useReservations } from '../hooks/use-reservations';
import type { ReservationKind, ReservationsByKind } from '../types';

const TABS: { value: ReservationKind; label: string }[] = [
  { value: 'active', label: 'Ativas' },
  { value: 'released', label: 'Liberadas' },
  { value: 'expired', label: 'Expiradas' },
];

const EMPTY_COPY: Record<ReservationKind, { title: string; description: string }> = {
  active: {
    title: 'Nenhuma proposta em análise',
    description: 'Quando você marcar interesse em uma demanda do cardápio, ela fica guardada aqui por 5 dias úteis para você decidir com calma.',
  },
  released: { title: 'Nenhuma proposta liberada', description: 'Propostas que você devolveu ao cardápio aparecem aqui.' },
  expired: { title: 'Nenhuma proposta expirada', description: 'Propostas que passam de 5 dias úteis sem decisão aparecem aqui.' },
};

const ReservationList = ({ reservations }: { reservations: ReservationsByKind }) => {
  const toast = useToast();
  const [tab, setTab] = useState<ReservationKind>('active');
  const release = useReleaseReservation();
  const reserve = useReserveDemand();
  const visible = reservations[tab];

  const releaseReservation = (demandId: string) =>
    release.mutate(demandId, { onSuccess: () => toast.show('Reserva liberada. A demanda voltou ao cardápio dos outros docentes.') });

  const reserveAgain = (demandId: string) =>
    reserve.mutate(demandId, {
      onSuccess: () => {
        setTab('active');
        toast.show('Reservada de novo por 5 dias úteis.');
      },
    });

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <UnderlineTabs label="Situação da reserva" items={TABS} value={tab} onChange={setTab} />
        <span className="text-[13px] text-n-500 tabular-nums">{pluralize(visible.length, 'proposta', 'propostas')}</span>
      </div>

      {visible.length > 0 ? (
        <div className="flex flex-col gap-4">
          {visible.map((reservation) => (
            <ReservationCard
              key={`${reservation.kind}-${reservation.demandId}`}
              reservation={reservation}
              onRelease={releaseReservation}
              onReserveAgain={reserveAgain}
              busy={release.isPending || reserve.isPending}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookmarkIcon size={28} />}
          title={EMPTY_COPY[tab].title}
          description={EMPTY_COPY[tab].description}
          action={
            <Link to={paths.menu} className={buttonClassName({ variant: 'primary', size: 'lg' })}>
              Ver o cardápio de demandas
            </Link>
          }
        />
      )}
    </div>
  );
};

export const ReservationsPage = () => {
  usePageHeader('Minhas propostas', 'Demandas que você segurou e o prazo de cada uma');
  const reservationsQuery = useReservations();
  return <QueryView query={reservationsQuery}>{(reservations) => <ReservationList reservations={reservations} />}</QueryView>;
};
