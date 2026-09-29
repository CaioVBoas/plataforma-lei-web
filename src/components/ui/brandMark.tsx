import horizontalOnDark from '@/assets/brand/horizontal/branco.svg';
import horizontal from '@/assets/brand/horizontal/principal.svg';
import symbol from '@/assets/brand/simbolo/petroleo-600.svg';
import { cn } from '@/utils/cn';

interface BrandMarkProps {
  /** Versão branca, para o painel petróleo da tela de entrada. */
  onDark?: boolean;
  className?: string;
}

/**
 * Logotipo horizontal do PLEI: o mascote com o botão de play e o
 * nome. Vem dos arquivos oficiais em `src/assets/brand`; não redesenhar aqui.
 */
export const BrandMark = ({ onDark = false, className }: BrandMarkProps) => (
  <img src={onDark ? horizontalOnDark : horizontal} alt="PLEI" width={80} height={32} className={cn('h-8 w-auto self-start', className)} />
);

/** Só o símbolo, para a barra lateral recolhida. */
export const BrandSymbol = ({ className }: { className?: string }) => (
  <img src={symbol} alt="PLEI" width={32} height={32} className={cn('size-8', className)} />
);
