import { useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { FolderIcon, TrayIcon } from '@/components/ui/icons';
import { AnchorIcon, Item, ItemList } from '@/components/ui/itemList';
import { Monogram } from '@/components/ui/monogram';
import { FactGrid, Page } from '@/components/ui/page';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { useTabParam } from '@/hooks/useTabParam';
import { Tag } from '@/components/ui/tag';
import { formatShortDate } from '@/domain/calendar';
import type { Demand } from '@/domain/types';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { useOrganization } from './useOrganizations';
import type { OrganizationDetail } from './types';

/** Botão visível só como afordância: o clique é da linha inteira. */
const RowAction = ({ children }: { children: string }) => (
  <span aria-hidden="true" className={cn(buttonClassName({ variant: 'secondary' }), 'w-full px-3')}>
    {children}
  </span>
);

const TABS = ['demandas', 'projetos', 'historico', 'contato'] as const;

/** Só aparece quando há reserva: é o que muda a decisão de quem olha. */
const reservationLine = (demand: Demand) => {
  if (!demand.reservation) return undefined;
  const until = formatShortDate(demand.reservation.until);
  return demand.reservation.mine ? `Reservada por você até ${until}` : `Reservada por ${demand.reservation.teacherName} até ${until}`;
};

const OrganizationView = ({ detail }: { detail: OrganizationDetail }) => {
  const { organization, contact, openDemands, myProjects } = detail;
  const [tab, setTab] = useTabParam(TABS);

  return (
    <Page
      title={organization.name}
      back={{ to: paths.organizations, label: 'Organizações' }}
      leading={<Monogram name={organization.name} size="lg" />}
      meta={
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
          <Tag className="shrink-0">{organization.type}</Tag>
          <span>{organization.location}</span>
        </div>
      }
    >
      <p className="mb-5 text-[15px] leading-relaxed text-ink-2">{organization.about}</p>
        <FactGrid
          items={[
            { label: 'Público atendido', value: organization.audience },
            { label: 'Reuniões', value: organization.meetingCadence },
            { label: 'Visita da turma', value: organization.onSiteVisit },
            { label: 'Site', value: organization.site },
          ]}
      />

      {/* Primeiro o que dá para levar para a turma agora. */}
      <UnderlineTabs
        label="Sobre a parceria"
        value={tab}
        onChange={setTab}
        className="mt-10"
        options={[
          { value: 'demandas', label: 'Demandas abertas', count: openDemands.length },
          { value: 'projetos', label: 'Seus projetos', count: myProjects.length },
          { value: 'historico', label: 'Histórico com o CIn', count: organization.history.length },
          { value: 'contato', label: 'Contato' },
        ]}
      />

      {tab === 'demandas' &&
        (openDemands.length > 0 ? (
          <ItemList flush>
            {openDemands.map((demand) => {
              const reservation = reservationLine(demand);
              return (
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
                  {reservation && (
                    <Tag tone="reserve" className="mt-2">
                      {reservation}
                    </Tag>
                  )}
                </Item>
              );
            })}
          </ItemList>
        ) : (
          <p className="py-6 text-sm text-ink-3">Nenhuma demanda no cardápio agora.</p>
        ))}

      {tab === 'projetos' &&
        (myProjects.length > 0 ? (
          <ItemList flush>
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
        ) : (
          <p className="py-6 text-sm text-ink-3">Você ainda não tem projeto com esta organização.</p>
        ))}

      {tab === 'contato' && (
        <div className="pt-6">
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
            <p className="text-sm text-ink-3">Aparece quando uma demanda desta organização virar projeto seu.</p>
          )}
        </div>
      )}

      {tab === 'historico' &&
        (organization.history.length > 0 ? (
          <ItemList flush>
            {organization.history.map((entry) => (
              <Item key={`${entry.title}-${entry.semester}`} anchor={<span className="pt-0.5 text-[13px] text-ink-2 tabular-nums">{entry.semester}</span>}>
                <p className="text-[15px] font-semibold text-ink">{entry.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{entry.result}</p>
                <p className="mt-1 truncate text-[13px] text-ink-3">
                  {entry.disciplineName} · {entry.teacherName}
                </p>
              </Item>
            ))}
          </ItemList>
        ) : (
          <p className="py-6 text-sm text-ink-3">Nenhum projeto ainda. O seu seria o primeiro.</p>
        ))}
    </Page>
  );
};

export const OrganizationPage = () => {
  const { organizationId = '' } = useParams();
  const organizationQuery = useOrganization(organizationId);
  return <QueryView query={organizationQuery}>{(detail) => <OrganizationView detail={detail} />}</QueryView>;
};
