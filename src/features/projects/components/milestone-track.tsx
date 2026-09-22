import { completedCount, MILESTONE_ORDER } from '@/domain/project-lifecycle';
import type { Milestone } from '@/domain/types';
import { cn } from '@/utils/cn';

/** Seis segmentos, um por etapa: dá para ver em que pé o projeto está sem ler nada. */
export const MilestoneTrack = ({ milestones, className }: { milestones: Milestone[]; className?: string }) => {
  const done = completedCount(milestones);
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="meter"
        aria-label="Etapas concluídas"
        aria-valuemin={0}
        aria-valuemax={MILESTONE_ORDER.length}
        aria-valuenow={done}
        className="flex flex-1 gap-1"
      >
        {milestones.map((milestone) => (
          <span key={milestone.id} className={cn('h-1 flex-1 rounded-full', milestone.doneAt ? 'bg-positive' : 'bg-fill-strong')} />
        ))}
      </div>
      <span className="shrink-0 text-[13px] text-ink-3 tabular-nums">
        {done} de {MILESTONE_ORDER.length}
      </span>
    </div>
  );
};
