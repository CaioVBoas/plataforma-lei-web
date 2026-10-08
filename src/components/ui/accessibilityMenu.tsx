import { usePopover } from '@/hooks/usePopover';
import { cn } from '@/utils/cn';
import { AccessibilityPanel } from './accessibilityPanel';
import { AccessibilityIcon } from './icons';

/** O botão "Acessibilidade" da barra de cima: sempre à vista, abre o painel de leitura. */
export const AccessibilityMenu = () => {
  const { open, toggle, containerRef } = usePopover();
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Acessibilidade: tamanho do texto, zoom e botões maiores"
        onClick={toggle}
        className={cn('flex h-10 items-center gap-2 rounded-md px-2.5 text-sm font-medium text-ink-2 hover:bg-fill hover:text-ink', open && 'bg-fill text-ink')}
      >
        <AccessibilityIcon size={22} />
        <span className="top-label hidden xl:inline">Acessibilidade</span>
      </button>
      {open && (
        <div role="dialog" aria-label="Acessibilidade" className="fixed inset-x-3 top-16 z-40 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-lg bg-surface p-4 shadow-popover animate-fade-in sm:absolute sm:inset-x-auto sm:top-12 sm:right-0 sm:w-[22rem]">
          <p className="mb-3 text-[15px] font-semibold text-ink">Deixar a tela mais fácil de ler</p>
          <AccessibilityPanel />
        </div>
      )}
    </div>
  );
};
