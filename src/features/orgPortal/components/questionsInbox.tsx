import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { DoubleCheckIcon, SendIcon, UndoIcon } from '@/components/ui/icons';
import { formatShortDate } from '@/domain/calendar';
import { SUBMISSION_LIMITS } from '@/domain/submission';
import type { Demand, DemandQuestion, IsoDate } from '@/domain/types';
import { cn } from '@/utils/cn';
import { MONTH_NAMES } from '@/utils/format';
import { useAnswerQuestion } from '../useOrgPortal';

/** "2026-08-19" vira "19 de agosto de 2026", como o separador de dia do WhatsApp. */
const dayLabel = (date: IsoDate) => `${Number(date.slice(8, 10))} de ${MONTH_NAMES[Number(date.slice(5, 7)) - 1].toLowerCase()} de ${date.slice(0, 4)}`;

type ChatEvent = { kind: 'question'; date: IsoDate; question: DemandQuestion } | { kind: 'answer'; date: IsoDate; question: DemandQuestion };

/** Perguntas e respostas na ordem em que aconteceram, cada uma no seu dia. */
const timeline = (questions: DemandQuestion[]): ChatEvent[] =>
  questions
    .flatMap<ChatEvent>((question) => [
      { kind: 'question', date: question.askedAt, question },
      ...(question.answer ? [{ kind: 'answer' as const, date: question.answer.answeredAt, question }] : []),
    ])
    .sort((a, b) => a.date.localeCompare(b.date) || (a.kind === 'question' ? -1 : 1));

const DaySeparator = ({ date }: { date: IsoDate }) => (
  <li className="flex justify-center py-1">
    <span className="rounded-md bg-surface px-3 py-1 text-caption font-medium text-ink-2 shadow-[0_1px_0.5px_rgba(10,50,50,0.13)]">{dayLabel(date)}</span>
  </li>
);

/** Balão do docente, à esquerda, com o nome em petróleo. Sem resposta, oferece "Responder", como no WhatsApp. */
const TeacherBubble = ({ question, replying, onReply }: { question: DemandQuestion; replying: boolean; onReply?: () => void }) => (
  <li className="flex flex-col items-start">
    <div
      className={cn(
        'relative max-w-[min(85%,36rem)] rounded-xl rounded-tl-none bg-surface px-3.5 pt-2 pb-1.5 shadow-[0_1px_0.5px_rgba(10,50,50,0.13)]',
        replying && 'ring-2 ring-accent/50',
      )}
    >
      <span aria-hidden="true" className="absolute top-0 -left-2 border-t-[10px] border-l-[10px] border-t-surface border-l-transparent" />
      <p className="text-small font-semibold text-brand-strong">{question.teacherName}</p>
      <p className="mt-0.5 text-body whitespace-pre-line text-ink">{question.text}</p>
      <p className="mt-1 text-right text-caption text-ink-3">{formatShortDate(question.askedAt)}</p>
    </div>
    {!question.answer && onReply && (
      <button
        type="button"
        onClick={onReply}
        aria-pressed={replying}
        className={cn('mt-1.5 inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-small font-semibold', replying ? 'bg-accent text-white' : 'bg-accent-soft text-accent hover:bg-accent/15')}
      >
        <UndoIcon size={16} />
        {replying ? 'Respondendo esta' : 'Responder esta pergunta'}
      </button>
    )}
  </li>
);

/** Balão de vocês, à direita, em petróleo claro, citando a pergunta respondida e com os dois tiques. */
const AnswerBubble = ({ question }: { question: DemandQuestion }) =>
  question.answer ? (
    <li className="flex justify-end">
      <div className="relative max-w-[min(85%,36rem)] rounded-xl rounded-tr-none bg-brand-50 px-3.5 pt-2 pb-1.5 shadow-[0_1px_0.5px_rgba(10,50,50,0.13)]">
        <span aria-hidden="true" className="absolute top-0 -right-2 border-t-[10px] border-r-[10px] border-t-brand-50 border-r-transparent" />
        <div className="mb-1.5 rounded-md border-l-4 border-brand bg-surface/70 px-2.5 py-1.5">
          <p className="text-caption font-semibold text-brand-strong">{question.teacherName}</p>
          <p className="line-clamp-2 text-small text-ink-2">{question.text}</p>
        </div>
        <p className="text-body whitespace-pre-line text-ink">{question.answer.text}</p>
        <p className="mt-1 flex items-center justify-end gap-1 text-caption text-ink-3">
          {question.answer.by.split(',')[0]} · {formatShortDate(question.answer.answeredAt)}
          <DoubleCheckIcon size={16} className="text-brand" />
          <span className="sr-only">Resposta enviada</span>
        </p>
      </div>
    </li>
  ) : null;

