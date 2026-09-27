import { cn } from '@/utils/cn';

/**
 * Símbolo do Aperta o PLEI: o botão de play num quadrado de canto 6/24,
 * "apertar o play" num projeto real. Não girar, contornar nem trocar a cor do triângulo.
 */
export const BrandSymbol = ({ size = 24, onDark = false }: { size?: number; onDark?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <rect width="24" height="24" rx="6" className={onDark ? 'fill-brand-on-dark' : 'fill-brand'} />
    <path
      d="M10 7.6 L16.9 12 L10 16.4 Z"
      strokeWidth="1.6"
      strokeLinejoin="round"
      className={onDark ? 'fill-panel-deep stroke-panel-deep' : 'fill-white stroke-white'}
    />
  </svg>
);

/** Logotipo: "PLEI" em negrito e na cor de identidade, para ler L.E.I. dentro do nome. */
export const BrandMark = ({ onDark = false }: { onDark?: boolean }) => (
  <span className="flex items-center gap-2">
    <BrandSymbol onDark={onDark} />
    <span className={cn('text-[15px] font-medium tracking-[-0.01em]', onDark ? 'text-white' : 'text-ink')}>
      Aperta o <span className={cn('font-bold tracking-[0.02em]', onDark ? 'text-brand-on-dark' : 'text-brand-strong')}>PLEI</span>
    </span>
  </span>
);
