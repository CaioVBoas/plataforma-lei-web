import { useState } from 'react';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-controls';
import { PlusIcon, SparkleIcon } from '@/components/ui/icons';
import { SectionCard } from '@/components/ui/section-card';
import { Tag } from '@/components/ui/tag';
import { useCompetencyCatalog, useEditDemandCompetency } from '../../hooks/use-demands';
import type { DemandCompetency } from '../../types';

const MAX_SUGGESTIONS = 6;

interface CompetenciesSectionProps {
  demandId: string;
  competencies: DemandCompetency[];
  onOpenReading: () => void;
}

export const CompetenciesSection = ({ demandId, competencies, onOpenReading }: CompetenciesSectionProps) => {
  const toast = useToast();
  const edit = useEditDemandCompetency(demandId);
  const { data: catalog = [] } = useCompetencyCatalog();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const names = competencies.map((competency) => competency.name);
  const query = draft.trim().toLowerCase();
  const suggestions = catalog
    .filter((name) => !names.includes(name) && (!query || name.toLowerCase().includes(query)))
    .slice(0, MAX_SUGGESTIONS);

  const closeField = () => {
    setAdding(false);
    setDraft('');
  };

  const add = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.show('Escreva ou escolha o nome da competência.');
      return;
    }
    edit.mutate(
      { action: 'add', name: trimmed },
      {
        onSuccess: () => {
          closeField();
          toast.show(`${trimmed} adicionada como confirmada. Também entrou no seu perfil de prática.`);
        },
        onError: (error) => toast.show(error.message),
      },
    );
  };

  const remove = (name: string) =>
    edit.mutate({ action: 'remove', name }, { onSuccess: () => toast.show('Competência removida da leitura automática.') });

  return (
    <SectionCard
      title="Competências que o projeto exige"
      description="Sugeridas a partir da descrição da organização. Ajuste o que não fizer sentido."
      action={
        <Button variant="outline-muted" size="sm" onClick={onOpenReading} title="Como estas competências foram identificadas">
          <SparkleIcon size={13} />
          Verifique
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {competencies.map((competency) => (
          <Tag
            key={competency.name}
            label={competency.name}
            size="sm"
            inferred={!competency.confirmed}
            onConfirm={competency.confirmed ? undefined : () => edit.mutate({ action: 'confirm', name: competency.name })}
            onRemove={() => remove(competency.name)}
          />
        ))}
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex h-10 items-center gap-1.5 rounded-full border border-dashed border-n-300 bg-n-0 px-3 text-[13px] font-medium text-n-600 hover:bg-n-50"
          >
            <PlusIcon size={12} className="text-n-500" />
            Adicionar competência
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              autoFocus
              aria-label="Nome da competência"
              placeholder="Nome da competência"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  add(draft);
                }
              }}
              className="h-10 min-w-0 flex-[1_1_260px] border-azul-500 text-sm"
            />
            <Button variant="primary" disabled={edit.isPending} onClick={() => add(draft)}>
              Adicionar
            </Button>
            <Button variant="ghost" onClick={closeField}>
              Cancelar
            </Button>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((name) => (
                <Button key={name} variant="outline-muted" size="sm" className="font-normal" onClick={() => add(name)}>
                  {name}
                </Button>
              ))}
            </div>
          )}
          <p className="mt-2.5 text-[13px] text-n-500">
            Entra nesta demanda como confirmada e, se for nova para você, também no seu perfil de prática.
          </p>
        </div>
      )}
    </SectionCard>
  );
};
