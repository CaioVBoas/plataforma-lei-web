import { cn } from '@/utils/cn';
import { CheckIcon } from './icons';

interface ChoiceChipsProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

/** Várias escolhas numa lista curta, como competências: o marcado fica azul com o check. */
export const ChoiceChips = ({ label, options, value, onChange }: ChoiceChipsProps) => {
  const toggle = (option: string) => onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(option)}
            className={cn(
              'inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-[13px] transition-colors duration-100',
              selected ? 'border-accent bg-accent-soft text-accent' : 'border-line-strong bg-surface text-ink-2 hover:border-ink-3',
            )}
          >
            {selected && <CheckIcon size={13} />}
            {option}
          </button>
        );
      })}
    </div>
  );
};
