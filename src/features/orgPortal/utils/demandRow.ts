import { formatShortDate } from '@/domain/calendar';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import type { OrgDemandSummary } from '../types';

/** O que a data de cada estado quer dizer, para "24 ago 2026" nunca aparecer solto. */
export const demandDateLine = (demand: OrgDemandSummary) => {
  const date = formatShortDate(demand.date);
  const questions = demand.unanswered > 0 ? ` · ${pluralize(demand.unanswered, 'pergunta sem resposta', 'perguntas sem resposta')}` : '';
  switch (demand.stage) {
    case 'draft':
      return `Rascunho salvo em ${date}`;
    case 'in-review':
      return `Enviada em ${date}`;
    case 'needs-changes':
      return `Ajuste pedido em ${date}`;
    case 'reserved':
      return `${demand.reservation ? `${demand.reservation.teacherName} avalia até ${formatShortDate(demand.reservation.until)}` : `No cardápio desde ${date}`}${questions}`;
    case 'open':
      return `No cardápio desde ${date}${questions}`;
    case 'done':
      return `Projeto concluído, começou em ${date}`;
    default:
      return `Projeto desde ${date}`;
  }
};

/** A única ação que cabe em cada estado, e para onde a linha leva. */
export const demandAction = (demand: OrgDemandSummary): { label: string; to: string; rowTo: string; primary: boolean } => {
  const detail = demand.archived && demand.projectId ? paths.orgProject(demand.projectId) : paths.orgDemand(demand.id);
  if (demand.stage === 'draft') return { label: 'Continuar', to: paths.orgEditDemand(demand.id), rowTo: detail, primary: false };
  if (demand.stage === 'needs-changes') return { label: 'Ajustar', to: paths.orgEditDemand(demand.id), rowTo: detail, primary: true };
  if (demand.unanswered > 0) return { label: 'Responder', to: paths.orgDemand(demand.id, 'perguntas'), rowTo: detail, primary: true };
  if ((demand.stage === 'in-project' || demand.stage === 'done') && demand.projectId) {
    return { label: 'Ver projeto', to: paths.orgProject(demand.projectId), rowTo: detail, primary: false };
  }
  return { label: 'Abrir', to: detail, rowTo: detail, primary: false };
};

