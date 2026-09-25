import { cn } from '@/utils/cn';

/**
 * Quantas das competências pedidas a turma cobre, em segmentos: dá para
 * comparar cartões de relance, sem uma tag por competência.
 */
export const CoverageMeter = ({ covered, total, fits }: { covered: number; total: number; fits: boolean }) => (
  <span role="img" aria-label={`Cobre ${covered} de ${total} competências`} className="flex gap-0.5">
    {Array.from({ length: total }, (_, index) => (
      <span
        key={index}
        aria-hidden="true"
        className={cn('h-1.5 w-3.5 rounded-full', index < covered ? (fits ? 'bg-positive' : 'bg-ink-3') : 'bg-fill-strong')}
      />
    ))}
  </span>
);
