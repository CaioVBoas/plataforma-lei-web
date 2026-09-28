import { initialsOf } from '@/utils/format';
import { cn } from '@/utils/cn';

const SIZES = {
  sm: 'size-8 rounded-sm text-[12px]',
  xl: 'size-[72px] rounded-lg text-[26px]',
} as const;

/** Foto do docente ou, sem ela, as iniciais no mesmo desenho do monograma. */
export const Avatar = ({ name, photo, size = 'sm' }: { name: string; photo?: string; size?: keyof typeof SIZES }) =>
  photo ? (
    <img src={photo} alt="" aria-hidden="true" className={cn('shrink-0 object-cover', SIZES[size])} />
  ) : (
    <span aria-hidden="true" className={cn('flex shrink-0 items-center justify-center bg-monogram font-semibold text-monogram-ink', SIZES[size])}>
      {initialsOf(name)}
    </span>
  );
