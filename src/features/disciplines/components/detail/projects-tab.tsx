import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/button-styles';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import type { Discipline } from '../../types';
import { freeSlots } from '../../utils/discipline-presentation';

interface ProjectsTabProps {
  discipline: Discipline;
  onShowCompatibleDemands: () => void;
}

export const ProjectsTab = ({ discipline, onShowCompatibleDemands }: ProjectsTabProps) => {
  const { data: projects = [] } = useProjects();
  const ofDiscipline = projects.filter((project) => project.disciplineName === discipline.name);

  if (ofDiscipline.length === 0) {
    return (
      <EmptyState
        align="start"
        title="Nenhum projeto nesta turma"
        description={`Esta disciplina tem ${pluralize(freeSlots(discipline), 'vaga livre', 'vagas livres')}. Vincular uma demanda compatível cria o primeiro projeto da turma.`}
        action={
          <Button variant="outline-accent" size="sm" onClick={onShowCompatibleDemands}>
            Ver demandas compatíveis
          </Button>
        }
      />
    );
  }

  return (
    <ul className="flex flex-col gap-8">
      {ofDiscipline.map((project) => (
        <li key={project.id} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3.5 border-b border-n-200 pb-8">
          <div className="min-w-0 flex-[1_1_320px]">
            <Link to={paths.project(project.id)} className="text-lg leading-[1.35] font-bold tracking-[-.01em] text-n-800 hover:text-azul-800">
              {project.title}
            </Link>
            <p className="mt-[5px] text-sm text-n-600">{project.partnerName}</p>
            <p className="mt-[3px] text-[13px] text-n-500">
              {project.teamsFormed} de {project.teamsPlanned} equipes formadas · {project.students} estudantes ·{' '}
              {project.completion ? `${project.completion.certifiedHours}h certificadas` : `${project.hours} de ${project.plannedHours}h`}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className={project.completion ? 'text-sm font-medium text-n-600' : 'text-sm font-medium text-n-800'}>
              {project.completion ? `Concluído em ${project.completion.date}` : 'Em execução'}
            </p>
            <Link to={paths.project(project.id)} className={`${buttonClassName({ variant: 'outline-accent', size: 'sm' })} mt-1.5`}>
              Abrir projeto
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};
