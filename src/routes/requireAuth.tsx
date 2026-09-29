import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { session } from '@/features/auth/session';
import type { UserRole } from '@/features/auth/types';
import { homeFor, paths } from './paths';

/**
 * Sem sessão, qualquer rota do portal leva à entrada do perfil certo, lembrando
 * para onde a pessoa ia, com aba e âncora. Com sessão de outro perfil, volta ao próprio portal.
 */
export const RequireAuth = ({ role }: { role: UserRole }) => {
  const location = useLocation();
  if (!session.isAuthenticated()) {
    return <Navigate to={paths.loginAs(role)} replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
  }
  if (session.role() !== role) return <Navigate to={homeFor(session.role())} replace />;
  return <Outlet />;
};
