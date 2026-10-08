import { Monogram } from '@/components/ui/monogram';
import { Tag } from '@/components/ui/tag';
import type { DemandDraft } from '@/domain/types';
import { CONSTRAINT_COPY } from '@/features/demands/utils/demandPresentation';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';

/**
 * O cartão como o docente vai ver no cardápio, montado enquanto a organização
 * escreve. A linha de baixo mostra o que ela informou; qual turma combina é
 * calculado para cada docente e não aparece aqui.
 */
export const DemandPreviewCard = ({ draft, organization }: { draft: DemandDraft; organization: { name: string; logo?: string } }) => {
  const facts = [
    draft.skills.length > 0 ? pluralize(draft.skills.length, 'competência', 'competências') : 'Competências na triagem',
    ...draft.constraints.map((constraint) => CONSTRAINT_COPY[constraint].label),
  ];

  return (
    <div aria-label="Prévia do cartão no cardápio" className="flex min-w-0 flex-col rounded-lg border border-line bg-surface p-6">
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Monogram name={organization.name} logo={organization.logo} size="sm" />
          <p className="truncate text-[13px] font-semibold text-ink-2">{organization.name}</p>
        </div>
        <Tag tone="accent">Nova</Tag>
      </div>

      <p className={cn('mt-3 text-[17px] leading-snug font-semibold tracking-[-0.01em] break-words', draft.title.trim() ? 'text-ink' : 'text-ink-3')}>
        {draft.title.trim() || 'Nome da demanda'}
      </p>
      <p className={cn('mt-1.5 line-clamp-3 text-sm leading-relaxed break-words', draft.problem.trim() ? 'text-ink-2' : 'text-ink-3')}>
        {draft.problem.trim() || 'O problema em uma frase, do ponto de vista de quem sofre com ele.'}
      </p>

      <div className="mt-5 border-t border-line pt-4">
        <p className="text-sm text-ink-3">A turma que combina aparece para cada docente</p>
        <p className="mt-1 text-[13px] text-ink-3">{facts.join(' · ')}</p>
      </div>
    </div>
  );
};
