import { cn } from '@/utils/cn';

/** Inicial da organização num quadrado petróleo claro: identidade, sem cor por tipo. */
export const Monogram = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) => (
  <span
    aria-hidden="true"
    className={cn(
      'flex shrink-0 items-center justify-center bg-monogram font-semibold text-monogram-ink',
      size === 'sm' ? 'size-8 rounded-sm text-[13px]' : size === 'md' ? 'size-10 rounded-md text-[16px]' : size === 'lg' ? 'size-14 rounded-lg text-[24px]' : 'size-[72px] rounded-lg text-[30px]',
    )}
  >
    {name.trim().charAt(0).toUpperCase()}
  </span>
);
