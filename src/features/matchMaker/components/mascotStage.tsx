import { cn } from '@/utils/cn';
import { Mascot, type MascotPose, type MascotTone } from './mascot';

/**
 * A cor do palco conta o momento, com os mesmos papéis do resto do portal:
 * grafite é onde estou (a busca), vermelho é a marca e a ação (uma sugestão
 * escolhida) e o âmbar é só a reserva.
 */
export type StageTone = 'identity' | 'working' | 'action' | 'reserve';

export interface StageState {
  tone: StageTone;
  pose: MascotPose;
  title: string;
  text: string;
}

const TONES: Record<StageTone, { surface: string; mascot: MascotTone }> = {
  identity: { surface: 'border-fact-line bg-brand-50', mascot: 'vermelho' },
  // Grafite cheio só enquanto o Match Maker trabalha: dura poucos segundos e some. É o caranguejo vermelho sobre grafite do logo "escuro".
  working: { surface: 'border-brand bg-brand', mascot: 'vermelho' },
  action: { surface: 'border-accent/30 bg-accent-soft', mascot: 'vermelho' },
  reserve: { surface: 'border-reserve-dot/40 bg-reserve-soft', mascot: 'grafite' },
};

/** Ondas de 80 unidades, longas o bastante para correr sem mostrar a ponta (o mesmo desenho do portal público). */
const WAVE = Array.from({ length: 40 }, () => 'q 20 -7 40 0 t 40 0').join(' ');

const Water = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-9 overflow-hidden">
    <svg width="3200" height="36" className="motion-safe:animate-water">
      <path d={`M 0 14 ${WAVE}`} fill="none" strokeWidth={1.4} strokeLinecap="round" className="stroke-brand-300" />
      <path d={`M 0 26 ${WAVE}`} fill="none" strokeWidth={1.4} strokeLinecap="round" className="stroke-brand-400" />
    </svg>
  </div>
);

interface MascotStageProps {
  stage: StageState;
  /** Número que sobe a cada gesto (escolher turma, reservar) e faz o mascote pular. */
  burst: number;
}

/**
 * O palco do Match Maker: o mascote e o balão com o que está acontecendo.
 * Fica em cima das três etapas, então a cor muda em transição em vez de piscar
 * a cada tela. O balão é branco com borda, como as mensagens do portal, e o
 * texto dele nunca depende da cor do palco (contraste AA).
 */
export const MascotStage = ({ stage, burst }: MascotStageProps) => {
  const tone = TONES[stage.tone];
  return (
    <section
      aria-label="Match Maker"
      className={cn('relative overflow-hidden rounded-lg border transition-colors duration-500 ease-standard', tone.surface)}
    >
      <div className={cn('flex items-center gap-5 px-5 py-6 sm:gap-8 sm:px-8 sm:py-8', stage.tone === 'working' && 'pb-12')}>
        <Mascot tone={tone.mascot} pose={stage.pose} burst={burst} />
        {/* A chave no texto repete a entrada a cada mensagem nova. */}
        <div key={`${stage.title}|${stage.text}`} role="status" className="relative min-w-0 flex-1 animate-rise-in rounded-lg border border-line bg-surface px-5 py-4">
          <span aria-hidden="true" className="absolute top-1/2 -left-1.5 hidden size-3 -translate-y-1/2 rotate-45 border-b border-l border-line bg-surface sm:block" />
          <p className="text-h4 text-ink">{stage.title}</p>
          <p className="mt-1 text-small text-ink-2">{stage.text}</p>
        </div>
      </div>
      {stage.tone === 'working' && <Water />}
    </section>
  );
};
