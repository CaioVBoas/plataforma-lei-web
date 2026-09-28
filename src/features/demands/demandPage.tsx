import { useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { FactGrid, Page } from '@/components/ui/page';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { useTabParam } from '@/hooks/useTabParam';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import { rankDisciplines } from '@/domain/matching';
import type { SemesterCalendar } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useCurrentDisciplines } from '@/features/disciplines/useDisciplines';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { demandCover } from '@/lib/covers';
import { paths } from '@/routes/paths';
import { AdoptDemandModal } from './components/adoptDemandModal';
import { DecisionPanel } from './components/decisionPanel';
import { useDemand } from './useDemands';
import type { DemandDetail } from './types';
import { DemandQuestions } from './components/demandQuestions';
import { InvitationNote } from './components/invitationNote';
import { OrganizationBrief } from './components/organizationBrief';
import { SkillsCoverage } from './components/skillsCoverage';
import { LEVEL_COPY } from '@/features/disciplines/utils/disciplinePresentation';
import { CONSTRAINT_COPY, SCOPE_COPY, SEMESTER_DELIVERY } from './utils/demandPresentation';

const TABS = ['problema', 'competencias', 'perguntas', 'inspiracao', 'organizacao'] as const;

const SubBlock = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mt-8">
    <h3 className="mb-2.5 text-[15px] font-semibold text-ink">{title}</h3>
    {children}
  </section>
);

const DemandView = ({ detail, disciplines, calendar }: { detail: DemandDetail; disciplines: DisciplineWithUsage[]; calendar: SemesterCalendar }) => {
  const [adopting, setAdopting] = useState(false);
  const [tab, setTab] = useTabParam(TABS);
  const { demand, organization } = detail;
  const matches = rankDisciplines(demand, disciplines);
  const best = matches[0];
  const scope = SCOPE_COPY[demand.scopeFit];
  const cover = demandCover(demand.id, organization.id);

  return (
    <Page
      title={demand.title}
      eyebrow={`${demand.organization.name} · ${demand.organization.type}`}
      back={detail.projectId ? { to: paths.project(detail.projectId), label: 'Projeto' } : { to: paths.menu, label: 'Cardápio' }}
      subtitle={demand.problem}
    >
      {cover && <img src={cover} alt="" className="mb-8 block h-48 w-full rounded-lg object-cover sm:h-60" />}
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

          {tab === 'competencias' && <SkillsCoverage skills={demand.skills} matches={matches} />}

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

          {tab === 'organizacao' && <OrganizationBrief organization={organization} hasProject={Boolean(detail.projectId)} />}
        </div>

        <aside className="-order-1 lg:sticky lg:top-20 lg:order-none lg:self-start">
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
