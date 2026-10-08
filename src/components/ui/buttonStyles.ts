import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'plain' | 'destructive' | 'onDark' | 'onDarkOutline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/*
 * primary: a única ação principal da tela.
 * secondary: ação real de apoio, com borda fina sobre fundo branco. No máximo duas por item.
 * plain: ação terciária, só texto em azul.
 * destructive: desfazer ou remover, só texto em vermelho.
 * onDark e onDarkOutline: só sobre blocos petróleo do portal público, em branco cheio ou contorno claro.
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-canvas',
  plain: 'bg-transparent text-accent hover:bg-accent-soft',
  destructive: 'bg-transparent text-critical hover:bg-critical-soft',
  onDark: 'bg-surface text-brand-strong hover:bg-brand-50',
  onDarkOutline: 'border border-brand-300 bg-transparent text-white hover:bg-brand-700',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 whitespace-nowrap px-3 text-[13px]',
  md: 'h-9 gap-1.5 whitespace-nowrap px-4 text-sm',
  lg: 'h-11 gap-1.5 whitespace-nowrap px-5 text-[15px]',
  /** Para quem tem pouca prática: alvo grande, texto de 16px e ícone de 20px ao lado. */
  /** Com texto grande, o rótulo quebra em duas linhas em vez de sair da tela. */
  xl: 'min-h-12 gap-2.5 px-6 py-2 text-center text-base leading-tight font-semibold',
};

/** Exposto para que links de navegação tenham a mesma aparência dos botões. */
export const buttonClassName = ({ variant = 'secondary', size = 'md', fullWidth }: ButtonStyleOptions = {}) =>
  cn(
    'inline-flex items-center justify-center rounded-md font-medium',
    'transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
  );

/**
 * Link de texto: azul escuro, sem borda nem fundo, sublinhado só no hover.
 * Nunca se parece com botão, para que contagem, link e ação não se confundam.
 */
export const textLinkClassName = 'text-accent-hover underline-offset-2 hover:underline';
