import { ChevronRightIcon } from '@/components/ui/icons';
import { ProgressBar } from '@/components/ui/progress-indicators';
import { SectionCard } from '@/components/ui/section-card';
import type { DisciplineMatch } from '../../utils/demand-presentation';

interface DisciplineFitSectionProps {
  matches: DisciplineMatch[];
  onExplain: (disciplineId: string) => void;
}

/** Nenhum percentual aparece sem que o docente possa abrir a conta: cada linha abre a explicação. */
export const DisciplineFitSection = ({ matches, onExplain }: DisciplineFitSectionProps) => (
  <SectionCard title="Encaixe nas disciplinas do CIn" description="Esta demanda só pode ser vinculada a uma disciplina do Centro de Informática.">
    <ul>
      {matches.map(({ discipline, percent }) => (
        <li key={discipline.id}>
          <button
            type="button"
            onClick={() => onExplain(discipline.id)}
            aria-label={`Por que ${percent}% com ${discipline.name}`}
            className="flex w-full items-center gap-4 border-b border-n-200 py-5 text-left first:border-t"
          >
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-2">
                <span className="text-[15px] font-medium text-n-800">{discipline.name}</span>
                <span className="text-[13px] text-n-500">{discipline.code}</span>
              </span>
              <span className="mt-[3px] block text-[13px] text-n-600">
                Oferta de {discipline.executionStart} a {discipline.executionEnd} · {discipline.students} estudantes por turma
              </span>
              <ProgressBar percent={percent} label={`Compatibilidade com ${discipline.name}`} className="mt-2.5 max-w-[320px]" />
            </span>
            <span className="flex shrink-0 items-center gap-3">
              <span className="text-xl font-bold text-n-800 tabular-nums">{percent}%</span>
              <ChevronRightIcon size={14} className="text-n-400" />
            </span>
          </button>
        </li>
      ))}
    </ul>
    <p className="mt-3.5 text-[13px] leading-normal text-n-500">
      Calculado sobre a ementa que você cadastrou, seu perfil de prática e projetos que você registrou aqui.
    </p>
  </SectionCard>
);
