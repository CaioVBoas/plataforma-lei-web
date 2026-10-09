import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { ChatIcon, CheckIcon, ClockIcon, EyeIcon, FolderIcon, PencilIcon, TrayIcon } from '@/components/ui/icons';
import { Tag } from '@/components/ui/tag';
import type { OrgDemandStage } from '@/domain/submission';
import { cn } from '@/utils/cn';
import type { OrgDemandSummary } from '../types';
import { demandGuidance, type DemandGuidance } from '../utils/demandGuidance';
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

const ACTION_ICON: Record<DemandGuidance['action']['icon'], typeof ClockIcon> = {
  write: PencilIcon,
  answer: ChatIcon,
  see: EyeIcon,
  follow: FolderIcon,
  done: CheckIcon,
};

/** O estado da demanda numa etiqueta com ícone, igual em toda a parte do portal. */
export const StageTag = ({ stage }: { stage: OrgDemandStage }) => {
  const copy = STAGE_COPY[stage];
  const Icon = STAGE_ICON[stage];
  return (
    <Tag pill tone={copy.tone} icon={<Icon size={13} />}>
      {copy.label}
    </Tag>
  );
};

/**
 * Uma demanda em cartão, no desenho do cardápio do docente: estado, título,
 * o problema e, embaixo, o que está acontecendo em palavras simples com um
 * botão grande. Quando a vez é da organização, o cartão diz "Sua vez" e o
 * botão fica azul; a borda é a mesma de todos, sem destaque.
 */
export const OrgDemandCard = ({ demand }: { demand: OrgDemandSummary }) => {
  const guidance = demandGuidance(demand);
  const ActionIcon = ACTION_ICON[guidance.action.icon];

  return (
    <article
      className={cn(
        'relative flex h-full min-w-0 flex-col rounded-lg border border-line bg-surface p-6 sm:p-7 transition-[border-color,box-shadow] duration-150 hover:border-line-strong hover:shadow-[0_2px_8px_rgba(10,50,50,0.08)]',
      )}
    >
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
        <StageTag stage={demand.stage} />
        {guidance.yourTurn && <span className="text-small font-semibold text-accent">Sua vez</span>}
      </div>

      <h3 className="mt-4 text-h4 font-semibold text-ink">{demand.title}</h3>
      {demand.problem && <p className="mt-2 line-clamp-2 text-small text-ink-2">{demand.problem}</p>}

      <div className="mt-auto pt-6">
        <p className="rounded-md bg-canvas px-4 py-3.5 text-small text-ink">
          <span className="font-semibold">Agora: </span>
          {guidance.now}
        </p>
        <Link
          to={guidance.action.to}
          className={cn(buttonClassName({ variant: guidance.yourTurn ? 'primary' : 'secondary', size: 'xl', fullWidth: true }), 'mt-4')}
        >
          <ActionIcon size={20} />
          {guidance.action.label}
        </Link>
      </div>
    </article>
  );
};
