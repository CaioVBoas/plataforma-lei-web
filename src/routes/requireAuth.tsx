import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { session } from '@/features/auth/session';
import { paths } from './paths';

/** Sem sessão, qualquer rota do portal leva à entrada, lembrando para onde o docente ia, com aba e âncora. */
export const RequireAuth = () => {
  const location = useLocation();
  if (!session.isAuthenticated()) return <Navigate to={paths.login} replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
  return <Outlet />;
};
