import horizontalOnPhoto from '@/assets/brand/logo/plei-horizontal-branco.svg';
import horizontalOnDark from '@/assets/brand/logo/plei-horizontal-escuro.svg';
import horizontal from '@/assets/brand/logo/plei-horizontal-principal.svg';
import symbol from '@/assets/brand/simbolo/plei-simbolo-vermelho.svg';
import { cn } from '@/utils/cn';

interface BrandMarkProps {
  /** Versão branca, para fotos escuras e fundos vermelhos. */
  onDark?: boolean;
  className?: string;
}

const LOGO = 'h-9 w-auto self-start';

/**
 * Logotipo horizontal do PLEI: o caranguejo com o botão de play e o letreiro.
 * Vem dos arquivos oficiais em `src/assets/brand`; não redesenhar aqui. A
 * altura de 36px mantém o mínimo de 120px de largura pedido pela marca.
 */
export const BrandMark = ({ onDark = false, className }: BrandMarkProps) =>
  onDark ? (
    <img src={horizontalOnPhoto} alt="PLEI" width={126} height={36} className={cn(LOGO, className)} />
  ) : (
    // No modo escuro entra a versão "escuro" da marca: caranguejo vermelho e letreiro branco.
    <>
      <img src={horizontal} alt="PLEI" width={126} height={36} className={cn(LOGO, 'dark:hidden', className)} />
      <img src={horizontalOnDark} alt="PLEI" width={126} height={36} className={cn(LOGO, 'hidden dark:block', className)} />
    </>
  );

/** Só o caranguejo, para a barra lateral recolhida e o topo no celular. O vermelho serve nos dois modos. */
export const BrandSymbol = ({ className }: { className?: string }) => (
  <img src={symbol} alt="PLEI" width={32} height={20} className={cn('h-auto w-8', className)} />
);
