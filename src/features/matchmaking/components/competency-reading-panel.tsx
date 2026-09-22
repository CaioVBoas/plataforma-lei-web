import { useState } from 'react';
import { QueryView } from '@/components/feedback/query-states';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-controls';
import { PlusIcon, SparkleIcon } from '@/components/ui/icons';
import { SidePanel } from '@/components/ui/overlays';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import { useAssociateExcerpt, useCompetencyReading, useEditDemandCompetency } from '../hooks/use-demands';
import type { CompetencyReading, ReadingConfidence } from '../types';

const CONFIDENCE_LEVEL: Record<ReadingConfidence, number> = { baixa: 1, média: 2, alta: 3 };

const ConfidenceDots = ({ level }: { level: number }) => (
  <span aria-hidden="true" className="flex gap-[3px]">
    {[1, 2, 3].map((dot) => (
      <span key={dot} className={cn('size-1.5 rounded-full border', dot <= level ? 'border-azul-500 bg-azul-500' : 'border-n-300 bg-n-0')} />
    ))}
  </span>
);

interface ExtractionCardProps {
  competency: string;
  confidenceLabel: string;
  level: number;
  excerpt: string;
  callToAction: string;
  confirmed: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onConfirm?: () => void;
  onReject: () => void;
}

const ExtractionCard = ({ competency, confidenceLabel, level, excerpt, callToAction, confirmed, selected, onSelect, onConfirm, onReject }: ExtractionCardProps) => (
  <li
    className={cn(
      'rounded-[14px] border p-4 transition-colors animate-card-entra',
      selected ? 'border-azul-500 bg-azul-50/50 shadow-[inset_3px_0_0_var(--color-azul-500)]' : 'border-n-200 bg-n-0',
    )}
  >
    <button type="button" onClick={onSelect} disabled={!onSelect} className="block w-full text-left disabled:cursor-default">
      <span className="flex items-center gap-2">
        <span className="min-w-0 flex-1 text-[15px] font-medium text-n-800">{competency}</span>
        <span className="text-[13px] text-n-500">{confidenceLabel}</span>
        <ConfidenceDots level={level} />
      </span>
      <span className="mt-[7px] block text-[13px] leading-normal text-n-500">“{excerpt}”</span>
    </button>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5 border-t border-n-200 pt-3">
      <span className="text-[13px] text-n-500">{callToAction}</span>
      <span className="flex gap-1.5">
        <Button variant={confirmed ? 'secondary' : 'outline-muted'} size="sm" disabled={confirmed} onClick={onConfirm} className={cn(confirmed && 'border-azul-500 bg-azul-50 disabled:text-azul-800')}>
          {confirmed ? 'Confirmada' : 'Faz sentido'}
        </Button>
        <Button variant="outline-muted" size="sm" onClick={onReject}>
          Não é isso
        </Button>
      </span>
    </div>
  </li>
);

