import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ChevronLeftIcon } from './icons';

interface PageProps {
  title: string;
  subtitle?: ReactNode;
  /** Linha pequena em petróleo acima do título: de quem é, que tipo de coisa é. */
  eyebrow?: ReactNode;
  /** Linha de contexto em texto 13 logo abaixo do subtítulo: resumo, metadados. */
  meta?: ReactNode;
  /** Elemento de identidade à esquerda do título, como o monograma da organização. */
  leading?: ReactNode;
  back?: { to: string; label: string };
  /** Substitui o cabeçalho padrão por um bloco próprio, como a boas-vindas do Início. */
  hero?: ReactNode;
  actions?: ReactNode;
  width?: 'default' | 'narrow';
  children: ReactNode;
}

/** Casca de toda tela do portal: voltar, título grande, subtítulo e ações à direita. */
export const Page = ({ title, eyebrow, subtitle, meta, leading, back, hero, actions, width = 'default', children }: PageProps) => {
  useEffect(() => {
    document.title = `${title} · Aperta o PLEI`;
  }, [title]);

  return (
    <div className={cn('mx-auto w-full px-5 pt-8 pb-24 sm:px-10 sm:pt-12', width === 'default' ? 'max-w-[1000px]' : 'max-w-[760px]')}>
      {back && (
        // Voltar é navegação, não ação: texto cinza escuro, sem peso de botão.
        <Link to={back.to} className="-ml-1.5 mb-4 inline-flex items-center gap-0.5 text-sm text-ink-2 hover:text-ink">
          <ChevronLeftIcon size={16} />
          {back.label}
        </Link>
      )}
      {hero ? (
        <div className="mb-10">{hero}</div>
      ) : (
      <header className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="flex min-w-0 flex-[1_1_420px] items-start gap-4">
          {leading}
          <div className="min-w-0 flex-1">
            {eyebrow && <p className="mb-1.5 text-[13px] font-semibold text-brand-strong">{eyebrow}</p>}
            <h1 className={cn('text-balance', leading ? 'text-[26px] leading-tight font-bold tracking-[-0.019em] text-ink' : 'text-large-title')}>{title}</h1>
            {subtitle && <div className={cn('leading-snug text-ink-2', leading ? 'mt-1 text-[15px]' : 'mt-2 text-[17px]')}>{subtitle}</div>}
            {meta && <div className="mt-2 text-[13px] text-ink-2">{meta}</div>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>
      )}
      {children}
    </div>
  );
};

interface SectionProps {
  title: string;
  id?: string;
  description?: ReactNode;
  aside?: ReactNode;
  /** 36px entre seções em vez de 48px, para telas de consulta com pouco conteúdo por bloco. */
  compact?: boolean;
  className?: string;
  children: ReactNode;
}

export const Section = ({ title, id, description, aside, compact, className, children }: SectionProps) => (
  <section id={id} className={cn(compact ? 'mt-10' : 'mt-12', 'scroll-mt-6 first:mt-0', className)}>
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
      <div className="min-w-0">
        <h2 className="text-title">{title}</h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-ink-2">{description}</p>}
      </div>
      {aside}
    </div>
    {children}
  </section>
);

/**
 * Pares de rótulo e valor em mini cards de fato, até quatro por linha. Fato é o
 * único bloco com fundo petróleo e borda: não se confunde com tag, botão nem card clicável.
 */
export const FactGrid = ({ items, columns = 4 }: { items: { label: string; value: ReactNode }[]; columns?: 2 | 3 | 4 }) => (
  <dl className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2', columns === 3 && 'lg:grid-cols-3', columns === 4 && 'lg:grid-cols-4')}>
    {items.map((item) => (
      <div key={item.label} className="min-w-0 rounded-md border border-fact-line bg-fact px-3.5 py-3">
        <dt className="text-[12px] font-semibold text-fact-label">{item.label}</dt>
        <dd className="mt-1 text-[15px] leading-snug break-words text-ink">{item.value}</dd>
      </div>
    ))}
  </dl>
);
