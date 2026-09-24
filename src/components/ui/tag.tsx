import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { CheckIcon } from './icons';
import type { StatusTone } from './statusLabel';

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: 'bg-fill text-ink-2',
  accent: 'bg-accent-soft text-accent',
  positive: 'bg-positive-soft text-positive',
  caution: 'bg-caution-soft text-caution',
  critical: 'bg-critical-soft text-critical',
  reserve: 'bg-reserve-soft text-reserve',
};

interface TagProps {
  children: ReactNode;
  /** Cor do estado, sempre um tom suave dos tokens. O texto diz o estado; a cor só reforça. */
  tone?: StatusTone;
  /** Marca a competência que a disciplina já cobre. */
  covered?: boolean;
  icon?: ReactNode;
  className?: string;
}

/**
 * Rótulo estático (tipo, competência, estado): sem borda e sem hover, nunca clicável.
 * Assim ele não se confunde com botão secundário, que é o único elemento com borda.
 */
export const Tag = ({ children, tone = 'neutral', covered, icon, className }: TagProps) => (
  <span
    className={cn(
      'inline-flex max-w-full items-center gap-1 rounded-sm px-2.5 py-1 text-[13px] leading-tight',
      TONE_CLASSES[covered ? 'positive' : tone],
      className,
    )}
  >
    {covered ? <CheckIcon size={13} /> : icon}
    <span className="truncate">{children}</span>
  </span>
);
