import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { NumberStepper } from '@/components/ui/number-stepper';
import { RadioCard } from '@/components/ui/radio-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useCurrentDisciplines } from '@/features/disciplines/hooks/use-disciplines';
import { freeSlots } from '@/features/disciplines/utils/discipline-presentation';
import { JourneySteps } from '@/features/proposals/components/journey-steps';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { ColleagueInvite } from '../components/colleague-invite';
import { useDemandDetail, useLinkDiscipline, useMatchExplanation } from '../hooks/use-demands';
import type { DemandDetail } from '../types';
import { rankDisciplines } from '../utils/demand-presentation';

const TEAM_SIZES = ['3 a 4', '4 a 5', '5 a 6'] as const;
type TeamSize = (typeof TEAM_SIZES)[number];

const SectionTitle = ({ children }: { children: string }) => <h3 className="mb-4 text-[15px] font-medium text-n-800">{children}</h3>;

const LinkDisciplineForm = ({ demand }: { demand: DemandDetail }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const linkDiscipline = useLinkDiscipline();
  const { data: disciplines = [] } = useCurrentDisciplines();
  const ranked = rankDisciplines(demand, disciplines);

  // Quem volta do cadastro de disciplina chega com ela já escolhida.
  const [searchParams] = useSearchParams();
  const [chosenId, setChosenId] = useState<string | null>(searchParams.get('disciplina'));
  const [teams, setTeams] = useState(2);
  const [teamSize, setTeamSize] = useState<TeamSize>('4 a 5');
  const [invited, setInvited] = useState<string[]>([]);

  // Sem escolha explícita, vale a disciplina mais compatível.
  const disciplineId = chosenId ?? ranked[0]?.discipline.id ?? '';
  const { data: explanation } = useMatchExplanation(demand.id, disciplineId, Boolean(disciplineId));

  const generateDraft = () =>
    linkDiscipline.mutate(
      { demandId: demand.id, disciplineId, teams, teamSize, invitedColleagues: invited },
      {
        onSuccess: (proposalId) => {
          toast.show('Demanda vinculada e proposta gerada da demanda e da sua ementa. Revise antes de levar ao SIGAA.');
          navigate(paths.proposal(proposalId));
        },
        onError: (error) => toast.show(error.message),
      },
    );

  return (
    <div className="mx-auto max-w-[720px]">
      <JourneySteps current={1} />
      <h2 className="mt-3 mb-6 text-[22px] leading-[1.3] font-bold text-n-800">Em qual disciplina este projeto acontece?</h2>

      <div className="mb-12">
        <p className="text-sm font-medium text-n-800">{demand.organizationName}</p>
        <p className="mt-[3px] max-w-[62ch] text-[15px] leading-[1.55] text-n-600">{demand.problem}</p>
      </div>

      <section className="mb-12">
        <SectionTitle>Disciplina de destino</SectionTitle>
        <div role="radiogroup" aria-label="Disciplina de destino" className="flex flex-col gap-2.5">
          {ranked.map(({ discipline, percent }, index) => (
            <RadioCard
              key={discipline.id}
              selected={discipline.id === disciplineId}
              onSelect={() => setChosenId(discipline.id)}
              aside={<span className="shrink-0 text-lg font-bold text-n-800 tabular-nums">{percent}%</span>}
            >
              <span className="flex flex-wrap items-baseline gap-2">
                <span className="text-[15px] font-medium text-n-800">{discipline.name}</span>
                <span className="text-[13px] text-n-500">{discipline.code}</span>
                {index === 0 && <span className="text-[13px] font-medium text-n-800">Melhor compatibilidade</span>}
              </span>
              <span className="mt-1 block text-[13px] leading-normal text-n-600">
                Oferta {discipline.semester} · {discipline.course} · {discipline.students} estudantes matriculados
              </span>
              <span className="block text-[13px] leading-normal text-n-600">
                Execução de {discipline.executionStart} a {discipline.executionEnd} · {freeSlots(discipline)} de {discipline.projectCapacity} vagas de projeto ainda livres
              </span>
            </RadioCard>
          ))}
          <Link to={paths.newDiscipline(paths.linkDemand(demand.id))} className="flex w-full items-center gap-3.5 rounded-lg border border-n-300 bg-n-0 px-[18px] py-4 text-[15px] font-medium text-n-800 hover:bg-n-50">
            <span aria-hidden="true" className="size-[18px] shrink-0 rounded-full border-2 border-n-300" />
            Nenhuma destas, quero cadastrar outra disciplina
          </Link>
        </div>
        <p className="mt-3.5 text-[13px] text-n-500">Só aparecem disciplinas do Centro de Informática ofertadas neste semestre.</p>
      </section>

      <section className="mb-12">
        <SectionTitle>Formato do trabalho</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-n-700">Equipes nesta demanda</p>
            <NumberStepper
              label="Equipes nesta demanda"
              value={teams}
              min={1}
              max={6}
              onChange={setTeams}
              formatValue={(value) => pluralize(value, 'equipe', 'equipes')}
              className="h-11"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-n-700">Tamanho sugerido de equipe</p>
            <SegmentedControl
              label="Tamanho sugerido de equipe"
              value={teamSize}
              onChange={setTeamSize}
              options={TEAM_SIZES.map((size) => ({ value: size, label: `${size} estudantes` }))}
            />
          </div>
        </div>
        <p className="mt-3.5 text-[13px] leading-normal text-n-500">
          Uma demanda pode gerar recortes independentes: cada equipe ataca uma parte do problema e entrega separadamente ao parceiro.
        </p>
      </section>

      <section className="mb-12">
        <SectionTitle>Coordenação compartilhada com outro docente</SectionTitle>
        <ColleagueInvite
          invited={invited}
          onInvite={(colleagueId) => setInvited((current) => [...current, colleagueId])}
          missingCompetency={explanation?.gaps[0]?.competency}
        />
      </section>

      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <Link to={paths.demand(demand.id)} className={buttonClassName({ variant: 'outline-muted', size: 'lg' })}>
          Voltar
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-n-500">Leva cerca de 30 segundos.</span>
          <Button variant="primary" size="lg" disabled={!disciplineId || linkDiscipline.isPending} onClick={generateDraft}>
            Vincular e gerar proposta
          </Button>
        </div>
      </div>
    </div>
  );
};

export const LinkDisciplinePage = () => {
  usePageHeader('Vincular à disciplina', 'Primeira etapa da demanda ao SIGAA: escolher onde o projeto acontece');
  const { demandId = '' } = useParams();
  const demandQuery = useDemandDetail(demandId);
  return <QueryView query={demandQuery}>{(demand) => <LinkDisciplineForm demand={demand} />}</QueryView>;
};
