import { useToast } from '@/components/feedback/toast-context';
import { CopyIcon } from '@/components/ui/icons';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/utils/cn';
import type { ProposalSection } from '../types';

/** Proposta já registrada: leitura com cópia por seção, sem edição acidental. */
export const ReadOnlySections = ({ sections }: { sections: ProposalSection[] }) => {
  const toast = useToast();
  const { copiedKey, copy } = useCopyToClipboard<number>();

  return (
    <div className="flex flex-col gap-8">
      {sections.map((section, index) => (
        <section key={section.title} className="px-6 py-5">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[15px] font-medium text-n-800">{section.title}</h3>
            <button
              type="button"
              onClick={() => {
                copy(index, section.text);
                toast.show(`Seção “${section.title}” copiada. Cole no campo correspondente do SIGAA.`);
              }}
              className={cn('flex items-center gap-1.5 text-sm font-medium', copiedKey === index ? 'text-n-600' : 'text-azul-500 hover:text-azul-600')}
            >
              <CopyIcon size={13} />
              {copiedKey === index ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <p className={cn('max-w-[76ch] text-sm leading-[1.65] whitespace-pre-wrap', section.text.trim() ? 'text-n-700' : 'text-n-400')}>
            {section.text.trim() || 'Seção ainda vazia.'}
          </p>
        </section>
      ))}
    </div>
  );
};
