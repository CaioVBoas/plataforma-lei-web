import { useState } from 'react';
import { ConfirmedPracticeList, ExcludedPracticeList, InferredPracticeList } from '@/components/practice/practice-lists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-controls';
import { SectionCard } from '@/components/ui/section-card';
import type { PracticeChange } from '@/types/practice';
import { useChangeDisciplinePractice } from '../../hooks/use-disciplines';
import type { Discipline } from '../../types';

const ExcludeCompetencyField = ({ onAdd }: { onAdd: (name: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  if (!open) {
    return (
      <Button variant="outline-accent" size="sm" className="ml-1.5" onClick={() => setOpen(true)}>
        Marcar competência
      </Button>
    );
  }

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
    setOpen(false);
  };

  return (
    <span className="flex items-center gap-2">
      <Input
        autoFocus
        aria-label="Competência que esta turma não conduz"
        placeholder="Competência que esta turma não conduz"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && submit()}
        className="h-10 w-72 text-[13px]"
      />
      <Button variant="secondary" onClick={submit}>
        Marcar
      </Button>
    </span>
  );
};

export const PracticeTab = ({ discipline }: { discipline: Discipline }) => {
  const changePractice = useChangeDisciplinePractice(discipline.id);
  const onChange = (change: PracticeChange) => changePractice.mutate(change);
  const { practice } = discipline;

  return (
    <div className="flex flex-col gap-12">
      <p className="max-w-[68ch] text-[13px] leading-[1.55] text-n-500">
        A prática desta disciplina e a sua prática pessoal são somadas no cálculo de compatibilidade.
      </p>
      <SectionCard>
        <h3 className="heading-section mb-3.5">Confirmadas por você</h3>
        <div className="mb-12">
          <ConfirmedPracticeList practice={practice} onChange={onChange} size="sm" />
        </div>

        <h3 className="heading-section mb-3.5">Sugeridas a partir da ementa</h3>
        <div className="mb-12">
          <InferredPracticeList practice={practice} onChange={onChange} size="sm" />
        </div>

        <h3 className="heading-section mb-3.5">Não conduzo</h3>
        <div className="flex flex-wrap items-center gap-2">
          <ExcludedPracticeList practice={practice} onChange={onChange} size="sm" />
          {practice.excluded.length === 0 && <span className="text-[15px] text-n-600">Nada marcado como fora desta turma.</span>}
          <ExcludeCompetencyField onAdd={(name) => onChange({ action: 'add-excluded', name })} />
        </div>
        {practice.excluded.length > 0 && (
          <p className="mt-3 text-[13px] text-n-500">Demandas que dependem destas competências não aparecem para esta turma.</p>
        )}
      </SectionCard>
    </div>
  );
};
