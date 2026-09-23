import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type StatusTone = 'neutral' | 'accent' | 'positive' | 'caution' | 'critical' | 'reserve';

const DOT_CLASSES: Record<StatusTone, string> = {
  neutral: 'bg-ink-3',
  accent: 'bg-accent',
  positive: 'bg-positive',
  caution: 'bg-caution',
  critical: 'bg-critical',
  reserve: 'bg-reserve-dot',
};

const TEXT_CLASSES: Record<StatusTone, string> = {
  neutral: 'text-ink-2',
  accent: 'text-accent',
  positive: 'text-positive',
  caution: 'text-caution',
  critical: 'text-critical',
  reserve: 'text-reserve',
};

/** Estado com ponto colorido e texto. A cor nunca é a única pista: o texto sempre diz o estado. */
export const StatusLabel = ({ tone, children, className }: { tone: StatusTone; children: ReactNode; className?: string }) => (
  <span className={cn('inline-flex items-center gap-1.5 text-[13px] font-medium', TEXT_CLASSES[tone], className)}>
    <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', DOT_CLASSES[tone])} />
    {children}
  </span>
);
