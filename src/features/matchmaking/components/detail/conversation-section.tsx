import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/form-controls';
import { SectionCard } from '@/components/ui/section-card';
import { ToggleChip } from '@/components/ui/toggle-chip';
import { cn } from '@/utils/cn';
import { useSendQuestion } from '../../hooks/use-demands';
import type { ConversationMessage, MessageRecipient } from '../../types';

const RECIPIENTS: Record<MessageRecipient, { label: string; sent: string }> = {
  partner: { label: 'Perguntar à organização', sent: 'Pergunta enviada ao ponto focal da organização.' },
  lei: { label: 'Perguntar ao L.E.I.', sent: 'Pergunta enviada à equipe do Aperta o PLEI.' },
};

const MessageBubble = ({ message }: { message: ConversationMessage }) => (
  <div className={cn('flex', message.mine ? 'justify-end' : 'justify-start')}>
    <div
      className={cn(
        'max-w-[min(78%,56ch)] border px-3.5 py-3',
        message.mine ? 'rounded-[14px_14px_4px_14px] border-azul-100 bg-azul-50' : 'rounded-[14px_14px_14px_4px] border-n-150 bg-n-50',
      )}
    >
      <div className="mb-[5px] flex items-baseline gap-2">
        <span className="text-[13px] font-medium text-n-800">{message.author}</span>
        {message.role && <span className="text-xs text-n-500">{message.role}</span>}
      </div>
      <p className="text-sm leading-[1.55] text-n-700">{message.text}</p>
      <p className={cn('mt-[5px] text-xs text-n-400 tabular-nums', message.mine && 'text-right')}>{message.date}</p>
    </div>
  </div>
);

interface ConversationSectionProps {
  demandId: string;
  messages: ConversationMessage[];
}

export const ConversationSection = ({ demandId, messages }: ConversationSectionProps) => {
  const toast = useToast();
  const send = useSendQuestion(demandId);
  const [recipient, setRecipient] = useState<MessageRecipient>('partner');
  const [question, setQuestion] = useState('');
  const historyRef = useRef<HTMLDivElement>(null);

  // A mensagem mais recente fica sempre visível, inclusive logo depois de enviar.
  useEffect(() => {
    const history = historyRef.current;
    if (history) history.scrollTop = history.scrollHeight;
  }, [messages.length]);

  const submit = () => {
    const text = question.trim();
    if (!text) {
      toast.show('Escreva a dúvida antes de enviar.');
      return;
    }
    send.mutate(
      { recipient, text },
      {
        onSuccess: () => {
          setQuestion('');
          toast.show(RECIPIENTS[recipient].sent);
        },
      },
    );
  };

  return (
    <SectionCard title="Conversa">
      <div
        ref={historyRef}
        role="log"
        aria-label="Histórico da conversa"
        className="mb-5 flex h-[340px] flex-col gap-3.5 overflow-y-auto rounded-xl border border-n-200 bg-n-0 p-4"
      >
        {messages.map((message, index) => (
          <MessageBubble key={`${message.date}-${index}`} message={message} />
        ))}
      </div>
      <div className="border-t border-n-200 pt-5">
        <div role="radiogroup" aria-label="Destinatário" className="mb-2.5 flex gap-2">
          {(Object.keys(RECIPIENTS) as MessageRecipient[]).map((option) => (
            <ToggleChip key={option} role="radio" aria-checked={recipient === option} selected={recipient === option} showCheck={false} onClick={() => setRecipient(option)}>
              {RECIPIENTS[option].label}
            </ToggleChip>
          ))}
        </div>
        <Textarea
          aria-label="Sua pergunta"
          placeholder="Escreva a dúvida que precisa ser respondida antes de você decidir"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="min-h-[76px]"
        />
        <div className="mt-2.5 flex justify-end">
          <Button variant="secondary" disabled={send.isPending} onClick={submit}>
            {RECIPIENTS[recipient].label}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
};
