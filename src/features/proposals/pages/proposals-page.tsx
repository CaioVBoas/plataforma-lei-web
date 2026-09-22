import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { EmptyState } from '@/components/ui/empty-state';
import { BookmarkIcon } from '@/components/ui/icons';
import { SelectMenu } from '@/components/ui/select-menu';
import { UnderlineTabs } from '@/components/ui/underline-tabs';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { ProposalsTable } from '../components/proposals-table';
import { useProposals } from '../hooks/use-proposals';
import type { Proposal, ProposalStatus } from '../types';
import { isLateReady, listStatusOf } from '../utils/proposal-presentation';

type StatusFilter = 'all' | ProposalStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'draft', label: 'Em edição' },
  { value: 'ready', label: 'Prontos' },
  { value: 'registered', label: 'Registrados' },
];

const ALL_DISCIPLINES = 'all';

const ProposalsList = ({ proposals }: { proposals: Proposal[] }) => {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [discipline, setDiscipline] = useState(ALL_DISCIPLINES);

  const byDiscipline = proposals.filter((proposal) => discipline === ALL_DISCIPLINES || proposal.disciplineName === discipline);
  const byStatus = (filter: StatusFilter) =>
    byDiscipline.filter((proposal) => filter === 'all' || listStatusOf(proposal) === filter);
  const visible = byStatus(status);
  const late = proposals.filter(isLateReady);
  const disciplineNames = [...new Set(proposals.map((proposal) => proposal.disciplineName))];

  const showLate = () => {
    setStatus('ready');
    setDiscipline(ALL_DISCIPLINES);
  };

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <UnderlineTabs
            label="Situação do rascunho"
            value={status}
            onChange={setStatus}
            items={STATUS_FILTERS.map((filter) => ({ ...filter, count: byStatus(filter.value).length }))}
          />
          <SelectMenu
            label="Disciplina"
            shape="field"
            value={discipline}
            neutralValue={ALL_DISCIPLINES}
            onChange={setDiscipline}
            options={[{ value: ALL_DISCIPLINES, label: 'Todas as disciplinas' }, ...disciplineNames.map((name) => ({ value: name, label: name }))]}
          />
        </div>
        <span className="text-[13px] text-n-600 tabular-nums">{pluralize(visible.length, 'rascunho', 'rascunhos')}</span>
      </div>

      {late.length > 0 && (
        <div className="mb-5 flex flex-wrap items-baseline gap-2">
          <span className="text-sm leading-normal font-medium text-n-800">
            {late.length === 1 ? '1 rascunho pronto aguarda' : `${late.length} rascunhos prontos aguardam`} registro no SIGAA há mais de uma semana.
          </span>
          <Button variant="outline-accent" size="sm" onClick={showLate}>
            ver quais
          </Button>
        </div>
      )}

      {visible.length > 0 ? (
        <ProposalsTable proposals={visible} />
      ) : (
        <EmptyState
          icon={<BookmarkIcon size={26} className="text-azul-500" />}
          title="Nenhuma proposta ainda"
          description={'A proposta nasce quando você vincula uma demanda a uma disciplina.\nO texto já vem escrito a partir da demanda e da sua ementa, pronto para revisar.'}
          action={
            <Link to={paths.menu} className={buttonClassName({ variant: 'primary', size: 'lg' })}>
              Ver o cardápio de demandas
            </Link>
          }
        />
      )}
    </div>
  );
};

export const ProposalsPage = () => {
  usePageHeader('Rascunhos de projeto', 'Textos prontos para você registrar no SIGAA');
  const proposalsQuery = useProposals();
  return <QueryView query={proposalsQuery}>{(proposals) => <ProposalsList proposals={proposals} />}</QueryView>;
};
