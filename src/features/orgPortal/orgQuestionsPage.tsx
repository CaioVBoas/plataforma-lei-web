import { useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { FilterDropdown } from '@/components/ui/filterDropdown';
import { SearchInput } from '@/components/ui/formControls';
import { ArrowLeftIcon, EyeIcon, TrayIcon, UserIcon } from '@/components/ui/icons';
import { MonthPicker } from '@/components/ui/monthPicker';
import { Page } from '@/components/ui/page';
import { daysBetween, formatShortDate } from '@/domain/calendar';
import { conversationOf, isAnswered } from '@/domain/questions';
import type { Demand, DemandQuestion } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { normalizeText } from '@/utils/format';
import { StageTag } from './components/orgDemandCard';
import { QuestionsInbox } from './components/questionsInbox';
import { useOrgQuestions } from './useOrgPortal';

type Situation = 'todas' | 'esperando' | 'respondidas';
const ALL = 'todas';

interface Conversation {
  demand: Demand;
  /** As perguntas que passam nos filtros. */
  questions: DemandQuestion[];
  waiting: number;
  /** Data e hora do último movimento, pergunta ou resposta: ordena a lista. */
  stamp: string;
  /** Como a lista mostra a hora: "14:32" hoje, "Ontem", ou a data. */
  when: string;
  preview: string;
}

/** Hoje mostra a hora; ontem, "Ontem"; antes disso, a data, como no WhatsApp. */
const whenLabel = (stamp: string, today: string) => {
  const date = stamp.slice(0, 10);
  const days = daysBetween(date, today);
  if (days === 0) return stamp.slice(11, 16);
  if (days === 1) return 'Ontem';
  return formatShortDate(date);
};

/** A última mensagem da conversa, para a prévia e a ordem da lista. */
const lastOf = (questions: DemandQuestion[]) => {
  const last = conversationOf(questions).at(-1);
  if (!last) return { stamp: '', text: '' };
  return last.kind === 'question'
    ? { stamp: last.stamp, text: `${last.question.teacherName.split(' ')[0]}: ${last.question.text}` }
    : { stamp: last.stamp, text: `Vocês: ${last.reply.text}` };
};

/** Uma conversa na lista: a demanda, a última mensagem e quantas perguntas esperam, como no WhatsApp. */
const ConversationItem = ({ conversation, selected, onSelect }: { conversation: Conversation; selected: boolean; onSelect: () => void }) => (
  <li>
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'flex w-full items-start gap-3 border-l-4 px-4 py-3.5 text-left transition-colors',
        selected ? 'border-brand bg-brand-50' : 'border-transparent hover:bg-canvas',
      )}
    >
      <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-monogram text-monogram-ink">
        <TrayIcon size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className={cn('truncate text-body text-ink', conversation.waiting > 0 ? 'font-semibold' : 'font-medium')}>{conversation.demand.title}</span>
          <span className={cn('shrink-0 text-caption', conversation.waiting > 0 ? 'font-semibold text-accent' : 'text-ink-3')}>{conversation.when}</span>
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span className="line-clamp-1 text-small text-ink-2">{conversation.preview}</span>
          {conversation.waiting > 0 && (
            <span className="min-w-6 shrink-0 rounded-full bg-accent px-1.5 text-center text-caption font-semibold text-white tabular-nums">
              {conversation.waiting}
              <span className="sr-only"> sem resposta</span>
            </span>
          )}
        </span>
      </span>
    </button>
  </li>
);

/** Um grupo da lista de conversas, com o nome em caixa alta e a linha separando do grupo de cima. */
const ConversationGroup = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="border-t border-line first:border-t-0">
    <p className="bg-canvas/60 px-4 pt-3 pb-2 text-overline text-ink-3">{title}</p>
    <ul className="divide-y divide-line">{children}</ul>
  </div>
);

const TITLE = 'Perguntas dos docentes';
const SUBTITLE = 'Toque numa conversa para ler e responder.';

/**
 * A caixa de perguntas da organização, no desenho do WhatsApp: a lista de
 * conversas (uma por demanda) à esquerda, separada entre as que esperam
 * resposta e as já respondidas, e a conversa aberta à direita. Em cima, a
 * linha de filtros. No celular, a lista vem primeiro e a conversa abre por cima.
 */
