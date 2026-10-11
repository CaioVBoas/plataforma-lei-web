import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { linkCardClassName } from './card';
import type { StatusTone } from './statusLabel';
import { Tag } from './tag';

interface StepCardProps {
  to: string;
  kind: string;
  tone: StatusTone;
  title: string;
  context: string;
  when?: string;
  overdue?: boolean;
}

/**
 * Cada próximo passo é um card: o tipo de passo em tag, a ação em destaque e
 * de onde ela vem. Em grade, dá para ver o dia inteiro sem ler linha a linha.
 */
export const StepCard = ({ to, kind, tone, title, context, when, overdue }: StepCardProps) => (
  <Link to={to} className={linkCardClassName}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Tag tone={tone}>{kind}</Tag>
      {when && <span className={cn('text-small', overdue ? 'font-medium text-caution' : 'text-ink-3')}>{when}</span>}
    </div>
    <p className="mt-3 text-h4 group-hover:text-accent">{title}</p>
    <p className="mt-1 line-clamp-2 text-small text-ink-2">{context}</p>
  </Link>
);
