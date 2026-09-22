import { Textarea } from '@/components/ui/form-controls';
import { RadioCard } from '@/components/ui/radio-card';
import { HISTORY_OPTIONS, HISTORY_SOURCES } from '../../constants/onboarding-options';
import type { OnboardingAnswers } from '../../types';
import { ChoiceChip } from './choice-chip';

interface HistoryStepProps {
  source: OnboardingAnswers['historySource'];
  history: string[];
  pastSummary: string;
  onSourceChange: (source: OnboardingAnswers['historySource']) => void;
  onToggleHistory: (item: string) => void;
  onSummaryChange: (summary: string) => void;
}

export const HistoryStep = ({ source, history, pastSummary, onSourceChange, onToggleHistory, onSummaryChange }: HistoryStepProps) => (
  <div>
    <div role="radiogroup" aria-label="Como contar seu histórico" className="flex flex-col gap-2.5">
      {HISTORY_SOURCES.map((option) => (
        <div key={option.id}>
          <RadioCard rounded="2xl" selected={source === option.id} onSelect={() => onSourceChange(option.id)}>
            <span className="block text-[15px] font-semibold text-n-800">{option.title}</span>
            <span className="mt-[3px] block text-[13px] text-n-600">{option.note}</span>
          </RadioCard>

          {source === 'mark' && option.id === 'mark' && (
            <div className="pt-3 pr-4 pl-[46px]">
              <p className="mb-2 text-xs text-n-500">Marque o que já aconteceu, sem digitar nada.</p>
              <div className="flex flex-wrap gap-2">
                {HISTORY_OPTIONS.map((item) => (
                  <ChoiceChip key={item} selected={history.includes(item)} onToggle={() => onToggleHistory(item)}>
                    {item}
                  </ChoiceChip>
                ))}
              </div>
            </div>
          )}

          {source === 'paste' && option.id === 'paste' && (
            <div className="pt-3 pr-4 pl-[46px]">
              <Textarea
                aria-label="Resumo de projeto anterior"
                placeholder="Cole aqui o resumo de um projeto que você conduziu, se tiver à mão"
                value={pastSummary}
                onChange={(event) => onSummaryChange(event.target.value)}
                className="min-h-[84px] rounded-xl"
              />
              <p className="mt-1.5 text-xs text-n-500">Fica só na plataforma. Nada é buscado nem enviado a sistema institucional.</p>
            </div>
          )}
        </div>
      ))}
    </div>
    <p className="mt-3.5 text-[13px] leading-normal text-n-500">
      Quanto mais a plataforma souber, mais precisas ficam as sugestões. Você pode voltar aqui quando quiser.
    </p>
  </div>
);
