import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/feedback/toast-context';
import { useProposals } from '@/features/proposals/hooks/use-proposals';
import { paths } from '@/routes/paths';
import type { Demand } from '../types';
import { DEMAND_ACTION } from '../utils/demand-presentation';
import { useReleaseReservation, useReserveDemand } from './use-demands';

/** Centraliza o que cada botão de demanda faz, para o cartão e o detalhe se comportarem igual. */
export const useDemandActions = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const reserve = useReserveDemand();
  const release = useReleaseReservation();
  const { data: proposals = [] } = useProposals();

  const runPrimaryAction = (demand: Demand) => {
    switch (DEMAND_ACTION[demand.status].kind) {
      case 'reserve':
        reserve.mutate(demand.id, {
          onSuccess: () =>
            toast.show('Demanda reservada por 5 dias úteis. Ela sai do cardápio dos outros docentes.', {
              label: 'Vincular agora',
              onClick: () => navigate(paths.linkDemand(demand.id)),
            }),
        });
        return;
      case 'join-queue':
        toast.show(`Interesse registrado. Se ${demand.reservedBy} liberar a reserva, avisamos você primeiro.`);
        return;
      case 'link':
        navigate(paths.linkDemand(demand.id));
        return;
      case 'open-proposal': {
        const proposal = proposals.find((candidate) => candidate.demandId === demand.id);
        navigate(proposal ? paths.proposal(proposal.id) : paths.proposals);
      }
    }
  };

  /** Liberar não é recusar: a demanda volta ao cardápio e pode ser reservada de novo. */
  const releaseReservation = (demandId: string) =>
    release.mutate(demandId, {
      onSuccess: () => toast.show('Reserva liberada. A demanda voltou ao cardápio dos outros docentes.'),
    });

  return { runPrimaryAction, releaseReservation, isBusy: reserve.isPending || release.isPending };
};
