import { Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/query-states';
import { NotificationsPopover } from '@/features/notifications/components/notifications-popover';
import { useSemesterContext } from '@/features/semester/hooks/use-semester-context';
import { paths } from '@/routes/paths';
import { AccountMenu } from './account-menu';
import { ContextStrip } from './context-strip';
import { PageHeaderContext, type PageHeader } from './page-header-context';
import { Sidebar } from './sidebar';

/** Casco comum a todas as telas do portal: sidebar, cabeçalho e faixa de contexto do semestre. */
export const PortalLayout = () => {
  const { pathname } = useLocation();
  const { data: semesterContext } = useSemesterContext();
  const [header, setHeader] = useState<PageHeader>({ title: '', subtitle: '' });

  // Projeto concluído não tem prazo de vinculação a lembrar.
  const showContextStrip = pathname !== paths.completedProjects;

  return (
    <PageHeaderContext.Provider value={setHeader}>
      <div className="flex min-h-screen min-w-[1024px] text-n-700">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2.5 border-b border-n-200 bg-n-0 px-8 py-[11px]">
            <div className="min-w-0 flex-[1_1_340px]">
              <h1 className="truncate text-xl leading-tight font-bold tracking-[-.01em] text-n-800">{header.title}</h1>
              <p className="mt-0.5 text-[13px] leading-snug text-n-500">{header.subtitle}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <NotificationsPopover />
              <AccountMenu />
            </div>
          </header>

          {semesterContext && showContextStrip && <ContextStrip context={semesterContext} />}

          <main className="flex-1 bg-n-0 px-8 pt-10 pb-[72px]">
            <div className="mx-auto max-w-[1200px]">
              {/* Suspense aqui mantém sidebar e cabeçalho na tela enquanto a próxima página carrega. */}
              <Suspense fallback={<LoadingState />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </PageHeaderContext.Provider>
  );
};
