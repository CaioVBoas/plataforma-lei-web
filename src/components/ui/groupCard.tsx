import { useId, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from './icons';

interface GroupCardProps {
  /** Número do grupo, na ordem do caminho. Sem ele, o grupo é só uma lista. */
  index?: number;
  title: string;
  subtitle?: ReactNode;
  /** Resumo do grupo à direita, como "1 pergunta sem resposta". */
  status?: ReactNode;
  defaultOpen?: boolean;
  /** Sem abrir e fechar: a lista fica sempre à vista. */
  fixed?: boolean;
  children: ReactNode;
}

/**
 * Um grupo de itens num cartão branco: o cabeçalho numerado abre e fecha a
 * lista, e cada linha traz o estado e a única ação que cabe nela.
 */
export const GroupCard = ({ index, title, subtitle, status, defaultOpen = true, fixed, children }: GroupCardProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  const expanded = fixed || open;

  const heading = (
    <>
      {index !== undefined && (
        <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-canvas text-sm font-semibold text-ink-2 tabular-nums">
          {index}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-ink">{title}</span>
        {subtitle && <span className="mt-0.5 block text-[13px] text-ink-3">{subtitle}</span>}
      </span>
      {status && <span className="hidden shrink-0 sm:block">{status}</span>}
    </>
  );

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      {fixed ? (
        <div className="flex items-center gap-3.5 px-4 py-4 sm:px-6">{heading}</div>
      ) : (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center gap-3.5 px-4 py-4 text-left hover:bg-canvas/60 sm:px-6"
        >
          {heading}
          <ChevronDownIcon size={16} className={cn('shrink-0 text-ink-3 transition-transform', open && 'rotate-180')} />
        </button>
      )}
      {expanded && (
        <div id={contentId}>
          {status && <div className="-mt-1.5 px-4 pb-3 sm:hidden">{status}</div>}
          <ul className="divide-y divide-line border-t border-line">{children}</ul>
        </div>
      )}
    </section>
  );
};

interface GroupRowProps {
  /** A linha inteira leva aqui; a ação à direita pode levar a outro lugar. */
  to: string;
  label: string;
  icon: ReactNode;
  title: string;
  meta?: ReactNode;
  status?: ReactNode;
  action?: ReactNode;
}

/**
 * Uma linha do grupo: ícone, título com o contexto embaixo, estado e ação.
 * No celular, estado e ação descem para baixo do título, que não é cortado.
 */
export const GroupRow = ({ to, label, icon, title, meta, status, action }: GroupRowProps) => (
  <li className="relative flex items-start gap-x-4 px-4 py-3.5 transition-colors hover:bg-canvas/70 sm:items-center sm:px-6">
    <Link to={to} aria-label={label} className="absolute inset-0" />
    <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-canvas text-ink-2">
      {icon}
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[15px] font-semibold text-ink sm:truncate">{title}</p>
        {meta && <p className="mt-0.5 text-[13px] text-ink-3 sm:truncate">{meta}</p>}
      </div>
      {(status || action) && (
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:flex-nowrap sm:gap-4">
          {status}
          {action && <div className="relative z-10">{action}</div>}
        </div>
      )}
    </div>
  </li>
);

/** Lista simples num cartão branco, sem cabeçalho: mesmo desenho das linhas do grupo. */
export const CardList = ({ children }: { children: ReactNode }) => (
  <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">{children}</ul>
);
