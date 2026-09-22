import { useQuery } from '@tanstack/react-query';
import { getReservations } from '../api/reservations-api';

export const reservationKeys = { all: ['reservations'] as const };

export const useReservations = () => useQuery({ queryKey: reservationKeys.all, queryFn: getReservations });