/** O campo de resposta no pé da conversa, com a pergunta citada em cima. Enter envia; Shift e Enter pula linha. */
const Composer = ({ demandId, question }: { demandId: string; question: DemandQuestion }) => {
  const toast = useToast();
  const fieldId = useId();
  const answer = useAnswerQuestion();
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim() || answer.isPending) return;
    answer.mutate(
      { demandId, questionId: question.id, text },
      {
        onSuccess: () => {
          setText('');
          toast.show(`Resposta enviada. ${question.teacherName} e os próximos docentes já veem na demanda.`);
        },
      },
    );
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    send();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    <form onSubmit={submit} className="border-t border-line bg-surface p-3 sm:p-4">
      <div className="mb-2 flex items-start gap-2 rounded-lg border-l-4 border-accent bg-accent-soft px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-small font-semibold text-accent">Respondendo a {question.teacherName}</p>
          <p className="line-clamp-2 text-small text-ink-2">{question.text}</p>
        </div>
      </div>
      <label htmlFor={fieldId} className="sr-only">
        Sua resposta para {question.teacherName}
      </label>
      <div className="flex items-end gap-2">
        <textarea
          id={fieldId}
          rows={2}
          maxLength={SUBMISSION_LIMITS.answer}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escreva a resposta para o docente"
          className="min-h-12 flex-1 resize-none rounded-2xl border border-line-strong bg-canvas px-4 py-2.5 text-body text-ink placeholder:text-ink-3 focus:border-accent focus:bg-surface focus:outline-none"
        />
        <Button type="submit" variant="primary" size="xl" disabled={!text.trim() || answer.isPending}>
          <SendIcon size={20} />
          {answer.isPending ? 'Enviando' : 'Enviar'}
        </Button>
      </div>
      {answer.isError && (
        <p role="alert" className="mt-1.5 text-small text-critical">
          {answer.error.message}
        </p>
      )}
    </form>
  );
};

interface QuestionsInboxProps {
  demand: Demand;
  /** Só parte das perguntas, quando a tela filtra por docente ou mês. Sem isso, todas. */
  questions?: DemandQuestion[];
  /** Topo da conversa, como o nome da demanda na caixa de perguntas. */
  header?: ReactNode;
}

/**
 * As perguntas da demanda em conversa, no desenho do WhatsApp: o docente à
 * esquerda, vocês à direita, um separador por dia e o campo de resposta no
 * pé. A resposta vale para todos: fica na demanda, e o próximo docente já vê.
 */
export const QuestionsInbox = ({ demand, questions = demand.questions, header }: QuestionsInboxProps) => {
  const canAnswer = demand.status !== 'in-project';
  const waiting = questions.filter((question) => !question.answer);
  const [replyId, setReplyId] = useState<string | undefined>(waiting[0]?.id);
  const replyTo = waiting.find((question) => question.id === replyId) ?? waiting[0];
  const events = timeline(questions);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Como no WhatsApp, a conversa abre na mensagem mais recente.
  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [events.length, demand.id]);

  return (
    <section aria-label={`Perguntas dos docentes sobre ${demand.title}`} className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
      {header}
      <div ref={scrollRef} className="max-h-[min(36rem,62vh)] min-h-[14rem] overflow-y-auto bg-canvas px-3 py-4 sm:px-5">
        {events.length > 0 ? (
          <ol className="flex flex-col gap-3">
            {events.map((event, index) => {
              const showDay = index === 0 || events[index - 1].date !== event.date;
              return [
                showDay && <DaySeparator key={`dia-${event.date}-${index}`} date={event.date} />,
                event.kind === 'question' ? (
                  <TeacherBubble
                    key={`q-${event.question.id}`}
                    question={event.question}
                    replying={canAnswer && replyTo?.id === event.question.id && waiting.length > 1}
                    onReply={canAnswer && waiting.length > 1 ? () => setReplyId(event.question.id) : undefined}
                  />
                ) : (
                  <AnswerBubble key={`a-${event.question.id}`} question={event.question} />
                ),
              ];
            })}
          </ol>
        ) : (
          <p className="flex min-h-[12rem] items-center justify-center text-center text-body text-ink-3">
            Nenhuma pergunta ainda. Quando um docente perguntar algo antes de decidir, a pergunta aparece aqui.
          </p>
        )}
      </div>
      {canAnswer && replyTo ? (
        <Composer key={replyTo.id} demandId={demand.id} question={replyTo} />
      ) : (
        <p className="flex items-center gap-2 border-t border-line bg-surface px-4 py-3 text-small text-ink-2">
          <DoubleCheckIcon size={20} className="shrink-0 text-brand" />
          {canAnswer
            ? 'Tudo respondido. Os docentes veem a resposta na demanda.'
            : 'A demanda virou projeto. Agora a conversa é direto com o docente, pelo contato do projeto.'}
        </p>
      )}
    </section>
  );
};
