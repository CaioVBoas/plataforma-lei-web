import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/form-controls';
import { FolderIcon } from '@/components/ui/icons';
import { SelectMenu } from '@/components/ui/select-menu';
import { ToggleChip } from '@/components/ui/toggle-chip';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { ProjectRow } from '../components/project-row';
import { useProjectNextAction } from '../hooks/use-project-next-action';
import { useProjects } from '../hooks/use-projects';
import type { Project, ProjectStage } from '../types';
import { needsAttention } from '../utils/project-health';

const ALL = 'all';

const HEADER: Record<ProjectStage, [string, string]> = {
  running: ['Meus projetos', 'Projetos de extensão que você conduz neste semestre'],
  completed: ['Meus projetos', 'Projetos que você já entregou aos parceiros'],
};

const EMPTY_COPY: Record<ProjectStage, { title: string; description: string }> = {
  running: {
    title: 'Nenhum projeto em execução',
    description:
      'Projetos aparecem aqui depois que você vincula uma demanda a uma disciplina e a proposta é registrada. O acompanhamento das equipes fica todo nesta tela.',
  },
  completed: {
    title: 'Nenhum projeto concluído ainda',
    description: 'Projetos entregues ao parceiro passam para esta aba ao fim do semestre.\nO histórico de registros e as horas certificadas ficam preservados aqui.',
  },
};

const withCount = (projects: Project[], values: string[], allLabel: string, keyOf: (project: Project) => string | undefined) => [
  { value: ALL, label: allLabel, count: projects.length },
  ...values.map((value) => ({ value, label: value, count: projects.filter((project) => keyOf(project) === value).length })),
];

const ProjectList = ({ stage, projects }: { stage: ProjectStage; projects: Project[] }) => {
  const [search, setSearch] = useState('');
  const [discipline, setDiscipline] = useState(ALL);
  const [semester, setSemester] = useState(ALL);
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const nextAction = useProjectNextAction();

  const inStage = projects.filter((project) => project.stage === stage);
  const query = search.trim().toLowerCase();
  const visible = inStage.filter(
    (project) =>
      (!query || `${project.title} ${project.partnerName} ${project.disciplineName}`.toLowerCase().includes(query)) &&
      (discipline === ALL || project.disciplineName === discipline) &&
      (semester === ALL || project.completion?.semester === semester) &&
      (!attentionOnly || needsAttention(project)),
  );
  const hasFilter = Boolean(query) || discipline !== ALL || semester !== ALL || attentionOnly;

  const disciplineNames = [...new Set(projects.map((project) => project.disciplineName))];
  const semesters = [...new Set(inStage.flatMap((project) => (project.completion ? [project.completion.semester] : [])))].sort().reverse();

  const clearFilters = () => {
    setSearch('');
    setDiscipline(ALL);
    setSemester(ALL);
    setAttentionOnly(false);
  };

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-center gap-2.5">
        <SearchInput
          aria-label="Buscar projetos"
          placeholder="Buscar projeto, organização ou disciplina"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          containerClassName="min-w-0 flex-[1_1_280px]"
        />
        {stage === 'completed' && (
          <SelectMenu
            label="Semestre"
            shape="field"
            value={semester}
            neutralValue={ALL}
            onChange={setSemester}
            menuWidth={220}
            options={withCount(inStage, semesters, 'Todos os semestres', (project) => project.completion?.semester)}
          />
        )}
        <SelectMenu
          label="Disciplina"
          value={discipline}
          neutralValue={ALL}
          onChange={setDiscipline}
          menuWidth={260}
          options={withCount(inStage, disciplineNames, 'Todas as disciplinas', (project) => project.disciplineName)}
        />
        <ToggleChip selected={attentionOnly} onClick={() => setAttentionOnly((current) => !current)}>
          Só o que pede atenção
        </ToggleChip>
        <span className="ml-auto shrink-0 text-[13px] text-n-600 tabular-nums">{pluralize(visible.length, 'projeto', 'projetos')}</span>
      </div>

      {visible.length > 0 ? (
        <div>
          {visible.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              expanded={expandedId === project.id}
              onToggle={() => setExpandedId((current) => (current === project.id ? null : project.id))}
              onNextAction={nextAction.run}
              busy={nextAction.isBusy}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FolderIcon size={28} />}
          title={hasFilter ? 'Nenhum projeto com esses filtros' : EMPTY_COPY[stage].title}
          description={hasFilter ? 'Nenhum projeto corresponde à busca e aos filtros ativos.' : EMPTY_COPY[stage].description}
          action={
            hasFilter ? (
              <Button variant="secondary" onClick={clearFilters}>
                Limpar filtros
              </Button>
            ) : (
              stage === 'running' && (
                <Link to={paths.menu} className={buttonClassName({ variant: 'primary' })}>
                  Ver o cardápio de demandas
                </Link>
              )
            )
          }
        />
      )}
    </div>
  );
};

export const ProjectsPage = ({ stage }: { stage: ProjectStage }) => {
  usePageHeader(...HEADER[stage]);
  const projectsQuery = useProjects();
  return <QueryView query={projectsQuery}>{(projects) => <ProjectList key={stage} stage={stage} projects={projects} />}</QueryView>;
};
