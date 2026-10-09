import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { AccessibilityMenu } from '@/components/ui/accessibilityMenu';
import { BrandSymbol } from '@/components/ui/brandMark';
import { CloseIcon, MenuIcon, SidebarIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import { Sidebar, type SidebarConfig } from './sidebar';

const COLLAPSED_KEY = 'plei.sidebarCollapsed';

/** Preferência só deste navegador: sem armazenamento, a barra começa aberta. */
const readCollapsed = () => {
  try {
    return window.localStorage.getItem(COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
};

const ICON_BUTTON = 'size-10 items-center justify-center rounded-md text-ink-2 hover:bg-fill hover:text-ink';

interface PortalLayoutProps {
  sidebar: SidebarConfig;
  /** Sino de avisos do perfil. */
  bell: ReactNode;
  /** Menu da conta do perfil. */
  account: ReactNode;
}

/**
 * Casca de todas as telas dos portais do docente e da organização: barra
 * lateral recolhível no desktop, gaveta no celular e a barra superior com avisos e conta.
 */
export const PortalLayout = ({ sidebar, bell, account }: PortalLayoutProps) => {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const closeDrawer = () => setDrawerOpen(false);

  const toggleCollapsed = () =>
    setCollapsed((current) => {
      try {
        window.localStorage.setItem(COLLAPSED_KEY, current ? '0' : '1');
      } catch {
        // Sem armazenamento, a escolha vale só até recarregar.
      }
      return !current;
    });

  // Cada tela nova começa do topo, como uma página de verdade.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-surface">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-line bg-surface transition-[width] duration-200 md:block',
          collapsed ? 'w-[4.5rem]' : 'w-[18rem]',
        )}
      >
        <Sidebar {...sidebar} collapsed={collapsed} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div aria-hidden="true" onClick={closeDrawer} className="absolute inset-0 bg-black/25 animate-fade-in" />
          <aside className="absolute inset-y-0 left-0 w-[19rem] bg-surface shadow-sheet animate-fade-in">
            <button type="button" aria-label="Fechar menu" onClick={closeDrawer} className="absolute top-4 right-3 flex size-8 items-center justify-center rounded-md hover:bg-fill">
              <CloseIcon size={16} />
            </button>
            <Sidebar {...sidebar} onNavigate={closeDrawer} />
          </aside>
        </div>
      )}

      <div className={cn('transition-[padding] duration-200', collapsed ? 'md:pl-[4.5rem]' : 'md:pl-[18rem]')}>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-line bg-surface/95 px-3 backdrop-blur-md sm:px-4">
          <button type="button" aria-label="Abrir menu" onClick={() => setDrawerOpen(true)} className={cn(ICON_BUTTON, 'flex md:hidden')}>
            <MenuIcon />
          </button>
          <Link to={sidebar.homePath} className="md:hidden">
            <BrandSymbol />
          </Link>
          <button
            type="button"
            aria-label={collapsed ? 'Abrir barra lateral' : 'Recolher barra lateral'}
            aria-pressed={collapsed}
            title={collapsed ? 'Abrir barra lateral' : 'Recolher barra lateral'}
            onClick={toggleCollapsed}
            className={cn(ICON_BUTTON, 'hidden md:flex')}
          >
            <SidebarIcon size={20} />
          </button>

          <div className="ml-auto flex items-center gap-1">
            <AccessibilityMenu />
            {bell}
            <span aria-hidden="true" className="mx-1 h-6 w-px bg-line" />
            {account}
          </div>
        </header>

        <main>
          {/* Suspense aqui mantém a barra lateral na tela enquanto a próxima página carrega. */}
          <Suspense fallback={<LoadingState />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
