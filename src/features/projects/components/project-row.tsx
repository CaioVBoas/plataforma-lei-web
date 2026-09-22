import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { ChevronDownIcon } from '@/components/ui/icons';
import { ProgressBar } from '@/components/ui/progress-indicators';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import type { Project } from '../types';
import { NEXT_ACTION_LABEL, SILENCE_ALERT_WEEKS, healthLabel, needsAttention, nextActionOf, silentWeeks } from '../utils/project-health';

const RECENT_LOG_ENTRIES = 3;
const LOG_PREVIEW_LENGTH = 96;

const Chip = ({ children }: { children: string }) => (
  <span className="inline-flex h-[30px] items-center rounded-full border border-n-200 bg-n-0 px-[11px] text-[13px] text-n-600">{children}</span>
);

const metricsOf = (project: Project) =>
  project.completion
    ? [
        { label: 'Horas certificadas', value: `${project.completion.certifiedHours}h` },
        { label: 'Estudantes participantes', value: String(project.students) },
        { label: 'Semestre de realização', value: project.completion.semester },
      ]
    : [
        { label: 'Equipes formadas', value: `${project.teamsFormed} de ${project.teamsPlanned}` },
        { label: 'Estudantes', value: String(project.students) },
        { label: 'Semanas restantes', value: String(project.weeksLeft) },
      ];

const summarize = (text: string) => {
  const firstSentence = text.split('. ')[0];
  return firstSentence.length > LOG_PREVIEW_LENGTH ? `${firstSentence.slice(0, LOG_PREVIEW_LENGTH)}…` : firstSentence;
};

const ExpandedSummary = ({ project }: { project: Project }) => {
  const silence = silentWeeks(project);
  const nextDeadline = project.detail.deadlines[0] ?? { label: 'Relatório parcial de extensão', date: '30/09' };
  const recentLog = project.detail.log.slice(0, RECENT_LOG_ENTRIES);

  return (
    <div className="relative z-10 mt-5 border-t border-n-200 pt-5 pl-6 animate-abre-linha">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8">
        <div>
          <p className="mb-3 text-[13px] text-n-500">Equipes</p>
          <ul className="flex flex-col gap-3.5">
            {project.detail.teams.map((team, index) => (
              <li key={team.name}>
                <p className="text-sm font-medium text-n-800">{team.name}</p>
                <p className="mt-0.5 text-[13px] leading-normal text-n-600">{team.scope}</p>
                <p className="mt-[3px] text-[13px] text-n-500">
                  {pluralize(team.members.length, 'integrante', 'integrantes')}
                  {index === 0 && silence >= SILENCE_ALERT_WEEKS && ` · sem registro há ${silence} semanas`}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[13px] text-n-500">Últimos registros</p>
          {recentLog.length > 0 ? (
            <ul className="flex flex-col gap-3.5">
              {recentLog.map((entry) => (
                <li key={`${entry.date}-${entry.author}`}>
                  <p className="text-sm font-medium text-n-800">{entry.author}</p>
                  <p className="mt-0.5 text-[13px] leading-normal text-n-600">{summarize(entry.text)}</p>
                  <p className="mt-[3px] text-[13px] text-n-500 tabular-nums">{entry.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-[1.55] text-n-500">Nenhum registro de andamento ainda</p>
          )}
        </div>

        <div>
          <p className="mb-3 text-[13px] text-n-500">Próximo passo</p>
          <p className="text-sm leading-normal font-medium text-n-800">{nextDeadline.label}</p>
          <p className="mt-[3px] text-[13px] text-n-500 tabular-nums">Prazo {nextDeadline.date}</p>
          {!project.completion && (
            <Link to={paths.project(project.id)} className="mt-2.5 inline-block text-[13px] font-medium text-azul-500 hover:text-azul-600">
              Ver prazos no projeto
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5">
        {project.detail.teams.length > 0 && (
          <Link to={paths.project(project.id, 'equipes')} className={buttonClassName({ variant: 'secondary' })}>
            Ver todas as equipes
          </Link>
        )}
        <Link to={paths.project(project.id)} className={buttonClassName({ variant: 'secondary' })}>
          Abrir projeto
        </Link>
      </div>
    </div>
  );
};

interface ProjectRowProps {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
  onNextAction: (project: Project) => void;
  busy: boolean;
}

export const ProjectRow = ({ project, expanded, onToggle, onNextAction, busy }: ProjectRowProps) => {
  const attention = needsAttention(project);
  const nextAction = nextActionOf(project);

  return (
    <article
      className={cn(
        'relative border-b border-n-200 py-6 pr-5 transition-colors duration-150 animate-card-entra hover:bg-n-25',
        attention ? 'border-l-2 border-l-n-700 pl-[18px]' : 'pl-5',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2.5">
        <h2 className="min-w-0 flex-[1_1_320px] text-xl leading-[1.3] font-bold tracking-[-.01em] text-pretty text-n-800">
          <Link to={paths.project(project.id)} className="after:absolute after:inset-0 focus-visible:shadow-none focus-visible:after:shadow-focus">
            {project.title}
          </Link>
        </h2>
        <div className="relative z-10 flex shrink-0 items-center gap-2.5">
          <span className={cn('text-sm text-n-700', attention ? 'font-bold' : 'font-medium')}>{healthLabel(project)}</span>
          <button
            type="button"
            aria-expanded={expanded}
            title={expanded ? 'Recolher' : 'Ver resumo sem sair da lista'}
            aria-label={expanded ? 'Recolher resumo' : 'Ver resumo sem sair da lista'}
            onClick={onToggle}
            className="flex size-[30px] items-center justify-center rounded-full text-n-500 hover:bg-n-75"
          >
            <ChevronDownIcon size={15} strokeWidth={2.2} className={cn('transition-transform duration-150', expanded && 'rotate-180')} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Chip>{project.disciplineName}</Chip>
        <Chip>{project.partnerName}</Chip>
      </div>

      <dl className="mt-[18px] grid max-w-[620px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-4">
        {metricsOf(project).map((metric) => (
          <div key={metric.label}>
            <dt className="mb-1 text-[13px] text-n-500">{metric.label}</dt>
            <dd className="text-base font-medium text-n-800 tabular-nums">{metric.value}</dd>
          </div>
        ))}
      </dl>

      {!project.completion && (
        <div className="mt-[18px] max-w-[460px]">
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px] text-n-500">
            <span>Horas de extensão acumuladas</span>
            <span className="tabular-nums">
              {project.hours}h de {project.plannedHours}h
            </span>
          </div>
          <ProgressBar percent={(project.hours / project.plannedHours) * 100} label="Horas de extensão acumuladas" thickness={2} />
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="relative z-10">
          {nextAction && (
            <Button variant="primary" disabled={busy} onClick={() => onNextAction(project)}>
              {NEXT_ACTION_LABEL[nextAction]}
            </Button>
          )}
        </div>
        <span className="text-[13px] text-n-500">{project.lastUpdate}</span>
      </div>

      {expanded && <ExpandedSummary project={project} />}
    </article>
  );
};
