import { cn } from '@/utils/cn';

interface SegmentedOption<Value extends string> {
  value: Value;
  label: string;
  count?: number;
}

interface SegmentedControlProps<Value extends string> {
  label: string;
  value: Value;
  options: SegmentedOption<Value>[];
  onChange: (value: Value) => void;
}

/** Alternância entre visões da mesma lista, como o controle segmentado do sistema. */
export const SegmentedControl = <Value extends string>({ label, value, options, onChange }: SegmentedControlProps<Value>) => (
  <div role="radiogroup" aria-label={label} className="inline-flex rounded-md bg-fill p-0.5">
    {options.map((option) => {
      const selected = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex h-7 items-center gap-1.5 rounded-[5px] px-3 text-[13px] transition-colors duration-150',
            selected ? 'bg-surface font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_0_0.5px_rgba(0,0,0,0.06)]' : 'text-ink-2 hover:text-ink',
          )}
        >
          {option.label}
          {option.count !== undefined && <span className="text-ink-3 tabular-nums">{option.count}</span>}
        </button>
      );
    })}
  </div>
);
