import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type SignalTone = 'neutral' | 'success' | 'info' | 'danger' | 'muted';

const TONE_CLASSES: Record<SignalTone, string> = {
  neutral: 'bg-n-0 border-n-200 text-n-600',
  success: 'bg-sucesso-bg border-sucesso-borda text-sucesso-texto font-medium',
  info: 'bg-azul-50 border-azul-100 text-azul-800 font-medium',
  danger: 'bg-erro-bg border-erro-borda text-erro-texto font-medium',
  muted: 'bg-n-75 border-n-200 text-n-600 font-medium',
};

interface SignalPillProps {
  tone?: SignalTone;
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
}

/** Selo de estado com ícone e texto: a cor nunca é o único canal da informação. */
export const SignalPill = ({ tone = 'neutral', icon, title, children }: SignalPillProps) => (
  <span
    title={title}
    className={cn(
      'inline-flex h-[30px] shrink-0 items-center gap-[7px] rounded-full border px-[11px] text-[13px] transition-colors duration-200',
      TONE_CLASSES[tone],
    )}
  >
    {icon}
    <span>{children}</span>
  </span>
);
