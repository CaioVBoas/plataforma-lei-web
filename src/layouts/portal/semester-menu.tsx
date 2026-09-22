import { useToast } from '@/components/feedback/toast-context';
import { CheckIcon, ChevronDownIcon } from '@/components/ui/icons';
import type { SemesterSummary } from '@/features/semester/types';
import { usePopover } from '@/hooks/use-popover';
import { cn } from '@/utils/cn';

interface SemesterMenuProps {
  semesters: SemesterSummary[];
  current: string;
  selected: string;
  onSelect: (semesterId: string) => void;
}

export const SemesterMenu = ({ semesters, current, selected, onSelect }: SemesterMenuProps) => {
  const toast = useToast();
  const { open, toggle, close, containerRef } = usePopover();

  const choose = (semesterId: string) => {
    onSelect(semesterId);
    close();
    if (semesterId !== current) {
      toast.show(`Você está vendo ${semesterId}. As ações de reserva e vínculo valem só no semestre corrente.`);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={toggle}
        className={cn('flex h-8 items-center gap-1.5 text-[13px] font-medium', open ? 'text-azul-800' : 'text-n-600 hover:text-n-800')}
      >
        Semestre {selected}
        <ChevronDownIcon size={12} />
      </button>

      {open && (
        <div className="absolute top-11 right-0 z-60 w-[280px] rounded-lg border border-n-200 bg-n-0 p-1.5 shadow-popover animate-painel-entra">
          <ul role="listbox" aria-label="Semestre">
            {semesters.map((semester) => (
              <li key={semester.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={semester.id === selected}
                  onClick={() => choose(semester.id)}
                  className={cn('flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-[9px] text-left', semester.id === selected ? 'bg-azul-50' : 'hover:bg-n-50')}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium text-n-800 tabular-nums">{semester.id}</span>
                    <span className="mt-px block text-xs text-n-500">{semester.summary}</span>
                  </span>
                  {semester.id === selected && <CheckIcon size={13} className="text-azul-500" />}
                </button>
              </li>
            ))}
          </ul>
          <div className="mx-1 my-1.5 h-px bg-n-200" />
          <button
            type="button"
            onClick={() => {
              close();
              toast.show('Histórico completo de semestres: 2019.1 a 2026.2.');
            }}
            className="w-full rounded-lg px-2.5 py-[9px] text-left text-[13px] font-medium text-azul-500 hover:bg-n-50"
          >
            Ver todos os semestres
          </button>
        </div>
      )}
    </div>
  );
};
