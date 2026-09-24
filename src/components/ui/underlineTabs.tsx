import { cn } from '@/utils/cn';

interface TabOption<Value extends string> {
  value: Value;
  label: string;
  count?: number;
}

interface UnderlineTabsProps<Value extends string> {
  label: string;
  value: Value;
  options: TabOption<Value>[];
  onChange: (value: Value) => void;
  className?: string;
}

/** Abas sublinhadas: o mesmo controle para trocar de recorte em Projetos e Disciplinas. */
export const UnderlineTabs = <Value extends string>({ label, value, options, onChange, className }: UnderlineTabsProps<Value>) => (
  <div role="tablist" aria-label={label} className={cn('flex gap-6 border-b border-line', className)}>
    {options.map((option) => {
      const selected = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={selected}
          onClick={() => onChange(option.value)}
          className={cn(
            '-mb-px flex h-10 items-center gap-1.5 border-b-2 text-sm transition-colors duration-150',
            selected ? 'border-ink font-medium text-ink' : 'border-transparent text-ink-2 hover:text-ink',
          )}
        >
          {option.label}
          {option.count !== undefined && <span className="text-ink-3 tabular-nums">{option.count}</span>}
        </button>
      );
    })}
  </div>
);
