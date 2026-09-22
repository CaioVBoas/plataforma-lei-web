import { useMutation, useQuery, type QueryKey } from '@tanstack/react-query';
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries';
import * as demandsApi from '../api/demands-api';
import type { LinkDisciplinePayload, MessageRecipient } from '../types';

export const demandKeys = {
  all: ['demands'] as const,
  detail: (demandId: string) => ['demands', demandId] as const,
  match: (demandId: string, disciplineId: string) => ['demands', demandId, 'match', disciplineId] as const,
  reading: (demandId: string) => ['demands', demandId, 'reading'] as const,
  catalog: ['competency-catalog'] as const,
};

/** Reservar ou liberar mexe no cardápio, nas reservas e na contagem de demandas das organizações. */
const AFFECTED_BY_RESERVATION: QueryKey[] = [demandKeys.all, ['reservations'], ['organizations']];

export const useDemands = () => useQuery({ queryKey: demandKeys.all, queryFn: demandsApi.getDemands });

export const useDemandDetail = (demandId: string) =>
  useQuery({ queryKey: demandKeys.detail(demandId), queryFn: () => demandsApi.getDemandDetail(demandId) });

export const useMatchExplanation = (demandId: string, disciplineId: string, enabled = true) =>
  useQuery({
    queryKey: demandKeys.match(demandId, disciplineId),
    queryFn: () => demandsApi.getMatchExplanation(demandId, disciplineId),
    enabled,
  });

export const useCompetencyReading = (demandId: string, enabled = true) =>
  useQuery({ queryKey: demandKeys.reading(demandId), queryFn: () => demandsApi.getCompetencyReading(demandId), enabled });

export const useCompetencyCatalog = () =>
  useQuery({ queryKey: demandKeys.catalog, queryFn: demandsApi.getCompetencyCatalog, staleTime: Infinity });

export const useColleagues = () => useQuery({ queryKey: ['colleagues'], queryFn: demandsApi.getColleagues, staleTime: Infinity });

export const useReserveDemand = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn: demandsApi.reserveDemand, onSuccess: () => invalidate(AFFECTED_BY_RESERVATION) });
};

export const useReleaseReservation = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn: demandsApi.releaseReservation, onSuccess: () => invalidate(AFFECTED_BY_RESERVATION) });
};

type CompetencyAction = 'confirm' | 'remove' | 'add';

const COMPETENCY_ACTIONS: Record<CompetencyAction, (demandId: string, name: string) => Promise<void>> = {
  confirm: demandsApi.confirmCompetency,
  remove: demandsApi.removeCompetency,
  add: demandsApi.addCompetency,
};

/** Competências da demanda aparecem no detalhe, no cardápio e na leitura automática. */
export const useEditDemandCompetency = (demandId: string) => {
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn: ({ action, name }: { action: CompetencyAction; name: string }) => COMPETENCY_ACTIONS[action](demandId, name),
    onSuccess: () => invalidate([demandKeys.all, ['practice']]),
  });
};

export const useAssociateExcerpt = (demandId: string) => {
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn: ({ excerpt, competency }: { excerpt: string; competency: string }) =>
      demandsApi.associateExcerpt(demandId, excerpt, competency),
    onSuccess: () => invalidate([demandKeys.all]),
  });
};

export const useSendQuestion = (demandId: string) => {
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn: ({ recipient, text }: { recipient: MessageRecipient; text: string }) =>
      demandsApi.sendQuestion(demandId, recipient, text),
    onSuccess: () => invalidate([demandKeys.detail(demandId), ['reservations']]),
  });
};

export const useLinkDiscipline = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn: (payload: LinkDisciplinePayload) => demandsApi.linkDiscipline(payload),
    onSuccess: () => invalidate([['proposals']]),
  });
};
