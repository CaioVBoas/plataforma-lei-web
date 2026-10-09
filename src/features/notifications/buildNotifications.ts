import { daysBetween, formatShortDate } from '@/domain/calendar';
import { isMyReservation } from '@/domain/reservation';
import type { Demand, IsoDate } from '@/domain/types';
import type { StatusTone } from '@/components/ui/statusLabel';
import { daysLeftLabel } from '@/features/demands/utils/demandPresentation';
import { needsAttention, type AgendaItem } from '@/features/projects/shared/utils/agenda';
import { MILESTONE_COPY, milestoneDateLine } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { capitalize } from '@/utils/format';

/** Os cinco primeiros são do docente; pergunta, ajuste e projeto são da organização. */
export type NotificationKind = 'invitation' | 'reservation' | 'milestone' | 'released' | 'answer' | 'question' | 'review' | 'project';

export interface PortalNotification {
  id: string;
  kind: NotificationKind;
  /** Pede uma decisão de quem está no portal; o resto é novidade para ler. */
  actionable: boolean;
  tone: StatusTone;
  label: string;
  title: string;
  context: string;
  to: string;
}

/** Resposta da organização continua como novidade por duas semanas. */
const ANSWER_FRESH_DAYS = 14;

/**
 * Os avisos do portal saem do que o docente já tem na mão: indicações do L.E.I.,
 * reservas, prazos das etapas, demandas que liberaram e respostas às perguntas dele.
 */
export const buildNotifications = (agenda: AgendaItem[], menu: Demand[], today: IsoDate): PortalNotification[] => {
  const invitations = menu
    .filter((demand) => demand.invitation && demand.status === 'open')
    .map<PortalNotification>((demand) => ({
      id: `invitation-${demand.id}`,
      kind: 'invitation',
      actionable: true,
      tone: 'accent',
      label: 'Indicação do L.E.I.',
      title: `${demand.invitation?.from.split(',')[0]} indicou uma demanda para você`,
      context: `${demand.title} · ${demand.organization.name}`,
      to: paths.demand(demand.id),
    }));

  const reservations = menu.filter(isMyReservation).map<PortalNotification>((demand) => ({
    id: `reservation-${demand.id}`,
    kind: 'reservation',
    actionable: true,
    tone: 'reserve',
    label: capitalize(daysLeftLabel(demand.reservation?.until ?? today, today)),
    title: 'Decidir a reserva',
    context: `${demand.title} · ${demand.organization.name}`,
    to: paths.demand(demand.id),
  }));

  const milestones = agenda.filter(needsAttention).map<PortalNotification>(({ project, milestone, overdue }) => ({
    id: `milestone-${project.id}-${milestone.id}`,
    kind: 'milestone',
    actionable: true,
    tone: overdue ? 'caution' : 'neutral',
    label: capitalize(milestoneDateLine(milestone, today, true)),
    title: MILESTONE_COPY[milestone.id].title,
    context: `${project.title} · ${project.organization.name}`,
    to: paths.project(project.id, milestone.id === 'plan' ? 'plano' : undefined),
  }));

  const released = menu
    .filter((demand) => demand.watching && demand.status === 'open')
    .map<PortalNotification>((demand) => ({
      id: `released-${demand.id}`,
      kind: 'released',
      actionable: true,
      tone: 'positive',
      label: 'Liberou',
      title: 'A demanda que você esperava está livre',
      context: `${demand.title} · ${demand.organization.name}`,
      to: paths.demand(demand.id),
    }));

  const answers = menu.flatMap((demand) =>
    demand.questions
      .filter((question) => {
        const reply = question.replies.at(-1);
        return question.mine && reply !== undefined && daysBetween(reply.at, today) <= ANSWER_FRESH_DAYS;
      })
      .map<PortalNotification>((question) => ({
        id: `answer-${question.id}`,
        kind: 'answer',
        actionable: false,
        tone: 'neutral',
        label: `Respondida em ${formatShortDate(question.replies.at(-1)?.at ?? today)}`,
        title: `${demand.organization.name} respondeu sua pergunta`,
        context: demand.title,
        to: paths.demand(demand.id, 'perguntas'),
      })),
  );

  return [...invitations, ...reservations, ...released, ...milestones, ...answers];
};
