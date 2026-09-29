import { Controller, useFieldArray, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ChoiceChips } from '@/components/ui/choiceChips';
import { Field, FormGroup, Input, Textarea } from '@/components/ui/formControls';
import { CheckIcon, CloseIcon, PlusIcon } from '@/components/ui/icons';
import { SUBMISSION_LIMITS } from '@/domain/submission';
import type { DemandConstraint } from '@/domain/types';
import { CONSTRAINT_COPY } from '@/features/demands/utils/demandPresentation';
import { useSkillCatalog } from '@/features/disciplines/useDisciplines';
import { cn } from '@/utils/cn';
import { FORM_STEPS, type DemandFormValues } from '../utils/demandForm';
import { MEETING_SUGGESTIONS } from '../utils/orgPresentation';

/** Etapas no topo do formulário: dá para voltar a qualquer uma, e a atual fica em petróleo. */
export const FormStepsNav = ({ step, onChange }: { step: number; onChange: (step: number) => void }) => (
  <ol aria-label="Etapas do envio" className="grid grid-cols-4 gap-2">
    {FORM_STEPS.map((label, index) => {
      const current = index === step;
      const done = index < step;
      return (
        <li key={label} className="min-w-0">
          <button
            type="button"
            aria-current={current ? 'step' : undefined}
            onClick={() => onChange(index)}
            className="group flex w-full flex-col items-start gap-2 text-left"
          >
            <span className={cn('block h-1 w-full rounded-full', done ? 'bg-positive' : current ? 'bg-brand' : 'bg-fill-strong')} />
            <span className={cn('flex items-center gap-1.5 text-[13px] leading-snug', current ? 'font-semibold text-ink' : 'text-ink-2 group-hover:text-ink')}>
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                  done ? 'bg-positive-soft text-positive' : current ? 'bg-brand text-white' : 'bg-fill text-ink-2',
                )}
              >
                {done ? <CheckIcon size={11} /> : index + 1}
              </span>
              <span className="max-sm:sr-only">{label}</span>
            </span>
          </button>
        </li>
      );
    })}
  </ol>
);

/** Quanto do limite já foi usado, só quando chega perto: antes disso o número é ruído. */
const Counter = ({ value, limit }: { value: string; limit: number }) =>
  value.length > limit * 0.8 ? (
    <span className={cn('tabular-nums', value.length > limit ? 'text-critical' : 'text-ink-3')}>
      {value.length}/{limit}
    </span>
  ) : null;

interface StepProps {
  register: UseFormRegister<DemandFormValues>;
  control: Control<DemandFormValues>;
  errors: FieldErrors<DemandFormValues>;
  values: DemandFormValues;
}

export const ProblemStep = ({ register, errors, values }: StepProps) => (
  <div className="@container">
    <FormGroup title="A demanda" hint="O nome e a frase do problema são o que o docente vê primeiro, no cartão do cardápio.">
      <div className="flex flex-col gap-5">
        <Field
          label="Nome da demanda"
          htmlFor="demanda-nome"
          hint={
            <span className="flex justify-between gap-3">
              <span>Curto, como vocês chamam o problema no dia a dia. Ex.: Fila de consultas do interior.</span>
              <Counter value={values.title} limit={SUBMISSION_LIMITS.title} />
            </span>
          }
          error={errors.title?.message}
        >
          <Input id="demanda-nome" autoFocus {...register('title')} />
        </Field>
        <Field
          label="O problema em uma frase"
          htmlFor="demanda-problema"
          hint={
            <span className="flex justify-between gap-3">
              <span>Do ponto de vista de quem sofre com ele, sem falar ainda da solução.</span>
              <Counter value={values.problem} limit={SUBMISSION_LIMITS.problem} />
            </span>
          }
          error={errors.problem?.message}
        >
          <Textarea id="demanda-problema" rows={2} {...register('problem')} />
        </Field>
      </div>
    </FormGroup>

    <FormGroup title="O contexto" hint="Como é hoje, o que já tentaram e por que importa resolver agora.">
      <div className="flex flex-col gap-5">
        <Field
          label="Contexto"
          htmlFor="demanda-contexto"
          hint={
            <span className="flex justify-between gap-3">
              <span>Conte como a equipe trabalha hoje e onde o problema aparece.</span>
              <Counter value={values.description} limit={SUBMISSION_LIMITS.description} />
            </span>
          }
          error={errors.description?.message}
        >
          <Textarea id="demanda-contexto" rows={7} {...register('description')} />
        </Field>
        <Field label="Quem sente o problema" htmlFor="demanda-publico" hint="Quem é afetado e quantas pessoas, se souberem." error={errors.affectedPublic?.message}>
          <Input id="demanda-publico" {...register('affectedPublic')} />
        </Field>
      </div>
    </FormGroup>
  </div>
);

