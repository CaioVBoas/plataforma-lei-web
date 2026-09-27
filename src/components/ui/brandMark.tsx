import horizontalOnDark from '@/assets/brand/horizontal/branco.svg';
import horizontal from '@/assets/brand/horizontal/principal.svg';
import { cn } from '@/utils/cn';

interface BrandMarkProps {
  /** Versão branca, para o painel petróleo da tela de entrada. */
  onDark?: boolean;
  className?: string;
}

/**
 * Logotipo horizontal do Aperta o PL.E.I.: o mascote com o botão de play e o
 * nome. Vem dos arquivos oficiais em `src/assets/brand`; não redesenhar aqui.
 */
export const BrandMark = ({ onDark = false, className }: BrandMarkProps) => (
  <img src={onDark ? horizontalOnDark : horizontal} alt="Aperta o PL.E.I." width={168} height={32} className={cn('h-8 w-auto self-start', className)} />
);
