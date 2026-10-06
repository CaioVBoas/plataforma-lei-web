import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { GroupRow } from '@/components/ui/groupCard';
import { CheckIcon, ClockIcon, FolderIcon, PencilIcon, TrayIcon } from '@/components/ui/icons';
import { Tag } from '@/components/ui/tag';
import type { OrgDemandStage } from '@/domain/submission';
import type { OrgDemandSummary } from '../types';
import { demandAction, demandDateLine } from '../utils/demandRow';
import { STAGE_COPY } from '../utils/orgPresentation';

const STAGE_ICON: Record<OrgDemandStage, typeof ClockIcon> = {
  draft: PencilIcon,
  'in-review': ClockIcon,
  'needs-changes': PencilIcon,
  open: TrayIcon,
  reserved: ClockIcon,
  'in-project': FolderIcon,
  done: CheckIcon,
};

/** O ícone do estado, também usado no aviso da situação. */
export const StageIcon = ({ stage, size = 17 }: { stage: OrgDemandStage; size?: number }) => {
  const Icon = STAGE_ICON[stage];
  return <Icon size={size} />;
};

/** O estado em pílula com ícone, como no cabeçalho da demanda. */
export const StageTag = ({ demand }: { demand: Pick<OrgDemandSummary, 'stage'> }) => {
  const stage = STAGE_COPY[demand.stage];
  const Icon = STAGE_ICON[demand.stage];
  return (
    <Tag pill tone={stage.tone} icon={<Icon size={13} />}>
      {stage.label}
    </Tag>
  );
};

/** Uma demanda numa lista em cartão (Início e Demandas): ícone, título, data, estado e ação. */
export const OrgDemandRow = ({ demand }: { demand: OrgDemandSummary }) => {
  const action = demandAction(demand);
  return (
    <GroupRow
      to={action.rowTo}
      label={demand.title}
      icon={<TrayIcon size={17} />}
      title={demand.title}
      meta={demandDateLine(demand)}
      status={<StageTag demand={demand} />}
      action={
        <Link to={action.to} className={buttonClassName({ variant: action.primary ? 'primary' : 'secondary', size: 'sm' })}>
          {action.label}
        </Link>
      }
    />
  );
};
