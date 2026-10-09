import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { ConfirmDialog } from '@/components/ui/confirmDialog';
import { UndoIcon } from '@/components/ui/icons';
import { Monogram } from '@/components/ui/monogram';
import { SideCard, SideFact } from '@/components/ui/sideCard';
import { Stepper } from '@/components/ui/stepper';
import { maxTeams } from '@/domain/disciplineRules';
import { canWithdraw, projectStage } from '@/domain/projectLifecycle';
import type { Project } from '@/domain/types';
import { useDiscipline } from '@/features/disciplines/useDisciplines';
import { useOrganization } from '@/features/organizations/useOrganizations';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { useUpdateTeams, useWithdrawProject } from '../useProjectWorkspace';

const WithdrawModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const withdraw = useWithdrawProject();

  const confirm = () =>
    withdraw.mutate(project.id, {
      onSuccess: () => {
        toast.show('Você desistiu do projeto. A demanda voltou para o cardápio.');
        navigate(paths.projects, { replace: true });
      },
    });

  return (
    <ConfirmDialog
      icon={<UndoIcon size={26} />}
      title="Desistir deste projeto?"
      description={`A demanda volta para o cardápio e ${project.organization.name} recebe o aviso. O plano e as anotações deste projeto são apagados.`}
      confirmLabel="Sim, desistir"
      confirmIcon={<UndoIcon size={20} />}
      cancelLabel="Continuar com o projeto"
      pending={withdraw.isPending}
      pendingLabel="Desistindo"
      error={withdraw.error?.message}
      onConfirm={confirm}
      onClose={onClose}
    />
  );
};

/**
 * Quantas equipes da turma trabalham neste projeto, e quantos estudantes isso
 * soma. Desistir só aparece no planejamento (regra 7).
 */
const TeamCard = ({ project }: { project: Project }) => {
  const { data: discipline } = useDiscipline(project.disciplineId);
  const updateTeams = useUpdateTeams();
  const [withdrawing, setWithdrawing] = useState(false);
  const done = projectStage(project.milestones) === 'done';
  const students = discipline ? Math.min(discipline.students, project.teams * discipline.teamSize) : 0;

  return (
    <SideCard title="Turma no projeto">
      <Link to={paths.discipline(project.disciplineId)} className="text-body font-semibold text-ink hover:text-brand-strong">
        {project.disciplineName}
      </Link>
      {discipline && (
        <>
          <div className="mt-3 rounded-md border border-fact-line bg-fact p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-small font-semibold text-fact-label">Equipes</span>
              {done ? (
                <span className="text-small font-medium text-ink">{pluralize(project.teams, 'equipe', 'equipes')}</span>
              ) : (
                <Stepper
                  label="equipes"
                  value={project.teams}
                  min={1}
                  max={maxTeams(discipline)}
                  onChange={(teams) => updateTeams.mutate({ projectId: project.id, teams })}
                  formatValue={(value) => pluralize(value, 'equipe', 'equipes')}
                />
              )}
            </div>
            <p className="mt-2.5 text-small text-ink-2">
              <span className="font-semibold text-brand-strong tabular-nums">
                {students} de {discipline.students}
              </span>{' '}
              estudantes da turma, em equipes de até {discipline.teamSize}.
            </p>
          </div>
        </>
      )}

      {canWithdraw(project) && (
        <div className="mt-4 border-t border-line pt-3">
          <Button variant="destructive" size="sm" className="-ml-3" onClick={() => setWithdrawing(true)}>
            <UndoIcon size={16} />
            Desistir do projeto
          </Button>
          <p className="mt-1 text-caption text-ink-3">Possível até o registro no SIGAA. A demanda volta para o cardápio.</p>
        </div>
      )}

      {withdrawing && <WithdrawModal project={project} onClose={() => setWithdrawing(false)} />}
    </SideCard>
  );
};

/** O contato só existe aqui porque a demanda virou projeto (regra 6). */
const ContactCard = ({ project }: { project: Project }) => {
  const { data } = useOrganization(project.organization.id);
  const { contact, organization } = project;

  return (
    <SideCard title="Organização">
      <Link to={paths.organization(organization.id)} className="group mb-4 flex items-center gap-3">
        <Monogram name={organization.name} />
        <span className="min-w-0">
          <span className="block truncate text-body font-semibold text-ink group-hover:text-brand-strong">{organization.name}</span>
          <span className="block truncate text-caption text-ink-3">{organization.type}</span>
        </span>
      </Link>
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
        {data && <SideFact label="Reuniões">{data.organization.meetingCadence}</SideFact>}
        {data && <SideFact label="Visita da turma">{data.organization.onSiteVisit}</SideFact>}
      </dl>
    </SideCard>
  );
};

export const ProjectAside = ({ project }: { project: Project }) => (
  <aside className="flex flex-col gap-5 lg:sticky lg:top-20 lg:self-start">
    <TeamCard project={project} />
    <ContactCard project={project} />
  </aside>
);
