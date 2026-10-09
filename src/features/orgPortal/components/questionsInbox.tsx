import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { DoubleCheckIcon, SendIcon, UndoIcon } from '@/components/ui/icons';
import { conversationOf, isAnswered } from '@/domain/questions';
import { SUBMISSION_LIMITS } from '@/domain/submission';
import type { Demand, DemandQuestion, IsoDate, QuestionReply } from '@/domain/types';
import { cn } from '@/utils/cn';
import { MONTH_NAMES } from '@/utils/format';
import { useAnswerQuestion } from '../useOrgPortal';

/** "2026-08-19" vira "19 de agosto de 2026", como o separador de dia do WhatsApp. */
const dayLabel = (date: IsoDate) => `${Number(date.slice(8, 10))} de ${MONTH_NAMES[Number(date.slice(5, 7)) - 1].toLowerCase()} de ${date.slice(0, 4)}`;

const BUBBLE_SHADOW = 'shadow-[0_1px_0.5px_rgba(10,50,50,0.13)]';

const DaySeparator = ({ date }: { date: IsoDate }) => (
  <li className="flex justify-center py-1">
    <span className={cn('rounded-md bg-surface px-3 py-1 text-caption font-medium text-ink-2', BUBBLE_SHADOW)}>{dayLabel(date)}</span>
  </li>
);

interface TeacherBubbleProps {
  question: DemandQuestion;
  replying: boolean;
  onReply?: () => void;
}

/**
 * Balão do docente, à esquerda, com o nome em petróleo e a hora. Toda pergunta
 * pode receber mais uma resposta; a que ainda não tem nenhuma diz que espera.
 */
const TeacherBubble = ({ question, replying, onReply }: TeacherBubbleProps) => {
  const waiting = !isAnswered(question);
  return (
    <li className="flex flex-col items-start">
      <div className={cn('relative max-w-[min(85%,36rem)] rounded-xl rounded-tl-none bg-surface px-3.5 pt-2 pb-1.5', BUBBLE_SHADOW, replying && 'ring-2 ring-accent/50')}>
        <span aria-hidden="true" className="absolute top-0 -left-2 border-t-[10px] border-l-[10px] border-t-surface border-l-transparent" />
        <p className="text-small font-semibold text-brand-strong">{question.teacherName}</p>
        <p className="mt-0.5 text-body whitespace-pre-line text-ink">{question.text}</p>
        <p className="mt-1 text-right text-caption text-ink-3">
          <time dateTime={`${question.askedAt}T${question.askedTime}`}>{question.askedTime}</time>
        </p>
      </div>
      {onReply && (
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onReply}
            aria-pressed={replying}
            className={cn(
              'inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-small font-semibold',
              replying ? 'bg-accent text-white' : 'bg-accent-soft text-accent hover:bg-accent/15',
            )}
          >
            <UndoIcon size={16} />
            {replying ? 'Respondendo esta' : waiting ? 'Responder esta pergunta' : 'Responder de novo'}
          </button>
          {waiting && <span className="text-caption font-semibold text-accent">Esperando resposta</span>}
        </div>
      )}
    </li>
  );
};

/** Balão de vocês, à direita, em petróleo claro, citando a pergunta e com os dois tiques. */
const ReplyBubble = ({ question, reply }: { question: DemandQuestion; reply: QuestionReply }) => (
  <li className="flex justify-end">
    <div className={cn('relative max-w-[min(85%,36rem)] rounded-xl rounded-tr-none bg-brand-50 px-3.5 pt-2 pb-1.5', BUBBLE_SHADOW)}>
      <span aria-hidden="true" className="absolute top-0 -right-2 border-t-[10px] border-r-[10px] border-t-brand-50 border-r-transparent" />
      <div className="mb-1.5 rounded-md border-l-4 border-brand bg-surface/70 px-2.5 py-1.5">
        <p className="text-caption font-semibold text-brand-strong">{question.teacherName}</p>
        <p className="line-clamp-2 text-small text-ink-2">{question.text}</p>
      </div>
      <p className="text-body whitespace-pre-line text-ink">{reply.text}</p>
      <p className="mt-1 flex items-center justify-end gap-1 text-caption text-ink-3">
        {reply.by.split(',')[0]} · <time dateTime={`${reply.at}T${reply.time}`}>{reply.time}</time>
        <DoubleCheckIcon size={16} className="text-brand" />
        <span className="sr-only">Resposta enviada</span>
      </p>
    </div>
  </li>
);

