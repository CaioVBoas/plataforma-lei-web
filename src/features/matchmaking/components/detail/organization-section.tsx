import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/button-styles';
import { ChevronRightIcon } from '@/components/ui/icons';
import { SectionCard } from '@/components/ui/section-card';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import type { DemandDetail } from '../../types';

const Fact = ({ label, value, note }: { label: string; value: string; note?: string }) => (
  <div>
    <p className="text-[13px] text-n-500">{label}</p>
    <p className="mt-0.5 text-sm leading-[1.45] text-n-800">{value}</p>
    {note && <p className="text-[13px] text-n-600">{note}</p>}
  </div>
);

interface OrganizationSectionProps {
  demand: DemandDetail;
  /** A conversa com a organização só abre depois que o docente segura a demanda. */
  canTalk: boolean;
}

export const OrganizationSection = ({ demand, canTalk }: OrganizationSectionProps) => (
  <SectionCard
    title="A organização"
    action={
      <Link to={paths.organization(demand.organizationId)} className={buttonClassName({ variant: 'outline-muted', size: 'sm' })}>
        Ver perfil
        <ChevronRightIcon size={13} />
      </Link>
    }
  >
    <p className="text-[15px] font-medium text-n-800">{demand.organizationName}</p>
    <p className="mt-0.5 text-[13px] text-n-500">{demand.organizationType}</p>
    <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
      <Fact label="Ponto focal" value={demand.focalName} note={demand.focalRole} />
      <Fact label="Acompanhamento possível" value={demand.followUpCadence} />
      <Fact label="Canal preferido" value={demand.channel} />
    </div>
    <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 border-t border-n-200 pt-5">
      <Fact label="Parceria com o CIn" value={demand.partnershipSince} />
      <Fact
        label="Projetos concluídos com o CIn"
        value={demand.completedWithCin === 0 ? 'Nenhum ainda' : pluralize(demand.completedWithCin, 'projeto entregue', 'projetos entregues')}
      />
      <Fact label="Visita presencial" value={demand.onSiteVisit} />
    </div>
    {!canTalk && (
      <p className="mt-4 text-[13px] leading-[1.55] text-n-500">Depois de segurar esta demanda você poderá conversar com a organização.</p>
    )}
  </SectionCard>
);
