import { Button } from '@/components/ui/button';
import { isOverdue, nextMilestone } from '@/domain/projectLifecycle';
import type { IsoDate, Milestone, Project } from '@/domain/types';
import { cn } from '@/utils/cn';
import { ADOPTION_COPY, MILESTONE_COPY, milestoneDateLine } from '../utils/projectPresentation';

interface NextStepCardProps {
  project: Project;
  today: IsoDate;
  onAct: (milestone: Milestone) => void;
}

/** Topo do projeto: responde "o que eu faço agora" com uma única ação. */
export const NextStepCard = ({ project, today, onAct }: NextStepCardProps) => {
  const milestone = nextMilestone(project.milestones);

  if (!milestone) {
    return (
      <div className="rounded-lg border border-line bg-canvas p-5 sm:p-6">
        <p className="text-[13px] font-medium text-ink-3">Resultado</p>
        <p className="mt-1.5 text-headline">{project.outcome?.summary ?? 'Projeto concluído.'}</p>
        {project.outcome && <p className="mt-1 text-sm text-ink-2">{ADOPTION_COPY[project.outcome.adoption]}.</p>}
      </div>
    );
  }

  const copy = MILESTONE_COPY[milestone.id];
  const overdue = isOverdue(milestone, today);

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-lg border border-line bg-canvas p-5 sm:p-6">
      <div className="min-w-0 flex-[1_1_380px]">
        <p className={cn('text-[13px] font-medium', overdue ? 'text-caution' : 'text-ink-3')}>
          Próximo passo · {milestoneDateLine(milestone, today, true)}
        </p>
        <p className="mt-1.5 text-headline">{copy.title}</p>
        <p className="mt-1 max-w-[60ch] text-sm leading-relaxed text-ink-2">{copy.description}</p>
      </div>
      <Button variant="primary" size="lg" onClick={() => onAct(milestone)}>
        {copy.action}
      </Button>
    </div>
  );
};
