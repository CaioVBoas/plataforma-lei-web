import { ListRow } from '@/components/ui/groupedList';
import { isOverdue, nextMilestone } from '@/domain/projectLifecycle';
import type { IsoDate, Project } from '@/domain/types';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { ADOPTION_COPY, MILESTONE_COPY, milestoneDateLine } from '../utils/projectPresentation';
import { MilestoneTrack } from './milestoneTrack';

/** Uma linha por projeto: de quem é, para qual turma, e o que falta. */
export const ProjectRow = ({ project, today }: { project: Project; today: IsoDate }) => {
  const next = nextMilestone(project.milestones);
  const overdue = next ? isOverdue(next, today) : false;

  return (
    <ListRow to={paths.project(project.id)}>
      <p className="text-[13px] text-ink-3">
        {project.organization.name} · {project.disciplineName} · {project.semester}
      </p>
      <p className="mt-0.5 text-[15px] font-medium text-ink">{project.title}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <MilestoneTrack milestones={project.milestones} className="w-full max-w-[220px]" />
        <p className={cn('text-[13px]', overdue ? 'text-caution' : 'text-ink-2')}>
          {next
            ? `${MILESTONE_COPY[next.id].title} · ${milestoneDateLine(next, today, true)}`
            : project.outcome && ADOPTION_COPY[project.outcome.adoption]}
        </p>
      </div>
    </ListRow>
  );
};
