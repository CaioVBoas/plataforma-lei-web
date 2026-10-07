import { ArrowUpRightIcon, BuildingIcon, FolderIcon, HomeIcon, QuestionIcon, TrayIcon } from '@/components/ui/icons';
import { useOrgAccount } from '@/features/orgPortal/useOrgPortal';
import { useOrgNotifications } from '@/features/orgPortal/useOrgNotifications';
import { paths } from '@/routes/paths';
import { AccountMenu } from './accountMenu';
import { NotificationsBell } from './notificationsBell';
import { PortalLayout } from './portalLayout';
import type { SidebarConfig } from './sidebar';

/** O caminho da organização: o que pede atenção, o que ela pediu e o que as turmas estão fazendo. */
const SIDEBAR: SidebarConfig = {
  label: 'Portal da organização',
  homePath: paths.orgHome,
  large: true,
  navigation: [
    { to: paths.orgHome, label: 'Início', icon: <HomeIcon size={20} /> },
    { to: paths.orgDemands(), label: 'Demandas', icon: <TrayIcon size={20} /> },
    { to: paths.orgProjects, label: 'Projetos', icon: <FolderIcon size={20} /> },
  ],
  footer: [
    { to: paths.landing, label: 'Portal do L.E.I.', icon: <ArrowUpRightIcon size={20} /> },
    { to: paths.orgGuide, label: 'Como funciona', icon: <QuestionIcon size={20} /> },
    { to: paths.orgProfile, label: 'Perfil da organização', icon: <BuildingIcon size={20} /> },
  ],
};

const OrgBell = () => {
  const { notifications, pending } = useOrgNotifications();
  return <NotificationsBell notifications={notifications} pending={pending} allPath={paths.orgNotifications} />;
};

const OrgAccountMenu = () => {
  const { data: account } = useOrgAccount();
  if (!account) return null;
  return <AccountMenu name={account.name} email={account.email} accountPath={paths.orgProfile} accountLabel="Perfil da organização" />;
};

export const OrgLayout = () => <PortalLayout sidebar={SIDEBAR} bell={<OrgBell />} account={<OrgAccountMenu />} />;