/**
 * O campo de resposta no pé da conversa, com a pergunta citada em cima.
 * Enter envia; Shift e Enter pula linha. Depois de enviar, o campo continua
 * na mesma pergunta, para mandar mais uma mensagem se quiser.
 */
const Composer = ({ demandId, question }: { demandId: string; question: DemandQuestion }) => {
  const toast = useToast();
  const fieldId = useId();
  const answer = useAnswerQuestion();
  const [text, setText] = useState('');
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  // O campo limpa na hora do envio, e não na volta do servidor: quem já começou a
  // escrever a próxima mensagem não perde o texto. Se o envio falhar, ele volta.
  const send = () => {
    const sent = text;
    if (!sent.trim() || answer.isPending) return;
    setText('');
    fieldRef.current?.focus();
    answer.mutate(
      { demandId, questionId: question.id, text: sent },
      {
        onSuccess: () => toast.show(`Resposta enviada. ${question.teacherName.split(' ')[0]} e os próximos docentes já veem na demanda.`),
        onError: () => setText((current) => current || sent),
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
  const tooLong = text.length > SUBMISSION_LIMITS.answer * 0.9;

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
          ref={fieldRef}
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
      <p className={cn('mt-1.5 text-caption', tooLong ? 'font-medium text-caution' : 'text-ink-3')}>
        {tooLong ? `${text.length} de ${SUBMISSION_LIMITS.answer} letras. Se precisar, mande o resto numa segunda mensagem.` : 'Enter envia. Shift e Enter pula linha.'}
      </p>
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
 * esquerda, vocês à direita, um separador por dia, a hora em cada balão e o
 * campo de resposta no pé. Dá para responder quantas vezes quiser; a resposta
 * vale para todos: fica na demanda, e o próximo docente já vê.
 */
export const QuestionsInbox = ({ demand, questions = demand.questions, header }: QuestionsInboxProps) => {
  const canAnswer = demand.status !== 'in-project';
  const waiting = questions.filter((question) => !isAnswered(question));
  const [replyId, setReplyId] = useState<string | undefined>();
  // A escolhida; senão a mais antiga sem resposta; senão a pergunta mais recente.
  const replyTo = questions.find((question) => question.id === replyId) ?? waiting[0] ?? questions.at(-1);
  const messages = conversationOf(questions);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Como no WhatsApp, a conversa abre na mensagem mais recente e desce quando chega uma nova.
  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages.length, demand.id]);

  return (
    <section aria-label={`Perguntas dos docentes sobre ${demand.title}`} className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
      {header}
      <div ref={scrollRef} className="max-h-[min(36rem,62vh)] min-h-[14rem] overflow-y-auto bg-canvas px-3 py-4 sm:px-5">
        {messages.length > 0 ? (
          <ol aria-label="Mensagens, da mais antiga para a mais nova" className="flex flex-col gap-3">
            {messages.map((message, index) => {
              const showDay = index === 0 || messages[index - 1].date !== message.date;
              return [
                showDay && <DaySeparator key={`dia-${message.date}-${index}`} date={message.date} />,
                message.kind === 'question' ? (
                  <TeacherBubble
                    key={`q-${message.question.id}`}
                    question={message.question}
                    replying={canAnswer && questions.length > 1 && replyTo?.id === message.question.id}
                    onReply={canAnswer ? () => setReplyId(message.question.id) : undefined}
                  />
                ) : (
                  <ReplyBubble key={`r-${message.reply.id}`} question={message.question} reply={message.reply} />
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
          {canAnswer ? 'Nenhuma pergunta para responder.' : 'A demanda virou projeto. Agora a conversa é direto com o docente, pelo contato do projeto.'}
        </p>
      )}
    </section>
  );
};
