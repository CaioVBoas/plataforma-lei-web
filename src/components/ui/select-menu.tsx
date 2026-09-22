import { useId } from 'react';
import { usePopover } from '@/hooks/use-popover';
import { cn } from '@/utils/cn';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

export interface SelectOption<Value extends string> {
  value: Value;
  label: string;
  count?: number;
}

interface SelectMenuProps<Value extends string> {
  options: SelectOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  label: string;
  /** Valor considerado "sem filtro": qualquer outro deixa o botão destacado. */
  neutralValue?: Value;
  shape?: 'pill' | 'field';
  menuWidth?: number;
}

/** Filtro em forma de botão que abre uma lista de opções com contagem ao lado. */
export const SelectMenu = <Value extends string>({
  options,
  value,
  onChange,
  label,
  neutralValue,
  shape = 'pill',
  menuWidth = 244,
}: SelectMenuProps<Value>) => {
  const { open, toggle, close, containerRef } = usePopover();
  const listId = useId();

  const current = options.find((option) => option.value === value) ?? options[0];
  const highlighted = open || (neutralValue !== undefined && value !== neutralValue);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={`${label}: ${current.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={toggle}
        className={cn(
          'flex h-10 items-center gap-2 border px-3.5 text-sm font-medium transition-colors',
          shape === 'pill' ? 'rounded-full' : 'rounded-lg',
          highlighted ? 'border-azul-500 bg-azul-50 text-azul-800' : 'border-n-300 bg-n-0 text-n-700 hover:bg-n-50',
        )}
      >
        {current.label}
        {open ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />}
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          style={{ width: menuWidth }}
          className="absolute top-[46px] left-0 z-40 rounded-lg border border-n-200 bg-n-0 p-1.5 shadow-popover animate-painel-entra"
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option.value);
                    close();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-left text-sm',
                    selected ? 'bg-azul-50 font-medium text-azul-800' : 'text-n-700 hover:bg-n-50',
                  )}
                >
                  <span className="min-w-0 flex-1">{option.label}</span>
                  {option.count !== undefined && <span className="text-[13px] text-n-400 tabular-nums">{option.count}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
