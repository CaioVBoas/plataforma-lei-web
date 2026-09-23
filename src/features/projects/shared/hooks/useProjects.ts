import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import * as projectsApi from '../api/projectsApi';

/**
 * Todos os projetos do docente. Fica em shared porque não é só da listagem:
 * a agenda do Início, a barra lateral e a página de disciplina também leem.
 */
export const useProjects = () => useQuery({ queryKey: queryKeys.projects, queryFn: projectsApi.getProjects });
