import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ChevronRightIcon } from './icons';

/** Lista agrupada: um bloco com separadores finos entre as linhas, como nos Ajustes do sistema. */
export const GroupedList = ({ children, className }: { children: ReactNode; className?: string }) => (
  <ul className={cn('divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface', className)}>{children}</ul>
);

interface ListRowProps {
  to?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Com `to`, a linha inteira é o link e ganha a seta de navegação. */
export const ListRow = ({ to, leading, trailing, children, className }: ListRowProps) => {
  const content = (
    <>
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="min-w-0 flex-1">{children}</div>
      {trailing && <div className="shrink-0">{trailing}</div>}
      {to && <ChevronRightIcon size={15} className="shrink-0 text-ink-3" />}
    </>
  );
  const rowClasses = cn('flex items-center gap-4 px-4 py-3.5', className);

  return (
    <li>
      {to ? (
        <Link to={to} className={cn(rowClasses, 'transition-colors duration-100 hover:bg-canvas')}>
          {content}
        </Link>
      ) : (
        <div className={rowClasses}>{content}</div>
      )}
    </li>
  );
};

/** Pares de rótulo e valor, alinhados em duas colunas. */
export const DetailList = ({ items }: { items: { label: string; value: ReactNode }[] }) => (
  <dl className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
    {items.map((item) => (
      <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-3">
        <dt className="shrink-0 text-sm text-ink-2">{item.label}</dt>
        <dd className="min-w-0 flex-[1_1_260px] text-sm text-ink sm:text-right">{item.value}</dd>
      </div>
    ))}
  </dl>
);