export const OrgQuestionsPage = () => {
  const { data: demands } = useOrgQuestions();
  const { data: calendar } = useCalendar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const param = (key: string) => searchParams.get(key) ?? '';
  const setParam = (key: string, value: string) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value && value !== ALL) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  if (!demands || !calendar) {
    return (
      <Page title={TITLE} subtitle={SUBTITLE}>
        <LoadingState />
      </Page>
    );
  }

  const situation = (['esperando', 'respondidas'].includes(param('situacao')) ? param('situacao') : ALL) as Situation;
  const demandFilter = param('demanda') || ALL;
  const teacherFilter = param('docente') || ALL;
  const month = param('mes');
  const term = normalizeText(search.trim());

  const allQuestions = demands.flatMap((demand) => demand.questions);
  const teachers = [...new Set(allQuestions.map((question) => question.teacherName))].sort((a, b) => a.localeCompare(b));
  const months = [...new Set(allQuestions.map((question) => question.askedAt.slice(0, 7)))].sort();

  const passes = (demand: Demand, question: DemandQuestion) =>
    (situation === ALL || (situation === 'esperando' ? !isAnswered(question) : isAnswered(question))) &&
    (teacherFilter === ALL || question.teacherName === teacherFilter) &&
    (!month || question.askedAt.startsWith(month)) &&
    (!term || normalizeText(`${demand.title} ${question.text} ${question.replies.map((reply) => reply.text).join(' ')} ${question.teacherName}`).includes(term));

  const conversations: Conversation[] = demands
    .filter((demand) => demandFilter === ALL || demand.id === demandFilter)
    .map((demand) => {
      const questions = demand.questions.filter((question) => passes(demand, question));
      const last = lastOf(questions);
      return {
        demand,
        questions,
        waiting: questions.filter((question) => !isAnswered(question)).length,
        stamp: last.stamp,
        when: last.stamp ? whenLabel(last.stamp, calendar.today) : '',
        preview: last.text,
      };
    })
    .filter((conversation) => conversation.questions.length > 0)
    // Em cada grupo, a conversa com o movimento mais recente fica em cima.
    .sort((a, b) => b.stamp.localeCompare(a.stamp));
  const waitingList = conversations.filter((conversation) => conversation.waiting > 0);
  const answeredList = conversations.filter((conversation) => conversation.waiting === 0);

  const openId = param('conversa');
  const open = conversations.find((conversation) => conversation.demand.id === openId);
  // No desktop sempre há uma conversa aberta: a escolhida ou a primeira da lista.
  const shown = open ?? conversations[0];
  const filtering = situation !== ALL || demandFilter !== ALL || teacherFilter !== ALL || Boolean(month) || Boolean(term);

  return (
    <Page title={TITLE} subtitle={SUBTITLE}>
      <div role="search" aria-label="Filtrar perguntas" className="mb-5 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
        <SearchInput
          aria-label="Buscar nas perguntas"
          placeholder="Buscar nas perguntas"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          containerClassName="sm:w-[14rem]"
        />
        <FilterDropdown
          label="Mostrar"
          value={situation}
          onChange={(value) => setParam('situacao', value)}
          options={[
            { value: 'todas', label: 'Todas as perguntas', count: allQuestions.length },
            { value: 'esperando', label: 'Esperando resposta', count: allQuestions.filter((question) => !isAnswered(question)).length },
            { value: 'respondidas', label: 'Já respondidas', count: allQuestions.filter(isAnswered).length },
          ]}
        />
        <FilterDropdown
          label="Demanda"
          icon={<TrayIcon size={20} />}
          value={demandFilter}
          onChange={(value) => setParam('demanda', value)}
          options={[{ value: ALL, label: 'Todas' }, ...demands.map((demand) => ({ value: demand.id, label: demand.title, count: demand.questions.length }))]}
        />
        <FilterDropdown
          label="Docente"
          icon={<UserIcon size={20} />}
          value={teacherFilter}
          onChange={(value) => setParam('docente', value)}
          options={[
            { value: ALL, label: 'Todos' },
            ...teachers.map((name) => ({ value: name, label: name, count: allQuestions.filter((question) => question.teacherName === name).length })),
          ]}
        />
        <MonthPicker value={month} onChange={(value) => setParam('mes', value)} available={months} current={calendar.today.slice(0, 7)} />
        {filtering && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSearchParams(openId ? { conversa: openId } : {}, { replace: true });
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-body font-medium text-accent hover:bg-accent-soft"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          title={filtering ? 'Nada com esses filtros' : 'Nenhuma pergunta ainda'}
          description={
            filtering
              ? 'Mude ou limpe os filtros para ver outras conversas.'
              : 'Quando um docente perguntar algo, a conversa aparece aqui.'
          }
        />
      ) : (
        <div className="@container">
          {/* Lado a lado só quando cabe de fato: com texto grande e zoom, uma conversa por vez. */}
          <div className="grid gap-6 @min-[52rem]:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)]">
            <nav aria-label="Conversas" className={cn('self-start overflow-hidden rounded-xl border border-line bg-surface', open && '@max-[52rem]:hidden')}>
              <p className="border-b border-line px-4 py-3 text-body font-semibold text-ink">Conversas</p>
              {waitingList.length > 0 && (
                <ConversationGroup title={`Esperando resposta · ${waitingList.length}`}>
                  {waitingList.map((conversation) => (
                    <ConversationItem
                      key={conversation.demand.id}
                      conversation={conversation}
                      selected={shown?.demand.id === conversation.demand.id}
                      onSelect={() => setParam('conversa', conversation.demand.id)}
                    />
                  ))}
                </ConversationGroup>
              )}
              {answeredList.length > 0 && (
                <ConversationGroup title={`Já respondidas · ${answeredList.length}`}>
                  {answeredList.map((conversation) => (
                    <ConversationItem
                      key={conversation.demand.id}
                      conversation={conversation}
                      selected={shown?.demand.id === conversation.demand.id}
                      onSelect={() => setParam('conversa', conversation.demand.id)}
                    />
                  ))}
                </ConversationGroup>
              )}
            </nav>

            {shown && (
              <div className={cn('min-w-0', !open && '@max-[52rem]:hidden')}>
                {open && (
                  <button
                    type="button"
                    onClick={() => setParam('conversa', '')}
                    className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-body font-medium text-ink-2 hover:bg-fill @min-[52rem]:hidden"
                  >
                    <ArrowLeftIcon size={20} />
                    Voltar às conversas
                  </button>
                )}
                <QuestionsInbox
                  key={shown.demand.id}
                  demand={shown.demand}
                  questions={shown.questions}
                  header={
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
                      <div className="min-w-0">
                        <h2 className="text-h4">{shown.demand.title}</h2>
                        <div className="mt-1">
                          <StageTag stage={shown.demand.status === 'reserved' ? 'reserved' : shown.demand.status === 'open' ? 'open' : 'in-project'} />
                        </div>
                      </div>
                      <Link to={paths.orgDemand(shown.demand.id)} className={buttonClassName({ variant: 'secondary' })}>
                        <EyeIcon size={20} />
                        Ver a demanda
                      </Link>
                    </div>
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Page>
  );
};
