import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Stepper } from '@/components/ui/stepper';
import { maxTeams } from '@/domain/disciplineRules';
import { canWithdraw, projectStage } from '@/domain/projectLifecycle';
import type { Project } from '@/domain/types';
import { useDiscipline } from '@/features/disciplines/useDisciplines';
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
    <Modal
      title="Desistir deste projeto?"
      description={`A demanda volta para o cardápio e ${project.organization.name} recebe o aviso. O plano e as anotações deste projeto são apagados.`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Continuar com o projeto
          </Button>
          <Button variant="destructive" disabled={withdraw.isPending} onClick={confirm}>
            Desistir
          </Button>
        </>
      }
    />
  );
};

/** Ajustes que não são etapa: número de equipes e desistência, esta só no planejamento (regra 7). */
export const ProjectSettings = ({ project }: { project: Project }) => {
  const { data: discipline } = useDiscipline(project.disciplineId);
  const updateTeams = useUpdateTeams();
  const [withdrawing, setWithdrawing] = useState(false);
  const done = projectStage(project.milestones) === 'done';

  if (done) return null;

  return (
    <div className="mt-12 border-t border-line pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[15px] font-medium text-ink">Equipes da turma neste projeto</p>
          <p className="mt-0.5 text-[13px] text-ink-3">
            {discipline ? `${discipline.name} tem ${discipline.students} estudantes em equipes de até ${discipline.teamSize}.` : ' '}
          </p>
        </div>
        {discipline && (
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

      {canWithdraw(project) && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-[56ch] text-[13px] text-ink-3">Até o registro no SIGAA você pode desistir, e a demanda volta para o cardápio.</p>
          <Button variant="destructive" size="sm" onClick={() => setWithdrawing(true)}>
            Desistir do projeto
          </Button>
        </div>
      )}

      {withdrawing && <WithdrawModal project={project} onClose={() => setWithdrawing(false)} />}
    </div>
  );
};
