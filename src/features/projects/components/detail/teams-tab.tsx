import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import type { Team } from '../../types';

/** Estudante em mais de dois projetos simultâneos merece um olhar antes de receber tarefa nova. */
const HIGH_LOAD_PROJECTS = 2;

const GRID = 'grid grid-cols-[2fr_1fr_1fr_1.2fr] gap-4';

const TeamTable = ({ team }: { team: Team }) => (
  <section className="overflow-hidden">
    <div className="border-b border-n-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="heading-section">{team.name}</h3>
        <span className="text-[13px] text-n-600 tabular-nums">{pluralize(team.members.length, 'integrante', 'integrantes')}</span>
      </div>
      <p className="mt-1 max-w-[70ch] text-sm leading-normal text-n-600">{team.scope}</p>
    </div>
    <div className={cn(GRID, 'border-b border-n-300 px-6 py-[11px] text-overline text-n-500')} aria-hidden="true">
      <span>Estudante</span>
      <span>Horas no projeto</span>
      <span>Projetos simultâneos</span>
      <span>Disponibilidade declarada</span>
    </div>
    <ul>
      {team.members.map((member) => (
        <li key={member.enrollment} className={cn(GRID, 'items-center border-b border-n-200 px-6 py-3')}>
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar name={member.name} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-n-800">{member.name}</span>
              <span className="block text-xs text-n-500 tabular-nums">{member.enrollment}</span>
            </span>
          </div>
          <span className="text-sm text-n-700 tabular-nums">{member.hours}</span>
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-sm text-n-700 tabular-nums">{member.concurrentProjects}</span>
            {member.concurrentProjects > HIGH_LOAD_PROJECTS && (
              <span className="text-[13px] text-n-500">em {member.concurrentProjects} projetos ao mesmo tempo</span>
            )}
          </span>
          <span className="text-[13px] text-n-600">{member.availability}</span>
        </li>
      ))}
    </ul>
  </section>
);

interface TeamsTabProps {
  teams: Team[];
  onExportParticipants: () => void;
}

export const TeamsTab = ({ teams, onExportParticipants }: TeamsTabProps) => {
  if (teams.length === 0) {
    return <EmptyState align="start" title="Sem equipes registradas" description="Este projeto foi concluído antes de a plataforma registrar as equipes." />;
  }

  return (
    <div className="flex flex-col gap-12">
      {teams.map((team) => (
        <TeamTable key={team.name} team={team} />
      ))}
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <p className="max-w-[60ch] text-[13px] leading-normal text-n-500">Gera um arquivo para você colar no SIGAA. A plataforma não escreve lá.</p>
        <Button variant="secondary" onClick={onExportParticipants}>
          Exportar lista de participantes
        </Button>
      </div>
    </div>
  );
};
