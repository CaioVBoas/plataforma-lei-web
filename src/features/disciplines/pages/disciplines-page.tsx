import { useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';
import { PlusIcon } from '@/components/ui/icons';
import { Page, Section } from '@/components/ui/page';
import { StatusLabel } from '@/components/ui/status-label';
import { freeSlots } from '@/domain/discipline-rules';
import { paths } from '@/routes/paths';
import { NewDisciplineModal } from '../components/new-discipline-modal';
import { useDisciplines } from '../hooks/use-disciplines';
import type { DisciplineWithUsage } from '../types';
import { disciplineMeta, slotsLabel } from '../utils/discipline-presentation';

const DisciplineRow = ({ discipline }: { discipline: DisciplineWithUsage }) => (
  <ListRow
    to={paths.discipline(discipline.id)}
    trailing={
      discipline.isCurrent && <StatusLabel tone={freeSlots(discipline) > 0 ? 'positive' : 'neutral'}>{slotsLabel(discipline)}</StatusLabel>
    }
  >
    <p className="text-[15px] font-medium text-ink">{discipline.name}</p>
    <p className="mt-0.5 text-[13px] text-ink-3">
      {discipline.isCurrent ? disciplineMeta(discipline) : `${discipline.semester} · ${disciplineMeta(discipline)}`}
    </p>
    <p className="mt-1.5 line-clamp-1 text-[13px] text-ink-2">{discipline.skills.join(', ')}</p>
  </ListRow>
);

const DisciplineGroups = ({ disciplines, onCreate }: { disciplines: DisciplineWithUsage[]; onCreate: () => void }) => {
  const current = disciplines.filter((discipline) => discipline.isCurrent);
  const previous = disciplines.filter((discipline) => !discipline.isCurrent);

  return (
    <>
      <Section title={current[0]?.semester ? `Semestre ${current[0].semester}` : 'Este semestre'}>
        {current.length > 0 ? (
          <GroupedList>
            {current.map((discipline) => (
              <DisciplineRow key={discipline.id} discipline={discipline} />
            ))}
          </GroupedList>
        ) : (
          <EmptyState
            title="Nenhuma disciplina neste semestre"
            description="Cadastre as turmas que você leciona agora. Sem elas, não dá para saber quais demandas combinam com você."
            action={
              <Button variant="primary" onClick={onCreate}>
                Cadastrar disciplina
              </Button>
            }
          />
        )}
      </Section>

      {previous.length > 0 && (
        <Section title="Semestres anteriores" description="Guardam o histórico dos projetos concluídos.">
          <GroupedList>
            {previous.map((discipline) => (
              <DisciplineRow key={discipline.id} discipline={discipline} />
            ))}
          </GroupedList>
        </Section>
      )}
    </>
  );
};

export const DisciplinesPage = () => {
  const disciplinesQuery = useDisciplines();
  const [searchParams, setSearchParams] = useSearchParams();
  const creating = searchParams.get('nova') === '1';
  const setCreating = (open: boolean) => setSearchParams(open ? { nova: '1' } : {}, { replace: true });

  return (
    <Page
      title="Disciplinas"
      subtitle="O que cada turma trabalha decide quais demandas combinam com ela."
      actions={
        <Button variant="primary" onClick={() => setCreating(true)}>
          <PlusIcon size={15} />
          Nova disciplina
        </Button>
      }
    >
      <QueryView query={disciplinesQuery}>{(disciplines) => <DisciplineGroups disciplines={disciplines} onCreate={() => setCreating(true)} />}</QueryView>
      {creating && <NewDisciplineModal onClose={() => setCreating(false)} />}
    </Page>
  );
};
