import { Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/query-states';
import { BrandMark } from '@/components/ui/brand-mark';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { Sidebar } from './sidebar';

/** Casca de todas as telas do portal: barra lateral fixa no desktop e gaveta no celular. */
export const PortalLayout = () => {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  // Cada tela nova começa do topo, como uma página de verdade.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] border-r border-line bg-canvas md:block">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur-md md:hidden">
        <Link to={paths.home}>
          <BrandMark />
        </Link>
        <button type="button" aria-label="Abrir menu" onClick={() => setDrawerOpen(true)} className="flex size-9 items-center justify-center rounded-md hover:bg-fill">
          <MenuIcon />
        </button>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div aria-hidden="true" onClick={closeDrawer} className="absolute inset-0 bg-black/25 animate-fade-in" />
          <aside className={cn('absolute inset-y-0 left-0 w-[272px] bg-canvas shadow-sheet animate-fade-in')}>
            <button type="button" aria-label="Fechar menu" onClick={closeDrawer} className="absolute top-4 right-3 flex size-8 items-center justify-center rounded-md hover:bg-fill">
              <CloseIcon size={16} />
            </button>
            <Sidebar onNavigate={closeDrawer} />
          </aside>
        </div>
      )}

      <main className="md:pl-[236px]">
        {/* Suspense aqui mantém a barra lateral na tela enquanto a próxima página carrega. */}
        <Suspense fallback={<LoadingState />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
