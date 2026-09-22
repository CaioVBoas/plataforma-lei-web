import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SectionCardProps {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Superfície padrão dos portais: fundo branco, borda fina e sem sombra em repouso. */
export const SectionCard = ({ title, description, action, className, children }: SectionCardProps) => (
  <section className={cn('rounded-2xl border border-n-200 bg-n-0 px-6 py-[22px]', className)}>
    {(title || action) && (
      <div className={cn('flex items-start justify-between gap-4', description ? 'mb-1' : 'mb-4')}>
        {title && <h3 className="heading-section">{title}</h3>}
        {action}
      </div>
    )}
    {description && <p className="mb-4 text-[13px] text-n-500">{description}</p>}
    {children}
  </section>
);

interface SectionBlockProps {
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}

/** Bloco sem moldura, usado nas telas longas de perfil e detalhe. */
export const SectionBlock = ({ title, description, aside, children }: SectionBlockProps) => (
  <section>
    <div className={cn('flex flex-wrap items-baseline justify-between gap-3', description ? 'mb-2' : 'mb-4')}>
      <h3 className="heading-section">{title}</h3>
      {aside}
    </div>
    {description && <p className="mb-4 max-w-[68ch] text-[13px] leading-normal text-n-500">{description}</p>}
    {children}
  </section>
);
