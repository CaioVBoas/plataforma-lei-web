import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { OrgLayout } from '@/layouts/orgLayout';
import { TeacherLayout } from '@/layouts/teacherLayout';
import { lazyPage } from './lazyPage';
import { paths } from './paths';
import { RequireAuth } from './requireAuth';

/* Cada tela vira um pedaço separado do bundle, carregado só quando alguém a abre. */
const LandingPage = lazyPage(() => import('@/features/landing/landingPage'), 'LandingPage');
const SignupPage = lazyPage(() => import('@/features/auth/signupPage'), 'SignupPage');
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
const NotificationsPage = lazyPage(() => import('@/features/notifications/notificationsPage'), 'NotificationsPage');
const AccountPage = lazyPage(() => import('@/features/account/accountPage'), 'AccountPage');

const OrgHomePage = lazyPage(() => import('@/features/orgPortal/orgHomePage'), 'OrgHomePage');
const OrgDemandsPage = lazyPage(() => import('@/features/orgPortal/orgDemandsPage'), 'OrgDemandsPage');
const OrgDemandPage = lazyPage(() => import('@/features/orgPortal/orgDemandPage'), 'OrgDemandPage');
const SubmitDemandPage = lazyPage(() => import('@/features/orgPortal/submitDemandPage'), 'SubmitDemandPage');
const OrgProjectsPage = lazyPage(() => import('@/features/orgPortal/orgProjectsPage'), 'OrgProjectsPage');
const OrgProjectPage = lazyPage(() => import('@/features/orgPortal/orgProjectPage'), 'OrgProjectPage');
const OrgProfilePage = lazyPage(() => import('@/features/orgPortal/orgProfilePage'), 'OrgProfilePage');
const OrgNotificationsPage = lazyPage(() => import('@/features/orgPortal/orgNotificationsPage'), 'OrgNotificationsPage');

export const AppRoutes = () => (
  <Suspense fallback={<LoadingState />}>
    <Routes>
      <Route path={paths.landing} element={<LandingPage />} />
      <Route path={paths.login} element={<LoginPage />} />
      <Route path="/cadastro" element={<SignupPage />} />

      <Route element={<RequireAuth role="docente" />}>
        <Route element={<TeacherLayout />}>
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
          <Route path={paths.notifications} element={<NotificationsPage />} />
          <Route path={paths.account} element={<AccountPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth role="organizacao" />}>
        <Route element={<OrgLayout />}>
          <Route path={paths.orgHome} element={<OrgHomePage />} />
          <Route path="/organizacao/demandas" element={<OrgDemandsPage />} />
          <Route path={paths.orgNewDemand} element={<SubmitDemandPage />} />
          <Route path="/organizacao/demandas/:demandId" element={<OrgDemandPage />} />
          <Route path="/organizacao/demandas/:demandId/editar" element={<SubmitDemandPage />} />
          <Route path={paths.orgProjects} element={<OrgProjectsPage />} />
          <Route path="/organizacao/projetos/:projectId" element={<OrgProjectPage />} />
          <Route path={paths.orgProfile} element={<OrgProfilePage />} />
          <Route path={paths.orgNotifications} element={<OrgNotificationsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={paths.landing} replace />} />
    </Routes>
  </Suspense>
);
