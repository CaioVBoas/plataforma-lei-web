import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { LoadingState, QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
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
import { demandFormSchema, FORM_STEPS, STEP_FIELDS, toDraft, toFormValues, type DemandFormValues } from './utils/demandForm';

const LAST_STEP = FORM_STEPS.length - 1;

/** O que acontece depois do envio, dito antes de enviar para ninguém esperar um sistema pronto na semana seguinte. */
const NEXT_STEPS = [
  'O L.E.I. lê a demanda. Se faltar alguma coisa, pede um ajuste por aqui.',
  'Aprovada, ela entra no cardápio e os docentes do CIn passam a ver.',
  'Um docente pode reservar por até 7 dias, perguntar o que precisar e levar para uma disciplina.',
  'Vocês recebem o contato do docente e marcam a reunião de abertura com a turma.',
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
    formState: { errors, isDirty },
  } = useForm<DemandFormValues>({ resolver: zodResolver(demandFormSchema), defaultValues: toFormValues(submission ?? EMPTY_DRAFT) });
  const values = useWatch({ control }) as DemandFormValues;
  const draft = toDraft(values);
  const missing = missingForReview(draft);
  const busy = save.isPending || submit.isPending;

  // A etapa mora na URL: voltar do navegador e recarregar abrem a mesma etapa.
  const goTo = (next: number) => {
    setSearchParams(next === 0 ? {} : { etapa: String(next + 1) }, { replace: true });
    window.scrollTo(0, 0);
  };

  const next = async () => {
    if (await trigger(STEP_FIELDS[step])) goTo(Math.min(step + 1, LAST_STEP));
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

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={(event) => event.preventDefault()} noValidate className="min-w-0 rounded-xl border border-line bg-surface p-5 sm:p-8">
          <FormStepsNav step={step} onChange={goTo} />
          <h2 className="mt-8 mb-6 text-title">{FORM_STEPS[step]}</h2>

          {step === 0 && <ProblemStep register={register} control={control} errors={errors} values={values} />}
          {step === 1 && <ClassStep register={register} control={control} errors={errors} values={values} />}
          {step === 2 && <WorkStep register={register} control={control} errors={errors} values={values} setValue={setValue} />}
          {step === LAST_STEP && (
            <div>
              {missing.length > 0 ? (
                <div className="mb-8 rounded-lg bg-caution-soft px-5 py-4">
                  <p className="text-[15px] font-semibold text-caution">Falta preencher antes de enviar</p>
                  <ul className="mt-2 space-y-1 text-sm text-ink">
                    {missing.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mb-8 rounded-lg bg-accent-soft px-5 py-4 text-[15px] text-ink">
                  Tudo preenchido. Confira o texto abaixo como o docente vai ler e envie para a triagem.
                </p>
              )}
              <p className="text-[19px] leading-snug font-semibold text-ink">{draft.title || 'Demanda sem nome'}</p>
              <p className="mt-1.5 mb-6 text-[15px] leading-relaxed text-ink-2">{draft.problem}</p>
              <DemandContent
                {...draft}
                outcome={{ title: 'O que ajudaria ao fim do semestre', text: draft.expectedOutcome }}
              />
              <section className="mt-10 rounded-lg border border-line bg-surface p-5">
                <h3 className="text-[15px] font-semibold text-ink">Depois de enviar</h3>
                <ol className="mt-3 space-y-2.5">
                  {NEXT_STEPS.map((text, index) => (
                    <li key={text} className="flex gap-3 text-sm leading-relaxed text-ink-2">
                      <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-monogram text-[12px] font-semibold text-monogram-ink">
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
            <p role="alert" className="mt-6 text-sm text-critical">
              {error.message}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <div>
              {step > 0 && (
                <Button variant="secondary" size="xl" onClick={() => goTo(step - 1)}>
                  <ArrowLeftIcon size={20} />
                  Voltar
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="xl" onClick={saveDraft} disabled={busy || (!isDirty && Boolean(submission))}>
                <SaveIcon size={20} />
                {save.isPending ? 'Guardando' : 'Guardar e continuar depois'}
              </Button>
              {step < LAST_STEP ? (
                <Button variant="primary" size="xl" onClick={next} disabled={busy}>
                  Continuar
                  <ArrowRightIcon size={20} />
                </Button>
              ) : (
                <Button variant="primary" size="xl" onClick={send} disabled={busy || missing.length > 0}>
                  <SendIcon size={20} />
                  {submit.isPending ? 'Enviando' : submission?.stage === 'needs-changes' ? 'Reenviar para a triagem' : 'Enviar para a triagem'}
                </Button>
              )}
            </div>
          </div>
        </form>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-2.5 text-[13px] font-semibold text-brand-strong">Como aparece no cardápio</p>
          <DemandPreviewCard draft={draft} organization={organization} />
          <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
            O docente abre o cartão e lê o resto. Dúvidas chegam como perguntas na demanda, e vocês respondem por aqui.
          </p>
        </aside>
      </div>
    </>
  );
};

const NewDemand = () => {
  const profile = useOrgProfile();
  return (
    <Page title="Submeter demanda" subtitle="Conte o problema como vocês vivem. O L.E.I. ajuda a transformar em projeto para uma turma." back={{ to: paths.orgDemands(), label: 'Demandas' }}>
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
            <p className="text-sm text-ink-2">
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
