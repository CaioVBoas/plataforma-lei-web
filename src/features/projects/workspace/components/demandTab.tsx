import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { ArrowRightIcon, ChatIcon } from '@/components/ui/icons';
import { Tag } from '@/components/ui/tag';
import type { Project } from '@/domain/types';
import { useDemand } from '@/features/demands/useDemands';
import { CONSTRAINT_COPY } from '@/features/demands/utils/demandPresentation';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-t border-line py-5 first:border-t-0 first:pt-0">
    <h3 className="mb-2 text-[13px] font-semibold text-brand-strong">{title}</h3>
    {children}
  </section>
);

/**
 * O combinado com a organização: o problema como ela escreveu, o que ela
 * oferece, o que cabe no semestre e as competências. Serve de referência para a turma.
 */
export const DemandTab = ({ project }: { project: Project }) => {
  const { data, isPending } = useDemand(project.demandId);
  if (isPending) return null;
  // Projeto antigo: a demanda já saiu da plataforma. O combinado ficou registrado no plano.
  if (!data) {
    return (
      <div className="rounded-lg border border-line bg-canvas p-5">
        <p className="text-[15px] font-medium text-ink">A demanda original já saiu da plataforma</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          O que foi combinado com {project.organization.name} está na aba Plano{project.outcome ? ', e o resultado do semestre aparece no topo do projeto' : ''}.
        </p>
      </div>
    );
  }
  const { demand } = data;
  const answered = demand.questions.filter((question) => question.answer).length;

  return (
    <div>
      <div>
        <Block title="O problema">
          <p className="text-[15px] leading-relaxed text-ink-2">{demand.description}</p>
        </Block>

        <Block title="O que a organização oferece">
          <ul className="space-y-1.5 text-[15px] text-ink-2">
            {demand.offers.map((offer) => (
              <li key={offer} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
                {offer}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="O que cabe no semestre">
          <p className="text-[15px] leading-relaxed text-ink-2">{demand.scopeNote}</p>
        </Block>

        <Block title="Competências pedidas">
          <div className="flex flex-wrap gap-1.5">
            {demand.skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>
        </Block>

        {demand.constraints.length > 0 && (
          <Block title="Condições">
            <ul className="space-y-1.5">
              {demand.constraints.map((constraint) => (
                <li key={constraint} className="text-[15px] leading-relaxed text-ink-2">
                  <span className="font-medium text-ink">{CONSTRAINT_COPY[constraint].label}.</span> {CONSTRAINT_COPY[constraint].detail}
                </li>
              ))}
            </ul>
          </Block>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <Link to={paths.demand(demand.id)} className={buttonClassName({ variant: 'secondary' })}>
          Ver a demanda completa
          <ArrowRightIcon size={15} />
        </Link>
        {demand.questions.length > 0 && (
          <Link to={paths.demand(demand.id, 'perguntas')} className={buttonClassName({ variant: 'secondary' })}>
            <ChatIcon size={16} />
            {pluralize(answered, 'resposta da organização', 'respostas da organização')}
          </Link>
        )}
      </div>
    </div>
  );
};
