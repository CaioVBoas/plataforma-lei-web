import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandMark } from '@/components/ui/brand-mark';
import { BookIcon, BuildingIcon, FolderIcon, HomeIcon, QuestionIcon, TrayIcon } from '@/components/ui/icons';
import { useAgenda } from '@/features/projects/hooks/use-agenda';
import { needsAttention } from '@/features/projects/utils/agenda';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { AccountMenu } from './account-menu';

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  badge?: number;
  onNavigate?: () => void;
}

const NavItem = ({ to, icon, label, active, badge, onNavigate }: NavItemProps) => (
  <Link
    to={to}
    onClick={onNavigate}
    aria-current={active ? 'page' : undefined}
    className={cn(
      'flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors duration-100',
      active ? 'bg-fill-strong font-medium text-ink' : 'text-ink hover:bg-fill',
    )}
  >
    <span className={active ? 'text-accent' : 'text-ink-2'}>{icon}</span>
    <span className="min-w-0 flex-1 truncate">{label}</span>
    {Boolean(badge) && (
      <span className="min-w-5 rounded-full bg-accent px-1.5 text-center text-[11px] leading-5 font-semibold text-white tabular-nums">{badge}</span>
    )}
  </Link>
);

/** A ordem da navegação segue o caminho do docente: o que fazer, escolher, acompanhar e a base. */
const NAVIGATION = [
  { to: paths.home, label: 'Início', icon: <HomeIcon /> },
  { to: paths.demands, label: 'Demandas', icon: <TrayIcon /> },
  { to: paths.projects, label: 'Projetos', icon: <FolderIcon /> },
  { to: paths.disciplines, label: 'Disciplinas', icon: <BookIcon /> },
  { to: paths.organizations, label: 'Organizações', icon: <BuildingIcon /> },
];

export const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { pathname } = useLocation();
  const { agenda = [] } = useAgenda();
  // O único contador da navegação responde "quanta coisa pede ação minha agora".
  const pendingSteps = agenda.filter(needsAttention).length;

  return (
    <div className="flex h-full flex-col px-3 pt-5 pb-3">
      <Link to={paths.home} onClick={onNavigate} className="mb-7 px-2.5">
        <BrandMark />
      </Link>

      <nav aria-label="Portal do docente" className="flex flex-col gap-0.5">
        {NAVIGATION.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            active={pathname.startsWith(item.to)}
            badge={item.to === paths.home ? pendingSteps : undefined}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5">
        <NavItem to={paths.guide} label="Como funciona" icon={<QuestionIcon />} active={pathname.startsWith(paths.guide)} onNavigate={onNavigate} />
        <div className="mt-2 border-t border-line pt-2">
          <AccountMenu onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};
