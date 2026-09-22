import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/feedback/toast-context';
import { ActionMenu } from '@/components/ui/action-menu';
import { buttonClassName } from '@/components/ui/button-styles';
import { Overline } from '@/components/ui/overline';
import { ProgressBar } from '@/components/ui/progress-indicators';
import { Tag } from '@/components/ui/tag';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import { useArchiveDiscipline, useDuplicateDiscipline, useUpdateDiscipline } from '../hooks/use-disciplines';
import type { Discipline } from '../types';
import { disciplineDataLine } from '../utils/discipline-presentation';

export const DisciplineListItem = ({ discipline }: { discipline: Discipline }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const update = useUpdateDiscipline();
  const duplicate = useDuplicateDiscipline();
  const archive = useArchiveDiscipline();
  const compatible = discipline.paused ? 0 : discipline.compatibleDemands;
  const practices = [
    ...discipline.practice.confirmed.map((name) => ({ name, inferred: false })),
    ...discipline.practice.inferred.map(({ name }) => ({ name, inferred: true })),
  ];

  const togglePause = () =>
    update.mutate(
      { id: discipline.id, update: { paused: !discipline.paused } },
      {
        onSuccess: () =>
          toast.show(discipline.paused ? `${discipline.name} volta a receber demandas.` : `${discipline.name} não recebe demandas até você retomar.`),
      },
    );

  return (
    <article className={cn('flex flex-wrap items-start gap-x-6 gap-y-4 border-b border-n-200 pb-8 animate-card-entra', discipline.paused && 'opacity-70')}>
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div>
          <div className="flex flex-wrap items-baseline gap-2.5">
            <Link to={paths.discipline(discipline.id)} className="text-left text-xl font-bold tracking-[-.01em] text-n-800 hover:text-azul-800">
              {discipline.name}
            </Link>
            <span className="text-sm text-n-500">{discipline.code}</span>
            {discipline.paused && <span className="text-[13px] font-medium text-n-600">Não recebe demandas</span>}
          </div>
          <p className="mt-1.5 max-w-[76ch] text-[13px] leading-[1.55] text-n-500">{disciplineDataLine(discipline)}</p>
        </div>

        <div>
          {discipline.syllabus.trim() ? (
            <div>
              <Overline className="mb-[5px]">Ementa cadastrada</Overline>
              <p className="line-clamp-2 max-w-[76ch] text-[15px] leading-relaxed text-n-700">{discipline.syllabus}</p>
              <Link to={paths.discipline(discipline.id)} className={cn(buttonClassName({ variant: 'outline-accent', size: 'sm' }), 'mt-1')}>
                ler tudo
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm leading-normal font-medium text-n-800">Sem ementa cadastrada. As sugestões para esta turma ficam menos precisas.</span>
              <Link to={paths.discipline(discipline.id)} className={buttonClassName({ variant: 'outline-accent', size: 'sm' })}>
                cadastrar agora
              </Link>
            </div>
          )}

          <Overline className="mt-5 mb-2">Prática associada</Overline>
          <div className="flex flex-wrap items-center gap-2">
            {practices.map((practice) => (
              <Tag key={practice.name} label={practice.name} inferred={practice.inferred} size="sm" />
            ))}
            {practices.length === 0 && <span className="text-[13px] text-n-500">Prática ainda não declarada</span>}
            <Link to={paths.discipline(discipline.id, 'pratica')} className={cn(buttonClassName({ variant: 'outline-accent', size: 'sm' }), 'ml-1.5')}>
              Ajustar prática
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-n-800 tabular-nums">
            {discipline.linkedProjects} de {discipline.projectCapacity} vagas de projeto ocupadas
          </p>
          <ProgressBar
            percent={discipline.projectCapacity ? (discipline.linkedProjects / discipline.projectCapacity) * 100 : 0}
            label="Vagas de projeto ocupadas"
            className="mt-2 max-w-[280px]"
          />
          <Link to={paths.discipline(discipline.id, 'demandas')} className={cn(buttonClassName({ variant: 'outline-accent', size: 'sm' }), 'mt-3')}>
            {pluralize(compatible, 'demanda compatível', 'demandas compatíveis')}
          </Link>
        </div>
      </div>

      <ActionMenu
        label={`Ações de ${discipline.name}`}
        items={[
          { label: 'Editar', onSelect: () => navigate(paths.discipline(discipline.id)) },
          {
            label: 'Duplicar para o próximo semestre',
            onSelect: () => duplicate.mutate(discipline.id, { onSuccess: () => toast.show(`${discipline.name} duplicada para 2027.1 com a mesma ementa.`) }),
          },
          { label: discipline.paused ? 'Retomar recebimento de demandas' : 'Pausar recebimento de demandas', onSelect: togglePause },
          {
            label: 'Arquivar',
            subdued: true,
            onSelect: () => archive.mutate(discipline.id, { onSuccess: () => toast.show(`${discipline.name} arquivada. Ela sai da lista deste semestre.`) }),
          },
        ]}
      />
    </article>
  );
};
