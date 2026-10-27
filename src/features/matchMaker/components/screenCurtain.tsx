import { Mascot } from './mascot';

interface ScreenCurtainProps {
  demandTitle: string;
  disciplineName: string;
}

/**
 * A cor toma a tela quando a demanda vira projeto: o petróleo abre do centro
 * e o mascote anda enquanto o projeto é aberto. Dura pouco e só existe nesse
 * momento; com menos movimento pedido, aparece direto, sem a abertura.
 */
export const ScreenCurtain = ({ demandTitle, disciplineName }: ScreenCurtainProps) => (
  <div role="status" className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-brand px-6 text-center text-white motion-safe:animate-curtain-in">
    <Mascot tone="branco" pose="walk" size="lg" />
    <p className="mt-8 text-h2">Projeto criado</p>
    <p className="mt-2 max-w-md text-body text-brand-100">
      Levando {demandTitle} para {disciplineName}. O plano abre em seguida.
    </p>
  </div>
);
