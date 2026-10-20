import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { ArrowRightIcon, BookIcon, PlusIcon } from '@/components/ui/icons';
import { OptionList } from '@/components/ui/optionList';
import { Page } from '@/components/ui/page';
import { rankDemandsFor } from '@/domain/matching';
import type { Demand } from '@/domain/types';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { disciplineFacts, slotsLabel } from '@/features/disciplines/utils/disciplinePresentation';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';

interface DisciplineStepProps {
  disciplines: DisciplineWithUsage[];
  menu: Demand[];
}

/** Primeira pergunta do Match Maker: qual turma vai receber um projeto. Uma escolha, uma ação. */
export const DisciplineStep = ({ disciplines, menu }: DisciplineStepProps) => {
  const navigate = useNavigate();
  const fitCounts = new Map(disciplines.map((discipline) => [discipline.id, rankDemandsFor(menu, discipline).filter(({ match }) => match.fits).length]));
  // Já vem marcada a turma com mais demandas que combinam, como a janela de levar faz com a melhor turma.
  const best = disciplines.reduce<DisciplineWithUsage | undefined>((top, discipline) => ((fitCounts.get(discipline.id) ?? 0) > (fitCounts.get(top?.id ?? '') ?? -1) ? discipline : top), undefined);
  const [selectedId, setSelectedId] = useState(best?.id ?? '');

  return (
    <Page title="Match Maker" subtitle="Escolha a turma e veja as demandas que combinam com o que ela trabalha.">
      {disciplines.length === 0 ? (
        <EmptyState
          title="Nenhuma disciplina neste semestre"
          description="Cadastre as turmas que você leciona agora. Sem elas, não dá para saber quais demandas combinam."
          action={
            <Link to={paths.newDiscipline} className={buttonClassName({ variant: 'primary', size: 'lg' })}>
              <PlusIcon size={16} />
              Cadastrar disciplina
            </Link>
          }
        />
      ) : (
        <div className="max-w-3xl">
          <h2 className="mb-4 text-h3">Qual turma vai receber um projeto?</h2>
          <OptionList
            label="Turma"
            columns={1}
            value={selectedId}
            onChange={setSelectedId}
            options={disciplines.map((discipline) => ({
              value: discipline.id,
              label: discipline.name,
              icon: <BookIcon size={20} />,
              description: `${pluralize(fitCounts.get(discipline.id) ?? 0, 'demanda combina', 'demandas combinam')} · ${slotsLabel(discipline)} · ${disciplineFacts(discipline)}`,
            }))}
          />
          <Button variant="primary" size="xl" className="mt-8" disabled={!selectedId} onClick={() => navigate(paths.matchMaker(selectedId))}>
            Ver sugestões
            <ArrowRightIcon size={20} />
          </Button>
        </div>
      )}
    </Page>
  );
};
