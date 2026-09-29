import { daysBetween, formatShortDate } from '@/domain/calendar';
import { nextMilestone } from '@/domain/projectLifecycle';
import type { IsoDate } from '@/domain/types';
import type { PortalNotification } from '@/features/notifications/buildNotifications';
import { milestoneDateLine } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { capitalize, pluralize } from '@/utils/format';
import type { OrgDemandSummary, OrgProjectSummary } from '../types';
import { ORG_FACING_MILESTONES, ORG_MILESTONE_COPY } from './orgPresentation';

/** Etapa com a organização entra nos avisos quando falta até isso. */
const MILESTONE_NOTICE_DAYS = 14;

/**
 * Os avisos da organização saem do que ela já tem: perguntas de docentes sem
 * resposta e ajustes pedidos pelo L.E.I. pedem decisão; reserva, projeto novo
 * e etapa chegando são novidades.
 */
export const buildOrgNotifications = (demands: OrgDemandSummary[], projects: OrgProjectSummary[], today: IsoDate): PortalNotification[] => {
  const questions = demands
    .filter((demand) => demand.unanswered > 0)
    .map<PortalNotification>((demand) => ({
      id: `question-${demand.id}`,
      kind: 'question',
      actionable: true,
      tone: 'accent',
      label: pluralize(demand.unanswered, 'pergunta sem resposta', 'perguntas sem resposta'),
      title: demand.unanswered === 1 ? 'Um docente perguntou sobre sua demanda' : 'Docentes perguntaram sobre sua demanda',
      context: demand.title,
      to: paths.orgDemand(demand.id, 'perguntas'),
    }));

  const reviews = demands
    .filter((demand) => demand.stage === 'needs-changes')
    .map<PortalNotification>((demand) => ({
      id: `review-${demand.id}`,
      kind: 'review',
      actionable: true,
      tone: 'caution',
      label: `Pedido em ${formatShortDate(demand.review?.at ?? demand.date)}`,
      title: 'O L.E.I. pediu um ajuste',
      context: demand.title,
      to: paths.orgDemand(demand.id),
    }));

  const reservations = demands
    .filter((demand) => demand.stage === 'reserved' && demand.reservation)
    .map<PortalNotification>((demand) => ({
      id: `reservation-${demand.id}`,
      kind: 'reservation',
      actionable: false,
      tone: 'accent',
      label: `Até ${formatShortDate(demand.reservation?.until ?? today)}`,
      title: `${demand.reservation?.teacherName} está avaliando sua demanda`,
      context: demand.title,
      to: paths.orgDemand(demand.id),
    }));

  const milestones = projects.flatMap((project) => {
    const next = nextMilestone(project.milestones);
    if (!next || !ORG_FACING_MILESTONES.includes(next.id) || daysBetween(today, next.dueAt) > MILESTONE_NOTICE_DAYS) return [];
    return [
      {
        id: `project-${project.id}-${next.id}`,
        kind: 'project',
        actionable: false,
        tone: 'neutral',
        label: capitalize(milestoneDateLine(next, today, true)),
        title: ORG_MILESTONE_COPY[next.id].title,
        context: `${project.title} · ${project.disciplineName}`,
        to: paths.orgProject(project.id),
      } satisfies PortalNotification,
    ];
  });

  return [...reviews, ...questions, ...reservations, ...milestones];
};
