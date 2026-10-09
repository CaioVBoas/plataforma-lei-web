import { useState, type ReactNode } from 'react';
import { CheckIcon, ChevronDownIcon } from '@/components/ui/icons';
import { MILESTONE_ORDER } from '@/domain/projectLifecycle';
import type { MilestoneId } from '@/domain/types';
import { cn } from '@/utils/cn';

/* Os blocos do Como funciona, iguais nos dois portais: muda só o texto. */

export interface GuideStep {
  title: string;
  text: string;
  /** Rótulo pequeno à direita do texto: prazo ou atalho. */
  aside?: ReactNode;
  done?: boolean;
}

/**
 * Passos numa linha, ligados por um traço. Clicar num passo mostra a frase
 * dele embaixo.
 */
export const StepTabs = ({ label, steps }: { label: string; steps: GuideStep[] }) => {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div>
      <ol aria-label={label} className="relative flex justify-between gap-2">
        <span aria-hidden="true" className="absolute top-4 right-[5%] left-[5%] h-px bg-line-strong" />
        {steps.map((item, index) => {
          const current = index === active;
          return (
            <li key={item.title} className="relative flex min-w-0 flex-1 justify-center">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={current ? 'step' : undefined}
                className="flex min-w-0 flex-col items-center gap-2 text-center"
              >
                <span
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-small font-semibold tabular-nums ring-4 ring-surface transition-colors',
                    current ? 'bg-brand text-white' : item.done ? 'bg-positive-soft text-positive' : 'bg-fill text-ink-2 hover:bg-fill-strong',
                  )}
                >
                  {item.done && !current ? <CheckIcon size={14} strokeWidth={2.2} /> : index + 1}
                </span>
                <span className={cn('hidden text-small sm:block', current ? 'font-semibold text-ink' : 'text-ink-2')}>{item.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div aria-live="polite" className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-line pt-5">
        <div className="min-w-0 flex-[1_1_420px]">
          <p className="text-h4 font-semibold text-ink">{step.title}</p>
          <p className="mt-1 text-body text-ink-2">{step.text}</p>
        </div>
        {step.aside}
      </div>
    </div>
  );
};

const MILESTONE_TIMING: Record<MilestoneId, string> = {
  plan: 'Primeira semana',
  kickoff: 'Até duas semanas',
  sigaa: 'Até o prazo de vinculação',
  midterm: 'Meio do semestre',
  final: 'Última semana de aula',
  closing: 'Fim do semestre',
};

/** Em que fase o projeto fica em cada etapa, dito uma vez em cada troca. */
const PHASE_START: Partial<Record<MilestoneId, string>> = { plan: 'Planejamento', midterm: 'Em andamento', closing: 'Concluído' };

/**
 * As seis etapas de cima para baixo. Clicar numa abre o que acontece nela;
 * as outras ficam fechadas, só com o título e o prazo.
 */
export const Stages = ({ copy }: { copy: Record<MilestoneId, { title: string; description: string }> }) => {
  const [open, setOpen] = useState<MilestoneId>('plan');

  return (
    <ol className="overflow-hidden rounded-lg border border-line bg-surface">
      {MILESTONE_ORDER.map((id, index) => {
        const current = id === open;
        const phase = PHASE_START[id];
        return (
          <li key={id} className="border-t border-line first:border-t-0">
            {phase && <p className="bg-canvas px-5 py-1.5 text-caption font-semibold text-ink-2">{phase}</p>}
            <button
              type="button"
              onClick={() => setOpen(id)}
              aria-expanded={current}
              className={cn('flex w-full items-start gap-4 px-5 py-4 text-left transition-colors', current ? 'bg-surface' : 'hover:bg-canvas')}
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-small font-semibold tabular-nums transition-colors',
                  current ? 'bg-brand text-white' : 'bg-fill text-ink-2',
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 pt-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <span className={cn('text-body text-ink', current ? 'font-semibold' : 'font-medium')}>{copy[id].title}</span>
                  <span className={cn('text-small', current ? 'font-medium text-brand-strong' : 'text-ink-3')}>{MILESTONE_TIMING[id]}</span>
                </span>
                {current && <span className="mt-1.5 block text-small text-ink-2 animate-fade-in">{copy[id].description}</span>}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

/** As regras no mesmo desenho da faixa de perfis do portal: um cartão, três colunas. */
export interface RuleGroup {
  icon: ReactNode;
  title: string;
  rules: string[];
}

export const Rules = ({ groups }: { groups: RuleGroup[] }) => (
  <ul className="grid overflow-hidden rounded-lg border border-line bg-surface md:grid-cols-3">
    {groups.map((group) => (
      <li key={group.title} className="border-line p-6 not-first:border-t md:not-first:border-t-0 md:not-first:border-l">
        <span className="flex size-10 items-center justify-center rounded-md bg-brand text-white">{group.icon}</span>
        <p className="mt-4 text-h4 font-semibold text-ink">{group.title}</p>
        <ul className="mt-2 space-y-2">
          {group.rules.map((rule) => (
            <li key={rule} className="text-small text-ink-2">
              {rule}
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

export const Faq = ({ items }: { items: FaqItem[] }) => (
  <div className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
    {items.map((item) => (
      <details key={item.question} className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-body font-medium text-ink hover:bg-canvas [&::-webkit-details-marker]:hidden">
          {item.question}
          <ChevronDownIcon size={16} className="shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
        </summary>
        <p className="px-4 pb-4 text-small text-ink-2">{item.answer}</p>
      </details>
    ))}
  </div>
);

