import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/query-states';
import { PortalLayout } from '@/layouts/portal/portal-layout';
import { paths } from './paths';
import { lazyPage } from './lazy-page';
import { RequireAuth } from './require-auth';

/* Cada tela vira um pedaço separado do bundle, carregado só quando o docente a abre. */
const ReservationsPage = lazyPage(() => import('@/features/applications/pages/reservations-page'), 'ReservationsPage');
const LoginPage = lazyPage(() => import('@/features/auth/pages/login-page'), 'LoginPage');
const DisciplineDetailPage = lazyPage(() => import('@/features/disciplines/pages/discipline-detail-page'), 'DisciplineDetailPage');
const DisciplinesPage = lazyPage(() => import('@/features/disciplines/pages/disciplines-page'), 'DisciplinesPage');
const DemandDetailPage = lazyPage(() => import('@/features/matchmaking/pages/demand-detail-page'), 'DemandDetailPage');
const DemandMenuPage = lazyPage(() => import('@/features/matchmaking/pages/demand-menu-page'), 'DemandMenuPage');
const LinkDisciplinePage = lazyPage(() => import('@/features/matchmaking/pages/link-discipline-page'), 'LinkDisciplinePage');
const NotificationsPage = lazyPage(() => import('@/features/notifications/pages/notifications-page'), 'NotificationsPage');
const OrganizationDetailPage = lazyPage(() => import('@/features/organizations/pages/organization-detail-page'), 'OrganizationDetailPage');
const OrganizationsPage = lazyPage(() => import('@/features/organizations/pages/organizations-page'), 'OrganizationsPage');
const AccountPage = lazyPage(() => import('@/features/profile/pages/account-page'), 'AccountPage');
const CorrectionsPage = lazyPage(() => import('@/features/profile/pages/corrections-page'), 'CorrectionsPage');
const OnboardingPage = lazyPage(() => import('@/features/profile/pages/onboarding-page'), 'OnboardingPage');
const PracticePage = lazyPage(() => import('@/features/profile/pages/practice-page'), 'PracticePage');
const ProjectDetailPage = lazyPage(() => import('@/features/projects/pages/project-detail-page'), 'ProjectDetailPage');
const ProjectsPage = lazyPage(() => import('@/features/projects/pages/projects-page'), 'ProjectsPage');
const ProposalEditorPage = lazyPage(() => import('@/features/proposals/pages/proposal-editor-page'), 'ProposalEditorPage');
const ProposalsPage = lazyPage(() => import('@/features/proposals/pages/proposals-page'), 'ProposalsPage');

export const AppRoutes = () => (
  <Suspense fallback={<LoadingState />}>
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route path={paths.onboarding} element={<OnboardingPage />} />

        <Route element={<PortalLayout />}>
          <Route path={paths.menu} element={<DemandMenuPage />} />
          <Route path="/demandas/:demandId" element={<DemandDetailPage />} />
          <Route path="/demandas/:demandId/vincular" element={<LinkDisciplinePage />} />
          <Route path={paths.reservations} element={<ReservationsPage />} />

          <Route path={paths.proposals} element={<ProposalsPage />} />
          <Route path="/rascunhos/:proposalId" element={<ProposalEditorPage />} />

          <Route path="/projetos" element={<Navigate to={paths.runningProjects} replace />} />
          <Route path={paths.runningProjects} element={<ProjectsPage stage="running" />} />
          <Route path={paths.completedProjects} element={<ProjectsPage stage="completed" />} />
          <Route path="/projetos/:projectId" element={<ProjectDetailPage />} />

          <Route path={paths.disciplines} element={<DisciplinesPage />} />
          <Route path="/disciplinas/:disciplineId" element={<DisciplineDetailPage />} />

          <Route path={paths.organizations} element={<OrganizationsPage />} />
          <Route path="/organizacoes/:organizationId" element={<OrganizationDetailPage />} />

          <Route path={paths.notifications} element={<NotificationsPage />} />

          <Route path={paths.account} element={<AccountPage />} />
          <Route path={paths.practice} element={<PracticePage />} />
          <Route path={paths.corrections} element={<CorrectionsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={paths.menu} replace />} />
    </Routes>
  </Suspense>
);
