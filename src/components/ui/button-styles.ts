import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline-accent' | 'outline-muted' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-azul-500 border-azul-500 text-n-0 hover:bg-azul-600 hover:border-azul-600 hover:shadow-primary-hover disabled:bg-n-300 disabled:border-n-300 disabled:shadow-none',
  secondary: 'bg-n-0 border-n-300 text-n-700 hover:bg-n-50 hover:border-n-400',
  'outline-accent': 'bg-n-0 border-n-300 text-azul-500 hover:bg-n-50 hover:border-n-400',
  'outline-muted': 'bg-n-0 border-n-300 text-n-600 hover:bg-n-50 hover:border-n-400',
  ghost: 'bg-transparent border-transparent text-n-600 hover:bg-n-75 hover:text-n-800',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-[34px] px-[13px] text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-[18px] text-[15px]',
};

/** Exposto para que links de navegação tenham a mesma aparência dos botões. */
export const buttonClassName = ({ variant = 'secondary', size = 'md', fullWidth }: ButtonStyleOptions = {}) =>
  cn(
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border font-medium',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-suave active:scale-[.975]',
    'disabled:text-n-400 disabled:pointer-events-none',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
  );
