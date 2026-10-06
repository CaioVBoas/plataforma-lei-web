import type { ReactNode } from 'react';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import { FactGrid } from '@/components/ui/page';
import { Tag } from '@/components/ui/tag';
import type { DemandConstraint, Reference } from '@/domain/types';
import { CONSTRAINT_COPY } from '@/features/demands/utils/demandPresentation';

const SubBlock = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mt-8">
    <h3 className="mb-2.5 text-[15px] font-semibold text-ink">{title}</h3>
    {children}
  </section>
);

const Empty = () => <span className="text-ink-3">Ainda não preenchido</span>;

interface DemandContentProps {
  description: string;
  affectedPublic: string;
  meetingCadence: string;
  offers: string[];
  constraints: DemandConstraint[];
  skills: string[];
  references: Reference[];
  /** No pedido, o que a organização espera; no cardápio, o recorte que o L.E.I. escreveu. */
  outcome: { title: string; text: string };
  /** Quem sente e reuniões em mini cards. No detalhe, eles sobem para o topo, acima das abas. */
  facts?: boolean;
}

export const DemandFacts = ({ affectedPublic, meetingCadence }: Pick<DemandContentProps, 'affectedPublic' | 'meetingCadence'>) => (
  <FactGrid
    columns={2}
    items={[
      { label: 'Quem sente', value: affectedPublic || <Empty /> },
      { label: 'Reuniões', value: meetingCadence || <Empty /> },
    ]}
  />
);

/** O que a organização escreveu, na mesma ordem em que o docente lê no detalhe da demanda. */
export const DemandContent = ({ description, affectedPublic, meetingCadence, offers, constraints, skills, references, outcome, facts = true }: DemandContentProps) => (
  <div className="[&>section:first-child]:mt-0">
    {facts && <DemandFacts affectedPublic={affectedPublic} meetingCadence={meetingCadence} />}

    <SubBlock title="Contexto">
      <p className="text-[15px] leading-relaxed whitespace-pre-line text-ink-2">{description || <Empty />}</p>
    </SubBlock>

    <SubBlock title={outcome.title}>
      <p className="text-[15px] leading-relaxed text-ink-2">{outcome.text || <Empty />}</p>
    </SubBlock>

    <SubBlock title="O que vocês oferecem à turma">
      {offers.length > 0 ? (
        <ul className="space-y-2 text-[15px] text-ink-2">
          {offers.map((offer) => (
            <li key={offer} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-3" />
              {offer}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px]">
          <Empty />
        </p>
      )}
    </SubBlock>

    {constraints.length > 0 && (
      <SubBlock title="O que pesa na rotina da turma">
        <ul className="space-y-2">
          {constraints.map((constraint) => (
            <li key={constraint} className="text-[15px] leading-relaxed text-ink-2">
              <span className="font-medium text-ink">{CONSTRAINT_COPY[constraint].label}.</span> {CONSTRAINT_COPY[constraint].detail}
            </li>
          ))}
        </ul>
      </SubBlock>
    )}

    <SubBlock title="Competências">
      {skills.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <li key={skill}>
              <Tag>{skill}</Tag>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px] text-ink-3">O L.E.I. indica as competências na triagem.</p>
      )}
    </SubBlock>

    {references.length > 0 && (
      <SubBlock title="Para se inspirar">
        <ul className="grid gap-3 sm:grid-cols-2">
          {references.map((reference) => (
            <li key={reference.name}>
              <a href={reference.url} target="_blank" rel="noreferrer" className="flex h-full flex-col rounded-lg border border-line bg-surface px-4 py-3.5 transition-colors duration-150 hover:border-line-strong">
                <span className="flex items-center justify-between gap-3 text-[15px] font-medium text-ink">
                  {reference.name}
                  <ArrowUpRightIcon size={15} className="shrink-0 text-ink-3" />
                </span>
                {reference.description && <span className="mt-1 text-[13px] leading-relaxed text-ink-2">{reference.description}</span>}
              </a>
            </li>
          ))}
        </ul>
      </SubBlock>
    )}
  </div>
);
