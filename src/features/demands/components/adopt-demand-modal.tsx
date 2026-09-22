import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Stepper } from '@/components/ui/stepper';
import { formatShortDate } from '@/domain/calendar';
import { freeSlots, maxTeams } from '@/domain/discipline-rules';
import { rankDisciplines, type DisciplineMatch } from '@/domain/matching';
import type { Demand, SemesterCalendar } from '@/domain/types';
import { DisciplineForm } from '@/features/disciplines/components/discipline-form';
import { useCreateDiscipline } from '@/features/disciplines/hooks/use-disciplines';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { slotsLabel } from '@/features/disciplines/utils/discipline-presentation';
import { useAdoptDemand } from '@/features/projects/hooks/use-projects';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';

const DEFAULT_TEAMS = 2;

interface DisciplineOptionProps {
  match: DisciplineMatch<DisciplineWithUsage>;
  demand: Demand;
  selected: boolean;
  name: string;
  onSelect: () => void;
}

const DisciplineOption = ({ match, demand, selected, name, onSelect }: DisciplineOptionProps) => {
  const { discipline } = match;
  const full = freeSlots(discipline) === 0;
  return (
    <label
      className={cn(
        'flex items-start gap-3 rounded-md border px-3.5 py-3 transition-colors duration-100',
        full ? 'cursor-not-allowed border-line opacity-50' : 'cursor-pointer',
        selected ? 'border-accent bg-accent-soft' : !full && 'border-line hover:border-line-strong',
      )}
    >
      <input type="radio" name={name} checked={selected} disabled={full} onChange={onSelect} className="mt-1 accent-accent" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-ink">{discipline.name}</span>
        <span className="mt-0.5 block text-[13px] text-ink-2">
          Cobre {match.covered.length} de {demand.skills.length} competências · {slotsLabel(discipline)}
        </span>
      </span>
    </label>
  );
};

/** O que muda depois de confirmar. Dito antes, para a decisão não ter surpresa. */
const WhatHappensNext = ({ demand, calendar }: { demand: Demand; calendar: SemesterCalendar }) => (
  <div className="mt-6 rounded-md bg-canvas px-4 py-3.5">
    <p className="text-[13px] font-medium text-ink">Depois de confirmar</p>
    <ol className="mt-2 list-decimal space-y-1 pl-4 text-[13px] leading-relaxed text-ink-2">
      <li>O projeto é criado com o plano já escrito para você revisar.</li>
      <li>{demand.organization.name} recebe o aviso e o contato do ponto focal aparece no projeto.</li>
      <li>Você tem até {formatShortDate(calendar.linkDeadline)} para registrar no SIGAA. Até lá, pode desistir.</li>
    </ol>
  </div>
);

interface AdoptDemandModalProps {
  demand: Demand;
  disciplines: DisciplineWithUsage[];
  calendar: SemesterCalendar;
  onClose: () => void;
}

/** A decisão principal do produto: escolher a turma e confirmar. Sem disciplina, o cadastro acontece aqui mesmo. */
export const AdoptDemandModal = ({ demand, disciplines, calendar, onClose }: AdoptDemandModalProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const formId = useId();
  const adopt = useAdoptDemand();
  const createDiscipline = useCreateDiscipline();

  const ranked = rankDisciplines(demand, disciplines);
  const firstAvailable = ranked.find((match) => freeSlots(match.discipline) > 0);
  const [selectedId, setSelectedId] = useState(firstAvailable?.discipline.id);
  const [creating, setCreating] = useState(disciplines.length === 0);
  const selected = ranked.find((match) => match.discipline.id === selectedId)?.discipline;
  const teamLimit = selected ? maxTeams(selected) : 1;
  const [teams, setTeams] = useState(DEFAULT_TEAMS);
  const effectiveTeams = Math.min(teams, teamLimit);

  const confirm = () => {
    if (!selected) return;
    adopt.mutate(
      { demandId: demand.id, disciplineId: selected.id, teams: effectiveTeams },
      {
        onSuccess: (project) => {
          toast.show('Projeto criado. Comece revisando o plano.');
          navigate(paths.project(project.id, 'plano'));
        },
      },
    );
  };

  if (creating) {
    return (
      <Modal
        title="Cadastre a disciplina"
        description={`Para levar "${demand.title}" para uma turma, primeiro diga qual turma é essa e o que ela trabalha.`}
        size="lg"
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" onClick={() => (disciplines.length > 0 ? setCreating(false) : onClose())}>
              {disciplines.length > 0 ? 'Voltar' : 'Cancelar'}
            </Button>
            <Button variant="primary" type="submit" form={formId} disabled={createDiscipline.isPending}>
              Cadastrar e continuar
            </Button>
          </>
        }
      >
        <DisciplineForm
          formId={formId}
          defaultValues={{ name: '', code: '', students: 40, teamSize: 5, projectSlots: 2, skills: demand.skills }}
          onSubmit={(values) =>
            createDiscipline.mutate(values, {
              onSuccess: (discipline) => {
                setSelectedId(discipline.id);
                setCreating(false);
              },
            })
          }
        />
        {createDiscipline.isError && (
          <p role="alert" className="mt-4 text-sm text-critical">
            {createDiscipline.error.message}
          </p>
        )}
      </Modal>
    );
  }

  return (
    <Modal
      title="Levar para uma disciplina"
      description={`${demand.title}, de ${demand.organization.name}.`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!selected || adopt.isPending} onClick={confirm}>
            Criar projeto
          </Button>
        </>
      }
    >
      <fieldset>
        <legend className="mb-2 text-[13px] font-medium text-ink-2">Qual turma</legend>
        <div className="flex flex-col gap-2">
          {ranked.map((match) => (
            <DisciplineOption
              key={match.discipline.id}
              match={match}
              demand={demand}
              name={`${formId}-discipline`}
              selected={match.discipline.id === selectedId}
              onSelect={() => setSelectedId(match.discipline.id)}
            />
          ))}
        </div>
        <button type="button" onClick={() => setCreating(true)} className="mt-2.5 text-[13px] text-accent hover:text-accent-hover">
          Cadastrar outra disciplina
        </button>
      </fieldset>

      {selected && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-ink-2">Equipes neste projeto</p>
            <p className="text-[13px] text-ink-3">A turma forma até {pluralize(teamLimit, 'equipe', 'equipes')}.</p>
          </div>
          <Stepper
            label="equipes"
            value={effectiveTeams}
            min={1}
            max={teamLimit}
            onChange={setTeams}
            formatValue={(value) => pluralize(value, 'equipe', 'equipes')}
          />
        </div>
      )}

      <WhatHappensNext demand={demand} calendar={calendar} />

      {adopt.isError && (
        <p role="alert" className="mt-4 text-sm text-critical">
          {adopt.error.message}
        </p>
      )}
    </Modal>
  );
};
