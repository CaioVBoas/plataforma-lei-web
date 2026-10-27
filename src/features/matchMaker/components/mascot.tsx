import petroleo from '@/assets/brand/simbolo/petroleo-600.svg';
import petroleoOnDark from '@/assets/brand/simbolo/petroleo-on-dark.svg';
import azul from '@/assets/brand/simbolo/azul-600.svg';
import azulOnDark from '@/assets/brand/simbolo/azul-on-dark.svg';
import branco from '@/assets/brand/simbolo/branco.svg';
import { cn } from '@/utils/cn';

export type MascotTone = 'petroleo' | 'azul' | 'branco';
export type MascotPose = 'idle' | 'walk' | 'think';
export type MascotSize = 'xs' | 'md' | 'lg';

/** O mascote é sempre o arquivo oficial de `assets/brand/simbolo`: só a versão de cor troca. */
const SOURCES: Record<MascotTone, { light: string; dark: string }> = {
  petroleo: { light: petroleo, dark: petroleoOnDark },
  azul: { light: azul, dark: azulOnDark },
  branco: { light: branco, dark: branco },
};

const SIZE_CLASSES: Record<MascotSize, string> = {
  xs: 'w-7',
  md: 'w-[84px] sm:w-[104px]',
  lg: 'w-[132px]',
};

const POSE_CLASSES: Record<MascotPose, string> = {
  idle: 'motion-safe:animate-mascot-idle',
  walk: 'motion-safe:animate-mascot-walk',
  think: 'motion-safe:animate-mascot-think',
};

interface MascotProps {
  tone: MascotTone;
  pose?: MascotPose;
  size?: MascotSize;
  /** Cada número novo repete o pulo uma vez: reserva feita, turma escolhida. */
  burst?: number;
  className?: string;
}

/**
 * O caranguejo do PLEI como personagem. A cor muda em fade junto com o palco
 * (as três versões ficam empilhadas) e a pose é só movimento, sem redesenhar a marca.
 */
export const Mascot = ({ tone, pose = 'idle', size = 'md', burst = 0, className }: MascotProps) => (
  <span aria-hidden="true" className={cn('inline-block shrink-0', className)}>
    {/* A chave no pulo reinicia a animação a cada reserva ou escolha. */}
    <span key={burst} className={cn('block origin-bottom', burst > 0 && 'motion-safe:animate-mascot-hop')}>
      <span className={cn('relative block origin-bottom aspect-[23.4/18.6]', SIZE_CLASSES[size], POSE_CLASSES[pose])}>
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
      </span>
    </span>
  </span>
);
