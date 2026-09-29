import { TrayIcon } from '@/components/ui/icons';
import { AnchorIcon, Item } from '@/components/ui/itemList';
import { Tag } from '@/components/ui/tag';
import { formatShortDate } from '@/domain/calendar';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import type { OrgDemandSummary } from '../types';
import { STAGE_COPY } from '../utils/orgPresentation';

/** O que a data de cada estado quer dizer, para "24 ago 2026" nunca aparecer solto. */
const dateLine = (demand: OrgDemandSummary) => {
  const date = formatShortDate(demand.date);
  switch (demand.stage) {
    case 'draft':
      return `Salvo em ${date}`;
    case 'in-review':
      return `Enviada em ${date}`;
    case 'needs-changes':
      return `Ajuste pedido em ${date}`;
    case 'reserved':
      return demand.reservation ? `${demand.reservation.teacherName}, até ${formatShortDate(demand.reservation.until)}` : `No cardápio desde ${date}`;
    case 'open':
      return `No cardápio desde ${date}`;
    default:
      return `Projeto desde ${date}`;
  }
};

/** Uma demanda na lista: estado em tag, a data que importa para esse estado e as perguntas esperando. */
export const OrgDemandRow = ({ demand }: { demand: OrgDemandSummary }) => {
  const stage = STAGE_COPY[demand.stage];
  return (
    <Item
      to={paths.orgDemand(demand.id)}
      label={demand.title}
      anchor={
        <AnchorIcon>
          <TrayIcon size={18} />
        </AnchorIcon>
      }
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="min-w-0 text-[15px] font-semibold text-ink">{demand.title}</p>
        <Tag tone={stage.tone}>{stage.label}</Tag>
      </div>
      {demand.problem && <p className="mt-1 line-clamp-1 text-sm text-ink-2">{demand.problem}</p>}
      <p className="mt-1 text-[13px] text-ink-3">
        {dateLine(demand)}
        {demand.unanswered > 0 && <span className="font-medium text-accent"> · {pluralize(demand.unanswered, 'pergunta sem resposta', 'perguntas sem resposta')}</span>}
      </p>
    </Item>
  );
};
