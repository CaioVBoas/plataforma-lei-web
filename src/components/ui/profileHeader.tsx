import type { ReactNode } from 'react';

interface ProfileHeaderProps {
  /** Monograma ou ícone grande que sobrepõe a capa. */
  avatar: ReactNode;
  title: string;
  /** Linha pequena acima do título, em petróleo: tipo, código, semestre. */
  eyebrow?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}

/**
 * Cabeçalho de perfil (organização, disciplina, conta): capa petróleo com o
 * avatar sobreposto. É a cor de identidade dizendo "isto é uma entidade", não uma ação.
 */
export const ProfileHeader = ({ avatar, title, eyebrow, meta, actions }: ProfileHeaderProps) => (
  <header className="overflow-hidden rounded-lg border border-line">
    <div aria-hidden="true" className="relative h-24 overflow-hidden bg-brand sm:h-28">
      <span className="absolute -top-20 right-10 size-56 rounded-full bg-brand-500" />
      <span className="absolute -bottom-24 right-48 size-40 rounded-full bg-brand-700" />
    </div>
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 px-5 pb-5 sm:px-6">
      <div className="flex min-w-0 flex-[1_1_360px] items-end gap-4">
        <div className="-mt-9 shrink-0 rounded-xl bg-surface p-1">{avatar}</div>
        <div className="min-w-0 pt-3">
          {eyebrow && <p className="text-[13px] font-semibold text-brand-strong">{eyebrow}</p>}
          <h1 className="mt-0.5 text-[26px] leading-tight font-bold tracking-[-0.019em] text-balance text-ink">{title}</h1>
          {meta && <div className="mt-1.5 text-[13px] text-ink-2">{meta}</div>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  </header>
);

interface StatTilesProps {
  items: { value: ReactNode; label: string }[];
}

/** Números de resumo em petróleo claro: o estado da tela em um olhar, sem ser clicável. */
export const StatTiles = ({ items }: StatTilesProps) => (
  <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {items.map((item) => (
      <div key={item.label} className="rounded-md border border-fact-line bg-fact px-4 py-3.5">
        <dt className="sr-only">{item.label}</dt>
        <dd className="text-[24px] leading-none font-bold text-brand-strong tabular-nums">{item.value}</dd>
        <dd className="mt-1.5 text-[13px] text-ink-2">{item.label}</dd>
      </div>
    ))}
  </dl>
);
