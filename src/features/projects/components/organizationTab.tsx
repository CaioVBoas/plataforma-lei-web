import { Link } from 'react-router-dom';
import { DetailList } from '@/components/ui/groupedList';
import type { Project } from '@/domain/types';
import { useOrganization } from '@/features/organizations/hooks/useOrganizations';
import { paths } from '@/routes/paths';

/** Quem é o ponto focal e como falar com ele. O contato só existe aqui porque a demanda virou projeto. */
export const OrganizationTab = ({ project }: { project: Project }) => {
  const { data } = useOrganization(project.organization.id);
  const { contact } = project;

  const items = [
    { label: 'Ponto focal', value: contact.focalName },
    { label: 'Função', value: contact.focalRole },
    {
      label: 'E-mail',
      value: (
        <a href={`mailto:${contact.email}`} className="text-accent hover:text-accent-hover">
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
      <DetailList items={items} />
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link to={paths.organization(project.organization.id)} className="text-accent hover:text-accent-hover">
          Sobre {project.organization.name}
        </Link>
        <Link to={paths.demand(project.demandId)} className="text-accent hover:text-accent-hover">
          Demanda original
        </Link>
      </div>
    </div>
  );
};
