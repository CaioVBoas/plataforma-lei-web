import { Link, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { useToast } from '@/components/feedback/toast-context';
import { BackLink } from '@/components/ui/back-link';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { SectionBlock } from '@/components/ui/section-card';
import { Tag } from '@/components/ui/tag';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { useOrganization } from '../hooks/use-organizations';
import type { OrganizationWithDemands } from '../types';

const OrganizationDetail = ({ organization }: { organization: OrganizationWithDemands }) => {
  const toast = useToast();
  const facts = [
    { label: 'Área de atuação', value: organization.area },
    { label: 'Público atendido', value: organization.audience },
    { label: 'Tamanho da equipe', value: organization.teamSize },
    { label: 'Site', value: organization.site },
  ];
  const howTheyWork = [
    { label: 'Ponto focal', value: organization.focalName },
    { label: 'Cargo', value: organization.focalRole },
    { label: 'Acompanhamento possível', value: organization.followUp },
    { label: 'Canal preferido', value: organization.channel },
    { label: 'Visita presencial', value: organization.onSiteVisit },
  ];

  return (
    <div className="max-w-[760px]">
      <BackLink to={paths.organizations}>Voltar para organizações</BackLink>

      <div className="mb-12">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h2 className="text-[30px] leading-tight font-bold tracking-[-.02em] text-pretty text-n-800">{organization.name}</h2>
          <span className="text-base text-n-500">{organization.type}</span>
        </div>
        <p className="mt-2.5 text-[13px] leading-[1.55] text-n-500">
          {[
            organization.location,
            organization.partnershipSince,
            `${pluralize(organization.completedProjects.length, 'projeto concluído', 'projetos concluídos')} com o CIn`,
          ].join(' · ')}
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <SectionBlock title="Quem é">
          <p className="mb-6 max-w-[68ch] text-[15px] leading-relaxed text-pretty text-n-700">{organization.presentation}</p>
          <dl className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[13px] text-n-500">{fact.label}</dt>
                <dd className="mt-0.5 text-[15px] leading-normal text-n-800">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </SectionBlock>

        <SectionBlock title="Temas de atuação">
          <div className="flex flex-wrap gap-2">
            {organization.themes.map((theme) => (
              <Tag key={theme} label={theme} />
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Demandas abertas">
          {organization.openDemands.length > 0 ? (
            <ul>
              {organization.openDemands.map((demand) => (
                <li key={demand.id} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3.5 border-t border-n-200 py-5">
                  <div className="min-w-0 flex-[1_1_360px]">
                    <Link to={paths.demand(demand.id)} className="block text-lg leading-[1.35] font-bold tracking-[-.01em] text-pretty text-n-800 hover:text-azul-800">
                      {demand.problem}
                    </Link>
                    <p className="mt-1.5 text-[13px] text-n-500">
                      Afeta {demand.affectedPublic} · publicada há {pluralize(demand.publishedDaysAgo, 'dia', 'dias')}
                    </p>
                  </div>
                  <Link to={paths.demand(demand.id)} className={buttonClassName({ variant: 'outline-accent', size: 'sm' })}>
                    Ver demanda
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px] text-n-600">Nenhuma demanda aberta no momento.</p>
          )}
        </SectionBlock>

        <SectionBlock title="Projetos concluídos com o CIn">
          {organization.completedProjects.length > 0 ? (
            <ul>
              {organization.completedProjects.map((project) => (
                <li key={project.title} className="border-t border-n-200 py-5">
                  <p className="text-base leading-[1.4] font-medium text-n-800">{project.title}</p>
                  <p className="mt-1 text-[13px] text-n-500">{[project.semester, project.disciplineName, project.teacherName].join(' · ')}</p>
                  <p className="mt-2 max-w-[68ch] text-[15px] leading-relaxed text-n-700">{project.deliverable}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-[68ch] text-[15px] leading-relaxed text-n-600">
              Nenhum projeto concluído ainda. Seria a primeira parceria desta organização com o Centro de Informática.
            </p>
          )}
        </SectionBlock>

        <SectionBlock title="Como trabalham">
          <dl>
            {howTheyWork.map((item) => (
              <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-n-200 py-3.5">
                <dt className="shrink-0 text-[15px] text-n-500">{item.label}</dt>
                <dd className="min-w-0 flex-[1_1_320px] text-right text-[15px] leading-normal text-n-800">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-n-700">Sabe que o resultado de um semestre pode ser protótipo, não sistema pronto.</p>
        </SectionBlock>

        <div className="flex flex-wrap items-center gap-5 border-t border-n-200 pt-8">
          <Button variant="primary" size="lg" onClick={() => toast.show('A proposta vai ao ponto focal com a sua disciplina e a janela do semestre.')}>
            Propor um projeto a esta organização
          </Button>
          <Button variant="outline-muted" size="sm" onClick={() => toast.show('Mensagem enviada ao ponto focal desta organização.')}>
            Enviar mensagem
          </Button>
          <p className="min-w-0 flex-[1_1_260px] text-[13px] leading-normal text-n-500">Use quando você já tem uma ideia e quer um parceiro para ela.</p>
        </div>
      </div>
    </div>
  );
};

export const OrganizationDetailPage = () => {
  usePageHeader('Organização', 'Histórico da parceria com o Centro de Informática');
  const { organizationId = '' } = useParams();
  const organizationQuery = useOrganization(organizationId);
  return <QueryView query={organizationQuery}>{(organization) => <OrganizationDetail organization={organization} />}</QueryView>;
};
