import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch, type Path } from 'react-hook-form';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { LoadingState, QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirmDialog';
import { MissingFieldsDialog, type MissingItem } from '@/components/ui/missingFieldsDialog';
import { visibleError } from '@/utils/formProblems';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { ArrowLeftIcon, ArrowRightIcon, SaveIcon, SendIcon } from '@/components/ui/icons';
import { Page } from '@/components/ui/page';
import { canEditSubmission, EMPTY_DRAFT, missingForReview } from '@/domain/submission';
import type { DemandSubmission, Organization } from '@/domain/types';
import { paths } from '@/routes/paths';
import { ClassStep, FormStepsNav, ProblemStep, WorkStep } from './components/demandFormSteps';
import { DemandContent } from './components/demandContent';
import { DemandPreviewCard } from './components/demandPreviewCard';
import { ReviewNote } from './components/reviewNote';
import { useOrgDemand, useOrgProfile, useSaveDraft, useSubmitForReview } from './useOrgPortal';
import { demandFormSchema, FIELD_COPY, FORM_STEPS, STEP_FIELDS, stepOf, toDraft, toFormValues, type DemandFormValues } from './utils/demandForm';
import { WarningNote } from '@/components/ui/warningNote';

const LAST_STEP = FORM_STEPS.length - 1;
const ALL_FIELDS = STEP_FIELDS.flat();

/** A primeira mensagem de erro de um campo, também dentro de listas (ofertas, referências). */
const firstMessage = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object') return undefined;
  const record = error as Record<string, unknown>;
  if (typeof record.message === 'string' && record.message) return record.message;
  for (const [key, value] of Object.entries(record)) {
    if (key === 'ref') continue;
    const message = firstMessage(value);
    if (message) return message;
  }
  return undefined;
};

/** O que acontece depois do envio, dito antes de enviar para ninguém esperar um sistema pronto na semana seguinte. */
const NEXT_STEPS = [
  'O L.E.I. lê e, se faltar algo, pede um ajuste.',
  'Aprovada, entra no cardápio dos docentes.',
  'Um docente reserva, pergunta o que precisar e leva para a turma.',
  'Vocês recebem o contato e marcam a primeira reunião.',
];

interface SubmitFormProps {
  submission?: DemandSubmission;
  organization: Organization;
}

