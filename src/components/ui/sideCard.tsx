import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/** Bloco da coluna lateral das telas de detalhe: título pequeno em petróleo e conteúdo em card branco. */
export const SideCard = ({ title, className, children }: { title: string; className?: string; children: ReactNode }) => (
  <section className={cn('rounded-lg border border-line bg-surface p-5', className)}>
    <h2 className="text-[13px] font-semibold text-brand-strong">{title}</h2>
    <div className="mt-3">{children}</div>
  </section>
);

/** Par rótulo e valor empilhado, separado por linha fina, dentro de um SideCard. */
export const SideFact = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="border-t border-line py-2.5 first:border-t-0 first:pt-0 last:pb-0">
    <dt className="text-[12px] text-ink-3">{label}</dt>
    <dd className="mt-0.5 text-sm break-words text-ink">{children}</dd>
  </div>
);
