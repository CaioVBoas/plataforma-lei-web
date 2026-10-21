import type { ReactNode } from 'react';
import { Mascot } from './mascot';

interface MascotInviteProps {
  title: string;
  text: string;
  /** A ação do convite, uma só: o botão que leva ao Match Maker. */
  action: ReactNode;
}

/**
 * O convite do caranguejo: ele chama a pessoa para apertar o play, com os anéis
 * saindo do botão do desenho. É um bloco de fato (branco, com borda), não uma cor
 * cheia: o convite aparece sempre que a pessoa entra, então não pode gritar.
 */
export const MascotInvite = ({ title, text, action }: MascotInviteProps) => (
  <section aria-label={title} className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-5 rounded-lg border border-fact-line bg-fact px-6 py-6 sm:px-8">
    <Mascot tone="vermelho" variant="calling" size="lg" className="mx-1" />
    <div className="min-w-0 flex-[1_1_300px]">
      <h2 className="text-h3">{title}</h2>
      <p className="mt-1.5 max-w-[56ch] text-body text-ink-2">{text}</p>
    </div>
    <div className="shrink-0">{action}</div>
  </section>
);
