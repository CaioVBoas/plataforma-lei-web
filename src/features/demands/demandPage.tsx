import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { FactGrid, Page } from '@/components/ui/page';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { useTabParam } from '@/hooks/useTabParam';
import { cn } from '@/utils/cn';
import { Tag } from '@/components/ui/tag';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import { rankDisciplines, type DisciplineMatch } from '@/domain/matching';
import type { SemesterCalendar } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useCurrentDisciplines } from '@/features/disciplines/useDisciplines';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { paths } from '@/routes/paths';
import { joinWithAnd, pluralize } from '@/utils/format';
import { AdoptDemandModal } from './components/adoptDemandModal';
import { DecisionPanel } from './components/decisionPanel';
import { useDemand } from './useDemands';
import type { DemandDetail } from './types';
import { DemandQuestions } from './components/demandQuestions';
import { InvitationNote } from './components/invitationNote';
import { LEVEL_COPY } from '@/features/disciplines/utils/disciplinePresentation';
import { CONSTRAINT_COPY, SCOPE_COPY, SEMESTER_DELIVERY } from './utils/demandPresentation';

const TABS = ['problema', 'competencias', 'perguntas', 'inspiracao', 'organizacao'] as const;

const SubBlock = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mt-8">
    <h3 className="mb-2.5 text-[15px] font-semibold text-ink">{title}</h3>
    {children}
  </section>
);

/** Cobertura por disciplina: quais competências a turma já trabalha e quais faltam. */
const CoverageList = ({ matches }: { matches: DisciplineMatch<DisciplineWithUsage>[] }) => (
  <ul className="mt-5 space-y-2">
    {matches.map((match) => (
      <li key={match.discipline.id} className="text-sm leading-relaxed text-ink-2">
        <span className="font-medium text-ink">{match.discipline.name}</span> cobre {match.covered.length} de{' '}
        {match.covered.length + match.missing.length}
        {match.missing.length > 0 && `. Falta ${joinWithAnd(match.missing)}`}
        {match.aboveLevel && `. A demanda pede mais do que a turma, que está no ${LEVEL_COPY[match.discipline.level].label.toLowerCase()}`}.
      </li>
    ))}
  </ul>
);

