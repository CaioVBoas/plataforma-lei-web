import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { ArrowUpRightIcon, CheckCircleIcon, ChevronDownIcon, MinusCircleIcon, PencilIcon } from '@/components/ui/icons';
import { SidePanel } from '@/components/ui/overlays';
import { AffinityMeter, ProgressBar } from '@/components/ui/progress-indicators';
import { ToggleChip } from '@/components/ui/toggle-chip';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import { useMatchExplanation } from '../hooks/use-demands';
import type { MatchExplanation } from '../types';
import { matchBandLabel, type DisciplineMatch } from '../utils/demand-presentation';

const CountBadge = ({ count, tone }: { count: number; tone: 'success' | 'muted' }) => (
  <span
    className={cn(
      'flex h-6 items-center rounded-full border px-[9px] text-xs font-medium tabular-nums',
      tone === 'success' ? 'border-sucesso-borda bg-sucesso-bg text-sucesso-texto' : 'border-n-200 bg-n-75 text-n-600',
    )}
  >
    {pluralize(count, 'competência', 'competências')}
  </span>
);

const CorrectionButton = ({ corrected, label, onClick }: { corrected: boolean; label: string; onClick: () => void }) => (
  <ToggleChip selected={corrected} showCheck={false} size="sm" onClick={onClick} disabled={corrected}>
    <PencilIcon size={13} />
    {corrected ? 'Corrigido' : label}
  </ToggleChip>
);

const ExplanationBody = ({ explanation }: { explanation: MatchExplanation }) => {
  const toast = useToast();
  const [corrected, setCorrected] = useState<string[]>([]);
  const [calculationOpen, setCalculationOpen] = useState(false);

  const correct = (competency: string) => {
    setCorrected((current) => [...current, competency]);
    toast.show('Correção registrada. O modelo reaprende no próximo cálculo.');
  };

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <CheckCircleIcon className="text-sucesso-texto" />
        <h3 className="text-[15px] font-medium text-n-800">O que corresponde</h3>
        <CountBadge count={explanation.matches.length} tone="success" />
      </div>
      <ul className="mb-8 flex flex-col gap-2.5">
        {explanation.matches.map((line) => (
          <li key={line.competency} className="rounded-xl border border-n-200 bg-n-0 px-4 py-3.5">
            <p className="text-sm leading-[1.4] font-medium text-n-800">{line.competency}</p>
            <div className="mt-2 flex items-start gap-2">
              <ArrowUpRightIcon size={15} className="mt-0.5 text-sucesso-texto" />
              <p className="min-w-0 flex-1 text-sm leading-[1.45] text-n-700">{line.practice}</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-n-150 pt-3">
              <span className="text-[13px] text-n-500">{line.source}</span>
              <CorrectionButton corrected={corrected.includes(line.competency)} label="Corrigir" onClick={() => correct(line.competency)} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mb-3 flex items-center gap-2">
        <MinusCircleIcon className="text-n-400" />
        <h3 className="text-[15px] font-medium text-n-800">O que não corresponde</h3>
        <CountBadge count={explanation.gaps.length} tone="muted" />
      </div>
      {/* Ver a lacuna é o que permite ao docente julgar se ela é impeditiva. */}
      <ul className="mb-8 flex flex-col gap-2.5">
        {explanation.gaps.map((gap) => (
          <li key={gap.competency} className="rounded-xl border border-n-150 bg-n-50 px-4 py-3.5">
            <p className="text-sm leading-[1.4] font-medium text-n-800">{gap.competency}</p>
            <p className="mt-1.5 text-[13px] leading-normal text-n-600">Isso não impede o projeto, mas pode exigir apoio externo.</p>
            <p className="mt-2 text-[13px] text-n-500">{gap.reason}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-n-200 pt-3">
              <CorrectionButton corrected={corrected.includes(gap.competency)} label="Tenho essa prática" onClick={() => correct(gap.competency)} />
              <Button
                variant="outline-muted"
                size="sm"
                onClick={() => toast.show('Convite de coordenação conjunta: escolha o colega na etapa de vínculo.')}
              >
                Convidar colega
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="overflow-hidden rounded-xl border border-n-200">
        <button
          type="button"
          aria-expanded={calculationOpen}
          onClick={() => setCalculationOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 bg-n-0 px-3.5 py-[13px] text-left"
        >
          <span className="text-sm font-medium text-n-800">Como isso foi calculado</span>
          <ChevronDownIcon size={14} className={cn('text-n-500 transition-transform', calculationOpen && 'rotate-180')} />
        </button>
        {calculationOpen && (
          <div className="px-3.5 pt-1 pb-3.5">
            <ul className="flex flex-col gap-3.5">
              {explanation.weights.map((weight) => (
                <li key={weight.label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] font-medium text-n-800">{weight.label}</span>
                    <span className="text-xs font-semibold text-n-600 tabular-nums">{weight.percent}%</span>
                  </div>
                  <ProgressBar percent={weight.percent} label={`Peso de ${weight.label}`} thickness={4} className="mt-1.5" />
                  <p className="mt-[5px] text-xs leading-[1.45] text-n-500">{weight.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3.5 border-t border-n-200 pt-3 text-xs leading-normal text-n-500">
              Nenhum dado veio de sistema externo. Tudo vem do que você cadastrou aqui e do catálogo de disciplinas do CIn.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

interface MatchExplanationPanelProps {
  demandId: string;
  matches: DisciplineMatch[];
  disciplineId: string;
  onChangeDiscipline: (disciplineId: string) => void;
  onClose: () => void;
}

/** Explicação do casamento: requisito, não enfeite. Mostra o par de cada competência e as lacunas. */
export const MatchExplanationPanel = ({ demandId, matches, disciplineId, onChangeDiscipline, onClose }: MatchExplanationPanelProps) => {
  const navigate = useNavigate();
  const explanationQuery = useMatchExplanation(demandId, disciplineId);
  const selected = matches.find((match) => match.discipline.id === disciplineId) ?? matches[0];

  return (
    <SidePanel
      title="Por que esta demanda combina"
      onClose={onClose}
      header={
        <>
          <div role="radiogroup" aria-label="Disciplina" className="mt-3.5 flex flex-wrap gap-2">
            {matches.map(({ discipline, percent }) => (
              <ToggleChip
                key={discipline.id}
                role="radio"
                aria-checked={discipline.id === disciplineId}
                selected={discipline.id === disciplineId}
                showCheck={false}
                size="sm"
                onClick={() => onChangeDiscipline(discipline.id)}
              >
                <span>{discipline.name}</span>
                <span className="font-bold tabular-nums">{percent}%</span>
              </ToggleChip>
            ))}
          </div>
          {selected && (
            <div className="mt-4 rounded-xl bg-n-50 p-4">
              <div className="flex items-center gap-3.5">
                <span className="text-[32px] leading-none font-bold tracking-[-.02em] text-n-800 tabular-nums">{selected.percent}%</span>
                <AffinityMeter percent={selected.percent} label={selected.discipline.name} />
              </div>
              <p className="mt-2.5 text-[13px] text-n-600">
                {selected.discipline.name} · {matchBandLabel(selected.percent)}
              </p>
            </div>
          )}
        </>
      }
      footer={
        <Button variant="secondary" size="lg" fullWidth onClick={() => navigate(paths.practice)}>
          Corrigir minha leitura de prática
        </Button>
      }
    >
      <QueryView query={explanationQuery}>{(explanation) => <ExplanationBody key={disciplineId} explanation={explanation} />}</QueryView>
    </SidePanel>
  );
};