const SubmitForm = ({ submission, organization }: SubmitFormProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const save = useSaveDraft();
  const submit = useSubmitForReview();
  const requested = Number(searchParams.get('etapa'));
  const step = Number.isInteger(requested) && requested >= 1 && requested <= FORM_STEPS.length ? requested - 1 : 0;

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    getFieldState,
    setFocus,
    formState: { errors, isDirty },
    // Confere a cada letra: erro de tamanho ou de link aparece na hora; o "falta preencher" espera o Continuar.
  } = useForm<DemandFormValues>({ mode: 'onChange', resolver: zodResolver(demandFormSchema), defaultValues: toFormValues(submission ?? EMPTY_DRAFT) });
  const [problems, setProblems] = useState<MissingItem[] | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [attempted, setAttempted] = useState<number[]>([]);
  const values = useWatch({ control }) as DemandFormValues;
  const attemptedHere = attempted.includes(step) || attempted.includes(LAST_STEP);
  // Antes de tentar avançar, só aparecem os erros de campos já escritos.
  const shownErrors = Object.fromEntries(
    Object.entries(errors).filter(([field, error]) => visibleError(firstMessage(error), values[field as keyof DemandFormValues], attemptedHere)),
  ) as typeof errors;
  const draft = toDraft(values);
  const missing = missingForReview(draft);
  const busy = save.isPending || submit.isPending;

  // A etapa mora na URL: voltar do navegador e recarregar abrem a mesma etapa.
  const goTo = (next: number) => {
    setSearchParams(next === 0 ? {} : { etapa: String(next + 1) }, { replace: true });
    window.scrollTo(0, 0);
  };

  /** Leva até o campo, trocando de etapa se precisar. */
  const focusField = (field: keyof DemandFormValues) => {
    const target = stepOf(field);
    if (target >= 0 && target !== step) goTo(target);
    window.setTimeout(() => setFocus(FIELD_COPY[field].focus as Path<DemandFormValues>), 60);
  };

  /** Confere os campos e devolve o que falta, com o conserto de cada um. */
  const check = async (fields: (keyof DemandFormValues)[]) => {
    await trigger(fields);
    return fields.flatMap((field) => {
      const message = firstMessage(getFieldState(field).error);
      return message ? [{ label: FIELD_COPY[field].label, fix: message, onGo: () => focusField(field) }] : [];
    });
  };

  const next = async () => {
    setAttempted((current) => [...current, step]);
    const found = await check(STEP_FIELDS[step]);
    if (found.length > 0) setProblems(found);
    else goTo(Math.min(step + 1, LAST_STEP));
  };

  const saveDraft = () =>
    save.mutate(
      { id: submission?.id, draft: toDraft(getValues()) },
      {
        onSuccess: (saved) => {
          toast.show('Rascunho salvo. Só vocês veem até enviar.');
          if (!submission) navigate(`${paths.orgEditDemand(saved.id)}${step > 0 ? `?etapa=${step + 1}` : ''}`, { replace: true });
        },
      },
    );

  /** Enviar pergunta antes: depois do envio o texto fica com o L.E.I. até a resposta. */
  const askToSend = async () => {
    setAttempted((current) => [...current, LAST_STEP]);
    const found = await check(ALL_FIELDS);
    if (found.length > 0) setProblems(found);
    else setConfirming(true);
  };

  const send = handleSubmit(
    (formValues) =>
      submit.mutate(
        { id: submission?.id, draft: toDraft(formValues) },
        {
          onSuccess: (sent) => {
            toast.show('Demanda enviada para a triagem do L.E.I.');
            navigate(paths.orgDemand(sent.id), { replace: true });
          },
        },
      ),
    // Algum campo de outra etapa ficou errado: leva até a primeira etapa com problema.
    (formErrors) => {
      const firstWithError = STEP_FIELDS.findIndex((fields) => fields.some((field) => field in formErrors));
      if (firstWithError >= 0) goTo(firstWithError);
    },
  );

  const error = save.error ?? submit.error;

  return (
    <>
      {submission?.review && submission.stage === 'needs-changes' && <ReviewNote review={submission.review} />}

      <div className="grid grid-cols-1 gap-10 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={(event) => event.preventDefault()} noValidate className="min-w-0 rounded-xl border border-line bg-surface p-5 sm:p-8">
          <FormStepsNav step={step} onChange={goTo} />
          <h2 className="mt-8 mb-6 text-h2">{FORM_STEPS[step]}</h2>

          {step === 0 && <ProblemStep register={register} control={control} errors={shownErrors} values={values} />}
          {step === 1 && <ClassStep register={register} control={control} errors={shownErrors} values={values} />}
          {step === 2 && <WorkStep register={register} control={control} errors={shownErrors} values={values} setValue={setValue} />}
          {step === LAST_STEP && (
            <div>
              {missing.length > 0 ? (
                <WarningNote title="Falta preencher antes de enviar" className="mb-8">
                  <ul className="space-y-1">
                    {missing.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                </WarningNote>
              ) : (
                <p className="mb-8 rounded-lg bg-accent-soft px-5 py-4 text-body text-ink">
                  Tudo preenchido. Confira abaixo e envie.
                </p>
              )}
              <p className="text-h4 font-semibold text-ink">{draft.title || 'Demanda sem nome'}</p>
              <p className="mt-1.5 mb-6 text-body text-ink-2">{draft.problem}</p>
              <DemandContent
                {...draft}
                outcome={{ title: 'O que ajudaria ao fim do semestre', text: draft.expectedOutcome }}
              />
              <section className="mt-10 rounded-lg border border-line bg-surface p-6">
                <h3 className="text-body font-semibold text-ink">Depois de enviar</h3>
                <ol className="mt-3 space-y-2.5">
                  {NEXT_STEPS.map((text, index) => (
                    <li key={text} className="flex gap-3 text-small text-ink-2">
                      <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-monogram text-caption font-semibold text-monogram-ink">
                        {index + 1}
                      </span>
                      {text}
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-6 text-small text-critical">
              {error.message}
            </p>
          )}

          {/* No celular os botões ficam um embaixo do outro, na largura toda, com o principal em cima. */}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            {step > 0 ? (
              <Button variant="secondary" size="xl" className="w-full sm:w-auto" onClick={() => goTo(step - 1)}>
                <ArrowLeftIcon size={20} />
                Voltar
              </Button>
            ) : (
              <span className="hidden sm:block" />
            )}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto" onClick={saveDraft} disabled={busy || (!isDirty && Boolean(submission))}>
                <SaveIcon size={20} />
                {save.isPending ? 'Guardando' : 'Guardar e continuar depois'}
              </Button>
              {step < LAST_STEP ? (
                <Button variant="primary" size="xl" className="w-full sm:w-auto" onClick={next} disabled={busy}>
                  Continuar
                  <ArrowRightIcon size={20} />
                </Button>
              ) : (
                <Button variant="primary" size="xl" className="w-full sm:w-auto" onClick={askToSend} disabled={busy}>
                  <SendIcon size={20} />
                  {submit.isPending ? 'Enviando' : submission?.stage === 'needs-changes' ? 'Reenviar para a triagem' : 'Enviar para a triagem'}
                </Button>
              )}
            </div>
          </div>
        </form>

        {problems && (
          <MissingFieldsDialog
            description={step < LAST_STEP ? 'Para seguir para a próxima etapa, preencha o que está abaixo.' : 'Antes de enviar, preencha o que está abaixo.'}
            items={problems}
            onClose={() => setProblems(null)}
          />
        )}
        {confirming && (
          <ConfirmDialog
            tone="action"
            icon={<SendIcon size={26} />}
            title="Enviar para o L.E.I.?"
            description="O L.E.I. lê em alguns dias. Enquanto isso, vocês não editam o texto. Se faltar algo, ele pede um ajuste por aqui."
            confirmLabel={submission?.stage === 'needs-changes' ? 'Sim, reenviar' : 'Sim, enviar'}
            confirmIcon={<SendIcon size={20} />}
            cancelLabel="Revisar mais"
            pending={submit.isPending}
            pendingLabel="Enviando"
            error={submit.error?.message}
            onConfirm={() => void send()}
            onClose={() => setConfirming(false)}
          />
        )}

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-2.5 text-small font-semibold text-brand-strong">Como aparece no cardápio</p>
          <DemandPreviewCard draft={draft} organization={organization} />
          <p className="mt-3 text-small text-ink-3">
            É assim que o docente vê. As dúvidas dele chegam em Perguntas.
          </p>
        </aside>
      </div>
    </>
  );
};

const NewDemand = () => {
  const profile = useOrgProfile();
  return (
    <Page title="Submeter demanda" subtitle="Conte o problema do jeito que vocês vivem. São quatro etapas curtas." back={{ to: paths.orgDemands(), label: 'Demandas' }}>
      <QueryView query={profile}>{({ organization }) => <SubmitForm organization={organization} />}</QueryView>
    </Page>
  );
};

const EditDemand = ({ id }: { id: string }) => {
  const detail = useOrgDemand(id);
  const profile = useOrgProfile();

  if (detail.isPending || profile.isPending) {
    return (
      <Page title="Editar demanda" back={{ to: paths.orgDemand(id), label: 'Demanda' }}>
        <LoadingState />
      </Page>
    );
  }
  // Publicada ou na triagem não se edita por aqui: volta para o detalhe, que explica o porquê.
  if (detail.data && (detail.data.kind !== 'submission' || !canEditSubmission(detail.data.submission))) return <Navigate to={paths.orgDemand(id)} replace />;

  return (
    <Page title="Editar demanda" back={{ to: paths.orgDemand(id), label: 'Demanda' }}>
      <QueryView query={detail}>
        {(data) =>
          data.kind === 'submission' && profile.data ? (
            <SubmitForm key={data.submission.id} submission={data.submission} organization={profile.data.organization} />
          ) : (
            <p className="text-small text-ink-2">
              Não deu para abrir esta demanda.{' '}
              <Link to={paths.orgDemands()} className={textLinkClassName}>
                Voltar às demandas
              </Link>
            </p>
          )
        }
      </QueryView>
    </Page>
  );
};

/** Nova demanda ou edição de rascunho e de demanda devolvida, no mesmo formulário em quatro etapas. */
export const SubmitDemandPage = () => {
  const { demandId } = useParams();
  return demandId ? <EditDemand id={demandId} /> : <NewDemand />;
};
