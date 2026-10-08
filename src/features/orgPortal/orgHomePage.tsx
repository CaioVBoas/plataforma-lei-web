import heroPhoto from '@/assets/portal/capa/ponte-capibaribe.webp';
import { LoadingState } from '@/components/feedback/queryStates';
import { ActionTile } from '@/components/ui/actionTile';
import { cardGridClassName, tileGridClassName } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/emptyState';
import { BellIcon, FolderIcon, PencilIcon, PlusIcon, TrayIcon } from '@/components/ui/icons';
import { Page, Section } from '@/components/ui/page';
import { StepCard } from '@/components/ui/stepCard';
import { TutorialInvite } from '@/components/ui/tutorialInvite';
import { WelcomeHero } from '@/components/ui/welcomeHero';
import { daysBetween } from '@/domain/calendar';
import { isOverdue, nextMilestone } from '@/domain/projectLifecycle';
import type { IsoDate, OrgAccount } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { milestoneDateLine } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { OrgDemandCard } from './components/orgDemandCard';
import type { OrgDemandSummary } from './types';
import { useMarkOrgTutorialSeen, useOrgAccount, useOrgDemands, useOrgProfile, useOrgProjects } from './useOrgPortal';
import { demandGuidance } from './utils/demandGuidance';
import { ORG_FACING_MILESTONES, ORG_MILESTONE_COPY } from './utils/orgPresentation';

const RECENT_ON_HOME = 4;

/** Etapa com a organização entra nos próximos passos quando falta até isso. */
const MILESTONE_AHEAD_DAYS = 21;

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
  const markSeen = useMarkOrgTutorialSeen();

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
  const draft = demands.find((demand) => demand.stage === 'draft');
  const waiting = demands.filter((demand) => demandGuidance(demand).yourTurn && demand.stage !== 'draft');
  const milestones = projects.flatMap((project) => {
    const next = nextMilestone(project.milestones);
    return next && ORG_FACING_MILESTONES.includes(next.id) && daysBetween(today, next.dueAt) <= MILESTONE_AHEAD_DAYS ? [{ project, milestone: next }] : [];
  });

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
      {!account.tutorialSeen && (
        <TutorialInvite
          to={paths.orgGuide}
          text="Em dois minutos vocês entendem como uma demanda chega a uma turma do CIn."
          onDismiss={() => markSeen.mutate()}
        />
      )}

      <Section title="O que vocês querem fazer?">
        <ul className={tileGridClassName}>
          <li>
            <ActionTile
              to={draft ? paths.orgEditDemand(draft.id) : paths.orgNewDemand}
              icon={draft ? <PencilIcon size={28} /> : <PlusIcon size={28} />}
              tone="accent"
              title={draft ? 'Terminar o rascunho' : 'Contar um problema'}
              text={draft ? `"${draft.title}" ainda não foi enviado.` : 'Uma turma do CIn pode ajudar a resolver.'}
            />
          </li>
          <li>
            <ActionTile
              to={paths.orgDemands('vez')}
              icon={<BellIcon size={28} />}
              tone={waiting.length > 0 ? 'caution' : 'brand'}
              title="Ver o que espera por vocês"
              text={waiting.length > 0 ? 'Ajustes e perguntas que precisam de resposta.' : 'Nada esperando agora.'}
              badge={waiting.length > 0 ? String(waiting.length) : undefined}
            />
          </li>
          <li>
            <ActionTile to={paths.orgDemands('todas')} icon={<TrayIcon size={28} />} title="Ver minhas demandas" text="Todos os problemas que vocês já contaram." />
          </li>
          <li>
            <ActionTile
              to={paths.orgProjects}
              icon={<FolderIcon size={28} />}
              title="Acompanhar projetos"
              text={milestones.length > 0 ? 'Uma etapa com vocês está chegando.' : 'As turmas que trabalham com vocês.'}
              badge={milestones.length > 0 ? String(milestones.length) : undefined}
            />
          </li>
        </ul>
      </Section>

      <Section title="Esperando por vocês" description="Só o que precisa de uma resposta ou de uma ação de vocês agora.">
        {waiting.length > 0 || milestones.length > 0 ? (
          <ul className={cardGridClassName}>
            {waiting.slice(0, RECENT_ON_HOME).map((demand) => (
              <li key={demand.id}>
                <OrgDemandCard demand={demand} />
              </li>
            ))}
            {milestones.map(({ project, milestone }) => (
              <li key={`project-${project.id}`}>
                <StepCard
                  to={paths.orgProject(project.id)}
                  kind="Etapa com vocês"
                  tone={isOverdue(milestone, today) ? 'caution' : 'accent'}
                  title={ORG_MILESTONE_COPY[milestone.id].title}
                  context={`${project.title} · ${project.disciplineName}`}
                  when={milestoneDateLine(milestone, today, true)}
                  overdue={isOverdue(milestone, today)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Tudo em dia" description="Nada esperando por vocês agora. Quando o L.E.I. pedir um ajuste ou um docente perguntar algo, aparece aqui." />
        )}
      </Section>
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
