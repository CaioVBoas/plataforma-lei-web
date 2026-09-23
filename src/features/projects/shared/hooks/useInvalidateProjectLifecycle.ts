import { useQueryClient } from '@tanstack/react-query';
import { useInvalidateQueries } from '@/hooks/useInvalidateQueries';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Criar ou desfazer um projeto mexe no cardápio, nas vagas das disciplinas e
 * no histórico das organizações, então tudo isso é recarregado. A lista de
 * projetos é invalidada sozinha, sem o detalhe: o projeto desfeito não existe
 * mais e não deve ser buscado de novo.
 */
export const useInvalidateProjectLifecycle = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateQueries();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.projects, exact: true }),
      invalidate([queryKeys.demands, queryKeys.disciplines, queryKeys.organizations]),
    ]);
};
