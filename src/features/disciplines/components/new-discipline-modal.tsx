import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { Field, Input, SearchInput, Textarea } from '@/components/ui/form-controls';
import { NumberStepper } from '@/components/ui/number-stepper';
import { Modal } from '@/components/ui/overlays';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ToggleChip } from '@/components/ui/toggle-chip';
import { onlyDigits, pluralize } from '@/utils/format';
import { useCreateDiscipline, useDisciplineCatalog } from '../hooks/use-disciplines';
import { DISCIPLINE_LEVELS, NEW_DISCIPLINE_DEFAULTS, newDisciplineSchema, type NewDisciplineFormValues } from '../schemas/new-discipline-schema';

const MIN_SEARCH_LENGTH = 2;

export const NewDisciplineModal = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();
  const createDiscipline = useCreateDiscipline();
  const { data: catalog = [] } = useDisciplineCatalog();
  const [manual, setManual] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewDisciplineFormValues>({ resolver: zodResolver(newDisciplineSchema), defaultValues: NEW_DISCIPLINE_DEFAULTS });

  const name = watch('name');
  const code = watch('code');
  const acceptsDemands = watch('acceptsDemands');
  const query = name.trim().toLowerCase();
  const catalogMatches =
    !manual && query.length >= MIN_SEARCH_LENGTH && !code
      ? catalog.filter((entry) => `${entry.name} ${entry.code}`.toLowerCase().includes(query))
      : [];

  const submit = handleSubmit((values) =>
    createDiscipline.mutate(
      { ...values, students: Number(values.students) || 0 },
      {
        onSuccess: () => {
          onClose();
          toast.show(values.acceptsDemands ? 'Disciplina cadastrada. Ela já entra no cálculo do cardápio.' : 'Disciplina cadastrada sem receber demandas neste semestre.');
        },
      },
    ),
  );

  return (
    <Modal
      title="Cadastrar disciplina"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline-muted" size="lg" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="lg" disabled={createDiscipline.isPending} onClick={submit}>
            Cadastrar
          </Button>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field
          label={manual ? 'Nome da disciplina' : 'Disciplina'}
          htmlFor="disciplina-nome"
          error={errors.name?.message}
          hint={manual ? undefined : 'Catálogo do Centro de Informática.'}
          aside={
            <Button variant="outline-accent" size="sm" onClick={() => setManual((current) => !current)}>
              {manual ? 'Buscar no catálogo' : 'Não encontrei minha disciplina'}
            </Button>
          }
        >
          {manual ? (
            <div className="grid grid-cols-[1fr_140px] gap-3">
              <Input id="disciplina-nome" placeholder="Como aparece na sua turma" className="text-sm" {...register('name')} />
              <Input aria-label="Código" placeholder="IF____" className="text-sm" {...register('code')} />
            </div>
          ) : (
            <SearchInput
              id="disciplina-nome"
              placeholder="Buscar no catálogo do CIn"
              className="h-12 text-[15px]"
              {...register('name', { onChange: () => setValue('code', '') })}
            />
          )}
          {catalogMatches.length > 0 && (
            <ul className="mt-2 overflow-hidden rounded-lg border border-n-200">
              {catalogMatches.map((entry) => (
                <li key={entry.code}>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('name', entry.name, { shouldValidate: true });
                      setValue('code', entry.code);
                    }}
                    className="flex w-full items-center justify-between gap-3 border-b border-n-200 bg-n-0 px-3.5 py-[11px] text-left hover:bg-n-50"
                  >
                    <span className="text-sm text-n-800">{entry.name}</span>
                    <span className="text-[13px] text-n-500">{entry.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Período de oferta" htmlFor="disciplina-oferta">
            <Input id="disciplina-oferta" placeholder="2026.2" className="h-12 tabular-nums" {...register('semester')} />
          </Field>
          <Field label="Curso" htmlFor="disciplina-curso">
            <Input id="disciplina-curso" placeholder="Ciência da Computação" className="h-12" {...register('course')} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Estudantes matriculados" htmlFor="disciplina-estudantes" error={errors.students?.message}>
            <Input
              id="disciplina-estudantes"
              inputMode="numeric"
              className="h-12 tabular-nums"
              {...register('students', { onChange: (event) => setValue('students', onlyDigits(event.target.value)) })}
            />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-n-700">Janela de execução</legend>
          <div className="flex items-center gap-2.5">
            <Input aria-label="Início da execução" className="h-12 min-w-0 flex-1 tabular-nums" {...register('executionStart')} />
            <span className="text-sm text-n-500">até</span>
            <Input aria-label="Fim da execução" className="h-12 min-w-0 flex-1 tabular-nums" {...register('executionEnd')} />
          </div>
        </fieldset>

        <div>
          <p className="mb-2 text-sm font-medium text-n-700">Nível esperado</p>
          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <SegmentedControl
                label="Nível esperado"
                value={field.value}
                onChange={field.onChange}
                options={DISCIPLINE_LEVELS.map((level) => ({ value: level, label: level }))}
              />
            )}
          />
        </div>

        <Field label="Ementa ou descrição do que a turma faz" htmlFor="disciplina-ementa" aside={<span className="text-xs text-n-500">Opcional</span>} hint="Pode colar da sua ementa. Quanto mais próximo da prática real, melhores as sugestões.">
          <Textarea id="disciplina-ementa" placeholder="Cole aqui a ementa ou descreva o que a turma entrega no semestre" className="min-h-[78px]" {...register('syllabus')} />
        </Field>

        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="acceptsDemands"
            render={({ field }) => (
              <ToggleChip selected={field.value} size="sm" onClick={() => field.onChange(!field.value)} className="h-9">
                Aceitar demandas neste semestre
              </ToggleChip>
            )}
          />
          <span className="text-xs leading-[1.45] text-n-500">
            {acceptsDemands ? 'A disciplina entra no cálculo do cardápio agora.' : 'Fica cadastrada sem receber demandas neste semestre.'}
          </span>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-n-700">Quantos projetos você aceita conduzir nesta turma</p>
          <div className="flex items-center gap-3">
            <Controller
              control={control}
              name="projectCapacity"
              render={({ field }) => (
                <NumberStepper
                  label="Projetos que você aceita conduzir nesta turma"
                  value={field.value}
                  min={1}
                  max={6}
                  onChange={field.onChange}
                  formatValue={(value) => pluralize(value, 'projeto', 'projetos')}
                  className="w-40"
                />
              )}
            />
            <span className="text-[13px] leading-[1.45] text-n-500">Serve para a plataforma não te sobrecarregar.</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};