const ReadingBody = ({ demandId, reading, onCorrection }: { demandId: string; reading: CompetencyReading; onCorrection: () => void }) => {
  const toast = useToast();
  const edit = useEditDemandCompetency(demandId);
  const associate = useAssociateExcerpt(demandId);
  const [selectedCompetency, setSelectedCompetency] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const [chosenExcerpt, setChosenExcerpt] = useState<string | null>(null);
  const [newCompetency, setNewCompetency] = useState('');

  const extracted = reading.segments.filter((segment) => segment.competency);
  const confirmedCount = extracted.filter((segment) => segment.confirmed).length + reading.manualAssociations.length;
  const totalCount = extracted.length + reading.manualAssociations.length;
  const toggleSelection = (competency: string) => setSelectedCompetency((current) => (current === competency ? null : competency));

  const confirm = (competency: string) =>
    edit.mutate(
      { action: 'confirm', name: competency },
      {
        onSuccess: () => {
          onCorrection();
          toast.show(`${competency} confirmada. A confiança sobe para alta.`);
        },
      },
    );

  const reject = (competency: string, message: string) =>
    edit.mutate(
      { action: 'remove', name: competency },
      {
        onSuccess: () => {
          onCorrection();
          setSelectedCompetency(null);
          toast.show(message);
        },
      },
    );

  const submitAssociation = () => {
    if (!chosenExcerpt) {
      toast.show('Escolha o trecho antes de associar.');
      return;
    }
    const competency = newCompetency.trim();
    if (!competency) {
      toast.show('Escreva a competência que o trecho indica.');
      return;
    }
    associate.mutate(
      { excerpt: chosenExcerpt, competency },
      {
        onSuccess: () => {
          onCorrection();
          setMarking(false);
          setChosenExcerpt(null);
          setNewCompetency('');
          toast.show(`${competency} associada ao trecho e adicionada à demanda.`);
        },
        onError: (error) => toast.show(error.message),
      },
    );
  };

  return (
    <>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-n-800">Descrição do parceiro</h3>
        <span className="text-[13px] text-n-500">Clique em um trecho realçado</span>
      </div>
      <p className="mb-8 text-[15px] leading-[1.75] text-n-700">
        {reading.segments.map((segment, index) =>
          segment.competency ? (
            <button
              key={index}
              type="button"
              aria-pressed={selectedCompetency === segment.competency}
              onClick={() => toggleSelection(segment.competency ?? '')}
              className={cn(
                'inline rounded-[5px] text-left text-azul-800 [box-decoration-break:clone]',
                selectedCompetency === segment.competency
                  ? 'bg-azul-100 shadow-[0_0_0_2px_var(--color-azul-100),inset_0_-2px_0_var(--color-azul-500)]'
                  : 'bg-azul-50 shadow-[0_0_0_2px_var(--color-azul-50)]',
              )}
            >
              {segment.text}
            </button>
          ) : (
            <span key={index}>{segment.text}</span>
          ),
        )}
      </p>

      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-n-800">O que saiu de cada trecho</h3>
        <span className="text-[13px] text-n-500 tabular-nums">
          {confirmedCount} de {totalCount} confirmadas
        </span>
      </div>
      <ul className="mb-8 flex flex-col gap-3">
        {extracted.map((segment) => {
          const competency = segment.competency ?? '';
          const confidence = segment.confirmed ? 'alta' : (segment.confidence ?? 'baixa');
          return (
            <ExtractionCard
              key={competency}
              competency={competency}
              confidenceLabel={`Confiança ${confidence}`}
              level={CONFIDENCE_LEVEL[confidence]}
              excerpt={segment.text.trim()}
              callToAction={segment.confirmed ? 'Você confirmou esta leitura' : confidence === 'baixa' ? 'Confirme se faz sentido' : 'Está correto?'}
              confirmed={Boolean(segment.confirmed)}
              selected={selectedCompetency === competency}
              onSelect={() => toggleSelection(competency)}
              onConfirm={() => confirm(competency)}
              onReject={() => reject(competency, `${competency} descartada. Ela sai das competências desta demanda.`)}
            />
          );
        })}
        {reading.manualAssociations.map((association) => (
          <ExtractionCard
            key={association.competency}
            competency={association.competency}
            confidenceLabel="Marcada por você"
            level={3}
            excerpt={association.excerpt}
            callToAction="Você associou esta competência a este trecho"
            confirmed
            onReject={() => reject(association.competency, `${association.competency} desfeita.`)}
          />
        ))}
      </ul>

      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-n-800">Nada foi extraído de</h3>
        <span className="text-[13px] text-n-500 tabular-nums">{pluralize(reading.ignoredExcerpts.length, 'trecho', 'trechos')}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {reading.ignoredExcerpts.map((excerpt) => (
          <li key={excerpt} className="py-2.5 text-[15px] leading-relaxed text-n-500">
            “{excerpt}”
          </li>
        ))}
      </ul>
      <button
        type="button"
        aria-expanded={marking}
        onClick={() => setMarking((open) => !open)}
        className="mt-2.5 flex h-10 w-full items-center justify-center gap-[7px] rounded-full border border-dashed border-n-300 bg-n-0 text-[13px] font-medium text-n-700 hover:bg-n-50"
      >
        <PlusIcon size={13} className="text-n-600" />
        Marcar competência aqui
      </button>
      {marking && (
        <div className="mt-2.5 rounded-lg border border-n-200 p-3">
          <p className="mb-2 text-[13px] text-n-500">Selecione o trecho e diga qual competência ele indica.</p>
          <div role="radiogroup" aria-label="Trecho" className="mb-2.5 flex flex-col gap-1.5">
            {reading.ignoredExcerpts.map((excerpt) => (
              <button
                key={excerpt}
                type="button"
                role="radio"
                aria-checked={chosenExcerpt === excerpt}
                onClick={() => setChosenExcerpt(excerpt)}
                className={cn(
                  'w-full rounded-lg border px-2.5 py-[9px] text-left text-xs leading-[1.45]',
                  chosenExcerpt === excerpt ? 'border-azul-500 bg-azul-50 text-azul-800' : 'border-n-200 bg-n-50 text-n-600',
                )}
              >
                “{excerpt}”
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              aria-label="Competência que este trecho indica"
              placeholder="Competência que este trecho indica"
              value={newCompetency}
              onChange={(event) => setNewCompetency(event.target.value)}
              className="h-10 min-w-0 flex-1 text-[13px]"
            />
            <Button variant="secondary" disabled={associate.isPending} onClick={submitAssociation}>
              Associar
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

interface CompetencyReadingPanelProps {
  demandId: string;
  onClose: () => void;
}

/** Mostra de qual trecho da descrição saiu cada competência: a inferência é marcada como inferência. */
export const CompetencyReadingPanel = ({ demandId, onClose }: CompetencyReadingPanelProps) => {
  const toast = useToast();
  const readingQuery = useCompetencyReading(demandId);
  const [corrections, setCorrections] = useState(0);

  const saveAndClose = () => {
    onClose();
    toast.show(
      corrections === 0
        ? 'Nada a corrigir. A leitura continua como estava.'
        : `${pluralize(corrections, 'correção salva', 'correções salvas')}. A leitura da próxima demanda já usa isso.`,
    );
  };

  return (
    <SidePanel
      title={
        <span className="flex items-start gap-[9px]">
          <SparkleIcon size={17} className="mt-[3px] text-azul-500" />
          Como estas competências foram identificadas
        </span>
      }
      onClose={onClose}
      header={
        <p className="mt-2 text-[13px] leading-normal text-n-500">
          A descrição do parceiro foi escrita por quem vive o problema, não por quem programa. Veja o que a leitura automática extraiu de cada trecho.
        </p>
      }
      footer={
        <>
          <p className="mb-2.5 text-[13px] text-n-500">Suas correções melhoram as próximas sugestões.</p>
          <Button variant="primary" size="lg" fullWidth onClick={saveAndClose}>
            Salvar correções
          </Button>
        </>
      }
    >
      <QueryView query={readingQuery}>
        {(reading) => <ReadingBody demandId={demandId} reading={reading} onCorrection={() => setCorrections((count) => count + 1)} />}
      </QueryView>
    </SidePanel>
  );
};
