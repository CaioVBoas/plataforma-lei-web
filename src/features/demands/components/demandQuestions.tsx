import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/formControls';
import { SendIcon } from '@/components/ui/icons';
import { formatShortDate } from '@/domain/calendar';
import type { Demand, DemandQuestion } from '@/domain/types';
import { pluralize } from '@/utils/format';
import { useAskQuestion } from '../useDemands';

const QUESTION_LIMIT = 500;

/**
 * Conversa, não lista: a pergunta do docente em balão branco à esquerda e a
 * resposta da organização em azul, recuada à direita, para nunca se confundir com card.
 */
const Exchange = ({ question }: { question: DemandQuestion }) => (
  <li>
    <div className="max-w-[88%]">
      <p className="mb-1 px-1 text-[12px] text-ink-3">
        {question.mine ? 'Você' : question.teacherName} · {formatShortDate(question.askedAt)}
      </p>
      <p className="rounded-lg rounded-tl-sm border border-line bg-surface px-3.5 py-2.5 text-[14px] leading-relaxed text-ink">{question.text}</p>
    </div>
    {question.answer ? (
      <div className="mt-2.5 ml-auto max-w-[88%]">
        <p className="mb-1 px-1 text-right text-[12px] text-ink-3">
          {question.answer.by} · {formatShortDate(question.answer.answeredAt)}
        </p>
        <p className="rounded-lg rounded-tr-sm bg-accent-soft px-3.5 py-2.5 text-[14px] leading-relaxed text-ink">{question.answer.text}</p>
      </div>
    ) : (
      <p className="mt-2 flex items-center gap-1.5 px-1 text-[12px] text-ink-3">
        <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-ink-3" />
        Aguardando resposta da organização
      </p>
    )}
  </li>
);

/**
 * Perguntar antes de decidir, sem sair da plataforma. A conversa tem altura
 * fixa e rola por dentro, com o campo de escrever sempre embaixo: a página não
 * cresce com o número de mensagens. O histórico fica para o próximo docente.
 */
export const DemandQuestions = ({ demand, canAsk }: { demand: Demand; canAsk: boolean }) => {
  const toast = useToast();
  const fieldId = useId();
  const ask = useAskQuestion();
  const [text, setText] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);
  const { questions } = demand;
  const answered = questions.filter((question) => question.answer).length;

  // Como num chat, a conversa abre na mensagem mais recente e desce quando chega uma nova.
  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [questions.length]);

  const send = () => {
    if (!text.trim() || ask.isPending) return;
    ask.mutate(
      { id: demand.id, text },
      {
        onSuccess: () => {
          setText('');
          toast.show('Pergunta enviada. A organização responde no portal dela e a resposta aparece aqui.');
        },
      },
    );
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    send();
  };

  // Enter envia; Shift+Enter quebra a linha.
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  };

  return (
    <section aria-label={`Conversa com ${demand.organization.name}`} className="flex flex-col overflow-hidden rounded-lg border border-line">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-3">
        <p className="text-[15px] font-semibold text-ink">Conversa com {demand.organization.name}</p>
        {questions.length > 0 && (
          <p className="text-[12px] text-ink-3">
            {pluralize(questions.length, 'pergunta', 'perguntas')} · {pluralize(answered, 'respondida', 'respondidas')}
          </p>
        )}
      </header>

      <div ref={threadRef} tabIndex={0} aria-label="Mensagens" className="max-h-[min(440px,55vh)] min-h-[140px] overflow-y-auto overscroll-contain bg-canvas px-4 py-4">
        {questions.length > 0 ? (
          <ol className="space-y-5">
            {questions.map((question) => (
              <Exchange key={question.id} question={question} />
            ))}
          </ol>
        ) : (
          <p className="flex min-h-[108px] items-center justify-center text-center text-sm text-ink-3">
            Nenhuma pergunta ainda. A resposta que você receber fica aqui para os próximos docentes.
          </p>
        )}
      </div>

      {canAsk ? (
        <form onSubmit={submit} className="border-t border-line bg-surface p-3">
          <label htmlFor={fieldId} className="sr-only">
            Sua pergunta para {demand.organization.name}
          </label>
          <div className="flex items-end gap-2">
            <Textarea
              id={fieldId}
              rows={2}
              maxLength={QUESTION_LIMIT}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Pergunte a ${demand.organization.name} o que falta para você decidir`}
              style={{ resize: 'none' }}
              className="max-h-40 min-h-[44px] flex-1 text-[14px]"
            />
            <Button type="submit" variant="primary" size="lg" aria-label="Enviar pergunta" disabled={!text.trim() || ask.isPending} className="shrink-0">
              <SendIcon size={16} />
              <span className="hidden sm:inline">Enviar</span>
            </Button>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 px-0.5 text-[12px] text-ink-3">
            <span>A organização recebe no portal dela. Enter envia, Shift+Enter quebra a linha.</span>
            {text.length > QUESTION_LIMIT * 0.8 && (
              <span className="tabular-nums">
                {text.length}/{QUESTION_LIMIT}
              </span>
            )}
          </div>
          {ask.isError && (
            <p role="alert" className="mt-2 text-[13px] text-critical">
              {ask.error.message}
            </p>
          )}
        </form>
      ) : (
        <p className="border-t border-line bg-surface px-4 py-3 text-[13px] text-ink-3">
          Esta demanda virou projeto. Fale com a organização pelo contato do projeto.
        </p>
      )}
    </section>
  );
};
