import { Routes, Route, Navigate } from 'react-router-dom';
import { ProjectsPage } from '@/features/projects/pages/projectsPage';
import { LoginPage } from '@/features/auth/pages/loginPage';
import { ProtectedRoute } from './protectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rota Protegida (Exemplo: apenas autenticados) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<ProjectsPage />} />
      </Route>

      {/* Rota Protegida com restrição de papel (Exemplo: apenas ORGANIZAÇÃO e PROFESSOR) */}
      <Route element={<ProtectedRoute allowedRoles={['ORGANIZATION', 'PROFESSOR', 'ADMIN']} />}>
        <Route
          path="/projects/new"
          element={
            <div className="min-h-screen p-8 text-center bg-slate-50 dark:bg-slate-950">
              <h1 className="text-2xl font-bold">Área Restrita: Cadastro de Novo Projeto</h1>
            </div>
          }
        />
      </Route>

      {/* Rota de Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
