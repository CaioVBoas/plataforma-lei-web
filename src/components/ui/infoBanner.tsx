import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { InfoIcon } from './icons';
import type { StatusTone } from './statusLabel';

const TONES: Partial<Record<StatusTone, string>> = {
  neutral: 'bg-fill/70 text-ink-2',
  accent: 'bg-accent-soft text-ink',
  caution: 'bg-caution-soft text-ink',
};

const ICON_TONES: Partial<Record<StatusTone, string>> = {
  neutral: 'text-ink-3',
  accent: 'text-accent',
  caution: 'text-caution',
};

/** Aviso de uma ou duas linhas com ícone: diz em que pé a tela está, sem pedir ação. */
export const InfoBanner = ({
  children,
  icon,
  tone = 'neutral',
  action,
  className,
}: {
  children: ReactNode;
  icon?: ReactNode;
  tone?: 'neutral' | 'accent' | 'caution';
  action?: ReactNode;
  className?: string;
}) => (
  <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg px-4 py-3 text-sm leading-relaxed', TONES[tone], className)}>
    <span aria-hidden="true" className={cn('shrink-0', ICON_TONES[tone])}>
      {icon ?? <InfoIcon size={17} />}
    </span>
    <div className="min-w-0 flex-[1_1_280px]">{children}</div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