const CONSTRAINTS: DemandConstraint[] = ['on-site', 'sensitive-data', 'confidential'];

export const ClassStep = ({ register, control, errors, values }: StepProps) => {
  const { data: catalog = [] } = useSkillCatalog();
  return (
    <div className="@container">
      <FormGroup title="O resultado" hint="Em um semestre, uma turma entrega pesquisa com usuários, protótipo ou prova de conceito. Um sistema pronto para uso costuma ficar de fora.">
        <Field
          label="O que já ajudaria ao fim do semestre"
          htmlFor="demanda-resultado"
          hint={
            <span className="flex justify-between gap-3">
              <span>Pense no primeiro passo que faria diferença, não no sistema completo.</span>
              <Counter value={values.expectedOutcome} limit={SUBMISSION_LIMITS.expectedOutcome} />
            </span>
          }
          error={errors.expectedOutcome?.message}
        >
          <Textarea id="demanda-resultado" rows={3} {...register('expectedOutcome')} />
        </Field>
      </FormGroup>

      <FormGroup title="Competências, opcional" hint="Se não souber, deixe em branco: o L.E.I. completa na triagem. É o que liga a demanda às turmas.">
        <Controller
          control={control}
          name="skills"
          render={({ field }) => <ChoiceChips label="Competências que a demanda pede" options={catalog} value={field.value} onChange={field.onChange} />}
        />
      </FormGroup>

      <FormGroup title="O que pesa na rotina" hint="Marque o que vale para esta demanda. O docente vê isso antes de aceitar.">
        <Controller
          control={control}
          name="constraints"
          render={({ field }) => (
            <ul className="flex flex-col gap-2">
              {CONSTRAINTS.map((constraint) => {
                const checked = field.value.includes(constraint);
                return (
                  <li key={constraint}>
                    <label
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-md border px-3.5 py-3 transition-colors duration-100',
                        checked ? 'border-accent bg-accent-soft' : 'border-line-strong hover:border-ink-3',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => field.onChange(checked ? field.value.filter((item) => item !== constraint) : [...field.value, constraint])}
                        className="mt-0.5 size-4 shrink-0 accent-accent"
                      />
                      <span>
                        <span className="block text-sm font-medium text-ink">{CONSTRAINT_COPY[constraint].label}</span>
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-2">{CONSTRAINT_COPY[constraint].detail}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        />
      </FormGroup>
    </div>
  );
};

interface WorkStepProps extends StepProps {
  setValue: UseFormSetValue<DemandFormValues>;
}

export const WorkStep = ({ register, control, errors, values, setValue }: WorkStepProps) => {
  const offers = useFieldArray({ control, name: 'offers' });
  const references = useFieldArray({ control, name: 'references' });
  const offersError = errors.offers?.message ?? errors.offers?.root?.message;

  return (
    <div className="@container">
      <FormGroup title="Reuniões com a turma" hint="Com que frequência e como vocês podem encontrar a turma durante o semestre.">
        <Field label="Ritmo das reuniões" htmlFor="demanda-reunioes" error={errors.meetingCadence?.message}>
          <Input id="demanda-reunioes" placeholder="Ex.: Reunião quinzenal de 1 hora, por vídeo" {...register('meetingCadence')} />
        </Field>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {MEETING_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setValue('meetingCadence', suggestion, { shouldValidate: true, shouldDirty: true })}
              aria-pressed={values.meetingCadence === suggestion}
              className={cn(
                'inline-flex h-8 items-center rounded-md border px-2.5 text-[13px] transition-colors duration-100',
                values.meetingCadence === suggestion ? 'border-accent bg-accent-soft text-accent' : 'border-line-strong bg-surface text-ink-2 hover:border-ink-3',
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </FormGroup>

      <FormGroup title="O que vocês oferecem" hint="Dados, visitas, tempo da equipe. É o que faz a turma conseguir trabalhar no problema.">
        <ul className="flex flex-col gap-2">
          {offers.fields.map((field, index) => (
            <li key={field.id} className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <label htmlFor={`oferta-${field.id}`} className="sr-only">
                  Oferta {index + 1}
                </label>
                <Input
                  id={`oferta-${field.id}`}
                  placeholder={index === 0 ? 'Ex.: Planilha de atendimentos de 2025, anonimizada' : 'Ex.: Visita da turma ao local'}
                  {...register(`offers.${index}.value`)}
                />
                {errors.offers?.[index]?.value?.message && (
                  <p role="alert" className="mt-1.5 text-[13px] text-critical">
                    {errors.offers[index]?.value?.message}
                  </p>
                )}
              </div>
              {offers.fields.length > 1 && (
                <button
                  type="button"
                  aria-label={`Remover oferta ${index + 1}`}
                  onClick={() => offers.remove(index)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-md text-ink-3 hover:bg-fill hover:text-ink"
                >
                  <CloseIcon size={15} />
                </button>
              )}
            </li>
          ))}
        </ul>
        {offersError && (
          <p role="alert" className="mt-1.5 text-[13px] text-critical">
            {offersError}
          </p>
        )}
        {offers.fields.length < SUBMISSION_LIMITS.maxOffers && (
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => offers.append({ value: '' })}>
            <PlusIcon size={14} />
            Adicionar outra
          </Button>
        )}
      </FormGroup>

      <FormGroup title="Para se inspirar, opcional" hint="Sistemas ou iniciativas parecidas que vocês conhecem. Ajudam a turma a não começar do zero.">
        {references.fields.length > 0 && (
          <ul className="flex flex-col gap-3">
            {references.fields.map((field, index) => (
              <li key={field.id} className="rounded-md border border-line p-3.5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nome" htmlFor={`ref-nome-${field.id}`} error={errors.references?.[index]?.name?.message}>
                    <Input id={`ref-nome-${field.id}`} placeholder="Ex.: Cal.com" {...register(`references.${index}.name`)} />
                  </Field>
                  <Field label="Link" htmlFor={`ref-link-${field.id}`} error={errors.references?.[index]?.url?.message}>
                    <Input id={`ref-link-${field.id}`} type="url" placeholder="https://" {...register(`references.${index}.url`)} />
                  </Field>
                </div>
                <Field label="Por que lembra o problema, opcional" htmlFor={`ref-desc-${field.id}`} className="mt-3">
                  <Input id={`ref-desc-${field.id}`} {...register(`references.${index}.description`)} />
                </Field>
                <div className="mt-2 flex justify-end">
                  <Button variant="destructive" size="sm" onClick={() => references.remove(index)}>
                    Remover
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {references.fields.length < SUBMISSION_LIMITS.maxReferences && (
          <Button variant="secondary" size="sm" className={references.fields.length > 0 ? 'mt-3' : undefined} onClick={() => references.append({ name: '', url: '', description: '' })}>
            <PlusIcon size={14} />
            Adicionar referência
          </Button>
        )}
      </FormGroup>
    </div>
  );
};
