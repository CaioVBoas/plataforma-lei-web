import { buttonClassName } from '@/components/ui/button-styles';
import { ExternalLinkIcon } from '@/components/ui/icons';
import { SectionCard } from '@/components/ui/section-card';
import type { PartnerReference } from '../../types';

export const ReferencesSection = ({ references }: { references: PartnerReference[] }) => (
  <SectionCard title="Referências existentes">
    <ul className="flex flex-col gap-3.5">
      {references.map((reference) => (
        <li key={reference.name} className="flex items-start justify-between gap-4 border-b border-n-200 pb-3.5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-n-800">{reference.name}</p>
            <p className="mt-0.5 text-[13px] leading-[1.45] text-n-600">{reference.description}</p>
          </div>
          <a
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir ${reference.name} em nova aba`}
            className={buttonClassName({ variant: 'secondary', size: 'sm' })}
          >
            Abrir
            <ExternalLinkIcon size={12} />
          </a>
        </li>
      ))}
    </ul>
    <p className="mt-1 text-[13px] text-n-500">Serve como repertório para os estudantes. O parceiro não definiu solução.</p>
  </SectionCard>
);
