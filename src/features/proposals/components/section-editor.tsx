import { AutoResizeTextarea } from '@/components/ui/form-controls';
import { cn } from '@/utils/cn';
import type { ProposalSection } from '../types';
import { sectionPendingMessage } from '../utils/proposal-presentation';

/** Contador fica escuro perto do limite do campo do SIGAA. */
const NEAR_LIMIT_RATIO = 0.9;

interface SectionEditorProps {
  section: ProposalSection;
  copied: boolean;
  onChange: (text: string) => void;
  onCopy: () => void;
}

/** Uma seção por bloco, com cópia individual: é assim que a transposição ao SIGAA acontece. */
export const SectionEditor = ({ section, copied, onChange, onCopy }: SectionEditorProps) => {
  const pending = sectionPendingMessage(section);
  const fieldId = `secao-${section.title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <section>
      <div className="mb-2.5 flex items-baseline justify-between gap-4">
        <label htmlFor={fieldId} className="heading-section">
          {section.title}
        </label>
        <div className="flex shrink-0 items-baseline gap-4">
          <span className={cn('text-xs tabular-nums', section.text.length > section.limit * NEAR_LIMIT_RATIO ? 'text-n-700' : 'text-n-400')}>
            {section.text.length} / {section.limit}
          </span>
          <button type="button" onClick={onCopy} className={cn('text-sm font-medium', copied ? 'text-n-600' : 'text-azul-500 hover:text-azul-600')}>
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
      <AutoResizeTextarea
        id={fieldId}
        value={section.text}
        maxLength={section.limit}
        onChange={(event) => onChange(event.target.value)}
        className="border-n-200 px-3.5 py-[11px] text-[15px] leading-relaxed"
      />
      {pending && <p className="mt-2.5 text-sm leading-normal font-medium text-n-800">{pending}</p>}
    </section>
  );
};
