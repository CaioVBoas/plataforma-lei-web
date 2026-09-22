import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'plain' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/*
 * primary: a única ação principal da tela.
 * secondary: ações de apoio, em cinza preenchido.
 * plain: ação terciária, só texto em azul.
 * destructive: desfazer ou remover, só texto em vermelho.
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-fill text-ink hover:bg-fill-strong',
  plain: 'bg-transparent text-accent hover:bg-accent-soft',
  destructive: 'bg-transparent text-critical hover:bg-critical-soft',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-5 text-[15px]',
};

/** Exposto para que links de navegação tenham a mesma aparência dos botões. */
export const buttonClassName = ({ variant = 'secondary', size = 'md', fullWidth }: ButtonStyleOptions = {}) =>
  cn(
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium',
    'transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
  );
