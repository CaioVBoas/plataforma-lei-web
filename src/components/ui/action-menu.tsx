import { usePopover } from '@/hooks/use-popover';
import { cn } from '@/utils/cn';

export interface ActionMenuItem {
  label: string;
  onSelect: () => void;
  subdued?: boolean;
}

/** Menu "Ações" discreto, para operações secundárias sobre um item de lista. */
export const ActionMenu = ({ items, label }: { items: ActionMenuItem[]; label: string }) => {
  const { open, toggle, close, containerRef } = usePopover();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={toggle}
        className={cn('text-sm font-medium', open ? 'text-azul-500' : 'text-n-600 hover:text-n-800')}
      >
        Ações
      </button>
      {open && (
        <div role="menu" className="absolute top-10 right-0 z-40 w-[268px] rounded-lg border border-n-200 bg-n-0 p-1.5 shadow-popover animate-painel-entra">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                item.onSelect();
              }}
              className={cn('w-full rounded-lg px-2.5 py-[9px] text-left text-[13px] hover:bg-n-50', item.subdued ? 'text-n-500' : 'text-n-700')}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
