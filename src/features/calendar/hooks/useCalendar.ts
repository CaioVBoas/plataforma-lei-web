import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getCalendar } from '../api/calendarApi';

/** O calendário acadêmico não muda durante a sessão. */
export const useCalendar = () => useQuery({ queryKey: queryKeys.calendar, queryFn: getCalendar, staleTime: Infinity });
