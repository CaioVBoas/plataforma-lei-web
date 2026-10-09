import { useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { cardGridClassName } from '@/components/ui/card';
import { FolderIcon } from '@/components/ui/icons';
import { AnchorIcon, Item, ItemList } from '@/components/ui/itemList';
import { Monogram } from '@/components/ui/monogram';
import { FactGrid, Page } from '@/components/ui/page';
import { ProfileHeader } from '@/components/ui/profileHeader';
import { SideCard, SideFact } from '@/components/ui/sideCard';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { rankDisciplines } from '@/domain/matching';
import { organizationCover } from '@/lib/covers';
import { useCalendar } from '@/features/calendar/useCalendar';
import { DemandCard } from '@/features/demands/components/demandCard';
import { useCurrentDisciplines } from '@/features/disciplines/useDisciplines';
import { useTabParam } from '@/hooks/useTabParam';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import { useOrganization } from './useOrganizations';
import type { OrganizationDetail } from './types';

/** Botão visível só como afordância: o clique é da linha inteira. */
const RowAction = ({ children }: { children: string }) => (
  <span aria-hidden="true" className={cn(buttonClassName({ variant: 'secondary' }), 'w-full px-3')}>
    {children}
  </span>
);

const TABS = ['projetos', 'cin'] as const;

/**
 * Perfil da organização em uma página: quem é, o que oferece à turma, o que
 * está aberto agora e como falar com ela. Só o que é histórico fica em abas.
 */
const OrganizationView = ({ detail }: { detail: OrganizationDetail }) => {
  const { organization, contact, openDemands, myProjects } = detail;
  const [tab, setTab] = useTabParam(TABS);
  const { data: disciplines = [] } = useCurrentDisciplines();
  const { data: calendar } = useCalendar();
  const since = organization.history.map((entry) => entry.semester).sort()[0];

  return (
    <Page
      title={organization.name}
      back={{ to: paths.organizations, label: 'Organizações' }}
      hero={
        <ProfileHeader
          avatar={<Monogram name={organization.name} logo={organization.logo} size="xl" />}
          eyebrow={organization.type}
          title={organization.name}
          meta={organization.location}
          cover={organizationCover(organization.id, organization.cover)}
        />
      }
    >
      <div className="grid grid-cols-1 gap-10 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <h2 className="text-h4">Sobre</h2>
          <p className="mt-2 text-body text-ink-2">{organization.about}</p>
          <div className="mt-5">
            <FactGrid
              columns={2}
              items={[
                { label: 'Público atendido', value: organization.audience },
                { label: 'Reuniões', value: organization.meetingCadence },
                { label: 'Visita da turma', value: organization.onSiteVisit },
                { label: 'Site', value: organization.site },
              ]}
            />
          </div>

          <h2 className="mt-10 text-h4">Demandas abertas</h2>
          {openDemands.length > 0 && calendar ? (
            <ul className={cn(cardGridClassName, 'mt-4')}>
              {openDemands.map((demand) => (
                <li key={demand.id}>
                  <DemandCard demand={demand} best={rankDisciplines(demand, disciplines)[0]} today={calendar.today} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-small text-ink-3">Nenhuma demanda no cardápio agora.</p>
          )}
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-20 lg:self-start">
          <SideCard title="Parceria com o CIn">
            <dl className="grid grid-cols-3 gap-2 text-center">
              {[
                { value: openDemands.length, label: openDemands.length === 1 ? 'demanda aberta' : 'demandas abertas' },
                { value: organization.history.length, label: organization.history.length === 1 ? 'projeto concluído' : 'projetos concluídos' },
                { value: since ?? '–', label: 'desde' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-md bg-fact px-1 py-2.5">
                  <dd className="text-h4 text-brand-strong tabular-nums">{stat.value}</dd>
                  <dt className="mt-1 text-caption text-ink-2">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </SideCard>

          <SideCard title="Contato">
            {contact ? (
              <dl>
                <SideFact label="Ponto focal">
                  {contact.focalName}
                  <span className="block text-small text-ink-2">{contact.focalRole}</span>
                </SideFact>
                <SideFact label="E-mail">
                  <a href={`mailto:${contact.email}`} className={textLinkClassName}>
                    {contact.email}
                  </a>
                </SideFact>
                <SideFact label="Canal preferido">{contact.channel}</SideFact>
              </dl>
            ) : (
              <p className="text-small text-ink-2">Aparece quando uma demanda desta organização virar projeto seu.</p>
            )}
          </SideCard>
        </aside>
      </div>

      <UnderlineTabs
        label="Trabalho com o CIn"
        value={tab}
        onChange={setTab}
        className="mt-12"
        options={[
          { value: 'projetos', label: 'Projetos', count: myProjects.length },
          { value: 'cin', label: 'Interface com o CIn', count: organization.history.length },
        ]}
      />

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
                    <FolderIcon size={20} />
                  </AnchorIcon>
                }
                action={<RowAction>Abrir projeto</RowAction>}
              >
                <p className="truncate text-body font-semibold text-ink">{project.title}</p>
                <p className="mt-1 truncate text-small text-ink-2">
                  {project.disciplineName} · {project.semester}
                </p>
              </Item>
            ))}
          </ItemList>
        ) : (
          <p className="py-6 text-small text-ink-3">Você ainda não tem projeto com esta organização.</p>
        ))}

      {tab === 'cin' &&
        (organization.history.length > 0 ? (
          <ItemList flush>
            {organization.history.map((entry) => (
              <Item key={`${entry.title}-${entry.semester}`} anchor={<span className="pt-0.5 text-small font-semibold text-brand-strong tabular-nums">{entry.semester}</span>}>
                <p className="text-body font-semibold text-ink">{entry.title}</p>
                <p className="mt-1 text-small text-ink-2">{entry.result}</p>
                <p className="mt-1 truncate text-small text-ink-3">
                  {entry.disciplineName} · {entry.teacherName}
                </p>
              </Item>
            ))}
          </ItemList>
        ) : (
          <p className="py-6 text-small text-ink-3">
            Nenhum projeto com o CIn ainda. {pluralize(openDemands.length, 'demanda aberta pode', 'demandas abertas podem')} ser a primeira parceria.
          </p>
        ))}
    </Page>
  );
};

export const OrganizationPage = () => {
  const { organizationId = '' } = useParams();
  const organizationQuery = useOrganization(organizationId);
  return <QueryView query={organizationQuery}>{(detail) => <OrganizationView detail={detail} />}</QueryView>;
};
