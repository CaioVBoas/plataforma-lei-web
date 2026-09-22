import { Link } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { buttonClassName } from '@/components/ui/button-styles';
import { EmptyState } from '@/components/ui/empty-state';
import { ReadOnlySections } from '@/features/proposals/components/read-only-sections';
import { useProposal } from '@/features/proposals/hooks/use-proposals';
import { paths } from '@/routes/paths';

export const DraftTab = ({ proposalId }: { proposalId?: string }) => {
  const proposalQuery = useProposal(proposalId);

  if (!proposalId) {
    return <EmptyState align="start" title="Sem rascunho na plataforma" description="Este projeto foi registrado no SIGAA antes de a plataforma gerar propostas." />;
  }

  return (
    <QueryView query={proposalQuery}>
      {(proposal) => (
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 text-azul-800">
              <p className="text-sm font-medium">Somente leitura</p>
              <p className="mt-0.5 text-[13px] leading-normal">
                {proposal.registeredOn
                  ? `Você declarou o registro no SIGAA em ${proposal.registeredOn}. Editar aqui não altera o que já foi registrado lá.`
                  : 'O registro no SIGAA ainda não foi declarado. Edite no rascunho antes de transpor.'}
              </p>
            </div>
            <Link to={paths.proposal(proposal.id)} className={buttonClassName({ variant: 'secondary' })}>
              Editar proposta
            </Link>
          </div>
          <ReadOnlySections sections={proposal.sections} />
        </div>
      )}
    </QueryView>
  );
};
