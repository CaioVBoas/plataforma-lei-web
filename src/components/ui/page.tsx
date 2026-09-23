import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ChevronLeftIcon } from './icons';

interface PageProps {
  title: string;
  subtitle?: ReactNode;
  back?: { to: string; label: string };
  actions?: ReactNode;
  width?: 'default' | 'narrow';
  children: ReactNode;
}

/** Casca de toda tela do portal: voltar, título grande, subtítulo e ações à direita. */
export const Page = ({ title, subtitle, back, actions, width = 'default', children }: PageProps) => {
  useEffect(() => {
    document.title = `${title} · Aperta o PLEI`;
  }, [title]);

  return (
    <div className={cn('mx-auto w-full px-5 pt-8 pb-24 sm:px-10 sm:pt-12', width === 'default' ? 'max-w-[1000px]' : 'max-w-[760px]')}>
      {back && (
        <Link to={back.to} className="-ml-1.5 mb-4 inline-flex items-center gap-0.5 text-sm text-accent hover:text-accent-hover">
          <ChevronLeftIcon size={16} />
          {back.label}
        </Link>
      )}
      <header className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0 flex-[1_1_420px]">
          <h1 className="text-large-title text-balance">{title}</h1>
          {subtitle && <div className="mt-2 max-w-[62ch] text-[17px] leading-snug text-ink-2">{subtitle}</div>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  );
};

interface SectionProps {
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const Section = ({ title, description, aside, className, children }: SectionProps) => (
  <section className={cn('mt-12 first:mt-0', className)}>
    <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
      <div className="min-w-0">
        <h2 className="text-title">{title}</h2>
        {description && <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-ink-2">{description}</p>}
      </div>
      {aside}
    </div>
    {children}
  </section>
);
