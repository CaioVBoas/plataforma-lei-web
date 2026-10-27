import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { ArrowRightIcon, BookIcon, PlusIcon } from '@/components/ui/icons';
import { OptionList } from '@/components/ui/optionList';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { disciplineFacts, slotsLabel } from '@/features/disciplines/utils/disciplinePresentation';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';

interface DisciplineStepProps {
  disciplines: DisciplineWithUsage[];
  /** Quantas demandas combinam com cada turma, pela regra de compatibilidade. */
  fitCounts: Record<string, number>;
  selectedId: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
}

/** Primeira pergunta do Match Maker: qual turma vai receber um projeto. O mascote reage a cada escolha. */
export const DisciplineStep = ({ disciplines, fitCounts, selectedId, onSelect, onContinue }: DisciplineStepProps) =>
  disciplines.length === 0 ? (
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
    <div className="mt-8 max-w-3xl">
      <OptionList
        label="Turma"
        columns={1}
        value={selectedId}
        onChange={onSelect}
        options={disciplines.map((discipline) => ({
          value: discipline.id,
          label: discipline.name,
          icon: <BookIcon size={20} />,
          description: `${pluralize(fitCounts[discipline.id] ?? 0, 'demanda combina', 'demandas combinam')} · ${slotsLabel(discipline)} · ${disciplineFacts(discipline)}`,
        }))}
      />
      <Button variant="primary" size="xl" className="mt-8" disabled={!selectedId} onClick={onContinue}>
        Ver sugestões
        <ArrowRightIcon size={20} />
      </Button>
    </div>
  );
