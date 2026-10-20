import { useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { DisciplineStep } from './components/disciplineStep';
import { SuggestionsStep } from './components/suggestionsStep';
import { useMatchMaker } from './useMatchMaker';

/**
 * Match Maker: o docente escolhe a turma e o PLEI sugere as demandas que
 * combinam, pela regra de compatibilidade do cardápio. A turma vai na URL
 * (`?turma=`), então voltar e recarregar abrem no mesmo ponto.
 */
export const MatchMakerPage = () => {
  const [searchParams] = useSearchParams();
  const { disciplines, menu, calendar } = useMatchMaker();
  const requested = searchParams.get('turma');

  return (
    <QueryView query={disciplines}>
      {(current) => (
        <QueryView query={menu}>
          {(demands) => (
            <QueryView query={calendar}>
              {(semester) => {
                const discipline = current.find((candidate) => candidate.id === requested);
                // Turma desconhecida na URL (removida, de outro semestre) volta para a primeira pergunta.
                return discipline ? (
                  <SuggestionsStep key={discipline.id} discipline={discipline} disciplines={current} menu={demands} calendar={semester} />
                ) : (
                  <DisciplineStep disciplines={current} menu={demands} />
                );
              }}
            </QueryView>
          )}
        </QueryView>
      )}
    </QueryView>
  );
};
