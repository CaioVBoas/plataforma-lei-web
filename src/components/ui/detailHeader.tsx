import type { ReactNode } from 'react';
import type { Cover } from '@/lib/covers';
import { cn } from '@/utils/cn';
import { PhotoCreditLine } from './photoCredit';

export interface HeaderFact {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

interface DetailHeaderProps {
  title: string;
  /** Estado e tipo em etiquetas, acima do título. */
  chips?: ReactNode;
  description?: ReactNode;
  /** A ação da tela, à direita do título. */
  actions?: ReactNode;
  cover?: Cover;
  /** Uma linha curta e a barra de andamento, logo abaixo do título. */
  progress?: { label: ReactNode; bar: ReactNode };
  /** Fatos com ícone no pé do cartão: o resumo da tela em um olhar. */
  facts?: HeaderFact[];
}

/**
 * Topo das telas de detalhe do portal da organização: tudo num cartão só,
 * com a capa, o estado, o título, a única ação que cabe agora e os fatos.
 */
export const DetailHeader = ({ title, chips, description, actions, cover, progress, facts }: DetailHeaderProps) => (
  <header className="overflow-hidden rounded-xl border border-line bg-surface">
    {cover && (
      <div className="relative">
        <img src={cover.src} alt="" aria-hidden="true" className="block h-40 w-full object-cover sm:h-52" />
        {cover.credit && (
          <div className="absolute right-2 bottom-2 max-w-[90%] rounded-sm bg-black/55 px-2 py-1">
            <PhotoCreditLine credit={cover.credit} onDark />
          </div>
        )}
      </div>
    )}
    <div className="px-5 py-6 sm:px-8 sm:py-7">
      {chips && <div className="mb-3 flex flex-wrap items-center gap-2">{chips}</div>}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="min-w-0 flex-[1_1_420px]">
          <h1 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-balance text-ink sm:text-[32px]">{title}</h1>
          {description && <div className="mt-2 max-w-[72ch] text-[15px] leading-relaxed text-ink-2">{description}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {progress && (
        <div className="mt-6">
          <p className="mb-2.5 text-sm font-semibold text-ink">{progress.label}</p>
          {progress.bar}
        </div>
      )}

      {facts && facts.length > 0 && (
        <dl className={cn('grid gap-x-6 gap-y-5 border-t border-line pt-5 sm:grid-cols-2', progress ? 'mt-6' : 'mt-6', facts.length >= 4 && 'lg:grid-cols-4')}>
          {facts.map((fact) => (
            <div key={fact.label} className="flex min-w-0 items-start gap-3">
              <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-canvas text-ink-2">
                {fact.icon}
              </span>
              <div className="min-w-0">
                <dt className="text-[12px] text-ink-3">{fact.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold break-words text-ink">{fact.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      )}
    </div>
  </header>
);
