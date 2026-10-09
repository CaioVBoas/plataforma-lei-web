import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { LightbulbIcon } from './icons';

/** Dica curta com ícone, ao lado de onde a pessoa vai agir: "Digite o nome da demanda". */
export const Hint = ({ children, icon, className }: { children: ReactNode; icon?: ReactNode; className?: string }) => (
  <p className={cn('flex items-start gap-2 text-small text-ink-2', className)}>
    <span aria-hidden="true" className="mt-0.5 shrink-0 text-brand">
      {icon ?? <LightbulbIcon size={20} />}
    </span>
    <span>{children}</span>
  </p>
);
