import { ArrowUpRightIcon, BookIcon, BuildingIcon, FolderIcon, HomeIcon, QuestionIcon, TrayIcon, UserIcon } from '@/components/ui/icons';
import { useAccount } from '@/features/account/useAccount';
import { useNotifications } from '@/features/notifications/useNotifications';
import { paths } from '@/routes/paths';
import { AccountMenu } from './accountMenu';
import { NotificationsBell } from './notificationsBell';
import { PortalLayout } from './portalLayout';
import type { SidebarConfig } from './sidebar';

/** A ordem da navegação segue o caminho do docente: o que fazer, escolher, acompanhar e a base. */
const SIDEBAR: SidebarConfig = {
  label: 'Portal do docente',
  homePath: paths.home,
  navigation: [
    { to: paths.home, label: 'Início', icon: <HomeIcon /> },
    { to: paths.menu, label: 'Cardápio', icon: <TrayIcon /> },
    { to: paths.projects, label: 'Projetos', icon: <FolderIcon /> },
    { to: paths.disciplines, label: 'Disciplinas', icon: <BookIcon /> },
    { to: paths.organizations, label: 'Organizações', icon: <BuildingIcon /> },
  ],
  footer: [
    { to: paths.landing, label: 'Portal do L.E.I.', icon: <ArrowUpRightIcon /> },
    { to: paths.guide, label: 'Como funciona', icon: <QuestionIcon /> },
    { to: paths.account, label: 'Minha conta', icon: <UserIcon /> },
  ],
};

const TeacherBell = () => {
  const { notifications, pending } = useNotifications();
  return <NotificationsBell notifications={notifications} pending={pending} allPath={paths.notifications} />;
};

const TeacherAccountMenu = () => {
  const { data: account } = useAccount();
  if (!account) return null;
  return <AccountMenu name={account.name} email={account.email} photo={account.photo || undefined} accountPath={paths.account} accountLabel="Minha conta" />;
};

export const TeacherLayout = () => <PortalLayout sidebar={SIDEBAR} bell={<TeacherBell />} account={<TeacherAccountMenu />} helpPath={paths.guide} />;