const DemandView = ({ detail, disciplines, calendar }: { detail: DemandDetail; disciplines: DisciplineWithUsage[]; calendar: SemesterCalendar }) => {
  const [adopting, setAdopting] = useState(false);
  const [tab, setTab] = useTabParam(TABS);
  const { demand, organization } = detail;
  const matches = rankDisciplines(demand, disciplines);
  const best = matches[0];
  const scope = SCOPE_COPY[demand.scopeFit];
  const coveredByBest = new Set(best?.covered ?? []);

  return (
    <Page
      title={demand.title}
      back={detail.projectId ? { to: paths.project(detail.projectId), label: 'Projeto' } : { to: paths.menu, label: 'Cardápio' }}
      subtitle={demand.problem}
    >
      {demand.invitation && !detail.projectId && <InvitationNote invitation={demand.invitation} />}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <FactGrid
            columns={2}
            items={[
              { label: 'Quem sente', value: demand.affectedPublic },
              { label: 'Reuniões', value: demand.meetingCadence },
              { label: 'Semestre', value: <span className={scope.tone === 'caution' ? 'text-caution' : undefined}>{scope.label}</span> },
              { label: 'Altura do curso', value: `${LEVEL_COPY[demand.level].label}, ${LEVEL_COPY[demand.level].periods}` },
            ]}
          />

          <UnderlineTabs
            label="Sobre a demanda"
            value={tab}
            onChange={setTab}
            className="mt-10 mb-7"
            options={[
              { value: 'problema', label: 'Problema' },
              { value: 'competencias', label: 'Competências', count: demand.skills.length },
              { value: 'perguntas', label: 'Perguntas', count: demand.questions.length },
              ...(demand.references.length > 0 ? [{ value: 'inspiracao' as const, label: 'Para se inspirar' }] : []),
              { value: 'organizacao', label: 'Organização' },
            ]}
          />

          {tab === 'problema' && (
            <>
              <p className="text-[15px] leading-relaxed text-ink-2">{demand.description}</p>

              <SubBlock title="O que a organização oferece">
                <ul className="space-y-2 text-[15px] text-ink-2">
                  {demand.offers.map((offer) => (
                    <li key={offer} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-3" />
                      {offer}
                    </li>
                  ))}
                </ul>
              </SubBlock>

              <SubBlock title="O que cabe no semestre">
                <p className="text-[15px] leading-relaxed text-ink-2">{demand.scopeNote}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{SEMESTER_DELIVERY}</p>
              </SubBlock>

              {demand.constraints.length > 0 && (
                <SubBlock title="Antes de aceitar">
                  <ul className="space-y-2">
                    {demand.constraints.map((constraint) => (
                      <li key={constraint} className="text-[15px] leading-relaxed text-ink-2">
                        <span className="font-medium text-ink">{CONSTRAINT_COPY[constraint].label}.</span> {CONSTRAINT_COPY[constraint].detail}
                      </li>
                    ))}
                  </ul>
                </SubBlock>
              )}
            </>
          )}

          {tab === 'competencias' && (
            <>
              <div className="flex flex-wrap gap-1.5">
                {demand.skills.map((skill) => (
                  <Tag key={skill} covered={coveredByBest.has(skill)}>
                    {skill}
                  </Tag>
                ))}
              </div>
              {matches.length > 0 && <CoverageList matches={matches} />}
            </>
          )}

          {tab === 'perguntas' && <DemandQuestions demand={demand} canAsk={!detail.projectId} />}

          {tab === 'inspiracao' && (
            <>
              <p className="mb-4 text-sm text-ink-2">Soluções parecidas que já existem. A turma não precisa começar do zero.</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {demand.references.map((reference) => (
                  <li key={reference.name}>
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-full flex-col rounded-lg bg-canvas px-4 py-3.5 transition-colors duration-150 hover:bg-fill"
                    >
                      <span className="flex items-center justify-between gap-3 text-[15px] font-medium text-ink">
                        {reference.name}
                        <ArrowUpRightIcon size={15} className="shrink-0 text-ink-3" />
                      </span>
                      <span className="mt-1 text-[13px] leading-relaxed text-ink-2">{reference.description}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === 'organizacao' && (
            <>
              <p className="text-[15px] leading-relaxed text-ink-2">{organization.about}</p>
              <p className="mt-3 text-sm text-ink-3">
                {organization.type} · {organization.location}
                {organization.history.length > 0 && ` · ${pluralize(organization.history.length, 'projeto', 'projetos')} com o CIn`}
              </p>
              <Link to={paths.organization(organization.id)} className={cn(textLinkClassName, 'mt-3 inline-block text-sm')}>
                Ver organização
              </Link>
            </>
          )}
        </div>

        <aside className="-order-1 lg:sticky lg:top-8 lg:order-none lg:self-start">
          <DecisionPanel detail={detail} best={best} calendar={calendar} hasDisciplines={disciplines.length > 0} onAdopt={() => setAdopting(true)} />
        </aside>
      </div>

      {adopting && <AdoptDemandModal demand={demand} disciplines={disciplines} calendar={calendar} onClose={() => setAdopting(false)} />}
    </Page>
  );
};

export const DemandPage = () => {
  const { demandId = '' } = useParams();
  const demandQuery = useDemand(demandId);
  const disciplinesQuery = useCurrentDisciplines();
  const calendarQuery = useCalendar();

  return (
    <QueryView query={demandQuery}>
      {(detail) => (
        <QueryView query={disciplinesQuery}>
          {(disciplines) => <QueryView query={calendarQuery}>{(calendar) => <DemandView detail={detail} disciplines={disciplines} calendar={calendar} />}</QueryView>}
        </QueryView>
      )}
    </QueryView>
  );
};
