import { CheckCircleIcon } from '@/components/ui/icons';
import { SignalPill } from '@/components/ui/signal-pill';
import type { Viability } from '../types';
import { VIABILITY_LABEL } from '../utils/demand-presentation';

interface ViabilityPillProps {
  viability: Viability;
  note: string;
}

/** Selo de viabilidade no semestre, visível antes de qualquer aceite. */
export const ViabilityPill = ({ viability, note }: ViabilityPillProps) => (
  <SignalPill tone={viability === 'fits' ? 'success' : 'neutral'} icon={<CheckCircleIcon size={15} />} title={`${VIABILITY_LABEL[viability]}. ${note}`}>
    {VIABILITY_LABEL[viability]}
  </SignalPill>
);
