import { cn } from '@/utils/cn';
import { MinusIcon, PlusIcon } from './icons';

interface NumberStepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** Texto exibido no lugar do número, ex.: "2 equipes". */
  formatValue: (value: number) => string;
  label: string;
  className?: string;
}

const STEP_BUTTON = 'flex size-[34px] items-center justify-center rounded-lg border border-n-200 bg-n-0 text-n-600 disabled:opacity-40';

export const NumberStepper = ({ value, min, max, onChange, formatValue, label, className }: NumberStepperProps) => (
  <div
    role="group"
    aria-label={label}
    className={cn('flex h-12 items-center justify-between rounded-lg border border-n-300 bg-n-0 pr-1.5 pl-3.5', className)}
  >
    <span aria-live="polite" className="text-[15px] text-n-800 tabular-nums">
      {formatValue(value)}
    </span>
    <span className="flex gap-1">
      <button type="button" aria-label="Diminuir" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={STEP_BUTTON}>
        <MinusIcon size={12} />
      </button>
      <button type="button" aria-label="Aumentar" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={STEP_BUTTON}>
        <PlusIcon size={12} />
      </button>
    </span>
  </div>
);
