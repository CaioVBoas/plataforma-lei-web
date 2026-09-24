import { cn } from '@/utils/cn';

/** Inicial da organização num quadrado neutro: âncora da lista, sem cor por tipo. */
export const Monogram = ({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) => (
  <span
    aria-hidden="true"
    className={cn(
      'flex shrink-0 items-center justify-center rounded-lg bg-fill font-semibold text-ink-2',
      size === 'md' ? 'size-10 text-[15px]' : 'size-14 text-[20px]',
    )}
  >
    {name.trim().charAt(0).toUpperCase()}
  </span>
);
