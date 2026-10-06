import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { ArrowRightIcon } from '@/components/ui/icons';
import { Monogram } from '@/components/ui/monogram';
import { FactGrid } from '@/components/ui/page';
import type { Organization } from '@/domain/types';
import { paths } from '@/routes/paths';

/**
 * Quem pediu a demanda, em um cartão de perfil: o que faz, como trabalha com a
 * turma e o último projeto com o CIn. O contato só aparece depois do projeto (regra 6).
 */
export const OrganizationBrief = ({ organization, hasProject }: { organization: Organization; hasProject: boolean }) => {
  const last = organization.history[0];

  return (
    <div className="rounded-lg border border-line p-5">
      <div className="flex items-center gap-3.5">
        <Monogram name={organization.name} logo={organization.logo} size="lg" />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-brand-strong">{organization.type}</p>
          <p className="text-[19px] leading-tight font-bold text-ink">{organization.name}</p>
          <p className="mt-0.5 text-[13px] text-ink-3">{organization.location}</p>
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{organization.about}</p>

      <div className="mt-4">
        <FactGrid
          columns={2}
          items={[
            { label: 'Público atendido', value: organization.audience },
            { label: 'Visita da turma', value: organization.onSiteVisit },
          ]}
        />
      </div>

      <div className="mt-4 rounded-md bg-canvas px-3.5 py-3">
        <p className="text-[12px] font-semibold text-ink-2">Com o CIn</p>
        {last ? (
          <p className="mt-0.5 text-sm text-ink">
            {organization.history.length === 1 ? '1 projeto' : `${organization.history.length} projetos`}. O mais recente: {last.title}, em {last.semester}.
          </p>
        ) : (
          <p className="mt-0.5 text-sm text-ink">Esta seria a primeira parceria.</p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        {!hasProject && <p className="text-[13px] text-ink-3">O contato do ponto focal aparece quando a demanda virar projeto seu.</p>}
        <Link to={paths.organization(organization.id)} className={buttonClassName({ variant: 'secondary' })}>
          Ver perfil da organização
          <ArrowRightIcon size={15} />
        </Link>
      </div>
    </div>
  );
};
