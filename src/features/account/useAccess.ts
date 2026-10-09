import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { session } from '@/features/auth/session';
import { paths } from '@/routes/paths';
import * as accessApi from './accessApi';

export const useChangePassword = (role: accessApi.AccessRole) =>
  useMutation({ mutationFn: (payload: accessApi.ChangePasswordPayload) => accessApi.changePassword(role, payload) });

/** Excluir encerra a sessão, limpa o cache e volta ao portal público. */
export const useDeleteAccount = (role: accessApi.AccessRole) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (typedEmail: string) => accessApi.deleteAccount(role, typedEmail),
    onSuccess: () => {
      session.end();
      queryClient.clear();
      navigate(paths.landing, { replace: true });
    },
  });
};
