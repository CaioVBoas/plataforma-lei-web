import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { BookIcon } from '@/components/ui/icons';
import { ToggleChip } from '@/components/ui/toggle-chip';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { pluralize } from '@/utils/format';
import { DisciplineListItem } from '../components/discipline-list-item';
import { NewDisciplineModal } from '../components/new-discipline-modal';
import { CURRENT_SEMESTER, useDisciplines } from '../hooks/use-disciplines';
import type { Discipline } from '../types';
import { freeSlots } from '../utils/discipline-presentation';

type SemesterTab = 'current' | 'previous';

/** "?cadastrar=1" abre o cadastro direto, vindo do vínculo de demanda. */
const CREATE_PARAM = 'cadastrar';

const summaryLine = (semester: string, disciplines: Discipline[]) => {
  const active = disciplines.filter((discipline) => !discipline.paused);
  const slots = disciplines.reduce((total, discipline) => total + freeSlots(discipline), 0);
  const compatible = active.reduce((total, discipline) => total + discipline.compatibleDemands, 0);
  return [
    semester,
    pluralize(active.length, 'disciplina ativa', 'disciplinas ativas'),
    pluralize(slots, 'vaga de projeto', 'vagas de projeto'),
    `${compatible} demandas compatíveis`,
  ].join(' · ');
};

const DisciplineList = ({ disciplines }: { disciplines: Discipline[] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<SemesterTab>('current');
  const creating = searchParams.has(CREATE_PARAM);
  const setCreating = (open: boolean) => setSearchParams(open ? { [CREATE_PARAM]: '1' } : {}, { replace: true });

  const visible = disciplines.filter((discipline) => (tab === 'current' ? discipline.semester === CURRENT_SEMESTER : discipline.semester < CURRENT_SEMESTER));
  const shownSemester = tab === 'current' ? CURRENT_SEMESTER : (visible[0]?.semester ?? '');

  return (
    <div>
      <div className="mb-12 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <ToggleChip selected={tab === 'current'} onClick={() => setTab('current')}>
            {CURRENT_SEMESTER}
          </ToggleChip>
          <ToggleChip selected={tab === 'previous'} onClick={() => setTab('previous')}>
            Semestres anteriores
          </ToggleChip>
        </div>
        <Button variant="primary" onClick={() => setCreating(true)}>
          Cadastrar disciplina
        </Button>
      </div>

      {visible.length > 0 ? (
        <>
          <p className="mb-12 text-[13px] text-n-500">{summaryLine(shownSemester, visible)}</p>
          <div className="flex flex-col gap-8">
            {visible.map((discipline) => (
              <DisciplineListItem key={discipline.id} discipline={discipline} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<BookIcon size={28} />}
          title="Nenhuma disciplina cadastrada ainda"
          description={
            'Sem disciplina cadastrada a plataforma não sabe o que você ensina neste semestre, e por isso não consegue sugerir demandas compatíveis.\nO cadastro leva menos de um minuto e pode ser ajustado depois.'
          }
          action={
            <Button variant="primary" size="lg" onClick={() => setCreating(true)}>
              Cadastrar minha primeira disciplina
            </Button>
          }
        />
      )}

      {creating && <NewDisciplineModal onClose={() => setCreating(false)} />}
    </div>
  );
};

export const DisciplinesPage = () => {
  usePageHeader('Minhas disciplinas', 'Disciplinas do Centro de Informática que podem receber projetos de extensão');
  const disciplinesQuery = useDisciplines();
  return <QueryView query={disciplinesQuery}>{(disciplines) => <DisciplineList disciplines={disciplines} />}</QueryView>;
};
