import { zodResolver } from '@hookform/resolvers/zod';
import { useId, type ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Field, Input } from '@/components/ui/formControls';
import { CheckIcon } from '@/components/ui/icons';
import { Tag } from '@/components/ui/tag';
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

interface FormGroupProps {
  title: string;
  hint?: string;
  aside?: ReactNode;
  children: ReactNode;
}

/**
 * Um bloco do formulário: título e explicação curta de um lado, campos do outro.
 * Em espaço estreito, como a janela de cadastro, o título fica em cima.
 */
const FormGroup = ({ title, hint, aside, children }: FormGroupProps) => {
  const titleId = useId();
  return (
    <div role="group" aria-labelledby={titleId} className="grid gap-3 border-t border-line py-6 first:border-t-0 first:pt-0 last:pb-0 @2xl:grid-cols-[200px_minmax(0,1fr)] @2xl:gap-8">
      <div>
        <h3 id={titleId} className="text-[15px] font-semibold text-ink">
          {title}
        </h3>
        {hint && <p className="mt-1 text-[13px] leading-relaxed text-ink-3">{hint}</p>}
        {aside && <div className="mt-2">{aside}</div>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
};

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

  const [students, teamSize, projectSlots, skills] = useWatch({ control, name: ['students', 'teamSize', 'projectSlots', 'skills'] });
  const teams = students > 0 && teamSize > 0 ? Math.max(1, Math.floor(students / teamSize)) : 0;

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="@container">
      <FormGroup title="Identificação">
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <Field label="Nome" htmlFor={`${formId}-name`} error={errors.name?.message}>
            <Input id={`${formId}-name`} placeholder="Ex.: Projetos de Software" {...register('name')} />
          </Field>
          <Field label="Código, opcional" htmlFor={`${formId}-code`}>
            <Input id={`${formId}-code`} placeholder="Ex.: IF1015" {...register('code')} />
          </Field>
        </div>
      </FormGroup>

      <FormGroup title="Tamanho da turma" hint="Define quantas equipes e projetos a turma comporta no semestre.">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Estudantes" htmlFor={`${formId}-students`} error={errors.students?.message}>
            <Input id={`${formId}-students`} type="number" min={1} inputMode="numeric" {...register('students', { valueAsNumber: true })} />
          </Field>
          <Field label="Por equipe" htmlFor={`${formId}-team`} error={errors.teamSize?.message}>
            <Input id={`${formId}-team`} type="number" min={1} inputMode="numeric" {...register('teamSize', { valueAsNumber: true })} />
          </Field>
          <Field label="Projetos" htmlFor={`${formId}-slots`} error={errors.projectSlots?.message}>
            <Input id={`${formId}-slots`} type="number" min={1} inputMode="numeric" {...register('projectSlots', { valueAsNumber: true })} />
          </Field>
        </div>
        {teams > 0 && (
          <p aria-live="polite" className="mt-3 rounded-md border border-fact-line bg-fact px-3.5 py-2.5 text-[13px] text-ink-2">
            <span className="font-semibold text-brand-strong">{teams === 1 ? '1 equipe' : `${teams} equipes`}</span> de até {teamSize} pessoas, para até{' '}
            <span className="font-semibold text-brand-strong">{projectSlots === 1 ? '1 projeto' : `${projectSlots || 0} projetos`}</span> neste semestre.
          </p>
        )}
      </FormGroup>

      <FormGroup title="Altura do curso" hint="Demandas que pedem mais do que a turma dá conta não aparecem como compatíveis.">
        <Controller control={control} name="level" render={({ field }) => <LevelPicker value={field.value} onChange={field.onChange} />} />
      </FormGroup>

      <FormGroup
        title="O que a turma trabalha"
        hint="Uma demanda combina quando a turma cobre pelo menos metade das competências pedidas."
        aside={<Tag tone={skills.length > 0 ? 'positive' : 'neutral'}>{skills.length === 1 ? '1 marcada' : `${skills.length} marcadas`}</Tag>}
      >
        <Controller control={control} name="skills" render={({ field }) => <SkillPicker catalog={catalog} value={field.value} onChange={field.onChange} />} />
        {errors.skills && (
          <p role="alert" className="mt-2 text-[13px] text-critical">
            {errors.skills.message}
          </p>
        )}
      </FormGroup>
    </form>
  );
};
