import { useMutation } from '@tanstack/react-query';
import * as projectsApi from '../api/projectsApi';
import { useInvalidateProjectLifecycle } from './useInvalidateProjectLifecycle';

/** Levar uma demanda reservada para a disciplina. Quem chama é a janela do cardápio, em demands. */
export const useAdoptDemand = () => {
  const invalidateLifecycle = useInvalidateProjectLifecycle();
  return useMutation({ mutationFn: projectsApi.adoptDemand, onSuccess: invalidateLifecycle });
};
