import { useState } from 'react';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-controls';
import { SectionBlock } from '@/components/ui/section-card';
import { pluralize } from '@/utils/format';
import { useAddPastProject } from '../../hooks/use-profile';
import type { PastProject } from '../../types';

const EMPTY_FORM = { title: '', year: '', partnerName: '', competencies: '' };

const PastProjectForm = ({ onDone }: { onDone: () => void }) => {
  const toast = useToast();
  const addProject = useAddPastProject();
  const [form, setForm] = useState(EMPTY_FORM);
  const update = (field: keyof typeof EMPTY_FORM) => (event: { target: { value: string } }) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = () => {
    const competencies = form.competencies.split(',').map((item) => item.trim()).filter(Boolean);
    addProject.mutate(
      {
        title: form.title.trim(),
        year: form.year.trim() || 'Sem ano',
        partnerName: form.partnerName.trim() || 'Parceiro não informado',
        competencies,
      },
      {
        onSuccess: () => {
          onDone();
          toast.show('Projeto registrado. As competências dele entram no seu perfil.');
        },
        onError: (error) => toast.show(error.message),
      },
    );
  };

  return (
    <div className="mt-6 border-t border-n-200 pt-6">
      <h4 className="mb-4 text-[15px] font-medium text-n-800">Registrar projeto anterior</h4>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
        <Field label="Título" htmlFor="projeto-titulo">
          <Input id="projeto-titulo" placeholder="Como você chama esse projeto" value={form.title} onChange={update('title')} />
        </Field>
        <Field label="Ano" htmlFor="projeto-ano">
          <Input id="projeto-ano" placeholder="2025.1" value={form.year} onChange={update('year')} className="tabular-nums" />
        </Field>
        <Field label="Organização" htmlFor="projeto-organizacao">
          <Input id="projeto-organizacao" placeholder="Organização envolvida" value={form.partnerName} onChange={update('partnerName')} />
        </Field>
        <Field label="Competências envolvidas" htmlFor="projeto-competencias">
          <Input id="projeto-competencias" placeholder="Separe por vírgula" value={form.competencies} onChange={update('competencies')} />
        </Field>
      </div>
      <div className="mt-6 flex items-center gap-5">
        <Button variant="primary" size="lg" disabled={addProject.isPending} onClick={submit}>
          Registrar
        </Button>
        <Button variant="outline-muted" size="sm" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export const PastProjects = ({ projects }: { projects: PastProject[] }) => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <SectionBlock
      title="Projetos que você registrou aqui"
      aside={
        projects.length > 0 &&
        !formOpen && (
          <Button variant="outline-accent" size="sm" onClick={() => setFormOpen(true)}>
            Registrar projeto anterior
          </Button>
        )
      }
    >
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={`${project.title}-${project.year}`} className="border-t border-n-200 py-[18px]">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <p className="text-base font-medium text-n-800">{project.title}</p>
                <p className="text-[13px] text-n-500 tabular-nums">{project.year}</p>
              </div>
              <p className="mt-[3px] text-sm text-n-600">{project.partnerName}</p>
              <p className="mt-2 max-w-[68ch] text-[13px] leading-normal text-n-500">
                Contribuiu com {pluralize(project.competencies.length, 'competência', 'competências')} para o seu perfil.
              </p>
            </li>
          ))}
        </ul>
      ) : (
        !formOpen && (
          <div className="max-w-[62ch]">
            <p className="mb-4 text-[15px] leading-relaxed text-n-600">Registrar um projeto anterior é a forma mais rápida de a plataforma te conhecer.</p>
            <Button variant="primary" size="lg" onClick={() => setFormOpen(true)}>
              Registrar projeto anterior
            </Button>
          </div>
        )
      )}
      {formOpen && <PastProjectForm onDone={() => setFormOpen(false)} />}
    </SectionBlock>
  );
};
