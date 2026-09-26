import { Link } from 'react-router-dom';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { FactGrid } from '@/components/ui/page';
import type { Project } from '@/domain/types';
import { useOrganization } from '@/features/organizations/useOrganizations';
import { paths } from '@/routes/paths';

/** Quem é o ponto focal e como falar com ele. O contato só existe aqui porque a demanda virou projeto. */
export const OrganizationTab = ({ project }: { project: Project }) => {
  const { data } = useOrganization(project.organization.id);
  const { contact } = project;

  const items = [
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
    ...(data
      ? [
          { label: 'Reuniões', value: data.organization.meetingCadence },
          { label: 'Visita', value: data.organization.onSiteVisit },
        ]
      : []),
  ];

  return (
    <div>
      <FactGrid items={items} />
      <div className="mt-6 flex flex-wrap gap-2">
        <Link to={paths.organization(project.organization.id)} className={buttonClassName({ variant: 'secondary' })}>
          Sobre {project.organization.name}
        </Link>
        <Link to={paths.demand(project.demandId)} className={buttonClassName({ variant: 'secondary' })}>
          Demanda original
        </Link>
      </div>
    </div>
  );
};
