import { useId, useState, type FormEvent } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/formControls';
import { SendIcon } from '@/components/ui/icons';
import { formatShortDate } from '@/domain/calendar';
import { SUBMISSION_LIMITS } from '@/domain/submission';
import type { Demand, DemandQuestion } from '@/domain/types';
import { pluralize } from '@/utils/format';
import { useAnswerQuestion } from '../useOrgPortal';

/** Resposta escrita logo abaixo da pergunta, recuada à direita, onde o balão azul vai aparecer. */
const AnswerForm = ({ demandId, question }: { demandId: string; question: DemandQuestion }) => {
  const toast = useToast();
  const fieldId = useId();
  const answer = useAnswerQuestion();
  const [text, setText] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || answer.isPending) return;
    answer.mutate(
      { demandId, questionId: question.id, text },
      { onSuccess: () => toast.show(`Resposta enviada. ${question.teacherName} e os próximos docentes já veem na demanda.`) },
    );
  };

  return (
    <form onSubmit={submit} className="mt-2.5 ml-auto max-w-[88%]">
      <label htmlFor={fieldId} className="mb-1 block px-1 text-right text-[12px] text-ink-3">
        Sua resposta para {question.teacherName}
      </label>
      <Textarea
        id={fieldId}
        rows={3}
        maxLength={SUBMISSION_LIMITS.answer}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Responda com o que o docente precisa para decidir"
        className="text-[14px]"
      />
      {answer.isError && (
        <p role="alert" className="mt-1.5 text-[13px] text-critical">
          {answer.error.message}
        </p>
      )}
      <div className="mt-2 flex justify-end">
        <Button type="submit" variant="primary" size="sm" disabled={!text.trim() || answer.isPending}>
          <SendIcon size={14} />
          {answer.isPending ? 'Enviando' : 'Responder'}
        </Button>
      </div>
    </form>
  );
};

/** Mesmo desenho da conversa no portal do docente: pergunta em balão branco, resposta em azul à direita. */
const Exchange = ({ demandId, question, canAnswer }: { demandId: string; question: DemandQuestion; canAnswer: boolean }) => (
  <li>
    <div className="max-w-[88%]">
      <p className="mb-1 px-1 text-[12px] text-ink-3">
        {question.teacherName} · {formatShortDate(question.askedAt)}
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
    ) : canAnswer ? (
      <AnswerForm demandId={demandId} question={question} />
    ) : (
      <p className="mt-2 px-1 text-[12px] text-ink-3">Sem resposta</p>
    )}
  </li>
);

/**
 * Perguntas dos docentes sobre a demanda. Responder aqui vale para todos: a
 * resposta fica na demanda e o próximo docente não precisa perguntar de novo.
 */
export const QuestionsInbox = ({ demand }: { demand: Demand }) => {
  const { questions } = demand;
  const unanswered = questions.filter((question) => !question.answer).length;
  const canAnswer = demand.status !== 'in-project';

  return (
    <section aria-label="Perguntas dos docentes" className="overflow-hidden rounded-lg border border-line bg-surface">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-3">
        <p className="text-[15px] font-semibold text-ink">Perguntas dos docentes</p>
        {questions.length > 0 && (
          <p className="text-[12px] text-ink-3">
            {pluralize(questions.length, 'pergunta', 'perguntas')} · {pluralize(unanswered, 'sem resposta', 'sem resposta')}
          </p>
        )}
      </header>
      <div className="bg-canvas px-4 py-4">
        {questions.length > 0 ? (
          <ol className="space-y-6">
            {questions.map((question) => (
              <Exchange key={question.id} demandId={demand.id} question={question} canAnswer={canAnswer} />
            ))}
          </ol>
        ) : (
          <p className="flex min-h-[108px] items-center justify-center text-center text-sm text-ink-3">
            Nenhuma pergunta ainda. Quando um docente perguntar algo antes de decidir, a pergunta aparece aqui.
          </p>
        )}
      </div>
      <p className="border-t border-line bg-surface px-4 py-3 text-[13px] text-ink-3">
        {canAnswer
          ? 'A resposta fica na demanda, visível para todos os docentes que a abrirem.'
          : 'A demanda virou projeto. Agora a conversa é direto com o docente, pelo contato do projeto.'}
      </p>
    </section>
  );
};
