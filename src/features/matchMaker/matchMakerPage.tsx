import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/feedback/toastContext';
import { ErrorState } from '@/components/feedback/queryStates';
import { Page } from '@/components/ui/page';
import { rankDemandsFor } from '@/domain/matching';
import type { Project } from '@/domain/types';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { paths } from '@/routes/paths';
import { DisciplineStep } from './components/disciplineStep';
import { MascotStage, type StageState } from './components/mascotStage';
import { ScreenCurtain } from './components/screenCurtain';
import { SearchProgress } from './components/searchProgress';
import { SuggestionsStep } from './components/suggestionsStep';
import { useSearchSequence } from './hooks';
import { useMatchMaker } from './useMatchMaker';
import { chooseStage, NO_DISCIPLINE_STAGE, OPENING_STAGE, searchStage } from './utils/stageCopy';

/** Quanto a cortina de cor fica na tela antes de abrir o projeto (menos, se a pessoa pede menos movimento). */
const CURTAIN_MS = 1500;
const CURTAIN_REDUCED_MS = 400;

interface Leaving {
  projectId: string;
  demandTitle: string;
  disciplineName: string;
}

/**
 * Match Maker: o docente escolhe a turma e o PLEI sugere as demandas que
 * combinam, pela regra de compatibilidade do cardápio. O mascote fica em cima
 * das três etapas (escolher, buscar, decidir) e a cor do palco muda com o
 * momento. A turma vai na URL (`?turma=`), então voltar e recarregar abrem no mesmo ponto.
 */
export const MatchMakerPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const reduced = usePrefersReducedMotion();
  const [searchParams] = useSearchParams();
  const { disciplines, menu, calendar } = useMatchMaker();

  const [chosenId, setChosenId] = useState<string>();
  const [searchedId, setSearchedId] = useState<string>();
  const [burst, setBurst] = useState(0);
  const [resultsStage, setResultsStage] = useState<StageState>({ tone: 'working', pose: 'idle', title: 'Pronto', text: 'As sugestões estão logo abaixo.' });
  const [leaving, setLeaving] = useState<Leaving>();

  const jump = useCallback(() => setBurst((value) => value + 1), []);
  const requested = searchParams.get('turma');
  const failed = [disciplines, menu, calendar].find((query) => query.isError);
  const current = disciplines.data ?? [];
  const demands = menu.data ?? [];
  const semester = calendar.data;
  const ready = Boolean(disciplines.data && menu.data && semester);

  // Turma desconhecida na URL (removida, de outro semestre) volta para a primeira pergunta.
  const discipline = ready ? current.find((candidate) => candidate.id === requested) : undefined;
  const searching = Boolean(discipline) && searchedId !== discipline?.id && !reduced;
  const finishSearch = useCallback(() => setSearchedId(discipline?.id), [discipline?.id]);
  const step = useSearchSequence(searching, discipline?.id ?? '', finishSearch);

  const fitCounts = Object.fromEntries(current.map((candidate) => [candidate.id, rankDemandsFor(demands, candidate).filter(({ match }) => match.fits).length]));
  // Já vem marcada a turma com mais demandas que combinam, como a janela de levar faz com a melhor turma.
  const best = current.reduce<string | undefined>((top, candidate) => ((fitCounts[candidate.id] ?? 0) > (fitCounts[top ?? ''] ?? -1) ? candidate.id : top), undefined);
  const selectedId = current.some((candidate) => candidate.id === chosenId) ? (chosenId ?? '') : (best ?? '');
  const chosen = current.find((candidate) => candidate.id === selectedId);

  const handleAdopted = useCallback((project: Project, demandTitle: string) => {
    setLeaving({ projectId: project.id, demandTitle, disciplineName: discipline?.name ?? '' });
  }, [discipline?.name]);

  // A cortina cobre a tela e, passado o tempo dela, o projeto abre. O aviso entra já na chegada.
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => {
      toast.show('Projeto criado. Comece revisando o plano.');
      navigate(paths.project(leaving.projectId, 'plano'));
    }, reduced ? CURTAIN_REDUCED_MS : CURTAIN_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, navigate, reduced, toast]);

  const facts = discipline && ready ? {
    skills: discipline.skills.length,
    menu: demands.length,
    fits: fitCounts[discipline.id] ?? 0,
    partial: rankDemandsFor(demands, discipline).filter(({ match }) => !match.fits).length,
  } : undefined;

  let stage: StageState;
  if (!ready) stage = OPENING_STAGE;
  else if (searching && discipline && facts) stage = searchStage(step, discipline, facts);
  else if (discipline) stage = resultsStage;
  else stage = current.length === 0 ? NO_DISCIPLINE_STAGE : chooseStage(chosen, chosen ? (fitCounts[chosen.id] ?? 0) : 0);

  if (failed) {
    return (
      <Page title="Match Maker">
        <ErrorState error={failed.error} onRetry={() => failed.refetch()} />
      </Page>
    );
  }

  return (
    <Page
      title="Match Maker"
      subtitle="Escolha a turma e veja as demandas que combinam com o que ela trabalha."
      back={discipline ? { to: paths.matchMaker(), label: 'Escolher outra turma' } : undefined}
    >
      <MascotStage stage={stage} burst={burst} />

      {ready && semester && !discipline && (
        <DisciplineStep
          disciplines={current}
          fitCounts={fitCounts}
          selectedId={selectedId}
          onSelect={(id) => {
            setChosenId(id);
            jump();
          }}
          onContinue={() => navigate(paths.matchMaker(selectedId))}
        />
      )}
      {ready && semester && discipline && searching && facts && (
        <SearchProgress step={step} facts={facts} disciplineName={discipline.name} onSkip={finishSearch} />
      )}
      {ready && semester && discipline && !searching && (
        <SuggestionsStep key={discipline.id} discipline={discipline} disciplines={current} menu={demands} calendar={semester} onStage={setResultsStage} onReserved={jump} onAdopted={handleAdopted} />
      )}
      {leaving && <ScreenCurtain demandTitle={leaving.demandTitle} disciplineName={leaving.disciplineName} />}
    </Page>
  );
};
