import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, Input } from '@/components/ui/formControls';
import { CheckIcon } from '@/components/ui/icons';
import type { CourseLevel } from '@/domain/types';
import { cn } from '@/utils/cn';
import { useSkillCatalog } from '../useDisciplines';
import { disciplineSchema, type DisciplineFormValues } from '../disciplineSchema';
import { LEVEL_COPY } from '../utils/disciplinePresentation';

const EMPTY_DISCIPLINE: DisciplineFormValues = { name: '', code: '', level: 'intermediate', students: 40, teamSize: 5, projectSlots: 2, skills: [] };

const LEVELS: CourseLevel[] = ['intro', 'intermediate', 'advanced'];

/** Escolha única, com o mesmo desenho das competências para o formulário não ter dois idiomas. */
const LevelPicker = ({ value, onChange }: { value: CourseLevel; onChange: (level: CourseLevel) => void }) => (
  <div role="radiogroup" aria-label="Em que altura do curso a turma está" className="grid gap-1.5 sm:grid-cols-3">
    {LEVELS.map((level) => {
      const selected = value === level;
      return (
        <button
          key={level}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(level)}
          className={cn(
            'flex flex-col items-start rounded-md border px-3 py-2 text-left transition-colors duration-100',
            selected ? 'border-accent bg-accent-soft' : 'border-line-strong bg-surface hover:border-ink-3',
          )}
        >
          <span className={cn('text-sm font-medium', selected ? 'text-accent' : 'text-ink')}>{LEVEL_COPY[level].label}</span>
          <span className="text-[13px] text-ink-3">{LEVEL_COPY[level].periods}</span>
        </button>
      );
    })}
  </div>
);

interface SkillPickerProps {
  catalog: string[];
  value: string[];
  onChange: (skills: string[]) => void;
}

const SkillPicker = ({ catalog, value, onChange }: SkillPickerProps) => {
  const toggle = (skill: string) => onChange(value.includes(skill) ? value.filter((item) => item !== skill) : [...value, skill]);
  return (
    <div className="flex flex-wrap gap-1.5">
      {catalog.map((skill) => {
        const selected = value.includes(skill);
        return (
          <button
            key={skill}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(skill)}
            className={cn(
              'inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-[13px] transition-colors duration-100',
              selected ? 'border-accent bg-accent-soft text-accent' : 'border-line-strong bg-surface text-ink-2 hover:border-ink-3',
            )}
          >
            {selected && <CheckIcon size={13} />}
            {skill}
          </button>
        );
      })}
    </div>
  );
};

interface DisciplineFormProps {
  formId: string;
  defaultValues?: DisciplineFormValues;
  onSubmit: (values: DisciplineFormValues) => void;
}

/**
 * Só os campos. Quem usa decide onde ficam os botões e aponta para o
 * formulário pelo `formId`, o que permite usá-lo numa janela ou numa página.
 */
export const DisciplineForm = ({ formId, defaultValues = EMPTY_DISCIPLINE, onSubmit }: DisciplineFormProps) => {
  const { data: catalog = [] } = useSkillCatalog();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DisciplineFormValues>({ resolver: zodResolver(disciplineSchema), defaultValues });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
        <Field label="Nome" htmlFor={`${formId}-name`} error={errors.name?.message}>
          <Input id={`${formId}-name`} placeholder="Ex.: Projetos de Software" {...register('name')} />
        </Field>
        <Field label="Código, opcional" htmlFor={`${formId}-code`}>
          <Input id={`${formId}-code`} placeholder="Ex.: IF1015" {...register('code')} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Estudantes" htmlFor={`${formId}-students`} error={errors.students?.message}>
          <Input id={`${formId}-students`} type="number" min={1} inputMode="numeric" {...register('students', { valueAsNumber: true })} />
        </Field>
        <Field label="Pessoas por equipe" htmlFor={`${formId}-team`} error={errors.teamSize?.message}>
          <Input id={`${formId}-team`} type="number" min={1} inputMode="numeric" {...register('teamSize', { valueAsNumber: true })} />
        </Field>
        <Field label="Projetos que comporta" htmlFor={`${formId}-slots`} error={errors.projectSlots?.message}>
          <Input id={`${formId}-slots`} type="number" min={1} inputMode="numeric" {...register('projectSlots', { valueAsNumber: true })} />
        </Field>
      </div>

      <div>
        <p className="text-[13px] font-medium text-ink-2">Altura do curso</p>
        <p className="mt-0.5 mb-2.5 text-[13px] text-ink-3">Demandas que pedem mais do que a turma dá conta não aparecem como compatíveis.</p>
        <Controller control={control} name="level" render={({ field }) => <LevelPicker value={field.value} onChange={field.onChange} />} />
      </div>

      <div>
        <p className="text-[13px] font-medium text-ink-2">O que a turma trabalha</p>
        <p className="mt-0.5 mb-2.5 text-[13px] text-ink-3">Uma demanda combina com a disciplina quando ela cobre pelo menos metade destas competências.</p>
        <Controller
          control={control}
          name="skills"
          render={({ field }) => <SkillPicker catalog={catalog} value={field.value} onChange={field.onChange} />}
        />
        {errors.skills && (
          <p role="alert" className="mt-2 text-[13px] text-critical">
            {errors.skills.message}
          </p>
        )}
      </div>
    </form>
  );
};
