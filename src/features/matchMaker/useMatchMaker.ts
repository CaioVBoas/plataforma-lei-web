import { useCalendar } from '@/features/calendar/useCalendar';
import { useMenu } from '@/features/demands/useDemands';
import { useCurrentDisciplines } from '@/features/disciplines/useDisciplines';

/**
 * O Match Maker não tem backend próprio: cruza o que as outras telas já leem
 * (cardápio, turmas do semestre e calendário). Reservar, liberar e levar
 * usam as mutations do cardápio, então as telas continuam coerentes entre si.
 */
export const useMatchMaker = () => ({ menu: useMenu(), disciplines: useCurrentDisciplines(), calendar: useCalendar() });
