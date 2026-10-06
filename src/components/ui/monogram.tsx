import { cn } from '@/utils/cn';

type MonogramSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<MonogramSize, string> = {
  sm: 'size-8 rounded-sm text-[13px]',
  md: 'size-10 rounded-md text-[16px]',
  lg: 'size-14 rounded-lg text-[24px]',
  xl: 'size-[72px] rounded-lg text-[30px]',
};

/**
 * Inicial da organização num quadrado petróleo claro: identidade, sem cor por
 * tipo. Com logo enviada pela organização, a logo toma o lugar da inicial.
 */
export const Monogram = ({ name, logo, size = 'md' }: { name: string; logo?: string; size?: MonogramSize }) =>
  logo ? (
    <img src={logo} alt="" aria-hidden="true" className={cn('shrink-0 border border-line bg-surface object-contain p-0.5', SIZES[size])} />
  ) : (
    <span aria-hidden="true" className={cn('flex shrink-0 items-center justify-center bg-monogram font-semibold text-monogram-ink', SIZES[size])}>
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
