import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface InfoItem {
  label: string;
  value?: ReactNode;
  /** Ocupa a linha toda, para textos longos como o "Sobre". */
  wide?: boolean;
}

/**
 * Rótulo e valor para ler, no modo de visualização de um perfil. Campo vazio
 * aparece como "Não informado", para a pessoa ver o que falta preencher.
 * Precisa de um `@container` em volta.
 */
export const InfoList = ({ items }: { items: InfoItem[] }) => (
  <dl className="grid grid-cols-1 gap-x-8 gap-y-5 @lg:grid-cols-2">
    {items.map((item) => (
      <div key={item.label} className={cn('min-w-0', item.wide && '@lg:col-span-2')}>
        <dt className="text-small font-medium text-ink-2">{item.label}</dt>
        <dd className="mt-1 text-body break-words whitespace-pre-line text-ink">
          {item.value ? item.value : <span className="text-ink-3">Não informado</span>}
        </dd>
      </div>
    ))}
  </dl>
);
