import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries';
import type { PracticeChange } from '@/types/practice';
import * as disciplinesApi from '../api/disciplines-api';
import type { DisciplineUpdate, NewDisciplinePayload } from '../types';

export const disciplineKeys = {
  all: ['disciplines'] as const,
  detail: (disciplineId: string) => ['disciplines', disciplineId] as const,
  catalog: ['discipline-catalog'] as const,
};

export const CURRENT_SEMESTER = '2026.2';

export const useDisciplines = () => useQuery({ queryKey: disciplineKeys.all, queryFn: disciplinesApi.getDisciplines });

/** Disciplinas do semestre corrente: as únicas que podem receber demandas. */
export const useCurrentDisciplines = () =>
  useQuery({
    queryKey: disciplineKeys.all,
    queryFn: disciplinesApi.getDisciplines,
    select: (disciplines) => disciplines.filter((discipline) => discipline.semester === CURRENT_SEMESTER),
  });

export const useDiscipline = (disciplineId: string) =>
  useQuery({ queryKey: disciplineKeys.detail(disciplineId), queryFn: () => disciplinesApi.getDiscipline(disciplineId) });

export const useDisciplineCatalog = () =>
  useQuery({ queryKey: disciplineKeys.catalog, queryFn: disciplinesApi.getDisciplineCatalog, staleTime: Infinity });

const useDisciplineMutation = <Variables, Result>(mutationFn: (variables: Variables) => Promise<Result>) => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn, onSuccess: () => invalidate([disciplineKeys.all]) });
};

export const useCreateDiscipline = () =>
  useDisciplineMutation((payload: NewDisciplinePayload) => disciplinesApi.createDiscipline(payload));

export const useUpdateDiscipline = () =>
  useDisciplineMutation(({ id, update }: { id: string; update: DisciplineUpdate }) => disciplinesApi.updateDiscipline(id, update));

export const useChangeDisciplinePractice = (disciplineId: string) =>
  useDisciplineMutation((change: PracticeChange) => disciplinesApi.changeDisciplinePractice(disciplineId, change));

export const useDuplicateDiscipline = () => useDisciplineMutation(disciplinesApi.duplicateDiscipline);

export const useArchiveDiscipline = () => useDisciplineMutation(disciplinesApi.archiveDiscipline);
