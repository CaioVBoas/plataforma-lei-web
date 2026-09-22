import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  title: string;
  description: ReactNode;
  icon?: ReactNode;
  /** Estado vazio sempre oferece um próximo passo, nunca só uma frase. */
  action?: ReactNode;
  align?: 'center' | 'start';
}

export const EmptyState = ({ title, description, icon, action, align = 'center' }: EmptyStateProps) => (
  <div className={cn(align === 'center' ? 'px-8 py-16 text-center' : 'max-w-[62ch] py-8')}>
    {icon && (
      <div className="mx-auto mb-[18px] flex size-16 items-center justify-center rounded-xl border border-n-200 text-n-400">
        {icon}
      </div>
    )}
    <h2 className="heading-section mb-2.5">{title}</h2>
    <p className={cn('text-sm leading-relaxed whitespace-pre-line text-n-600', align === 'center' && 'mx-auto max-w-[52ch]', Boolean(action) && 'mb-[22px]')}>
      {description}
    </p>
    {action}
  </div>
);
