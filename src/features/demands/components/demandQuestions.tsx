import { useId, useState, type FormEvent } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/formControls';
import { Tag } from '@/components/ui/tag';
import { formatShortDate } from '@/domain/calendar';
import type { Demand } from '@/domain/types';
import { useAskQuestion } from '../useDemands';

const QUESTION_LIMIT = 500;

/**
 * Perguntar antes de decidir, sem sair da plataforma. O histórico fica na
 * demanda: o próximo docente lê o que já foi respondido e não pergunta de novo.
 */
export const DemandQuestions = ({ demand, canAsk }: { demand: Demand; canAsk: boolean }) => {
  const toast = useToast();
  const fieldId = useId();
  const ask = useAskQuestion();
  const [text, setText] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    ask.mutate(
      { id: demand.id, text },
      {
        onSuccess: () => {
          setText('');
          toast.show('Pergunta enviada. O L.E.I. repassa e a resposta aparece aqui.');
        },
      },
    );
  };

  return (
    <div>
      {demand.questions.length > 0 && (
        <ul className="mb-5 divide-y divide-line border-y border-line">
          {demand.questions.map((question) => (
            <li key={question.id} className="py-4">
              <p className="text-[13px] text-ink-3">
                {question.mine ? 'Você' : question.teacherName} · {formatShortDate(question.askedAt)}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink">{question.text}</p>
              {question.answer ? (
                <div className="mt-3 rounded-lg bg-canvas px-4 py-3">
                  <p className="text-[13px] text-ink-3">
                    {question.answer.by} · {formatShortDate(question.answer.answeredAt)}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{question.answer.text}</p>
                </div>
              ) : (
                <Tag className="mt-2.5">Aguardando resposta</Tag>
              )}
            </li>
          ))}
        </ul>
      )}

      {canAsk && (
        <form onSubmit={submit}>
          <label htmlFor={fieldId} className="mb-1.5 block text-[13px] font-medium text-ink-2">
            {demand.questions.length > 0 ? 'Ainda tem dúvida?' : 'Tem uma dúvida antes de decidir?'}
          </label>
          <Textarea
            id={fieldId}
            rows={3}
            maxLength={QUESTION_LIMIT}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={`Pergunte a ${demand.organization.name} o que falta para você decidir`}
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-ink-3">O L.E.I. repassa para a organização. A resposta aparece aqui.</p>
            <Button type="submit" disabled={!text.trim() || ask.isPending}>
              Enviar pergunta
            </Button>
          </div>
          {ask.isError && (
            <p role="alert" className="mt-2 text-[13px] text-critical">
              {ask.error.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
};
