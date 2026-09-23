import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { Page } from '@/components/ui/page';
import { StatusLabel } from '@/components/ui/statusLabel';
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
import { SCOPE_COPY } from './utils/demandPresentation';

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-t border-line py-7 first:border-t-0 first:pt-0">
    <h2 className="mb-3 text-headline">{title}</h2>
    {children}
  </section>
);

/** Cobertura por disciplina: quais competências a turma já trabalha e quais faltam. */
const CoverageList = ({ matches }: { matches: DisciplineMatch<DisciplineWithUsage>[] }) => (
  <ul className="mt-4 space-y-2">
    {matches.map((match) => (
      <li key={match.discipline.id} className="text-sm leading-relaxed text-ink-2">
        <span className="font-medium text-ink">{match.discipline.name}</span> cobre {match.covered.length} de{' '}
        {match.covered.length + match.missing.length}
        {match.missing.length > 0 && `. Falta ${joinWithAnd(match.missing)}`}.
      </li>
    ))}
  </ul>
);

const DemandView = ({ detail, disciplines, calendar }: { detail: DemandDetail; disciplines: DisciplineWithUsage[]; calendar: SemesterCalendar }) => {
  const [adopting, setAdopting] = useState(false);
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
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <Block title="O problema">
            <p className="max-w-[68ch] text-[15px] leading-relaxed text-ink-2">{demand.description}</p>
            <p className="mt-3 text-sm text-ink-2">
              <span className="text-ink-3">Quem sente:</span> {demand.affectedPublic}
            </p>
          </Block>

          <Block title="O que a organização oferece">
            <ul className="space-y-2 text-[15px] text-ink-2">
              {demand.offers.map((offer) => (
                <li key={offer} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-3" />
                  {offer}
                </li>
              ))}
              <li className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-3" />
                {demand.meetingCadence}
              </li>
            </ul>
          </Block>

          <Block title="Competências pedidas">
            <div className="flex flex-wrap gap-1.5">
              {demand.skills.map((skill) => (
                <Tag key={skill} covered={coveredByBest.has(skill)}>
                  {skill}
                </Tag>
              ))}
            </div>
            {matches.length > 0 && <CoverageList matches={matches} />}
          </Block>

          <Block title="Cabe num semestre?">
            <StatusLabel tone={scope.tone}>{scope.label}</StatusLabel>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-relaxed text-ink-2">{demand.scopeNote}</p>
          </Block>

          {demand.references.length > 0 && (
            <Block title="Para se inspirar">
              <p className="mb-3 text-sm text-ink-2">Soluções parecidas que já existem. A turma não precisa começar do zero.</p>
              <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line">
                {demand.references.map((reference) => (
                  <li key={reference.name}>
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-100 hover:bg-canvas"
                    >
                      <span className="min-w-0">
                        <span className="block text-[15px] font-medium text-ink">{reference.name}</span>
                        <span className="block text-[13px] text-ink-2">{reference.description}</span>
                      </span>
                      <ArrowUpRightIcon size={16} className="shrink-0 text-ink-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block title={`Sobre ${organization.name}`}>
            <p className="max-w-[68ch] text-[15px] leading-relaxed text-ink-2">{organization.about}</p>
            <p className="mt-3 text-sm text-ink-3">
              {organization.type} · {organization.location}
              {organization.history.length > 0 && ` · ${pluralize(organization.history.length, 'projeto', 'projetos')} com o CIn`}
            </p>
            <Link to={paths.organization(organization.id)} className="mt-3 inline-block text-sm text-accent hover:text-accent-hover">
              Ver organização
            </Link>
          </Block>
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
