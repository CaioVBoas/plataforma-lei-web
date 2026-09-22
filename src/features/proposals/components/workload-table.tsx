import { Input } from '@/components/ui/form-controls';
import { cn } from '@/utils/cn';
import { onlyDigits, sumHours } from '@/utils/format';
import type { WorkloadRow } from '../types';
import { EXPECTED_EXTENSION_HOURS } from '../utils/proposal-presentation';

const GRID = 'grid grid-cols-[1fr_150px_200px] gap-3';

interface WorkloadTableProps {
  rows: WorkloadRow[];
  onChangeHours: (index: number, hours: string) => void;
}

export const WorkloadTable = ({ rows, onChangeHours }: WorkloadTableProps) => {
  const total = sumHours(rows.map((row) => row.hours));
  const matchesDiscipline = total === EXPECTED_EXTENSION_HOURS;

  return (
    <section>
      <h3 className="heading-section">Distribuição de carga horária</h3>
      <p className="mt-0.5 mb-5 text-[13px] text-n-500">Sugestão automática. Ajuste o que precisar.</p>

      <div className={cn(GRID, 'border-b border-n-200 pb-2.5 text-overline text-n-500')} aria-hidden="true">
        <span>Atividade</span>
        <span>Carga por estudante</span>
        <span>Participantes</span>
      </div>
      {rows.map((row, index) => (
        <div key={row.activity} className={cn(GRID, 'items-center border-b border-n-200 py-3')}>
          <span className="text-sm text-n-700">{row.activity}</span>
          <span className="flex items-center gap-1.5">
            <Input
              aria-label={`Horas por estudante em ${row.activity}`}
              inputMode="numeric"
              value={row.hours}
              onChange={(event) => onChangeHours(index, onlyDigits(event.target.value))}
              className="h-9 w-14 px-2.5 text-sm text-n-800 tabular-nums"
            />
            <span className="text-[13px] text-n-500">horas</span>
          </span>
          <span className="text-sm text-n-600">{row.participants}</span>
        </div>
      ))}
      <div className={cn(GRID, 'items-center pt-4')}>
        <span className="text-sm font-bold text-n-800">Total por estudante</span>
        <span className={cn('text-[15px] font-bold tabular-nums', matchesDiscipline ? 'text-n-800' : 'text-n-700')}>{total} horas</span>
        <span className="text-[13px] text-n-500">
          {matchesDiscipline ? 'Compatível com a disciplina' : `A disciplina prevê ${EXPECTED_EXTENSION_HOURS} horas de extensão`}
        </span>
      </div>
    </section>
  );
};
