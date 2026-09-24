import { useState } from 'react';
import { QueryView } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { SearchInput } from '@/components/ui/formControls';
import { Item, ItemList } from '@/components/ui/itemList';
import { Monogram } from '@/components/ui/monogram';
import { Page } from '@/components/ui/page';
import { Tag } from '@/components/ui/tag';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { normalizeText } from '@/utils/format';
import { OrganizationMeta } from './components/organizationMeta';
import { useOrganizations } from './useOrganizations';
import type { OrganizationSummary } from './types';

const OrganizationItem = ({ organization }: { organization: OrganizationSummary }) => (
  <Item
    to={paths.organization(organization.id)}
    label={organization.name}
    anchor={<Monogram name={organization.name} />}
    action={
      // Só afordância: quem recebe o clique é a linha inteira.
      <span aria-hidden="true" className={cn(buttonClassName({ variant: 'secondary' }), 'w-full px-3')}>
        Ver organização
      </span>
    }
  >
    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 sm:flex-nowrap">
      <p className="min-w-0 text-headline sm:truncate">{organization.name}</p>
      <Tag className="shrink-0">{organization.type}</Tag>
    </div>
    <p className="mt-1 truncate text-sm text-ink-2">{organization.about}</p>
    <div className="mt-1.5">
      <OrganizationMeta organization={organization} openDemands={organization.openDemands} />
    </div>
  </Item>
);

const OrganizationList = ({ organizations, search }: { organizations: OrganizationSummary[]; search: string }) => {
  const term = normalizeText(search.trim());
  // Quem tem demanda aberta vem primeiro: é com essas que dá para começar um projeto agora.
  const visible = organizations
    .filter((organization) => !term || normalizeText(`${organization.name} ${organization.type} ${organization.location}`).includes(term))
    .sort((a, b) => b.openDemands - a.openDemands);

  if (visible.length === 0) return <EmptyState title="Nada encontrado" description={`Nenhuma organização com "${search}".`} />;

  return (
    <ItemList>
      {visible.map((organization) => (
        <OrganizationItem key={organization.id} organization={organization} />
      ))}
    </ItemList>
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
