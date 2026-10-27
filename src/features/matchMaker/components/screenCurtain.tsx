import { Mascot } from '@/components/ui/mascot';

interface ScreenCurtainProps {
  demandTitle: string;
  disciplineName: string;
}

/**
 * A cor toma a tela quando a demanda vira projeto: o vermelho da marca abre do centro
 * e o mascote anda enquanto o projeto é aberto. Dura pouco e só existe nesse
 * momento; com menos movimento pedido, aparece direto, sem a abertura.
 */
export const ScreenCurtain = ({ demandTitle, disciplineName }: ScreenCurtainProps) => (
  <div role="status" className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-accent px-6 text-center text-white motion-safe:animate-curtain-in">
    <Mascot tone="branco" variant="celebrating" size="lg" overlayClassName="text-white" />
    <p className="mt-8 text-h2">Projeto criado</p>
    <p className="mt-2 max-w-md text-body text-white/90">
      Levando {demandTitle} para {disciplineName}. O plano abre em seguida.
    </p>
  </div>
);
