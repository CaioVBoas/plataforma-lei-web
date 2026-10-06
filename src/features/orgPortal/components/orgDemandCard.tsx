import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { ArrowRightIcon, CheckIcon, ClockIcon, FolderIcon, PencilIcon, TrayIcon } from '@/components/ui/icons';
import { Tag } from '@/components/ui/tag';
import type { OrgDemandStage } from '@/domain/submission';
import { cn } from '@/utils/cn';
import type { OrgDemandSummary } from '../types';
import { demandGuidance } from '../utils/demandGuidance';
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
 * botão grande. Quando a vez é da organização, o cartão diz "Sua vez".
 */
export const OrgDemandCard = ({ demand }: { demand: OrgDemandSummary }) => {
  const guidance = demandGuidance(demand);

  return (
    <article
      className={cn(
        'relative flex h-full min-w-0 flex-col rounded-lg border bg-surface p-5 transition-[border-color,box-shadow] duration-150 hover:shadow-[0_2px_8px_rgba(10,50,50,0.08)]',
        guidance.yourTurn ? 'border-accent/40' : 'border-line hover:border-line-strong',
      )}
    >
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
        <StageTag stage={demand.stage} />
        {guidance.yourTurn && <span className="text-[13px] font-semibold text-accent">Sua vez</span>}
      </div>

      <h3 className="mt-3 text-[17px] leading-snug font-semibold tracking-[-0.01em] text-ink">{demand.title}</h3>
      {demand.problem && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-2">{demand.problem}</p>}

      <div className="mt-auto pt-5">
        <p className="rounded-md bg-canvas px-3.5 py-2.5 text-sm leading-relaxed text-ink">
          <span className="font-semibold">Agora: </span>
          {guidance.now}
        </p>
        <Link
          to={guidance.action.to}
          className={cn(buttonClassName({ variant: guidance.yourTurn ? 'primary' : 'secondary', fullWidth: true }), 'mt-3 h-11 text-[15px]')}
        >
          {guidance.action.label}
          <ArrowRightIcon size={16} />
        </Link>
      </div>
    </article>
  );
};
