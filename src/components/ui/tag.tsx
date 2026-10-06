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
  /** Formato pílula com borda fina, para o estado de um item numa lista ou no cabeçalho. */
  pill?: boolean;
  className?: string;
}

/**
 * Rótulo estático (tipo, competência, estado): sem borda e sem hover, nunca clicável.
 * Assim ele não se confunde com botão secundário, que é o único elemento com borda.
 */
export const Tag = ({ children, tone = 'neutral', covered, icon, pill, className }: TagProps) => (
  <span
    className={cn(
      'inline-flex max-w-full items-center gap-1 text-[12px] leading-tight font-semibold whitespace-nowrap',
      pill ? 'gap-1.5 rounded-full border border-current/20 px-2.5 py-1' : 'rounded-sm px-2 py-[3px]',
      TONE_CLASSES[covered ? 'positive' : tone],
      className,
    )}
  >
    {covered ? <CheckIcon size={13} /> : (icon ?? (tone === 'reserve' && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-reserve-dot" />))}
    <span className="truncate">{children}</span>
  </span>
);
