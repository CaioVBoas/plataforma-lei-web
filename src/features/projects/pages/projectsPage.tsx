import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/projectCard';

export const ProjectsPage = () => {
  const { user, logout } = useAuth();
  const { data: projects, isLoading, isError, error } = useProjects();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Header section */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                plataforma-lei
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Conectando academia e impacto social
              </p>
            </div>
          </div>
          <nav className="flex items-center space-x-3">
            <Link
              to="/projects"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg"
            >
              Projetos
            </Link>

            {user ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                    {user.name || user.email}
                  </p>
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/70 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Projetos de Extensão Disponíveis
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Explore projetos submetidos por ONGs e organizações para colaboração com discentes e docentes.
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Carregando projetos acadêmicos...
            </p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-6 text-center max-w-2xl mx-auto my-10">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-400">
              Erro ao carregar projetos
            </h3>
            <p className="text-sm text-red-600 dark:text-red-500 mt-2">
              {(error as Error).message}
            </p>
          </div>
        )}

        {!isLoading && !isError && projects && projects.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto my-10 shadow-sm">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Nenhum projeto encontrado
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Não existem projetos de extensão cadastrados no momento. Que tal cadastrar o primeiro?
            </p>
          </div>
        )}

        {!isLoading && !isError && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
