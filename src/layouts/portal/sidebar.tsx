import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/feedback/toast-context';
import {
  AccountIcon,
  BookIcon,
  BookmarkIcon,
  BuildingIcon,
  ChevronDownIcon,
  DocumentIcon,
  FolderIcon,
  HelpIcon,
  MenuListIcon,
} from '@/components/ui/icons';
import { useDemands } from '@/features/matchmaking/hooks/use-demands';
import { useProposals } from '@/features/proposals/hooks/use-proposals';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { BrandMark } from '@/components/ui/brand-mark';
import { HELP_MESSAGE } from './help-message';

const ITEM_CLASSES = 'relative flex h-10 w-full items-center gap-2.5 pr-2 pl-3 text-left text-sm';

const ActiveBar = ({ active }: { active: boolean }) => (
  <span aria-hidden="true" className={cn('absolute top-[9px] bottom-[9px] left-0 w-0.5', active && 'bg-azul-500')} />
);

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  count?: number;
}

const NavItem = ({ to, icon, label, active, count }: NavItemProps) => (
  <Link to={to} aria-current={active ? 'page' : undefined} className={cn(ITEM_CLASSES, active ? 'font-bold text-n-800' : 'text-n-700 hover:text-n-900')}>
    <ActiveBar active={active} />
    {icon}
    <span className="min-w-0 flex-1 truncate">{label}</span>
    {Boolean(count) && <span className="text-[13px] font-normal text-n-500 tabular-nums">{count}</span>}
  </Link>
);

const SubNavItem = ({ to, label, active }: { to: string; label: string; active: boolean }) => (
  <Link
    to={to}
    aria-current={active ? 'page' : undefined}
    className={cn('flex h-[34px] items-center rounded-lg pr-2 pl-10 text-[13px]', active ? 'font-semibold text-azul-800' : 'text-n-600 hover:text-n-900')}
  >
    {label}
  </Link>
);

const isVinculate = (pathname: string) => /^\/demandas\/[^/]+\/vincular/.test(pathname);

export const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: demands = [] } = useDemands();

  const inProjects = pathname.startsWith('/projetos');
  // null = segue a rota; o docente pode abrir ou fechar o grupo manualmente.
  const [projectsGroupOverride, setProjectsGroupOverride] = useState<boolean | null>(null);
  const projectsGroupOpen = projectsGroupOverride ?? inProjects;

  const { data: proposals = [] } = useProposals();

  const menuCount = demands.filter((demand) => demand.status === 'available').length;
  const reservationCount = demands.filter((demand) => demand.status === 'reserved-by-me').length;
  // Propostas que ainda pedem trabalho do docente: as registradas já viraram projeto.
  const pendingProposals = proposals.filter((proposal) => !proposal.archived && proposal.status !== 'registered').length;

  const toggleProjectsGroup = () => {
    if (projectsGroupOpen) {
      setProjectsGroupOverride(false);
      return;
    }
    setProjectsGroupOverride(true);
    navigate(paths.runningProjects);
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[248px] shrink-0 flex-col border-r border-n-200 bg-n-0 px-2 pt-5 pb-4">
      <div className="px-3 pb-7">
        <BrandMark />
        <p className="mt-[5px] text-[13px] text-n-500">Centro de Informática, UFPE</p>
      </div>

      <nav aria-label="Portal do docente" className="flex flex-col gap-1">
        <NavItem
          to={paths.menu}
          icon={<MenuListIcon size={18} />}
          label="Cardápio de demandas"
          count={menuCount}
          active={pathname === paths.menu || (pathname.startsWith('/demandas') && !isVinculate(pathname))}
        />
        <NavItem
          to={paths.reservations}
          icon={<BookmarkIcon size={18} />}
          label="Minhas reservas"
          count={reservationCount}
          active={pathname === paths.reservations || isVinculate(pathname)}
        />
        <NavItem
          to={paths.proposals}
          icon={<DocumentIcon size={18} />}
          label="Propostas"
          count={pendingProposals}
          active={pathname.startsWith(paths.proposals)}
        />

        <button type="button" aria-expanded={projectsGroupOpen} onClick={toggleProjectsGroup} className={cn(ITEM_CLASSES, inProjects ? 'font-bold text-n-800' : 'text-n-700')}>
          <ActiveBar active={inProjects} />
          <FolderIcon size={18} />
          <span className="flex-1">Meus projetos</span>
          <ChevronDownIcon size={13} className={cn('text-n-400 transition-transform duration-150', projectsGroupOpen && 'rotate-180')} />
        </button>
        <div className={cn('grid overflow-hidden transition-[grid-template-rows] duration-150 ease-suave', projectsGroupOpen ? 'grid-rows-[1fr]' : '-mb-1 grid-rows-[0fr]')}>
          <div className="flex min-h-0 flex-col gap-1">
            <SubNavItem to={paths.runningProjects} label="Em execução" active={pathname === paths.runningProjects} />
            <SubNavItem to={paths.completedProjects} label="Concluídos" active={pathname === paths.completedProjects} />
          </div>
        </div>

        <NavItem to={paths.disciplines} icon={<BookIcon size={18} />} label="Minhas disciplinas" active={pathname.startsWith(paths.disciplines)} />
        <NavItem to={paths.organizations} icon={<BuildingIcon size={18} />} label="Organizações" active={pathname.startsWith(paths.organizations)} />
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-5">
        <NavItem to={paths.account} icon={<AccountIcon size={18} />} label="Meu perfil" active={pathname.startsWith(paths.account)} />
        <button type="button" onClick={() => toast.show(HELP_MESSAGE)} className={cn(ITEM_CLASSES, 'text-n-700 hover:text-n-900')}>
          <HelpIcon size={18} className="text-n-500" />
          Ajuda
        </button>
      </div>
    </aside>
  );
};
