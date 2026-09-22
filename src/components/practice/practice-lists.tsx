import type { Practice, PracticeChange } from '@/types/practice';
import { Tag } from '@/components/ui/tag';

interface PracticeListProps {
  practice: Practice;
  onChange: (change: PracticeChange) => void;
  size?: 'sm' | 'md';
}

/** Confirmadas pelo docente: entram no cálculo com peso cheio. */
export const ConfirmedPracticeList = ({ practice, onChange, size }: PracticeListProps) => (
  <div className="flex flex-wrap gap-2">
    {practice.confirmed.map((name) => (
      <Tag key={name} label={name} size={size} onRemove={() => onChange({ action: 'remove-confirmed', name })} />
    ))}
  </div>
);

/** Sugestões da leitura automática, sempre com a origem explicada e a decisão nas mãos do docente. */
export const InferredPracticeList = ({ practice, onChange, size }: PracticeListProps) => (
  <ul className="flex flex-col gap-3.5">
    {practice.inferred.map((item) => (
      <li key={item.name}>
        <Tag
          label={item.name}
          inferred
          size={size}
          onConfirm={() => onChange({ action: 'confirm-inferred', name: item.name })}
          onRemove={() => onChange({ action: 'discard-inferred', name: item.name })}
        />
        <p className="mt-1.5 max-w-[68ch] text-[13px] leading-normal text-n-500">{item.origin}</p>
      </li>
    ))}
  </ul>
);

export const ExcludedPracticeList = ({ practice, onChange, size }: PracticeListProps) => (
  <div className="flex flex-wrap items-center gap-2">
    {practice.excluded.map((name) => (
      <Tag key={name} label={name} muted size={size} onRemove={() => onChange({ action: 'remove-excluded', name })} />
    ))}
  </div>
);
