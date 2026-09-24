import { Link } from 'react-router-dom';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { aboveRowLink } from '@/components/ui/itemList';
import type { Organization } from '@/domain/types';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';

interface OrganizationMetaProps {
  organization: Organization;
  openDemands: number;
}

/**
 * Só o que ajuda a decidir: se há demanda para levar agora e se já houve
 * projeto com o CIn. Contagem é texto; com demanda aberta vira link.
 */
export const OrganizationMeta = ({ organization, openDemands }: OrganizationMetaProps) => {
  const done = organization.history.length;

  return (
    <p className="text-[13px] text-ink-2 sm:truncate">
      {openDemands === 0 ? (
        <span className="text-ink-3">Nenhuma demanda aberta</span>
      ) : (
        <Link to={paths.organizationDemands(organization.id)} className={cn(textLinkClassName, aboveRowLink)}>
          {pluralize(openDemands, 'demanda aberta', 'demandas abertas')}
        </Link>
      )}
      {done > 0 && (
        <>
          <span aria-hidden="true"> · </span>
          {pluralize(done, 'projeto com o CIn', 'projetos com o CIn')}
        </>
      )}
    </p>
  );
};
