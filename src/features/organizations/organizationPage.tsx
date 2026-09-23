import { useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { DetailList, GroupedList, ListRow } from '@/components/ui/groupedList';
import { Page, Section } from '@/components/ui/page';
import { paths } from '@/routes/paths';
import { useOrganization } from './useOrganizations';
import type { OrganizationDetail } from './types';

const OrganizationView = ({ detail }: { detail: OrganizationDetail }) => {
  const { organization, contact, openDemands, myProjects } = detail;

  return (
    <Page
      title={organization.name}
      back={{ to: paths.organizations, label: 'Organizações' }}
      subtitle={`${organization.type} · ${organization.location}`}
      width="narrow"
    >
      <Section title="Quem é">
        <p className="mb-5 max-w-[68ch] text-[15px] leading-relaxed text-ink-2">{organization.about}</p>
        <DetailList
          items={[
            { label: 'Quem é atendido', value: organization.audience },
            { label: 'Reuniões', value: organization.meetingCadence },
            { label: 'Visita da turma', value: organization.onSiteVisit },
            { label: 'Site', value: organization.site },
          ]}
        />
      </Section>

      <Section title="Contato">
        {contact ? (
          <DetailList
            items={[
              { label: 'Ponto focal', value: `${contact.focalName}, ${contact.focalRole}` },
              {
                label: 'E-mail',
                value: (
                  <a href={`mailto:${contact.email}`} className="text-accent hover:text-accent-hover">
                    {contact.email}
                  </a>
                ),
              },
              { label: 'Canal preferido', value: contact.channel },
            ]}
          />
        ) : (
          <p className="max-w-[68ch] text-sm leading-relaxed text-ink-2">
            O contato aparece quando uma demanda desta organização vira projeto seu. Assim a organização só é procurada por quem já assumiu o compromisso.
          </p>
        )}
      </Section>

      {openDemands.length > 0 && (
        <Section title="No cardápio">
          <GroupedList>
            {openDemands.map((demand) => (
              <ListRow key={demand.id} to={paths.demand(demand.id)}>
                <p className="text-[15px] font-medium text-ink">{demand.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[13px] text-ink-2">{demand.problem}</p>
              </ListRow>
            ))}
          </GroupedList>
        </Section>
      )}

      {myProjects.length > 0 && (
        <Section title="Seus projetos com esta organização">
          <GroupedList>
            {myProjects.map((project) => (
              <ListRow key={project.id} to={paths.project(project.id)}>
                <p className="text-[15px] font-medium text-ink">{project.title}</p>
                <p className="mt-0.5 text-[13px] text-ink-3">
                  {project.disciplineName} · {project.semester}
                </p>
              </ListRow>
            ))}
          </GroupedList>
        </Section>
      )}

      <Section title="Histórico com o CIn" description="O que cada projeto deixou com a organização, escrito por quem conduziu.">
        {organization.history.length > 0 ? (
          <GroupedList>
            {organization.history.map((entry) => (
              <ListRow key={`${entry.title}-${entry.semester}`}>
                <p className="text-[15px] font-medium text-ink">{entry.title}</p>
                <p className="mt-0.5 text-[13px] text-ink-3">
                  {entry.semester} · {entry.disciplineName} · {entry.teacherName}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{entry.result}</p>
              </ListRow>
            ))}
          </GroupedList>
        ) : (
          <p className="text-sm text-ink-2">Nenhum projeto concluído ainda. Seria a primeira parceria desta organização com o Centro de Informática.</p>
        )}
      </Section>
    </Page>
  );
};

export const OrganizationPage = () => {
  const { organizationId = '' } = useParams();
  const organizationQuery = useOrganization(organizationId);
  return <QueryView query={organizationQuery}>{(detail) => <OrganizationView detail={detail} />}</QueryView>;
};
