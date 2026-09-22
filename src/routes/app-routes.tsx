import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/query-states';
import { PortalLayout } from '@/layouts/portal-layout';
import { lazyPage } from './lazy-page';
import { paths } from './paths';
import { RequireAuth } from './require-auth';

/* Cada tela vira um pedaço separado do bundle, carregado só quando o docente a abre. */
const LoginPage = lazyPage(() => import('@/features/auth/pages/login-page'), 'LoginPage');
const HomePage = lazyPage(() => import('@/features/home/pages/home-page'), 'HomePage');
const GuidePage = lazyPage(() => import('@/features/guide/pages/guide-page'), 'GuidePage');
const DemandsPage = lazyPage(() => import('@/features/demands/pages/demands-page'), 'DemandsPage');
const DemandPage = lazyPage(() => import('@/features/demands/pages/demand-page'), 'DemandPage');
const ProjectsPage = lazyPage(() => import('@/features/projects/pages/projects-page'), 'ProjectsPage');
const ProjectPage = lazyPage(() => import('@/features/projects/pages/project-page'), 'ProjectPage');
const DisciplinesPage = lazyPage(() => import('@/features/disciplines/pages/disciplines-page'), 'DisciplinesPage');
const DisciplinePage = lazyPage(() => import('@/features/disciplines/pages/discipline-page'), 'DisciplinePage');
const OrganizationsPage = lazyPage(() => import('@/features/organizations/pages/organizations-page'), 'OrganizationsPage');
const OrganizationPage = lazyPage(() => import('@/features/organizations/pages/organization-page'), 'OrganizationPage');
const AccountPage = lazyPage(() => import('@/features/account/pages/account-page'), 'AccountPage');

export const AppRoutes = () => (
  <Suspense fallback={<LoadingState />}>
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<PortalLayout />}>
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.guide} element={<GuidePage />} />
          <Route path={paths.demands} element={<DemandsPage />} />
          <Route path="/demandas/:demandId" element={<DemandPage />} />
          <Route path={paths.projects} element={<ProjectsPage />} />
          <Route path="/projetos/:projectId" element={<ProjectPage />} />
          <Route path={paths.disciplines} element={<DisciplinesPage />} />
          <Route path="/disciplinas/:disciplineId" element={<DisciplinePage />} />
          <Route path={paths.organizations} element={<OrganizationsPage />} />
          <Route path="/organizacoes/:organizationId" element={<OrganizationPage />} />
          <Route path={paths.account} element={<AccountPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={paths.home} replace />} />
    </Routes>
  </Suspense>
);
