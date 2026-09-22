import { useState } from 'react';
import { QueryView } from '@/components/feedback/query-states';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/form-controls';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';
import { Page } from '@/components/ui/page';
import { StatusLabel } from '@/components/ui/status-label';
import { paths } from '@/routes/paths';
import { normalizeText, pluralize } from '@/utils/format';
import { useOrganizations } from '../hooks/use-organizations';
import type { OrganizationSummary } from '../types';

const OrganizationList = ({ organizations, search }: { organizations: OrganizationSummary[]; search: string }) => {
  const term = normalizeText(search.trim());
  const visible = organizations
    .filter((organization) => !term || normalizeText(`${organization.name} ${organization.type} ${organization.location}`).includes(term))
    .sort((a, b) => b.openDemands - a.openDemands);

  if (visible.length === 0) return <EmptyState title="Nada encontrado" description={`Nenhuma organização com "${search}".`} />;

  return (
    <GroupedList>
      {visible.map((organization) => (
        <ListRow
          key={organization.id}
          to={paths.organization(organization.id)}
          trailing={
            organization.openDemands > 0 && (
              <StatusLabel tone="accent">{pluralize(organization.openDemands, 'demanda aberta', 'demandas abertas')}</StatusLabel>
            )
          }
        >
          <p className="text-[15px] font-medium text-ink">{organization.name}</p>
          <p className="mt-0.5 text-[13px] text-ink-3">
            {organization.type} · {organization.location}
            {organization.history.length > 0 && ` · ${pluralize(organization.history.length, 'projeto', 'projetos')} com o CIn`}
          </p>
        </ListRow>
      ))}
    </GroupedList>
  );
};

export const OrganizationsPage = () => {
  const organizationsQuery = useOrganizations();
  const [search, setSearch] = useState('');

  return (
    <Page title="Organizações" subtitle="Quem publica as demandas e o que já foi feito com cada uma.">
      <SearchInput
        aria-label="Buscar organizações"
        placeholder="Buscar por nome ou lugar"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        containerClassName="mb-5 w-full sm:w-[320px]"
      />
      <QueryView query={organizationsQuery}>{(organizations) => <OrganizationList organizations={organizations} search={search} />}</QueryView>
    </Page>
  );
};
