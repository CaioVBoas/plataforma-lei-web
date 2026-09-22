import { cn } from '@/utils/cn';

interface SegmentedControlProps<Value extends string> {
  options: { value: Value; label: string }[];
  value: Value;
  onChange: (value: Value) => void;
  label: string;
}

export const SegmentedControl = <Value extends string>({ options, value, onChange, label }: SegmentedControlProps<Value>) => (
  <div role="radiogroup" aria-label={label} className="flex gap-1.5">
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
            'h-11 flex-1 rounded-lg border px-1.5 text-[13px] font-medium transition-colors',
            selected ? 'border-azul-500 bg-azul-50 text-azul-800' : 'border-n-300 bg-n-0 text-n-700 hover:bg-n-50',
          )}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);
