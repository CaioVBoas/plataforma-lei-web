import { Routes, Route } from 'react-router-dom';
import { ProjectsPage } from '@/features/projects/pages/projects-page';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  );
};
