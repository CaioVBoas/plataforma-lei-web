import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { getCalendar } from '../api/calendar-api';

/** O calendário acadêmico não muda durante a sessão. */
export const useCalendar = () => useQuery({ queryKey: queryKeys.calendar, queryFn: getCalendar, staleTime: Infinity });
