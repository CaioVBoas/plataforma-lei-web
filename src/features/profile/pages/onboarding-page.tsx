import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/ui/icons';
import { StepDots } from '@/components/ui/progress-indicators';
import { BrandMark } from '@/components/ui/brand-mark';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { HistoryStep } from '../components/onboarding/history-step';
import { PracticeStep } from '../components/onboarding/practice-step';
import { ThemesStep } from '../components/onboarding/themes-step';
import { ONBOARDING_STEPS } from '../constants/onboarding-options';
import { useOnboardingForm } from '../hooks/use-onboarding-form';
import { useCompleteOnboarding } from '../hooks/use-profile';
import type { OnboardingAnswers } from '../types';

const TOTAL_STEPS = ONBOARDING_STEPS.length;

/** Resumo ao lado do botão de avançar: reforça que marcar pouco também é aceitável. */
const selectionSummary = (step: number, answers: OnboardingAnswers) => {
  if (step === 1) {
    const marked = Object.values(answers.practices).flat().length;
    return marked > 0 ? `${marked} marcadas` : 'Nada marcado, tudo bem';
  }
  if (step === 2) return pluralize(Object.keys(answers.themes).length, 'tema definido', 'temas definidos');
  return answers.historySource === 'mark' && answers.history.length > 0 ? `${answers.history.length} marcados` : 'Nada aqui é obrigatório';
};

const Completed = ({ onReview }: { onReview: () => void }) => {
  const navigate = useNavigate();
  return (
    <section className="rounded-2xl border border-n-200 bg-n-0 px-10 py-14 text-center">
      <div className="mx-auto mb-[18px] flex size-14 items-center justify-center rounded-full bg-sucesso-bg text-sucesso">
        <CheckIcon size={26} strokeWidth={2.6} />
      </div>
      <h1 className="mb-2.5 font-display text-[22px] font-semibold text-n-800">Pronto, seu perfil está ativo</h1>
      <p className="mx-auto mb-6 max-w-[46ch] text-[15px] leading-[1.55] text-n-600">
        A partir de agora o cardápio ordena as demandas pela compatibilidade com o que você marcou, e cada percentual vem com a explicação de como foi calculado.
      </p>
      <Button variant="primary" size="lg" className="rounded-xl" onClick={() => navigate(paths.menu)}>
        Ver demandas que combinam comigo
      </Button>
      <div className="mt-[18px]">
        <button type="button" onClick={onReview} className="text-[13px] text-n-500 underline underline-offset-2 hover:text-n-700">
          Revisar o que eu marquei
        </button>
      </div>
    </section>
  );
};

/** Onboarding de prática docente: três etapas curtas, todas opcionais. */
export const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const { answers, customOptions, dispatch } = useOnboardingForm();
  const completeOnboarding = useCompleteOnboarding();

  useEffect(() => {
    document.title = 'Primeiros passos · Aperta o PLEI';
  }, []);

  const advance = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }
    completeOnboarding.mutate(answers, { onSuccess: () => setCompleted(true) });
  };

  const current = ONBOARDING_STEPS[step - 1];

  return (
    <div className="min-h-screen w-full bg-n-50 px-6 pt-12 pb-16 font-body text-n-700">
      <div className="mx-auto w-full max-w-[680px]">
        <div className="mb-10 flex justify-center">
          <BrandMark />
        </div>

        {completed ? (
          <Completed
            onReview={() => {
              setCompleted(false);
              setStep(1);
            }}
          />
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <StepDots current={step} total={TOTAL_STEPS} suffix=", cerca de 2 minutos" />
              <button type="button" onClick={advance} className="text-[13px] font-medium text-n-600 underline underline-offset-2 hover:text-n-800">
                Pular por enquanto
              </button>
            </div>

            <h1 className="mb-1.5 text-[22px] leading-[1.3] font-bold text-n-800">{current.title}</h1>
            <p className="mb-6 max-w-[62ch] text-[15px] leading-[1.55] text-n-600">{current.support}</p>

            {step === 1 && (
              <PracticeStep
                selected={answers.practices}
                custom={customOptions}
                onToggle={(groupId, option) => dispatch({ type: 'toggle-practice', groupId, option })}
                onAdd={(groupId, option) => dispatch({ type: 'add-practice', groupId, option })}
              />
            )}
            {step === 2 && <ThemesStep themes={answers.themes} onToggle={(theme, stance) => dispatch({ type: 'toggle-theme', theme, stance })} />}
            {step === 3 && (
              <HistoryStep
                source={answers.historySource}
                history={answers.history}
                pastSummary={answers.pastSummary}
                onSourceChange={(source) => dispatch({ type: 'set-source', source })}
                onToggleHistory={(item) => dispatch({ type: 'toggle-history', item })}
                onSummaryChange={(summary) => dispatch({ type: 'set-summary', summary })}
              />
            )}

            <div className="mt-6 flex items-center justify-between gap-4">
              <Button variant="outline-muted" size="lg" className={step === 1 ? 'invisible rounded-xl' : 'rounded-xl'} onClick={() => setStep(step - 1)}>
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-n-500">{selectionSummary(step, answers)}</span>
                <Button variant="primary" size="lg" className="rounded-xl font-semibold" disabled={completeOnboarding.isPending} onClick={advance}>
                  {step === TOTAL_STEPS ? 'Concluir' : 'Continuar'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
