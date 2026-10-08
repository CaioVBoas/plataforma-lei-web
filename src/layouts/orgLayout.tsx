import { ArrowUpRightIcon, BellIcon, BuildingIcon, ChatIcon, FolderIcon, HomeIcon, QuestionIcon, TrayIcon } from '@/components/ui/icons';
import { useOrgAccount, useOrgDemands } from '@/features/orgPortal/useOrgPortal';
import { useOrgNotifications } from '@/features/orgPortal/useOrgNotifications';
import { paths } from '@/routes/paths';
import { AccountMenu } from './accountMenu';
import { NotificationsBell } from './notificationsBell';
import { PortalLayout } from './portalLayout';
import type { SidebarConfig } from './sidebar';

const OrgBell = () => {
  const { notifications, pending } = useOrgNotifications();
  return <NotificationsBell notifications={notifications} pending={pending} allPath={paths.orgNotifications} />;
};

const OrgAccountMenu = () => {
  const { data: account } = useOrgAccount();
  if (!account) return null;
  return <AccountMenu name={account.name} email={account.email} accountPath={paths.orgProfile} accountLabel="Perfil da organização" />;
};

/**
 * O caminho da organização, com tudo à vista: o que pede atenção, o que ela
 * pediu, as perguntas dos docentes, os projetos e os avisos. Perguntas e
 * Avisos levam o número do que espera, para não depender só do sino.
 */
export const OrgLayout = () => {
  const { data: demands = [] } = useOrgDemands();
  const { pending } = useOrgNotifications();
  const questions = demands.reduce((sum, demand) => sum + demand.unanswered, 0);

  const sidebar: SidebarConfig = {
    label: 'Portal da organização',
    homePath: paths.orgHome,
    large: true,
    navigation: [
      {
        title: 'Demandas',
        items: [
          { to: paths.orgHome, label: 'Início', icon: <HomeIcon size={20} /> },
          { to: paths.orgDemands(), label: 'Demandas', icon: <TrayIcon size={20} /> },
          { to: paths.orgQuestions(), label: 'Perguntas', icon: <ChatIcon size={20} />, badge: questions || undefined },
          { to: paths.orgProjects, label: 'Projetos', icon: <FolderIcon size={20} /> },
        ],
      },
      {
        title: 'Conta',
        items: [
          { to: paths.orgNotifications, label: 'Avisos', icon: <BellIcon size={20} />, badge: pending || undefined },
          { to: paths.orgProfile, label: 'Perfil da organização', icon: <BuildingIcon size={20} /> },
        ],
      },
    ],
    footer: [
      { to: paths.orgGuide, label: 'Como funciona', icon: <QuestionIcon size={20} /> },
      { to: paths.landing, label: 'Portal do L.E.I.', icon: <ArrowUpRightIcon size={20} /> },
    ],
  };

  return <PortalLayout sidebar={sidebar} bell={<OrgBell />} account={<OrgAccountMenu />} helpPath={paths.orgGuide} />;
};
