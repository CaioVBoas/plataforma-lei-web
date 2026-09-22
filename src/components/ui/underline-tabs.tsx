import { cn } from '@/utils/cn';

export interface TabItem<Value extends string> {
  value: Value;
  label: string;
  count?: number;
}

interface UnderlineTabsProps<Value extends string> {
  items: TabItem<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  label: string;
  className?: string;
}

export const UnderlineTabs = <Value extends string>({ items, value, onChange, label, className }: UnderlineTabsProps<Value>) => (
  <div role="tablist" aria-label={label} className={cn('flex flex-wrap items-center border-b border-n-200', className)}>
    {items.map((item) => {
      const active = item.value === value;
      return (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(item.value)}
          className={cn(
            'mr-[22px] flex h-10 items-center gap-1.5 border-b-2 px-0.5 text-sm transition-colors',
            active ? 'border-azul-500 font-bold text-azul-800' : 'border-transparent text-n-700 hover:text-n-900',
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className={cn('text-xs font-normal tabular-nums', active ? 'text-n-600' : 'text-n-400')}>{item.count}</span>
          )}
        </button>
      );
    })}
  </div>
);
