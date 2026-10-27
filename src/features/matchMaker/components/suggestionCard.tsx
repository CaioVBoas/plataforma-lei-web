import { CoverageMeter } from '@/components/ui/coverageMeter';
import { Monogram } from '@/components/ui/monogram';
import { Tag } from '@/components/ui/tag';
import type { DemandMatch } from '@/domain/matching';
import type { IsoDate } from '@/domain/types';
import { isNew, reservationBadge } from '@/features/demands/utils/demandPresentation';
import { cn } from '@/utils/cn';

interface SuggestionCardProps {
  item: DemandMatch;
  today: IsoDate;
  selected: boolean;
  /** Nome do grupo de rádio: as setas do teclado trocam de sugestão sem sair da lista. */
  name: string;
  onSelect: () => void;
}

/**
 * Uma sugestão para escolher, no mesmo desenho do cartão do cardápio. Aqui o
 * cartão é uma escolha (rádio), não um link: o vermelho da ação marca a selecionada e o
 * detalhe aparece ao lado, sem trocar de tela.
 */
export const SuggestionCard = ({ item, today, selected, name, onSelect }: SuggestionCardProps) => {
  const { demand, match } = item;
  const reservation = reservationBadge(demand, today);

  return (
    <label
      className={cn(
        'flex h-full min-w-0 cursor-pointer flex-col rounded-lg border p-5 transition-[border-color,background-color,box-shadow] duration-150 focus-within:ring-2 focus-within:ring-accent/40',
        selected
          ? 'border-accent bg-accent-soft'
          : cn('bg-surface hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]', demand.reservation?.mine ? 'border-reserve-dot/40' : 'border-line hover:border-line-strong'),
      )}
    >
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="sr-only" />
      <span className="flex min-h-6 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <span className="flex min-w-0 items-center gap-2.5">
          <Monogram name={demand.organization.name} logo={demand.organization.logo} size="sm" />
          <span className="truncate text-small font-semibold text-ink-2">{demand.organization.name}</span>
        </span>
        {reservation ? (
          <Tag tone="reserve">{reservation}</Tag>
        ) : demand.invitation ? (
          <Tag tone="accent">Indicada para você</Tag>
        ) : (
          isNew(demand, today) && <Tag tone="accent">Nova</Tag>
        )}
      </span>

      <span className="mt-3 block text-h4 font-semibold text-ink">{demand.title}</span>
      <span className="mt-1.5 line-clamp-2 block flex-1 text-small text-ink-2">{demand.problem}</span>

      <span className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="text-small text-ink-2 tabular-nums">
          {match.covered.length} de {demand.skills.length} competências
        </span>
        <CoverageMeter covered={match.covered.length} total={demand.skills.length} fits={match.fits} />
      </span>
    </label>
  );
};
