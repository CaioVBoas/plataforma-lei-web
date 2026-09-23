import { useId, useState, type FormEvent } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/formControls';
import { Modal } from '@/components/ui/modal';
import type { IsoDate, Milestone, OutcomeAdoption, Project } from '@/domain/types';
import { cn } from '@/utils/cn';
import { useCompleteMilestone } from '../useProjectWorkspace';
import { ADOPTION_COPY, MILESTONE_COPY } from '../../shared/utils/projectPresentation';

/** O que cada etapa pergunta além da data. O plano não passa por aqui: é confirmado na aba Plano. */
const NOTE_PROMPT: Partial<Record<Milestone['id'], { label: string; placeholder: string }>> = {
  kickoff: { label: 'O que ficou combinado, opcional', placeholder: 'Escopo, dia das reuniões, regras de sigilo' },
  midterm: { label: 'Como a organização recebeu, opcional', placeholder: 'O que funcionou e o que precisa mudar' },
  final: { label: 'Como a organização recebeu, opcional', placeholder: 'O que foi entregue e em que estado' },
};

const ADOPTION_OPTIONS: OutcomeAdoption[] = ['in-use', 'partial', 'not-used'];

interface CompleteMilestoneModalProps {
  project: Project;
  milestone: Milestone;
  today: IsoDate;
  onClose: () => void;
}

export const CompleteMilestoneModal = ({ project, milestone, today, onClose }: CompleteMilestoneModalProps) => {
  const toast = useToast();
  const complete = useCompleteMilestone();
  const formId = useId();
  const [doneAt, setDoneAt] = useState(today);
  const [note, setNote] = useState('');
  const [sigaaCode, setSigaaCode] = useState('');
  const [summary, setSummary] = useState('');
  const [adoption, setAdoption] = useState<OutcomeAdoption>('in-use');

  const copy = MILESTONE_COPY[milestone.id];
  const notePrompt = NOTE_PROMPT[milestone.id];
  const isClosing = milestone.id === 'closing';

  const submit = (event: FormEvent) => {
    event.preventDefault();
    complete.mutate(
      {
        projectId: project.id,
        milestoneId: milestone.id,
        doneAt,
        note,
        sigaaCode: milestone.id === 'sigaa' ? sigaaCode : undefined,
        outcome: isClosing ? { summary, adoption } : undefined,
      },
      {
        onSuccess: () => {
          toast.show(copy.doneMessage);
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      title={copy.title}
      description={copy.description}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form={formId} disabled={complete.isPending || (isClosing && !summary.trim())}>
            {isClosing ? 'Encerrar projeto' : 'Registrar'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} className="flex flex-col gap-5">
        <Field label={isClosing ? 'Data do encerramento' : 'Quando aconteceu'} htmlFor={`${formId}-date`}>
          <div className="w-48">
            <Input id={`${formId}-date`} type="date" required max={today} value={doneAt} onChange={(event) => setDoneAt(event.target.value)} />
          </div>
        </Field>

        {milestone.id === 'sigaa' && (
          <Field label="Código do registro, opcional" htmlFor={`${formId}-code`} hint="A plataforma não acessa o SIGAA. Ela só guarda o que você informar.">
            <div className="w-60">
              <Input id={`${formId}-code`} value={sigaaCode} onChange={(event) => setSigaaCode(event.target.value)} placeholder="PJ-2026-0000" />
            </div>
          </Field>
        )}

        {notePrompt && (
          <Field label={notePrompt.label} htmlFor={`${formId}-note`}>
            <Textarea id={`${formId}-note`} rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder={notePrompt.placeholder} />
          </Field>
        )}

        {isClosing && (
          <>
            <Field label="O que ficou com a organização" htmlFor={`${formId}-summary`} hint="Duas linhas bastam. O próximo docente vai ler isto antes de começar.">
              <Textarea
                id={`${formId}-summary`}
                rows={3}
                required
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Ex.: Painel de estoque em uso pela equipe de logística desde novembro."
              />
            </Field>
            <fieldset>
              <legend className="mb-2 text-[13px] font-medium text-ink-2">A organização usa a entrega?</legend>
              <div className="flex flex-col gap-1">
                {ADOPTION_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className={cn('flex h-10 cursor-pointer items-center gap-3 rounded-md px-3 text-sm', adoption === option ? 'bg-accent-soft' : 'hover:bg-canvas')}
                  >
                    <input type="radio" name={`${formId}-adoption`} checked={adoption === option} onChange={() => setAdoption(option)} className="accent-accent" />
                    {ADOPTION_COPY[option]}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {complete.isError && (
          <p role="alert" className="text-sm text-critical">
            {complete.error.message}
          </p>
        )}
      </form>
    </Modal>
  );
};
