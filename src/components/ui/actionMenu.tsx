import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { MoreIcon } from './icons';

export interface ActionMenuItem {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
}

const MENU_ITEM = 'flex h-8 w-full items-center rounded-[5px] px-2.5 text-left text-sm whitespace-nowrap';

/**
 * Menu de ações de um item: kebab de 32px, nunca a palavra "Ações" solta.
 * O menu abre num portal para não ser cortado por tabelas com rolagem horizontal.
 */
export const ActionMenu = ({ label, items }: { label: string; items: ActionMenuItem[] }) => {
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const open = position !== null;
  const close = () => setPosition(null);

  const toggle = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    setPosition(open || !rect ? null : { top: rect.bottom + 4, right: window.innerWidth - rect.right });
  };

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) close();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        buttonRef.current?.focus();
      }
    };
    // A posição é fixa na tela: rolar ou redimensionar deixaria o menu solto.
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
  }, [open]);

  if (items.length === 0) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          'flex size-8 items-center justify-center rounded-md text-ink-2 transition-colors duration-150 hover:bg-fill hover:text-ink',
          open && 'bg-fill text-ink',
        )}
      >
        <MoreIcon size={18} />
      </button>
      {position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={label}
            style={{ top: position.top, right: position.right }}
            className="fixed z-50 min-w-[200px] rounded-md bg-surface p-1 shadow-popover animate-fade-in"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  item.onSelect();
                }}
                className={cn(
                  MENU_ITEM,
                  item.destructive ? 'text-critical hover:bg-critical-soft focus-visible:bg-critical-soft' : 'hover:bg-accent hover:text-white focus-visible:bg-accent focus-visible:text-white',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};
