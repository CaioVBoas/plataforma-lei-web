import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/feedback/toast-context';
import { paths } from '@/routes/paths';
import type { Project } from '../types';
import { nextActionOf } from '../utils/project-health';
import { usePrepareReport, usePublishOnShowcase } from './use-projects';

/** Mesma ação, mesmo destino: "Registrar andamento" sempre abre o formulário na aba Andamento. */
export const useProjectNextAction = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const prepareReport = usePrepareReport();
  const publish = usePublishOnShowcase();

  const run = (project: Project) => {
    switch (nextActionOf(project)) {
      case 'log-week':
        navigate(paths.project(project.id, 'andamento'));
        return;
      case 'prepare-report':
        prepareReport.mutate(project.id, { onSuccess: () => toast.show('Relatório preparado. A certificação das horas segue a partir dele.') });
        return;
      case 'publish':
        publish.mutate(project.id, { onSuccess: () => toast.show('Caso publicado na vitrine de resultados.') });
    }
  };

  return { run, isBusy: prepareReport.isPending || publish.isPending };
};
