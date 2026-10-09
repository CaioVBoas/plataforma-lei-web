import type { ClockTime, DemandQuestion, IsoDate, QuestionReply } from './types';

/** Respondida quando a organização mandou pelo menos uma resposta. */
export const isAnswered = (question: Pick<DemandQuestion, 'replies'>) => question.replies.length > 0;

export const lastReply = (question: Pick<DemandQuestion, 'replies'>): QuestionReply | undefined => question.replies.at(-1);

/** Data e hora juntas, "2026-08-19T10:12": ordena mensagens do mesmo dia. */
export const stampOf = (date: IsoDate, time: ClockTime) => `${date}T${time}`;

export const askedStamp = (question: Pick<DemandQuestion, 'askedAt' | 'askedTime'>) => stampOf(question.askedAt, question.askedTime);

/** Uma mensagem da conversa da demanda: a pergunta do docente ou uma resposta da organização. */
export type ConversationMessage =
  | { kind: 'question'; stamp: string; date: IsoDate; time: ClockTime; question: DemandQuestion }
  | { kind: 'reply'; stamp: string; date: IsoDate; time: ClockTime; question: DemandQuestion; reply: QuestionReply };

/** Todas as mensagens na ordem em que aconteceram, por data e hora. */
export const conversationOf = (questions: DemandQuestion[]): ConversationMessage[] =>
  questions
    .flatMap<ConversationMessage>((question) => [
      { kind: 'question', stamp: askedStamp(question), date: question.askedAt, time: question.askedTime, question },
      ...question.replies.map<ConversationMessage>((reply) => ({ kind: 'reply', stamp: stampOf(reply.at, reply.time), date: reply.at, time: reply.time, question, reply })),
    ])
    // Mesma data e hora: a pergunta vem antes da resposta.
    .sort((a, b) => a.stamp.localeCompare(b.stamp) || (a.kind === 'question' ? -1 : 1));

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * A hora de uma mensagem nova: a do relógio, mas nunca antes da última
 * mensagem do mesmo dia, para a conversa continuar em ordem.
 */
export const nextTime = (date: IsoDate, existing: string[], now = new Date()): ClockTime => {
  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const latestToday = existing.filter((stamp) => stamp.startsWith(date)).sort().at(-1)?.slice(11, 16);
  if (!latestToday || clock > latestToday) return clock;
  const [hours, minutes] = latestToday.split(':').map(Number);
  const total = Math.min(hours * 60 + minutes + 1, 23 * 60 + 59);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
};
