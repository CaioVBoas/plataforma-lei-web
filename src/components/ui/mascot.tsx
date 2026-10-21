import type { CSSProperties } from 'react';
import branco from '@/assets/brand/simbolo/plei-simbolo-branco.svg';
import grafite from '@/assets/brand/simbolo/plei-simbolo-grafite.svg';
import vermelho from '@/assets/brand/simbolo/plei-simbolo-vermelho.svg';
import { cn } from '@/utils/cn';

export type MascotTone = 'vermelho' | 'grafite' | 'branco';
export type MascotPose = 'idle' | 'walk' | 'think' | 'cheer';
export type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'fluid';

/**
 * Os momentos em que o caranguejo aparece. O personagem é sempre o arquivo
 * oficial de `assets/brand/simbolo`; cada variação só muda a pose e põe um
 * acessório simples por cima (anéis no botão de play, lupa, selo, reticências).
 */
export type MascotVariant = 'default' | 'calling' | 'searching' | 'found' | 'empty' | 'error' | 'celebrating';

/** O mascote é sempre o arquivo oficial de `assets/brand/simbolo`: só a versão de cor troca. */
const SOURCES: Record<MascotTone, { light: string; dark: string }> = {
  // O vermelho serve nos dois modos. O grafite some no fundo escuro, então lá entra o branco.
  vermelho: { light: vermelho, dark: vermelho },
  grafite: { light: grafite, dark: branco },
  branco: { light: branco, dark: branco },
};

const SIZE_CLASSES: Record<MascotSize, string> = {
  xs: 'w-7',
  sm: 'w-[72px]',
  md: 'w-[84px] sm:w-[104px]',
  lg: 'w-[132px]',
  fluid: 'w-full',
};

const POSE_CLASSES: Record<MascotPose, string> = {
  idle: 'motion-safe:animate-mascot-idle',
  walk: 'motion-safe:animate-mascot-walk',
  think: 'motion-safe:animate-mascot-think',
  cheer: 'motion-safe:animate-mascot-cheer',
};

/** Cada variação tem a pose que combina com o momento. A pose passada por quem usa vale mais. */
const VARIANT_POSE: Record<MascotVariant, MascotPose> = {
  default: 'idle',
  calling: 'idle',
  searching: 'walk',
  found: 'idle',
  empty: 'think',
  error: 'think',
  celebrating: 'cheer',
};

/** Cor dos acessórios quando a pessoa não escolhe outra: ficam legíveis sobre fundo claro. */
const OVERLAY_COLORS: Record<MascotVariant, string> = {
  default: '',
  calling: 'text-accent',
  searching: 'text-ink',
  found: 'text-positive',
  empty: 'text-ink-3',
  error: 'text-caution',
  celebrating: 'text-accent',
};

const SPOT = 'origin-center [transform-box:fill-box]';

/**
 * Acessórios no mesmo espaço do desenho (311 por 191), para acompanhar o
 * caranguejo em qualquer tamanho. O botão de play fica em cima, à direita.
 */
const Overlay = ({ variant }: { variant: MascotVariant }) => {
  switch (variant) {
    case 'calling':
      // Anéis saindo do botão de play: "aperte aqui".
      return (
        <>
          <circle cx="262" cy="46" r="38" fill="none" stroke="currentColor" strokeWidth="5" className={cn(SPOT, 'motion-safe:animate-ring-pulse')} />
          <circle cx="262" cy="46" r="38" fill="none" stroke="currentColor" strokeWidth="5" className={cn(SPOT, 'motion-safe:animate-ring-pulse')} style={{ animationDelay: '1s' }} />
        </>
      );
    case 'searching':
      return (
        <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
          <circle cx="38" cy="34" r="22" />
          <path d="M54 50 L72 68" />
        </g>
      );
    case 'found':
    case 'error':
      return (
        <g>
          <circle cx="268" cy="142" r="24" fill="currentColor" />
          {variant === 'found' ? (
            <path d="M257 142 L265 150 L280 134" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <g stroke="white" strokeWidth="7" strokeLinecap="round">
              <path d="M268 130 V146" />
              <path d="M268 156 V156.5" />
            </g>
          )}
        </g>
      );
    case 'empty':
      // Reticências: o caranguejo espera algo chegar.
      return (
        <g fill="currentColor">
          {[22, 46, 70].map((cx, index) => (
            <circle key={cx} cx={cx} cy="26" r="6" className="motion-safe:animate-dots-blink" style={{ animationDelay: `${index * 200}ms` }} />
          ))}
        </g>
      );
    case 'celebrating':
      // Confete na cor dos acessórios, em duas intensidades: serve no claro e sobre a cor cheia.
      return (
        <g fill="currentColor">
          {[
            { x: 24, y: 24, o: 1 },
            { x: 80, y: 6, o: 0.55 },
            { x: 150, y: 14, o: 1 },
            { x: 212, y: 2, o: 0.55 },
            { x: 296, y: 20, o: 1 },
            { x: 8, y: 96, o: 0.55 },
          ].map((piece, index) => (
            <rect key={index} x={piece.x} y={piece.y} width="10" height="10" rx="2" fillOpacity={piece.o} className={cn(SPOT, 'motion-safe:animate-sparkle')} style={{ animationDelay: `${index * 260}ms` }} />
          ))}
        </g>
      );
    default:
      return null;
  }
};

interface MascotProps {
  tone: MascotTone;
  variant?: MascotVariant;
  pose?: MascotPose;
  size?: MascotSize;
  /** Cada número novo repete o pulo uma vez: reserva feita, turma escolhida. */
  burst?: number;
  /** Cor dos acessórios, para fundo escuro ou cor cheia. */
  overlayClassName?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * O caranguejo do PLEI como personagem. A cor muda em fade junto com o palco
 * (as três versões ficam empilhadas) e a pose é só movimento, sem redesenhar a marca.
 * Decorativo: quem usa diz o que está acontecendo no texto ao lado.
 */
export const Mascot = ({ tone, variant = 'default', pose, size = 'md', burst = 0, overlayClassName, className, style }: MascotProps) => (
  <span aria-hidden="true" className={cn('inline-block shrink-0', className)} style={style}>
    {/* A chave no pulo reinicia a animação a cada reserva ou escolha. */}
    <span key={burst} className={cn('block origin-bottom', burst > 0 && 'motion-safe:animate-mascot-hop')}>
      <span className={cn('relative block origin-bottom aspect-[311/191]', SIZE_CLASSES[size], POSE_CLASSES[pose ?? VARIANT_POSE[variant]])}>
        {(Object.keys(SOURCES) as MascotTone[]).map((candidate) => {
          const visible = candidate === tone;
          const sources = SOURCES[candidate];
          const hasDark = sources.light !== sources.dark;
          return (
            <span key={candidate} className={cn('absolute inset-0 transition-opacity duration-500', visible ? 'opacity-100' : 'opacity-0')}>
              <img src={sources.light} alt="" className={cn('size-full', hasDark && 'dark:hidden')} />
              {hasDark && <img src={sources.dark} alt="" className="hidden size-full dark:block" />}
            </span>
          );
        })}
        {variant !== 'default' && (
          <svg viewBox="0 0 311 191" className={cn('pointer-events-none absolute inset-0 size-full overflow-visible', overlayClassName ?? OVERLAY_COLORS[variant])}>
            <Overlay variant={variant} />
          </svg>
        )}
      </span>
    </span>
  </span>
);
