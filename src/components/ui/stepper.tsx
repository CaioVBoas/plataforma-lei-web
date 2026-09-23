import { MinusIcon, PlusIcon } from './icons';

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

const STEP_BUTTON = 'flex size-8 items-center justify-center rounded-[5px] text-ink hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent';

export const Stepper = ({ label, value, min, max, onChange, formatValue = String }: StepperProps) => (
  <div role="group" aria-label={label} className="inline-flex items-center gap-1 rounded-md bg-fill p-0.5">
    <button type="button" aria-label={`Diminuir ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={STEP_BUTTON}>
      <MinusIcon size={14} />
    </button>
    <output aria-live="polite" className="min-w-[88px] text-center text-sm font-medium tabular-nums">
      {formatValue(value)}
    </output>
    <button type="button" aria-label={`Aumentar ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className={STEP_BUTTON}>
      <PlusIcon size={14} />
    </button>
  </div>
);
