import { useToast } from '@/components/feedback/toast-context';
import type { Project } from '../types';
import { nextActionOf } from '../utils/project-health';
import { useLogCurrentWeek, usePrepareReport, usePublishOnShowcase } from './use-projects';

const SUCCESS_MESSAGE = {
  'log-week': 'Andamento registrado nesta semana. O parceiro é notificado.',
  'prepare-report': 'Relatório preparado. A certificação das horas segue a partir dele.',
  publish: 'Caso publicado na vitrine de resultados.',
} as const;

export const useProjectNextAction = () => {
  const toast = useToast();
  const logWeek = useLogCurrentWeek();
  const prepareReport = usePrepareReport();
  const publish = usePublishOnShowcase();

  const run = (project: Project) => {
    const action = nextActionOf(project);
    if (!action) return;
    const mutation = { 'log-week': logWeek, 'prepare-report': prepareReport, publish }[action];
    mutation.mutate(project.id, { onSuccess: () => toast.show(SUCCESS_MESSAGE[action]) });
  };

  return { run, isBusy: logWeek.isPending || prepareReport.isPending || publish.isPending };
};
