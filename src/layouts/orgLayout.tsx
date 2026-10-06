import { ArrowUpRightIcon, BuildingIcon, FolderIcon, HomeIcon, QuestionIcon, TrayIcon } from '@/components/ui/icons';
import { useOrgAccount, useOrgProfile } from '@/features/orgPortal/useOrgPortal';
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

/** Quem está logado, no pé da barra: nome, a organização e o menu com perfil e sair. */
const OrgAccountMenu = ({ collapsed }: { collapsed: boolean }) => {
  const { data: account } = useOrgAccount();
  const { data: profile } = useOrgProfile();
  if (!account) return null;
  return (
    <AccountMenu
      inSidebar
      collapsed={collapsed}
      name={account.name}
      email={account.email}
      detail={profile?.organization.name}
      accountPath={paths.orgProfile}
      accountLabel="Perfil da organização"
    />
  );
};

/** O caminho da organização em três grupos: o trabalho do dia, a ajuda e o perfil. */
const SIDEBAR: SidebarConfig = {
  label: 'Portal da organização',
  homePath: paths.orgHome,
  subtitle: 'Portal da organização',
  navigation: [],
  sections: [
    {
      title: 'Demandas',
      items: [
        { to: paths.orgHome, label: 'Início', icon: <HomeIcon /> },
        { to: paths.orgDemands(), label: 'Demandas', icon: <TrayIcon /> },
        { to: paths.orgProjects, label: 'Projetos', icon: <FolderIcon /> },
      ],
    },
    {
      title: 'Ajuda',
      items: [
        { to: paths.orgGuide, label: 'Como funciona', icon: <QuestionIcon /> },
        { to: paths.landing, label: 'Portal do L.E.I.', icon: <ArrowUpRightIcon /> },
      ],
    },
    {
      title: 'Configurar',
      items: [{ to: paths.orgProfile, label: 'Perfil da organização', icon: <BuildingIcon /> }],
    },
  ],
  footer: [],
  user: (collapsed) => <OrgAccountMenu collapsed={collapsed} />,
};

export const OrgLayout = () => <PortalLayout cards sidebar={SIDEBAR} bell={<OrgBell />} />;
