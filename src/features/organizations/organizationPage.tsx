import { useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { FolderIcon, TrayIcon } from '@/components/ui/icons';
import { AnchorIcon, Item, ItemList } from '@/components/ui/itemList';
import { Monogram } from '@/components/ui/monogram';
import { FactGrid, Page, Section } from '@/components/ui/page';
import { Tag } from '@/components/ui/tag';
import { formatShortDate } from '@/domain/calendar';
import type { Demand } from '@/domain/types';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { OrganizationMeta } from './components/organizationMeta';
import { useOrganization } from './useOrganizations';
import type { OrganizationDetail } from './types';

/** Botão visível só como afordância: o clique é da linha inteira. */
const RowAction = ({ children }: { children: string }) => (
  <span aria-hidden="true" className={cn(buttonClassName({ variant: 'secondary' }), 'w-full px-3')}>
    {children}
  </span>
);

const demandStatusLine = (demand: Demand) => {
  const published = `Publicada em ${formatShortDate(demand.publishedAt)}`;
  if (!demand.reservation) return published;
  const until = formatShortDate(demand.reservation.until);
  return `${published} · ${demand.reservation.mine ? 'sua reserva' : `reservada por ${demand.reservation.teacherName}`} até ${until}`;
};

const OrganizationView = ({ detail }: { detail: OrganizationDetail }) => {
  const { organization, contact, openDemands, myProjects } = detail;
  useScrollToHash();

  return (
    <Page
      title={organization.name}
      back={{ to: paths.organizations, label: 'Organizações' }}
      leading={<Monogram name={organization.name} size="lg" />}
      subtitle="Histórico da parceria com o Centro de Informática"
      meta={
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
          <Tag className="shrink-0">{organization.type}</Tag>
          <div className="min-w-0">
            <OrganizationMeta organization={organization} openDemands={openDemands.length} linkDemands={false} />
          </div>
        </div>
      }
    >
      <Section title="Sobre" compact>
        <p className="mb-6 max-w-[68ch] text-[15px] leading-relaxed text-ink-2">{organization.about}</p>
        <FactGrid
          items={[
            { label: 'Público atendido', value: organization.audience },
            { label: 'Reuniões', value: organization.meetingCadence },
            { label: 'Visita da turma', value: organization.onSiteVisit },
            { label: 'Site', value: organization.site },
          ]}
        />
      </Section>

      <Section title="Contato" compact>
        {contact ? (
          <FactGrid
            items={[
              { label: 'Ponto focal', value: `${contact.focalName}, ${contact.focalRole}` },
              {
                label: 'E-mail',
                value: (
                  <a href={`mailto:${contact.email}`} className={textLinkClassName}>
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
        <Section title="Demandas abertas" id="demandas" compact>
          <ItemList>
            {openDemands.map((demand) => (
              <Item
                key={demand.id}
                to={paths.demand(demand.id)}
                label={demand.title}
                anchor={
                  <AnchorIcon>
                    <TrayIcon size={18} />
                  </AnchorIcon>
                }
                action={<RowAction>Ver demanda</RowAction>}
              >
                <p className="truncate text-[15px] font-semibold text-ink">{demand.title}</p>
                <p className="mt-1 truncate text-sm text-ink-2">{demand.problem}</p>
                <p className="mt-1.5 truncate text-[13px] text-ink-2">{demandStatusLine(demand)}</p>
              </Item>
            ))}
          </ItemList>
        </Section>
      )}

      {myProjects.length > 0 && (
        <Section title="Seus projetos com esta organização" compact>
          <ItemList>
            {myProjects.map((project) => (
              <Item
                key={project.id}
                to={paths.project(project.id)}
                label={project.title}
                anchor={
                  <AnchorIcon>
                    <FolderIcon size={18} />
                  </AnchorIcon>
                }
                action={<RowAction>Abrir projeto</RowAction>}
              >
                <p className="truncate text-[15px] font-semibold text-ink">{project.title}</p>
                <p className="mt-1 truncate text-[13px] text-ink-2">
                  {project.disciplineName} · {project.semester}
                </p>
              </Item>
            ))}
          </ItemList>
        </Section>
      )}

      <Section title="Histórico com o CIn" description="O que cada projeto deixou com a organização, escrito por quem conduziu." compact>
        {organization.history.length > 0 ? (
          <ItemList>
            {organization.history.map((entry) => (
              <Item key={`${entry.title}-${entry.semester}`} anchor={<span className="pt-0.5 text-[13px] text-ink-2 tabular-nums">{entry.semester}</span>}>
                <p className="text-[15px] font-semibold text-ink">{entry.title}</p>
                <p className="mt-1 truncate text-[13px] text-ink-2">
                  {entry.disciplineName} · {entry.teacherName}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{entry.result}</p>
              </Item>
            ))}
          </ItemList>
        ) : (
          <p className="text-sm text-ink-3">Nenhum projeto concluído ainda. Seria a primeira parceria desta organização com o Centro de Informática.</p>
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
