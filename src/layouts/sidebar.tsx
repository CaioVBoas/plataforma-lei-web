import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandMark, BrandSymbol } from '@/components/ui/brandMark';
import { BellIcon, BookIcon, BuildingIcon, FolderIcon, HomeIcon, QuestionIcon, TrayIcon, UserIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}

const NavItem = ({ to, icon, label, active, collapsed, onNavigate }: NavItemProps) => (
  <Link
    to={to}
    onClick={onNavigate}
    aria-current={active ? 'page' : undefined}
    title={collapsed ? label : undefined}
    className={cn(
      'flex h-9 items-center gap-2.5 rounded-lg text-sm transition-colors duration-150',
      collapsed ? 'justify-center' : 'px-3',
      active ? 'bg-brand font-semibold text-white' : 'text-ink-2 hover:bg-brand-50 hover:text-brand-strong',
    )}
  >
    <span className={active ? 'text-white' : 'text-ink-3'}>{icon}</span>
    <span className={collapsed ? 'sr-only' : 'min-w-0 flex-1 truncate'}>{label}</span>
  </Link>
);

/** A ordem da navegação segue o caminho do docente: o que fazer, escolher, acompanhar e a base. */
const NAVIGATION = [
  { to: paths.home, label: 'Início', icon: <HomeIcon /> },
  { to: paths.notifications, label: 'Avisos', icon: <BellIcon /> },
  { to: paths.menu, label: 'Cardápio', icon: <TrayIcon /> },
  { to: paths.projects, label: 'Projetos', icon: <FolderIcon /> },
  { to: paths.disciplines, label: 'Disciplinas', icon: <BookIcon /> },
  { to: paths.organizations, label: 'Organizações', icon: <BuildingIcon /> },
];

const FOOTER = [
  { to: paths.guide, label: 'Como funciona', icon: <QuestionIcon /> },
  { to: paths.account, label: 'Minha conta', icon: <UserIcon /> },
];

interface SidebarProps {
  /** Só ícones, para dar mais largura às telas. */
  collapsed?: boolean;
  onNavigate?: () => void;
}

export const Sidebar = ({ collapsed, onNavigate }: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <div className={cn('flex h-full flex-col pt-3 pb-3', collapsed ? 'px-2.5' : 'px-3')}>
      <Link to={paths.home} onClick={onNavigate} className={cn('mb-6 flex h-10 items-center', collapsed ? 'justify-center' : 'px-2.5')}>
        {collapsed ? <BrandSymbol /> : <BrandMark />}
      </Link>

      <nav aria-label="Portal do docente" className="flex flex-col gap-0.5">
        {NAVIGATION.map((item) => (
          <NavItem key={item.to} {...item} active={pathname.startsWith(item.to)} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-3">
        {FOOTER.map((item) => (
          <NavItem key={item.to} {...item} active={pathname.startsWith(item.to)} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};
