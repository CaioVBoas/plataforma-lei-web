import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { WarningIcon } from '@/components/ui/icons';
import { sumHours } from '@/utils/format';
import type { ProjectDetail } from '../../types';

/** Acima de 10% de diferença entre previsto e registrado, o relatório parcial tende a travar. */
const DIVERGENCE_ALERT_RATIO = 0.1;

interface HoursTabProps {
  detail: ProjectDetail;
  onExport: () => void;
}

export const HoursTab = ({ detail, onExport }: HoursTabProps) => {
  if (detail.hoursRows.length === 0) {
    return <EmptyState align="start" title="Sem planilha de horas" description="As horas deste projeto foram certificadas antes do registro semanal existir." />;
  }

  const gridTemplateColumns = `2fr repeat(${detail.hoursColumns.length}, 1fr) 90px`;
  const total = sumHours(detail.hoursRows.flatMap((row) => row.values));
  const divergence = Math.abs(total - detail.plannedHours) / detail.plannedHours;
  const columnTotals = detail.hoursColumns.map((_, column) => sumHours(detail.hoursRows.map((row) => row.values[column])));

  return (
    <div className="flex flex-col gap-12">
      {divergence > DIVERGENCE_ALERT_RATIO && (
        <div role="status" className="flex items-start gap-2.5 rounded-xl px-[18px] py-3.5">
          <WarningIcon className="mt-px text-n-700" strokeWidth={2} />
          <p className="min-w-0 flex-1 text-sm leading-[1.55] text-n-700">
            Previsto {detail.plannedHours}h e registrado {total}h, divergência de {Math.round(divergence * 100)}%. Vale conferir com as equipes antes do relatório parcial.
          </p>
        </div>
      )}

      <div role="table" aria-label="Horas por participante" className="overflow-hidden">
        <div role="row" className="grid gap-4 border-b border-n-300 px-6 py-3 text-overline text-n-500" style={{ gridTemplateColumns }}>
          <span role="columnheader">Participante</span>
          {detail.hoursColumns.map((column) => (
            <span key={column} role="columnheader">
              {column}
            </span>
          ))}
          <span role="columnheader">Total</span>
        </div>
        {detail.hoursRows.map((row) => (
          <div key={row.enrollment} role="row" className="grid items-center gap-4 border-b border-n-200 px-6 py-3" style={{ gridTemplateColumns }}>
            <div role="cell" className="min-w-0">
              <p className="truncate text-sm font-medium text-n-800">{row.name}</p>
              <p className="text-xs text-n-500 tabular-nums">{row.enrollment}</p>
            </div>
            {row.values.map((value, column) => (
              <span key={detail.hoursColumns[column]} role="cell" className="text-sm text-n-700 tabular-nums">
                {value}
              </span>
            ))}
            <span role="cell" className="text-sm font-semibold text-n-800 tabular-nums">
              {sumHours(row.values)}h
            </span>
          </div>
        ))}
        <div role="row" className="grid items-center gap-4 px-6 py-3.5 text-sm font-bold text-n-800 tabular-nums" style={{ gridTemplateColumns }}>
          <span role="cell">Total geral</span>
          {columnTotals.map((columnTotal, column) => (
            <span key={detail.hoursColumns[column]} role="cell">
              {columnTotal}h
            </span>
          ))}
          <span role="cell">{total}h</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={onExport}>
          Exportar planilha de horas
        </Button>
      </div>
    </div>
  );
};
