import { Link } from 'react-router-dom';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { aboveRowLink } from '@/components/ui/itemList';
import type { Organization } from '@/domain/types';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import { partnershipSince } from '../utils/organizationPresentation';

interface OrganizationMetaProps {
  organization: Organization;
  openDemands: number;
  /** Na própria página da organização a contagem não precisa levar a lugar nenhum. */
  linkDemands?: boolean;
}

const Dot = () => <span aria-hidden="true"> · </span>;

/**
 * Lugar, tempo de parceria e as contagens, em texto corrido. Contagem nunca é
 * pílula: com demanda aberta o número vira link, com zero fica apagado e inerte.
 */
export const OrganizationMeta = ({ organization, openDemands, linkDemands = true }: OrganizationMetaProps) => {
  const since = partnershipSince(organization.history);
  const demandsText = pluralize(openDemands, 'demanda aberta', 'demandas abertas');
  const done = organization.history.length;

  return (
    <p className={cn('text-[13px] text-ink-2', linkDemands && 'sm:truncate')}>
      {organization.location}
      {since && (
        <>
          <Dot />
          {since}
        </>
      )}
      <Dot />
      {openDemands === 0 ? (
        <span className="text-ink-3">{demandsText}</span>
      ) : linkDemands ? (
        <Link to={paths.organizationDemands(organization.id)} className={cn(textLinkClassName, aboveRowLink)}>
          {demandsText}
        </Link>
      ) : (
        demandsText
      )}
      <Dot />
      <span className={done === 0 ? 'text-ink-3' : undefined}>{pluralize(done, 'projeto concluído', 'projetos concluídos')}</span>
    </p>
  );
};
