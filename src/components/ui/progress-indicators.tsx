import { cn } from '@/utils/cn';

interface AffinityMeterProps {
  percent: number;
  label: string;
  className?: string;
}

/**
 * Termômetro de afinidade. O gradiente é desenhado sobre a largura total da
 * trilha, então 84% termina perto do laranja e 40% continua azul.
 */
export const AffinityMeter = ({ percent, label, className }: AffinityMeterProps) => (
  <div
    role="meter"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={percent}
    aria-valuetext={`${percent}% de compatibilidade com ${label}`}
    className={cn('h-2 flex-1 overflow-hidden rounded-full bg-n-200', className)}
  >
    <div className="h-full overflow-hidden rounded-full" style={{ width: `${percent}%` }}>
      <div
        className="h-full bg-linear-to-r from-azul-400 to-laranja-500"
        style={{ width: percent > 0 ? `${(100 / percent) * 100}%` : 0 }}
      />
    </div>
  </div>
);

interface ProgressBarProps {
  percent: number;
  label: string;
  thickness?: 2 | 3 | 4;
  className?: string;
}

export const ProgressBar = ({ percent, label, thickness = 3, className }: ProgressBarProps) => (
  <div
    role="progressbar"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(percent)}
    style={{ height: thickness }}
    className={cn('w-full overflow-hidden rounded-full bg-n-200', className)}
  >
    <div
      className="h-full rounded-full bg-azul-500 transition-[width] duration-[420ms] ease-suave"
      style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
    />
  </div>
);

interface StepDotsProps {
  current: number;
  total: number;
  /** Complemento do rótulo, ex.: ", cerca de 2 minutos". */
  suffix?: string;
}

export const StepDots = ({ current, total, suffix = '' }: StepDotsProps) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }, (_, index) => (
      <span key={index} aria-hidden="true" className={cn('size-2 rounded-full', index < current ? 'bg-azul-500' : 'bg-n-300')} />
    ))}
    <span className="ml-1 text-xs text-n-500">
      Etapa {current} de {total}
      {suffix}
    </span>
  </div>
);
