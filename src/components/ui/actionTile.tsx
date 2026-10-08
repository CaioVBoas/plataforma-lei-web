import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ArrowRightIcon } from './icons';

type TileTone = 'brand' | 'accent' | 'caution';

const ICON_TONES: Record<TileTone, string> = {
  brand: 'bg-brand-50 text-brand',
  accent: 'bg-accent-soft text-accent',
  caution: 'bg-caution-soft text-caution',
};

interface ActionTileProps {
  to: string;
  /** Ícone grande que sozinho já diz o que o cartão faz. */
  icon: ReactNode;
  title: string;
  /** Uma frase curta, para quem precisar ler. */
  text: string;
  tone?: TileTone;
  /** Contagem em destaque, como "2 esperando". */
  badge?: string;
}

/**
 * Um caminho do Início em cartão grande: ícone em círculo colorido, o nome da
 * ação e uma frase. O cartão inteiro é o botão, com área de toque generosa.
 */
export const ActionTile = ({ to, icon, title, text, tone = 'brand', badge }: ActionTileProps) => (
  <Link
    to={to}
    className="group flex h-full min-h-[168px] flex-col rounded-xl border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-150 hover:border-line-strong hover:shadow-[0_2px_10px_rgba(10,50,50,0.1)] focus-visible:border-accent"
  >
    <div className="flex items-start justify-between gap-3">
      <span aria-hidden="true" className={cn('flex size-14 shrink-0 items-center justify-center rounded-full', ICON_TONES[tone])}>
        {icon}
      </span>
      {badge && <span className="rounded-full bg-accent px-2.5 py-1 text-[13px] font-semibold text-white">{badge}</span>}
    </div>
    <p className="mt-4 text-[18px] leading-snug font-semibold text-ink group-hover:text-accent">
      {title}
      <ArrowRightIcon size={18} className="ml-1.5 inline-block align-[-3px]" />
    </p>
    <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{text}</p>
  </Link>
);
