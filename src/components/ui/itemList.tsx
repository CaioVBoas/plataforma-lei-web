import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

/**
 * Lista sem moldura: só divisórias finas entre os itens, para não pôr cartão dentro de cartão.
 * O conteúdo começa na mesma margem do título da seção; o hover se estende
 * 12px para os lados com sombra, sem mexer no alinhamento nem nas divisórias.
 */
export const ItemList = ({ children, flush }: { children: ReactNode; /** Logo abaixo de abas, que já traçam a linha de cima. */ flush?: boolean }) => (
  <ul className={cn('divide-y divide-line border-b border-line', !flush && 'border-t')}>{children}</ul>
);

/**
 * Links e botões dentro do conteúdo de um item precisam desta classe para
 * ficar acima do link que cobre a linha inteira.
 */
export const aboveRowLink = 'relative z-10';

interface ItemProps {
  /** Destino do item: a linha inteira fica clicável. Sem destino, o item é só leitura e não reage ao hover. */
  to?: string;
  /** Nome acessível do link da linha, em geral o título do item. */
  label?: string;
  /** Âncora visual de 40px à esquerda: monograma, código. */
  anchor: ReactNode;
  /** Botão secundário visível, só como afordância: o clique é da linha. */
  action?: ReactNode;
  /** Kebab de ações, que recebe o próprio clique. */
  menu?: ReactNode;
  children: ReactNode;
}

/**
 * Item em grade de três colunas: âncora, conteúdo e ação. Um link invisível
 * cobre a linha, então o olho desce pela âncora e o clique vale em qualquer ponto.
 */
export const Item = ({ to, label, anchor, action, menu, children }: ItemProps) => (
  <li
    className={cn(
      'relative grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-4 py-5',
      to &&
        'transition-[background-color,box-shadow] duration-150 hover:bg-canvas hover:shadow-[-12px_0_0_var(--color-canvas),12px_0_0_var(--color-canvas)]',
    )}
  >
    {to && <Link to={to} aria-label={label} className="absolute inset-y-0 -inset-x-3 rounded-md" />}
    <div className="flex w-10 self-start">{anchor}</div>
    <div className="min-w-0">{children}</div>
    {(action || menu) && (
      <div className="flex items-center justify-end gap-2">
        {action && <div className="hidden w-[140px] justify-end sm:flex">{action}</div>}
        {menu && <div className={aboveRowLink}>{menu}</div>}
      </div>
    )}
  </li>
);

/** Âncora neutra para listas sem monograma nem código: o ícone do tipo de item. */
export const AnchorIcon = ({ children }: { children: ReactNode }) => (
  <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-fill text-ink-2">
    {children}
  </span>
);
