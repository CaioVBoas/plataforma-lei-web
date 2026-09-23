import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { session } from '@/features/auth/api/session';
import { paths } from './paths';

/** Sem sessão, qualquer rota do portal leva à entrada, lembrando para onde o docente ia. */
export const RequireAuth = () => {
  const location = useLocation();
  if (!session.isAuthenticated()) return <Navigate to={paths.login} replace state={{ from: location.pathname }} />;
  return <Outlet />;
};
