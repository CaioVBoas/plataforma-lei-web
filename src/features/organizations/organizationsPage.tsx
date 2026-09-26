import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { EmptyState } from '@/components/ui/emptyState';
import { SearchInput } from '@/components/ui/formControls';
import { cardGridClassName, linkCardClassName } from '@/components/ui/card';
import { Monogram } from '@/components/ui/monogram';
import { Page } from '@/components/ui/page';
import { paths } from '@/routes/paths';
import { normalizeText } from '@/utils/format';
import { OrganizationMeta } from './components/organizationMeta';
import { useOrganizations } from './useOrganizations';
import type { OrganizationSummary } from './types';

/** Um card por organização: quem é, o que faz em poucas linhas e se há demanda para levar agora. */
const OrganizationCard = ({ organization }: { organization: OrganizationSummary }) => (
  <Link to={paths.organization(organization.id)} className={linkCardClassName}>
    <div className="flex items-start gap-3">
      <Monogram name={organization.name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-headline group-hover:text-accent">{organization.name}</p>
        <p className="mt-0.5 truncate text-[13px] text-ink-3">
          {organization.type} · {organization.location}
        </p>
      </div>
    </div>
    <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-2">{organization.about}</p>
    <div className="mt-4 border-t border-line pt-3.5">
      <OrganizationMeta organization={organization} openDemands={organization.openDemands} />
    </div>
  </Link>
);

const OrganizationList = ({ organizations, search }: { organizations: OrganizationSummary[]; search: string }) => {
  const term = normalizeText(search.trim());
  // Quem tem demanda aberta vem primeiro: é com essas que dá para começar um projeto agora.
  const visible = organizations
    .filter((organization) => !term || normalizeText(`${organization.name} ${organization.type} ${organization.location}`).includes(term))
    .sort((a, b) => b.openDemands - a.openDemands);

  if (visible.length === 0) return <EmptyState title="Nada encontrado" description={`Nenhuma organização com "${search}".`} />;

  return (
    <ul className={cardGridClassName}>
      {visible.map((organization) => (
        <li key={organization.id}>
          <OrganizationCard organization={organization} />
        </li>
      ))}
    </ul>
  );
};

export const OrganizationsPage = () => {
  const organizationsQuery = useOrganizations();
  const [search, setSearch] = useState('');

  return (
    <Page title="Organizações" subtitle="Quem publica as demandas do cardápio.">
      <SearchInput
        aria-label="Buscar organizações"
        placeholder="Buscar organização"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        containerClassName="mb-5 w-full sm:w-[320px]"
      />
      <QueryView query={organizationsQuery}>{(organizations) => <OrganizationList organizations={organizations} search={search} />}</QueryView>
    </Page>
  );
};
