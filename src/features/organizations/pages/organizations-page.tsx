import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { buttonClassName } from '@/components/ui/button-styles';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/form-controls';
import { SelectMenu } from '@/components/ui/select-menu';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { useOrganizations } from '../hooks/use-organizations';
import type { OrganizationWithDemands } from '../types';
import { ALL, filterOrganizations, type OpenDemandFilter } from '../utils/organization-filters';

const TYPES = ['Órgão público', 'Unidade da UFPE', 'Organização social'];
const THEMES = ['Saúde pública', 'Gestão pública', 'Cultura', 'Segurança alimentar', 'Direitos humanos', 'Educação'];

const OrganizationItem = ({ organization }: { organization: OrganizationWithDemands }) => {
  const open = organization.openDemands.length;
  const completed = organization.completedProjects.length;

  return (
    <li className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 border-b border-n-200 pb-8">
      <div className="min-w-0 flex-[1_1_420px]">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <Link to={paths.organization(organization.id)} className="text-xl leading-[1.3] font-bold tracking-[-.01em] text-n-800 hover:text-azul-800">
            {organization.name}
          </Link>
          <span className="text-sm text-n-500">{organization.type}</span>
        </div>
        <p className="mt-1.5 max-w-[68ch] text-[15px] leading-relaxed text-n-700">{organization.summary}</p>
        <p className="mt-2 max-w-[76ch] text-[13px] leading-[1.55] text-n-500">
          {[organization.location, organization.themes.join(' e '), organization.partnershipSince].join(' · ')}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-5">
          {open > 0 ? (
            <Link to={`${paths.menu}?busca=${encodeURIComponent(organization.name.split(',')[0])}`} className={buttonClassName({ variant: 'outline-accent', size: 'sm' })}>
              {pluralize(open, 'demanda aberta', 'demandas abertas')}
            </Link>
          ) : (
            <span className="text-sm text-n-500">Nenhuma demanda aberta</span>
          )}
          <Link to={paths.completedProjects} className={buttonClassName({ variant: 'outline-accent', size: 'sm' })}>
            {completed === 0 ? 'Nenhum projeto concluído com o CIn' : `${pluralize(completed, 'projeto concluído', 'projetos concluídos')} com o CIn`}
          </Link>
        </div>
      </div>
      <Link to={paths.organization(organization.id)} className={buttonClassName({ variant: 'outline-muted', size: 'sm' })}>
        Ver organização
      </Link>
    </li>
  );
};

const OrganizationList = ({ organizations }: { organizations: OrganizationWithDemands[] }) => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState(ALL);
  const [theme, setTheme] = useState(ALL);
  const [openDemands, setOpenDemands] = useState<OpenDemandFilter>(ALL);
  const visible = filterOrganizations(organizations, { search, type, theme, openDemands });

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <SearchInput aria-label="Buscar organização por nome" placeholder="Buscar por nome" value={search} onChange={(event) => setSearch(event.target.value)} containerClassName="w-[260px]" />
          <SelectMenu
            label="Tipo de organização"
            value={type}
            neutralValue={ALL}
            onChange={setType}
            options={[{ value: ALL, label: 'Todos os tipos' }, ...TYPES.map((value) => ({ value, label: value }))]}
          />
          <SelectMenu
            label="Tema"
            value={theme}
            neutralValue={ALL}
            onChange={setTheme}
            options={[{ value: ALL, label: 'Todos os temas' }, ...THEMES.map((value) => ({ value, label: value }))]}
          />
          <SelectMenu
            label="Demandas abertas"
            value={openDemands}
            neutralValue={ALL}
            onChange={setOpenDemands}
            options={[
              { value: ALL, label: 'Com e sem demanda aberta' },
              { value: 'with-open', label: 'Só com demanda aberta' },
              { value: 'without-open', label: 'Só sem demanda aberta' },
            ]}
          />
        </div>
        <span className="text-[13px] text-n-500 tabular-nums">{pluralize(visible.length, 'organização', 'organizações')}</span>
      </div>

      {visible.length > 0 ? (
        <ul className="flex flex-col gap-8">
          {visible.map((organization) => (
            <OrganizationItem key={organization.id} organization={organization} />
          ))}
        </ul>
      ) : (
        <EmptyState
          align="start"
          title="Nenhuma organização com esses filtros"
          description="Limpe a busca ou troque o filtro de tipo e de tema para ver as demais organizações cadastradas."
        />
      )}

      <p className="mt-12 max-w-[68ch] border-t border-n-200 pt-6 text-[15px] leading-relaxed text-n-600">
        Tem uma ideia e procura parceiro? Entre em contato pela página da organização.
      </p>
    </div>
  );
};

export const OrganizationsPage = () => {
  usePageHeader('Organizações', 'Parceiros cadastrados que trazem demandas para o Centro de Informática');
  const organizationsQuery = useOrganizations();
  return <QueryView query={organizationsQuery}>{(organizations) => <OrganizationList organizations={organizations} />}</QueryView>;
};
