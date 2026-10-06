import { Link } from 'react-router-dom';
import heroPhoto from '@/assets/portal/capa/ponte-capibaribe.webp';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { cardGridClassName } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/emptyState';
import { ItemList } from '@/components/ui/itemList';
import { Page, Section } from '@/components/ui/page';
import { StepCard } from '@/components/ui/stepCard';
import { WelcomeHero } from '@/components/ui/welcomeHero';
import { daysBetween, formatShortDate } from '@/domain/calendar';
import { isOverdue, nextMilestone } from '@/domain/projectLifecycle';
import type { IsoDate, OrgAccount } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { milestoneDateLine } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { OrgDemandRow } from './components/orgDemandRow';
import { SubmitDemandCallout } from './components/submitDemandCallout';
import type { OrgDemandSummary, OrgProjectSummary } from './types';
import { useOrgAccount, useOrgDemands, useOrgProfile, useOrgProjects } from './useOrgPortal';
import { ORG_FACING_MILESTONES, ORG_MILESTONE_COPY } from './utils/orgPresentation';

const RECENT_ON_HOME = 4;

/** Etapa com a organização entra nos próximos passos quando falta até isso. */
const MILESTONE_AHEAD_DAYS = 21;

interface NextStepsProps {
  demands: OrgDemandSummary[];
  projects: OrgProjectSummary[];
  today: IsoDate;
}

/** O que pede a organização agora: ajuste do L.E.I., perguntas de docentes e etapa do projeto chegando. O rascunho fica no bloco de submeter. */
const NextSteps = ({ demands, projects, today }: NextStepsProps) => {
  const reviews = demands.filter((demand) => demand.stage === 'needs-changes');
  const questions = demands.filter((demand) => demand.unanswered > 0);
  const milestones = projects.flatMap((project) => {
    const next = nextMilestone(project.milestones);
    return next && ORG_FACING_MILESTONES.includes(next.id) && daysBetween(today, next.dueAt) <= MILESTONE_AHEAD_DAYS ? [{ project, milestone: next }] : [];
  });

  if (reviews.length + questions.length + milestones.length === 0) {
    return <EmptyState title="Nada pendente" description="Quando um docente perguntar algo ou o L.E.I. pedir um ajuste, aparece aqui." />;
  }

  return (
    <ul className={cardGridClassName}>
      {reviews.map((demand) => (
        <li key={`review-${demand.id}`}>
          <StepCard
            to={paths.orgDemand(demand.id)}
            kind="Ajuste pedido pelo L.E.I."
            tone="caution"
            title="Ajustar e reenviar"
            context={demand.title}
            when={demand.review && formatShortDate(demand.review.at)}
          />
        </li>
      ))}
      {questions.map((demand) => (
        <li key={`question-${demand.id}`}>
          <StepCard
            to={paths.orgDemand(demand.id, 'perguntas')}
            kind="Pergunta de docente"
            tone="accent"
            title={demand.unanswered === 1 ? 'Responder a pergunta' : `Responder ${demand.unanswered} perguntas`}
            context={demand.title}
          />
        </li>
      ))}
      {milestones.map(({ project, milestone }) => (
        <li key={`project-${project.id}`}>
          <StepCard
            to={paths.orgProject(project.id)}
            kind="Projeto com a turma"
            tone={isOverdue(milestone, today) ? 'caution' : 'neutral'}
            title={ORG_MILESTONE_COPY[milestone.id].title}
            context={`${project.title} · ${project.disciplineName}`}
            when={milestoneDateLine(milestone, today, true)}
            overdue={isOverdue(milestone, today)}
          />
        </li>
      ))}
    </ul>
  );
};

const count = (demands: OrgDemandSummary[], ...stages: OrgDemandSummary['stage'][]) => demands.filter((demand) => stages.includes(demand.stage)).length;

const heroLine = (organizationName: string, demands: OrgDemandSummary[]) => {
  if (demands.length === 0) return `Boas-vindas ao PLEI. Conte o primeiro problema de ${organizationName} e o L.E.I. ajuda a levar para uma turma do CIn.`;
  const onMenu = count(demands, 'open', 'reserved');
  const evaluating = count(demands, 'reserved');
  const base = `${organizationName} no PLEI.`;
  if (evaluating > 0) {
    return `${base} ${evaluating === 1 ? 'Uma demanda está sendo avaliada por um docente' : `${evaluating} demandas estão sendo avaliadas por docentes`} agora.`;
  }
  if (onMenu > 0) return `${base} ${onMenu === 1 ? 'Uma demanda está' : `${onMenu} demandas estão`} no cardápio, à vista dos docentes do CIn.`;
  return `${base} Acompanhe aqui cada pedido, do envio ao fim do projeto.`;
};

const OrgHomeContent = ({ account, organizationName, today }: { account: OrgAccount; organizationName: string; today: IsoDate }) => {
  const { data: demands } = useOrgDemands();
  const { data: projects } = useOrgProjects();
  const firstName = account.name.split(' ')[0];

  if (!demands || !projects) {
    return (
      <Page title={`Olá, ${firstName}`}>
        <LoadingState />
      </Page>
    );
  }

  const inReview = count(demands, 'in-review', 'needs-changes');
  const onMenu = count(demands, 'open', 'reserved');
  const running = count(demands, 'in-project');

  return (
    <Page
      title={`Olá, ${firstName}`}
      hero={
        <WelcomeHero
          photo={heroPhoto}
          title={`Olá, ${firstName}`}
          line={heroLine(organizationName, demands)}
          stats={[
            { value: inReview, label: 'na triagem' },
            { value: onMenu, label: 'no cardápio' },
            { value: running, label: 'em projeto' },
          ]}
        />
      }
    >
      <Section title="O que pede sua atenção" description="Ajustes pedidos pelo L.E.I., perguntas de docentes e as etapas dos projetos em que vocês participam.">
        <NextSteps demands={demands} projects={projects} today={today} />
      </Section>

      <div className="mt-10">
        <SubmitDemandCallout draft={demands.find((demand) => demand.stage === 'draft')} firstTime={demands.length === 0} />
      </div>

      {demands.length > 0 && (
        <Section
          title="Suas demandas"
          aside={
            <Link to={paths.orgDemands()} className={buttonClassName({ variant: 'secondary', size: 'sm' })}>
              Ver todas
            </Link>
          }
        >
          <ItemList>
            {demands.slice(0, RECENT_ON_HOME).map((demand) => (
              <OrgDemandRow key={demand.id} demand={demand} />
            ))}
          </ItemList>
        </Section>
      )}

    </Page>
  );
};

export const OrgHomePage = () => {
  const { data: account } = useOrgAccount();
  const { data: profile } = useOrgProfile();
  const { data: calendar } = useCalendar();
  if (!account || !profile || !calendar) return <LoadingState />;
  return <OrgHomeContent account={account} organizationName={profile.organization.name} today={calendar.today} />;
};
