import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-controls';
import { SparkleIcon } from '@/components/ui/icons';
import { PRACTICE_GROUPS, type PracticeGroup } from '../../constants/onboarding-options';
import { ChoiceChip } from './choice-chip';

interface PracticeGroupCardProps {
  group: PracticeGroup;
  selected: string[];
  custom: string[];
  onToggle: (option: string) => void;
  onAdd: (option: string) => void;
}

const PracticeGroupCard = ({ group, selected, custom, onToggle, onAdd }: PracticeGroupCardProps) => {
  const [draft, setDraft] = useState('');
  const add = () => {
    const option = draft.trim();
    if (!option) return;
    onAdd(option);
    setDraft('');
  };

  return (
    <section className="rounded-2xl border border-n-200 bg-n-0 p-5">
      <div className="mb-3.5 flex items-baseline justify-between gap-4">
        <h2 className="text-[15px] font-semibold text-n-800">{group.title}</h2>
        {group.suggested.length > 0 && (
          <span className="flex shrink-0 items-center gap-[5px] text-xs text-n-500">
            <SparkleIcon size={13} className="text-n-400" />
            Sugerimos a partir das disciplinas que você leciona
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {[...group.options, ...custom].map((option) => (
          <ChoiceChip key={option} selected={selected.includes(option)} onToggle={() => onToggle(option)}>
            {option}
          </ChoiceChip>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-2.5 border-t border-n-200 pt-3.5">
        <Input
          aria-label={group.addPlaceholder}
          placeholder={group.addPlaceholder}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
          className="h-[38px] min-w-0 flex-1 rounded-xl text-[13px]"
        />
        <Button variant="secondary" size="sm" className="h-[38px] rounded-xl font-semibold" onClick={add}>
          Adicionar
        </Button>
      </div>
    </section>
  );
};

interface PracticeStepProps {
  selected: Record<string, string[]>;
  custom: Record<string, string[]>;
  onToggle: (groupId: string, option: string) => void;
  onAdd: (groupId: string, option: string) => void;
}

export const PracticeStep = ({ selected, custom, onToggle, onAdd }: PracticeStepProps) => (
  <div className="flex flex-col gap-4">
    {PRACTICE_GROUPS.map((group) => (
      <PracticeGroupCard
        key={group.id}
        group={group}
        selected={selected[group.id] ?? []}
        custom={custom[group.id] ?? []}
        onToggle={(option) => onToggle(group.id, option)}
        onAdd={(option) => onAdd(group.id, option)}
      />
    ))}
  </div>
);
