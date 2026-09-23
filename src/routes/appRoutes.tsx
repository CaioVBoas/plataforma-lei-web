import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { PortalLayout } from '@/layouts/portalLayout';
import { lazyPage } from './lazyPage';
import { paths } from './paths';
import { RequireAuth } from './requireAuth';

/* Cada tela vira um pedaço separado do bundle, carregado só quando o docente a abre. */
const LoginPage = lazyPage(() => import('@/features/auth/loginPage'), 'LoginPage');
const HomePage = lazyPage(() => import('@/features/home/homePage'), 'HomePage');
const GuidePage = lazyPage(() => import('@/features/guide/guidePage'), 'GuidePage');
const MenuPage = lazyPage(() => import('@/features/demands/menuPage'), 'MenuPage');
const DemandPage = lazyPage(() => import('@/features/demands/demandPage'), 'DemandPage');
const ProjectsPage = lazyPage(() => import('@/features/projects/list/projectsPage'), 'ProjectsPage');
const ProjectPage = lazyPage(() => import('@/features/projects/workspace/projectPage'), 'ProjectPage');
const DisciplinesPage = lazyPage(() => import('@/features/disciplines/disciplinesPage'), 'DisciplinesPage');
const DisciplinePage = lazyPage(() => import('@/features/disciplines/disciplinePage'), 'DisciplinePage');
const OrganizationsPage = lazyPage(() => import('@/features/organizations/organizationsPage'), 'OrganizationsPage');
const OrganizationPage = lazyPage(() => import('@/features/organizations/organizationPage'), 'OrganizationPage');
const AccountPage = lazyPage(() => import('@/features/account/accountPage'), 'AccountPage');

export const AppRoutes = () => (
  <Suspense fallback={<LoadingState />}>
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<PortalLayout />}>
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.guide} element={<GuidePage />} />
          <Route path={paths.menu} element={<MenuPage />} />
          <Route path="/cardapio/:demandId" element={<DemandPage />} />
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
