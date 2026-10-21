import { Mascot, type MascotPose, type MascotTone, type MascotVariant } from '@/components/ui/mascot';
import { cn } from '@/utils/cn';

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
  /** Qual variação do mascote aparece; sem isso, o caranguejo padrão. */
  variant?: MascotVariant;
  /** Só na busca: de 0 a 1, onde o caranguejo está na faixa de água. Sem isso, ele patrulha a faixa. */
  progress?: number;
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

/** Altura do caranguejo: a largura dividida pela proporção do desenho (311 por 191). */
const MASCOT_H = 'calc(var(--mw) * 0.614)';

interface MascotStageProps {
  stage: StageState;
  /** Número que sobe a cada gesto (escolher turma, reservar) e faz o mascote pular. */
  burst: number;
}

/**
 * O palco do Match Maker: o mascote e o balão com o que está acontecendo.
 * Fica em cima das três etapas, então a cor muda em transição em vez de piscar
 * a cada tela. Na busca o caranguejo sai do canto e anda pela água, mais longe a
 * cada passo, e na volta para as sugestões ele atravessa de novo até o canto. O
 * balão é branco com borda, como as mensagens do portal, e o texto dele nunca
 * depende da cor do palco (contraste AA).
 */
export const MascotStage = ({ stage, burst }: MascotStageProps) => {
  const tone = TONES[stage.tone];
  const working = stage.tone === 'working';
  const placed = working && stage.progress !== undefined;
  const left = placed ? `calc(var(--pad) + (100% - var(--mw) - 2 * var(--pad)) * ${stage.progress})` : 'var(--pad)';

  return (
    <section
      aria-label="Match Maker"
      className={cn(
        'relative min-h-[132px] overflow-hidden rounded-lg border [--mw:84px] [--pad:20px] sm:[--mw:104px] sm:[--pad:32px]',
        'transition-[background-color,border-color] duration-500 ease-standard',
        tone.surface,
      )}
    >
      <div
        className={cn(
          'px-5 pt-6 transition-[padding] duration-700 ease-in-out sm:px-8 sm:pt-8',
          working ? 'pb-28' : 'pb-6 sm:pb-8',
        )}
        // Fora da busca o balão sai de baixo do caranguejo. Inline porque o recuo lateral das telas largas (sm:px-8) venceria uma classe.
        style={working ? undefined : { paddingLeft: 'calc(var(--pad) + var(--mw) + 1.5rem)' }}
      >
        {/* A chave no texto repete a entrada a cada mensagem nova. */}
        <div key={`${stage.title}|${stage.text}`} role="status" className="relative min-w-0 animate-rise-in rounded-lg border border-line bg-surface px-5 py-4">
          {!working && <span aria-hidden="true" className="absolute top-1/2 -left-1.5 size-3 -translate-y-1/2 rotate-45 border-b border-l border-line bg-surface" />}
          <p className="text-h4 text-ink">{stage.title}</p>
          <p className="mt-1 text-small text-ink-2">{stage.text}</p>
        </div>
      </div>
      {working && <Water />}
      {/* Um só caranguejo para as três etapas: o canto, a faixa de água e o canto de novo são deslocamentos dele. */}
      <div
        className={cn('absolute w-(--mw) transition-[top,left] duration-700 ease-in-out', working && !placed && 'motion-safe:animate-mascot-patrol')}
        style={{ top: working ? `calc(100% - ${MASCOT_H} - 10px)` : `calc(50% - ${MASCOT_H} / 2)`, ...(working && !placed ? {} : { left }) }}
      >
        <Mascot
          tone={tone.mascot}
          variant={stage.variant}
          pose={stage.pose}
          size="fluid"
          burst={burst}
          overlayClassName={working ? 'text-white' : undefined}
          className="motion-safe:animate-mascot-enter"
        />
      </div>
    </section>
  );
};
