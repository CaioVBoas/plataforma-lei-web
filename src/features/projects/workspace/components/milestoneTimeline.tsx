import { CheckIcon } from '@/components/ui/icons';
import { nextMilestone } from '@/domain/projectLifecycle';
import type { IsoDate, Milestone } from '@/domain/types';
import { cn } from '@/utils/cn';
import { MILESTONE_COPY, milestoneDateLine } from '../../shared/utils/projectPresentation';

const MilestoneMarker = ({ done, current }: { done: boolean; current: boolean }) => {
  if (done) {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-positive text-white">
        <CheckIcon size={13} />
      </span>
    );
  }
  return <span className={cn('size-6 rounded-full border-2 bg-surface', current ? 'border-accent' : 'border-line-strong')} />;
};

/** As seis etapas em ordem, com a data feita ou prevista e o que foi anotado em cada uma. */
export const MilestoneTimeline = ({ milestones, today }: { milestones: Milestone[]; today: IsoDate }) => {
  const next = nextMilestone(milestones);

  return (
    <ol className="relative">
      {milestones.map((milestone, index) => {
        const current = milestone.id === next?.id;
        const isLast = index === milestones.length - 1;
        return (
          <li key={milestone.id} className="relative flex gap-4 pb-7 last:pb-0">
            {!isLast && <span aria-hidden="true" className="absolute top-7 bottom-1 left-[11px] w-0.5 rounded-full bg-line" />}
            <MilestoneMarker done={Boolean(milestone.doneAt)} current={current} />
            <div className="min-w-0 flex-1 pt-0.5">
              <p className={cn('text-[15px] font-medium', milestone.doneAt || current ? 'text-ink' : 'text-ink-2')}>
                {MILESTONE_COPY[milestone.id].title}
                <span className="sr-only">{milestone.doneAt ? ', concluída' : current ? ', próxima' : ', pendente'}</span>
              </p>
              <p className={cn('mt-0.5 text-[13px]', current && milestone.dueAt < today ? 'text-caution' : 'text-ink-3')}>
                {milestoneDateLine(milestone, today, current)}
              </p>
              {milestone.note && <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-ink-2">{milestone.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
};
