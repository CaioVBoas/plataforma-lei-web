import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInvalidateQueries } from '@/hooks/useInvalidateQueries';
import { queryKeys } from '@/lib/queryKeys';
import * as disciplinesApi from './disciplinesApi';

export const useDisciplines = () => useQuery({ queryKey: queryKeys.disciplines, queryFn: disciplinesApi.getDisciplines });

/** Só as do semestre atual recebem demandas; as outras guardam o histórico. */
export const useCurrentDisciplines = () => {
  const query = useDisciplines();
  return { ...query, data: query.data?.filter((discipline) => discipline.isCurrent) };
};

export const useDiscipline = (id: string) =>
  useQuery({ queryKey: queryKeys.discipline(id), queryFn: () => disciplinesApi.getDiscipline(id) });

export const useCreateDiscipline = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn: disciplinesApi.createDiscipline, onSuccess: () => invalidate([queryKeys.disciplines]) });
};

export const useUpdateDiscipline = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn: disciplinesApi.updateDiscipline, onSuccess: () => invalidate([queryKeys.disciplines]) });
};

/** Só a lista é recarregada: a disciplina removida não existe mais e não deve ser buscada de novo. */
export const useRemoveDiscipline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disciplinesApi.removeDiscipline,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.disciplines, exact: true }),
  });
};

/** Convidar ou tirar um colega muda a disciplina e o que ele vê nos projetos dela. */
export const useInviteCoTeacher = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn: disciplinesApi.inviteCoTeacher, onSuccess: () => invalidate([queryKeys.disciplines, queryKeys.projects]) });
};

export const useRemoveCoTeacher = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn: disciplinesApi.removeCoTeacher, onSuccess: () => invalidate([queryKeys.disciplines, queryKeys.projects]) });
};

export const useSkillCatalog = () => useQuery({ queryKey: queryKeys.skillCatalog, queryFn: disciplinesApi.getSkillCatalog, staleTime: Infinity });
