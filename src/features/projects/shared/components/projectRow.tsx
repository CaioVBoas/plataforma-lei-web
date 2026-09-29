import { FolderIcon } from '@/components/ui/icons';
import { AnchorIcon, Item } from '@/components/ui/itemList';
import { isOverdue, nextMilestone } from '@/domain/projectLifecycle';
import type { IsoDate, Project } from '@/domain/types';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { ADOPTION_COPY, MILESTONE_COPY, milestoneDateLine } from '../utils/projectPresentation';

/** Uma linha por projeto: de quem é, e o que falta. Usada onde a tabela de Projetos seria demais. */
export const ProjectRow = ({ project, today }: { project: Project; today: IsoDate }) => {
  const next = nextMilestone(project.milestones);
  const overdue = next ? isOverdue(next, today) : false;

  return (
    <Item
      to={paths.project(project.id)}
      label={project.title}
      anchor={
        <AnchorIcon>
          <FolderIcon size={18} />
        </AnchorIcon>
      }
    >
      <p className="truncate text-[15px] font-semibold text-ink">{project.title}</p>
      <p className="mt-1 truncate text-[13px] text-ink-2">
        {project.organization.name} · {project.semester}
      </p>
      <p className={cn('mt-1 truncate text-[13px]', overdue ? 'font-medium text-caution' : 'text-ink-3')}>
        {next ? `${MILESTONE_COPY[next.id].title} · ${milestoneDateLine(next, today, true)}` : project.outcome && ADOPTION_COPY[project.outcome.adoption]}
      </p>
    </Item>
  );
};
