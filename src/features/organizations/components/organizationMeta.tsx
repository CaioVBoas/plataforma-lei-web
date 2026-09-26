import type { Organization } from '@/domain/types';
import { pluralize } from '@/utils/format';

interface OrganizationMetaProps {
  organization: Organization;
  openDemands: number;
}

/**
 * Só o que ajuda a decidir: se há demanda para levar agora e se já houve
 * projeto com o CIn. Contagem é texto; zero fica apagado.
 */
export const OrganizationMeta = ({ organization, openDemands }: OrganizationMetaProps) => {
  const done = organization.history.length;

  return (
    <p className="text-[13px] text-ink-3">
      {openDemands === 0 ? (
        'Nenhuma demanda aberta'
      ) : (
        <span className="font-medium text-ink">{pluralize(openDemands, 'demanda aberta', 'demandas abertas')}</span>
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
