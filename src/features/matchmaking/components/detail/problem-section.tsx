import type { ReactNode } from 'react';
import { ClockIcon, MapPinIcon, PersonIcon } from '@/components/ui/icons';
import { SectionCard } from '@/components/ui/section-card';
import { capitalize } from '@/utils/format';
import type { DemandDetail } from '../../types';

const Fact = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div>
    <div className="mb-1.5 flex items-center gap-[7px] text-n-500">
      {icon}
      <span className="text-[13px]">{label}</span>
    </div>
    <p className="text-sm leading-[1.45] text-n-800">{value}</p>
  </div>
);

export const ProblemSection = ({ demand }: { demand: DemandDetail }) => (
  <SectionCard title="O problema">
    <p className="mb-5 max-w-[68ch] text-[15px] leading-relaxed text-pretty text-n-700">{demand.description}</p>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5 border-t border-n-200 pt-5">
      <Fact icon={<PersonIcon size={15} />} label="Quem é afetado" value={capitalize(demand.affectedPublic)} />
      <Fact icon={<MapPinIcon size={15} />} label="Onde acontece" value={demand.where} />
      <Fact icon={<ClockIcon size={15} strokeWidth={1.8} />} label="Há quanto tempo" value={demand.since} />
    </div>
  </SectionCard>
);
