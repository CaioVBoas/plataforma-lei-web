import { cn } from '@/utils/cn';
import { initialsOf } from '@/utils/format';

const AVATAR_SIZES = { sm: 'size-7 text-[11px]', md: 'size-8 text-xs', lg: 'size-9 text-sm', xl: 'size-16 text-[22px]' };

interface AvatarProps {
  name: string;
  size?: keyof typeof AVATAR_SIZES;
  /** Pessoa logada fica em azul escuro; demais pessoas e organizações em azul claro. */
  strong?: boolean;
}

export const Avatar = ({ name, size = 'md', strong }: AvatarProps) => (
  <span
    aria-hidden="true"
    className={cn(
      'flex shrink-0 items-center justify-center rounded-full font-semibold',
      AVATAR_SIZES[size],
      strong ? 'bg-azul-800 text-n-0' : 'bg-azul-50 text-azul-800',
    )}
  >
    {initialsOf(name)}
  </span>
);
