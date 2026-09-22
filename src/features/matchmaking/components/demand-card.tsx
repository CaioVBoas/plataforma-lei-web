import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon } from '@/components/ui/icons';
import { SignalPill } from '@/components/ui/signal-pill';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import type { Demand } from '../types';
import { DEMAND_ACTION, organizationLine, type DisciplineMatch } from '../utils/demand-presentation';
import { ViabilityPill } from './viability-pill';

interface DemandCardProps {
  demand: Demand;
  bestMatch?: DisciplineMatch;
  onPrimaryAction: (demand: Demand) => void;
  onRelease: (demandId: string) => void;
  busy: boolean;
}

/**
 * Card de Demanda. O cartão inteiro leva ao detalhe (link esticado sobre o
 * título); os botões ficam acima dele para não disparar a navegação.
 */
export const DemandCard = ({ demand, bestMatch, onPrimaryAction, onRelease, busy }: DemandCardProps) => {
  const reservedByMe = demand.status === 'reserved-by-me';

  return (
    <article
      className={cn(
        'relative flex flex-col gap-3 rounded-2xl border bg-n-0 px-6 py-[22px] animate-card-entra',
        'transition-[border-color,box-shadow,transform] duration-[260ms] ease-suave hover:-translate-y-0.5 hover:shadow-card-hover',
        reservedByMe ? 'border-azul-500' : 'border-n-200 hover:border-n-300',
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
        <p className="min-w-0 flex-[1_1_320px] text-[13px] text-n-500">{organizationLine(demand)}</p>
        <ViabilityPill viability={demand.viability} note={demand.viabilityNote} />
      </div>

      <div>
        <h2 className="max-w-[76ch] text-lg leading-[1.35] font-bold tracking-[-.01em] text-pretty text-n-800">
          <Link to={paths.demand(demand.id)} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:shadow-none focus-visible:after:shadow-focus">
            {demand.problem}
          </Link>
        </h2>
        <p className="mt-1.5 max-w-[76ch] text-[15px] leading-[1.55] text-n-600">Afeta {demand.affectedPublic}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {bestMatch && (
          <span className="text-[15px] font-medium text-n-800 tabular-nums">
            {bestMatch.percent}% com {bestMatch.discipline.name}
          </span>
        )}
        <SignalPill icon={<CalendarIcon size={15} />} title={`Ponto focal ${demand.followUpCadence.toLowerCase()} para acompanhar a equipe`}>
          {demand.followUpCadence}
        </SignalPill>
        {demand.status === 'reserved-by-other' && (
          <SignalPill icon={<ClockIcon size={15} strokeWidth={1.8} />} title="Outro docente reservou esta demanda e está decidindo">
            Em análise
          </SignalPill>
        )}
      </div>

      <ul aria-label="Competências inferidas" className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
        {demand.competencies.map((competency) => (
          <li
            key={competency.name}
            title={competency.confirmed ? 'Confirmada por você' : 'Sugerida pela leitura automática'}
            className={cn('border-b text-[13px] leading-[1.7] text-n-600', competency.confirmed ? 'border-n-400' : 'border-dashed border-n-300')}
          >
            {competency.name}
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-[18px] flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="primary" disabled={busy} onClick={() => onPrimaryAction(demand)}>
            {DEMAND_ACTION[demand.status].label}
          </Button>
          {reservedByMe && (
            <Button variant="ghost" disabled={busy} onClick={() => onRelease(demand.id)}>
              Liberar reserva
            </Button>
          )}
        </div>
        {reservedByMe && demand.reservationDaysLeft !== undefined && (
          <span className="text-[13px] font-medium text-azul-800">
            {pluralize(demand.reservationDaysLeft, 'dia útil restante', 'dias úteis restantes')}
          </span>
        )}
      </div>
    </article>
  );
};
