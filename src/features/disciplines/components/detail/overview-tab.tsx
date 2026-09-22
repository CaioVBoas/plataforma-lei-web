import { useState } from 'react';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/form-controls';
import { NumberStepper } from '@/components/ui/number-stepper';
import { SectionCard } from '@/components/ui/section-card';
import { ToggleChip } from '@/components/ui/toggle-chip';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { pluralize } from '@/utils/format';
import { useUpdateDiscipline } from '../../hooks/use-disciplines';
import type { Discipline } from '../../types';

const MAX_CAPACITY = 8;

const ClassFigures = ({ discipline }: { discipline: Discipline }) => {
  const { data: projects = [] } = useProjects();
  const inProjects = projects
    .filter((project) => project.stage === 'running' && project.disciplineName === discipline.name)
    .reduce((total, project) => total + project.students, 0);
  const alreadyIn = Math.min(discipline.students, inProjects);

  const figures = [
    { label: 'Estudantes matriculados', value: discipline.students },
    { label: 'Já em algum projeto de extensão', value: alreadyIn },
    { label: 'Ainda sem projeto', value: Math.max(0, discipline.students - alreadyIn) },
  ];

  return (
    <SectionCard title="A turma">
      <dl>
        {figures.map((figure) => (
          <div key={figure.label} className="flex items-baseline justify-between gap-4 border-b border-n-200 py-3.5">
            <dt className="text-[15px] text-n-700">{figure.label}</dt>
            <dd className="shrink-0 text-[15px] font-medium text-n-800 tabular-nums">{figure.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
};

export const OverviewTab = ({ discipline }: { discipline: Discipline }) => {
  const toast = useToast();
  const update = useUpdateDiscipline();
  const [syllabus, setSyllabus] = useState(discipline.syllabus);

  const saveSyllabus = () => {
    if (!syllabus.trim()) {
      toast.show('Escreva ou cole a ementa antes de salvar.');
      return;
    }
    update.mutate(
      { id: discipline.id, update: { syllabus } },
      { onSuccess: () => toast.show('Ementa salva. As sugestões desta turma já usam o novo texto.') },
    );
  };

  return (
    <div className="flex max-w-[760px] flex-col gap-12">
      <section>
        <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-3">
          <label htmlFor="ementa" className="heading-section">
            Ementa cadastrada
          </label>
          <span className="text-[13px] text-n-500">{pluralize(syllabus.length, 'caractere', 'caracteres')}</span>
        </div>
        <Textarea
          id="ementa"
          placeholder="Cole aqui a ementa ou descreva o que a turma entrega no semestre"
          value={syllabus}
          onChange={(event) => setSyllabus(event.target.value)}
          className="min-h-[150px] border-n-200 px-3.5 text-[15px] leading-relaxed"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-[62ch] text-[13px] leading-normal text-n-500">
            A ementa alimenta o cálculo de compatibilidade desta turma. Quanto mais próximo da prática real, melhores as sugestões.
          </p>
          <Button variant="outline-accent" size="sm" disabled={update.isPending} onClick={saveSyllabus}>
            Salvar ementa
          </Button>
        </div>
      </section>

      <ClassFigures discipline={discipline} />

      <SectionCard title="Capacidade">
        <NumberStepper
          label="Projetos que você aceita conduzir nesta turma"
          value={discipline.projectCapacity}
          min={1}
          max={MAX_CAPACITY}
          onChange={(projectCapacity) => update.mutate({ id: discipline.id, update: { projectCapacity } })}
          formatValue={(value) => pluralize(value, 'projeto', 'projetos')}
          className="w-[200px]"
        />
        <p className="mt-2.5 max-w-[62ch] text-[13px] leading-normal text-n-500">Serve para a plataforma não te sobrecarregar.</p>
        <p className="mt-1.5 text-[13px] text-n-500">
          {discipline.linkedProjects} de {discipline.projectCapacity} vagas ocupadas neste semestre.
        </p>
      </SectionCard>

      <SectionCard title="Recebimento">
        <ToggleChip selected={!discipline.paused} onClick={() => update.mutate({ id: discipline.id, update: { paused: !discipline.paused } })}>
          Aceitar demandas neste semestre
        </ToggleChip>
        <p className="mt-2.5 max-w-[62ch] text-[13px] leading-normal text-n-500">
          {discipline.paused ? 'Esta turma não recebe demandas novas até você retomar.' : 'Esta turma entra no cálculo do cardápio.'}
        </p>
      </SectionCard>
    </div>
  );
};
