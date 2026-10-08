import { Link, useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { ChoiceBar } from '@/components/ui/choiceBar';
import { EmptyState } from '@/components/ui/emptyState';
import { ChatIcon, CheckIcon, EyeIcon } from '@/components/ui/icons';
import { InfoBanner } from '@/components/ui/infoBanner';
import { Page } from '@/components/ui/page';
import { unansweredQuestions } from '@/domain/submission';
import { paths } from '@/routes/paths';
import { QuestionsInbox } from './components/questionsInbox';
import { useOrgQuestions } from './useOrgPortal';

type View = 'esperando' | 'respondidas';

const HELP: Record<View, string> = {
  esperando: 'Docentes perguntaram antes de decidir se levam a demanda para a turma. Escrevam a resposta embaixo da pergunta e apertem Responder.',
  respondidas: 'Perguntas que vocês já responderam. A resposta fica na demanda, para todos os docentes que a abrirem.',
};

const TITLE = 'Perguntas dos docentes';
const SUBTITLE = 'Tudo o que os docentes perguntaram sobre as demandas de vocês, num lugar só.';

/**
 * A caixa de perguntas da organização: as demandas com pergunta esperando
 * resposta primeiro, cada uma com a conversa e o campo de resposta logo abaixo.
 */
export const OrgQuestionsPage = () => {
  const { data: demands } = useOrgQuestions();
  const [searchParams, setSearchParams] = useSearchParams();
  const view: View = searchParams.get('ver') === 'respondidas' ? 'respondidas' : 'esperando';

  if (!demands) {
    return (
      <Page title={TITLE} subtitle={SUBTITLE}>
        <LoadingState />
      </Page>
    );
  }

  const waiting = demands.filter((demand) => unansweredQuestions(demand).length > 0);
  const answered = demands.filter((demand) => demand.questions.some((question) => question.answer));
  const visible = view === 'esperando' ? waiting : answered;
  const waitingCount = waiting.reduce((sum, demand) => sum + unansweredQuestions(demand).length, 0);
  const answeredCount = demands.reduce((sum, demand) => sum + demand.questions.filter((question) => question.answer).length, 0);

  return (
    <Page title={TITLE} subtitle={SUBTITLE}>
      <ChoiceBar
        label="Quais perguntas mostrar"
        value={view}
        onChange={(next) => setSearchParams(next === 'esperando' ? {} : { ver: next }, { replace: true })}
        options={[
          { value: 'esperando', label: 'Esperando resposta', icon: <ChatIcon size={20} />, count: waitingCount },
          { value: 'respondidas', label: 'Já respondidas', icon: <CheckIcon size={20} />, count: answeredCount },
        ]}
        className="mb-4"
      />
      <InfoBanner className="mb-6">{HELP[view]}</InfoBanner>

      {visible.length > 0 ? (
        <ul className="flex max-w-[860px] flex-col gap-8">
          {visible.map((demand) => (
            <li key={demand.id}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-headline">{demand.title}</h2>
                <Link to={paths.orgDemand(demand.id)} className={buttonClassName({ variant: 'secondary' })}>
                  <EyeIcon size={18} />
                  Ver a demanda
                </Link>
              </div>
              <QuestionsInbox demand={demand} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={view === 'esperando' ? 'Nenhuma pergunta esperando' : 'Nenhuma resposta ainda'}
          description={
            view === 'esperando'
              ? 'Quando um docente perguntar algo sobre uma demanda de vocês, a pergunta aparece aqui e no sino de avisos.'
              : 'Quando vocês responderem um docente, a conversa fica guardada aqui.'
          }
        />
      )}
    </Page>
  );
};
