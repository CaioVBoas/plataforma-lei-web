import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/feedback/toastContext';
import { paths } from '@/routes/paths';
import * as authApi from './authApi';
import { session } from './session';

/** Entrar ou se cadastrar troca a conta: o cache da anterior não pode sobrar. */
const useSessionMutation = <Payload>(mutationFn: (payload: Payload) => Promise<void>) => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => queryClient.clear() });
};

export const useLogin = () => useSessionMutation(authApi.login);

export const useSignup = () => useSessionMutation(authApi.signup);

export const useOrgLogin = () => useSessionMutation(authApi.loginOrganization);

export const useOrgSignup = () => useSessionMutation(authApi.signupOrganization);

export const useSignupCode = () => useMutation({ mutationFn: authApi.requestSignupCode });

export const useOrgSignupCode = () => useMutation({ mutationFn: authApi.requestOrgSignupCode });

export const usePasswordResetCode = () => useMutation({ mutationFn: authApi.requestPasswordReset });

export const useResetPassword = () => useMutation({ mutationFn: authApi.resetPassword });

/** Sair limpa o cache para que a próxima conta não veja dados da anterior, e volta à entrada do mesmo perfil. */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  return () => {
    const role = session.role();
    authApi.logout();
    queryClient.clear();
    navigate(paths.loginAs(role), { replace: true });
    toast.show('Você saiu da conta. Até a próxima.');
  };
};
