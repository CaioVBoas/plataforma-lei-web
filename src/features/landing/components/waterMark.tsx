import symbol from '@/assets/brand/simbolo/plei-simbolo-vermelho.svg';
import { cn } from '@/utils/cn';

/** Linhas de água: uma onda a cada 80 unidades, larga o bastante para correr sem mostrar a ponta. */
const WAVE = Array.from({ length: 10 }, () => 'q 20 -7 40 0 t 40 0').join(' ');
const LINES = Array.from({ length: 10 }, (_, index) => 222 + index * 15);

/**
 * O emblema de água da marca (src/assets/brand/agua) com a água correndo:
 * o caranguejo vermelho com a metade de baixo "dentro do rio", que o véu
 * branco deixa no vermelho claro da marca, e as ondas em cinza.
 * A água corre devagar e para quando a pessoa pede menos movimento.
 */
export const WaterMark = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn('relative mx-auto aspect-square w-full max-w-[440px]', className)}>
    <img src={symbol} alt="" className="absolute top-[24.5%] left-[15.4%] w-[69.2%]" />
    <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
      <defs>
        <clipPath id="meia-lua">
          <path d="M20 210 A180 180 0 0 0 380 210 Z" />
        </clipPath>
      </defs>
      <path d="M20 210 A180 180 0 0 0 380 210 Z" className="fill-surface" fillOpacity={0.65} />
      <g clipPath="url(#meia-lua)">
        <g className="motion-safe:animate-water">
          {LINES.map((y, index) => (
            <path
              key={y}
              d={`M -80 ${y} ${WAVE}`}
              fill="none"
              strokeWidth={1.4}
              strokeLinecap="round"
              className={index % 2 === 0 ? 'stroke-brand-300' : 'stroke-brand-200'}
            />
          ))}
        </g>
      </g>
      <path d="M20 210 A180 180 0 0 0 380 210" fill="none" strokeWidth={1.4} className="stroke-cin-water" />
      <path d="M20 210 H380" fill="none" strokeWidth={1.4} className="stroke-cin" />
    </svg>
  </div>
);
