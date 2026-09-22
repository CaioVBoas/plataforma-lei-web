import { Link } from 'react-router-dom';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import { useToggleProposalArchive } from '../hooks/use-proposals';
import type { Proposal } from '../types';
import { STATUS_LABEL, STATUS_TEXT_CLASS, isLateReady, listStatusOf, sectionsAsText } from '../utils/proposal-presentation';

const GRID = 'grid grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(110px,.9fr)_minmax(90px,.7fr)_minmax(150px,1.6fr)] gap-4';

const ProposalRow = ({ proposal }: { proposal: Proposal }) => {
  const toast = useToast();
  const toggleArchive = useToggleProposalArchive();
  const { copy } = useCopyToClipboard();
  const status = listStatusOf(proposal);

  const copySections = () => {
    copy(proposal.id, sectionsAsText(proposal.sections));
    toast.show(`${pluralize(proposal.sections.length, 'seção', 'seções')} de ${proposal.title} copiadas em sequência.`);
  };

  const archive = () =>
    toggleArchive.mutate(proposal.id, {
      onSuccess: () =>
        toast.show(proposal.archived ? `${proposal.title} reaberta como rascunho.` : `${proposal.title} arquivada. Ela sai da lista ativa.`),
    });

  return (
    <li className={cn(GRID, 'group items-center border-b border-n-200 bg-n-0 py-4', proposal.archived && 'opacity-60')}>
      <div className="min-w-0">
        <p className="text-sm leading-[1.4] font-semibold text-pretty text-n-800">{proposal.title}</p>
        <p className="mt-0.5 text-xs text-n-500">{proposal.partnerName}</p>
      </div>
      <p className="min-w-0 text-[13px] leading-[1.45] text-n-600">{proposal.originSummary}</p>
      <p className="min-w-0 text-[13px] leading-[1.45] text-n-600">{proposal.disciplineName}</p>
      <div>
        <p className={cn('text-[13px] leading-[1.4] font-medium', STATUS_TEXT_CLASS[status])}>
          {STATUS_LABEL[status]}
          {status === 'registered' && proposal.registeredOn && ` em ${proposal.registeredOn}`}
        </p>
        {isLateReady(proposal) && <p className="mt-1 text-[11px] text-n-700">há {proposal.waitingDays} dias</p>}
      </div>
      <p className="text-[13px] text-n-600 tabular-nums">{proposal.lastEditedOn}</p>
      {/* Ações aparecem no hover da linha e também quando o foco do teclado entra nela. */}
      <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-100 group-focus-within:opacity-100 group-hover:opacity-100">
        <Link to={paths.proposal(proposal.id)} className={buttonClassName({ variant: 'outline-accent', size: 'sm' })}>
          Abrir
        </Link>
        <Button variant="outline-muted" size="sm" onClick={copySections}>
          Copiar seções
        </Button>
        <Button variant="outline-muted" size="sm" disabled={toggleArchive.isPending} onClick={archive}>
          {proposal.archived ? 'Reabrir' : 'Arquivar'}
        </Button>
      </div>
    </li>
  );
};

export const ProposalsTable = ({ proposals }: { proposals: Proposal[] }) => (
  <div>
    <div className={cn(GRID, 'border-b border-n-300 py-3 text-overline text-n-500')} aria-hidden="true">
      <span>Proposta</span>
      <span>Demanda de origem</span>
      <span>Disciplina</span>
      <span>Situação</span>
      <span>Última edição</span>
      <span className="text-right">Ações</span>
    </div>
    <ul aria-label="Rascunhos de projeto">
      {proposals.map((proposal) => (
        <ProposalRow key={proposal.id} proposal={proposal} />
      ))}
    </ul>
  </div>
);
