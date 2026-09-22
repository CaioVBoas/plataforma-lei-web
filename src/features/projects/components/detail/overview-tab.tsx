import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/button-styles';
import { Overline } from '@/components/ui/overline';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import type { Milestone, Project } from '../../types';

/** Linha do tempo: a barra azul avança até o último marco concluído. */
const Timeline = ({ milestones }: { milestones: Milestone[] }) => {
  const lastDone = milestones.reduce((last, milestone, index) => (milestone.done ? index : last), -1);
  const progress = lastDone < 0 ? 0 : lastDone * (100 / milestones.length);

  return (
    <div className="relative pb-1">
      <div className="absolute inset-x-0 top-[7px] h-0.5 bg-n-200" />
      <div className="absolute top-[7px] left-0 h-0.5 bg-azul-500" style={{ width: `calc(${progress}% + 8px)` }} />
      <ol className="relative flex justify-between">
        {milestones.map((milestone) => (
          <li key={milestone.week} className="flex min-w-0 flex-1 flex-col items-start">
            <span className={cn('block size-4 rounded-full border-2', milestone.done ? 'border-azul-500 bg-azul-500' : 'border-n-300 bg-n-0')} />
            <span className="mt-2.5 text-[11px] font-semibold tracking-[.04em] text-n-500 uppercase">{milestone.week}</span>
            <span className={cn('mt-[3px] pr-3 text-[13px] leading-[1.4]', milestone.done ? 'text-n-800' : 'text-n-500')}>{milestone.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export const OverviewTab = ({ project }: { project: Project }) => {
  const { detail } = project;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-6">
      <div className="flex min-w-0 flex-col gap-12">
        <section>
          <Overline className="mb-2.5">Problema original</Overline>
          <p className="mb-3.5 max-w-[68ch] text-[15px] leading-relaxed text-n-700">{detail.problem}</p>
          {project.demandId && (
            <Link to={paths.demand(project.demandId)} className={buttonClassName({ variant: 'outline-accent', size: 'sm' })}>
              Ver a demanda original
            </Link>
          )}
        </section>

        <section>
          <h3 className="heading-section mb-3.5">Objetivos e entregável acordado</h3>
          {detail.goals.length > 0 && (
            <ul className="mb-[18px] flex flex-col gap-2.5">
              {detail.goals.map((goal) => (
                <li key={goal} className="flex gap-[9px]">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-azul-500" />
                  <span className="min-w-0 flex-1 text-sm leading-[1.55] text-n-700">{goal}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="rounded-lg border border-n-200 p-4">
            <Overline className="mb-[5px]">Entregável acordado</Overline>
            <p className="text-sm leading-normal text-n-800">{detail.agreedDeliverable}</p>
          </div>
        </section>

        <section>
          <h3 className="heading-section mb-12">Cronograma de doze semanas</h3>
          <Timeline milestones={detail.milestones} />
        </section>
      </div>

      <aside className="sticky top-6 flex flex-col gap-12">
        <section>
          <Overline className="mb-3">Parceiro</Overline>
          <p className="text-[15px] font-medium text-n-800">{project.partnerName}</p>
          <div className="my-3.5 h-px bg-n-200" />
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-xs text-n-500">Ponto focal</p>
              <p className="text-sm text-n-800">{detail.focalName}</p>
              <p className="text-[13px] text-n-600">{detail.focalRole}</p>
            </div>
            <div>
              <p className="text-xs text-n-500">Canal combinado</p>
              <p className="text-sm text-n-800">{detail.channel}</p>
            </div>
          </div>
        </section>

        <section>
          <Overline className="mb-3">Situação</Overline>
          <p
            className={cn(
              'inline-flex h-10 items-center rounded-lg px-[11px] text-[13px] font-semibold text-n-700',
              detail.healthTone === 'ok' ? 'bg-sucesso-bg' : 'bg-alerta-bg',
            )}
          >
            {detail.healthLabel}
          </p>
          <p className="mt-2.5 text-[13px] leading-normal text-n-600">{detail.healthNote}</p>
        </section>

        {detail.deadlines.length > 0 && (
          <section>
            <Overline className="mb-3">Prazos institucionais pendentes</Overline>
            <ul className="flex flex-col gap-8">
              {detail.deadlines.map((deadline) => (
                <li key={deadline.label}>
                  <div className="flex items-baseline justify-between gap-2.5">
                    <span className="min-w-0 flex-1 text-[13px] leading-[1.4] text-n-800">{deadline.label}</span>
                    <span className={cn('shrink-0 text-[13px] font-semibold tabular-nums', deadline.urgent ? 'text-n-700' : 'text-n-600')}>{deadline.date}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-n-500">{deadline.note}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
};
