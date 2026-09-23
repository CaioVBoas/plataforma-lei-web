import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import * as authApi from '../api/authApi';

export const useLogin = () => useMutation({ mutationFn: authApi.login });

/** Sair limpa o cache para que a próxima conta não veja dados da anterior. */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return () => {
    authApi.logout();
    queryClient.clear();
    navigate(paths.login, { replace: true });
  };
};
