import { useId } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useCreateDiscipline } from '../useDisciplines';
import type { DisciplineWithUsage } from '../types';
import { DisciplineForm } from './disciplineForm';
import { DialogActions } from '@/components/ui/confirmDialog';
import { CheckIcon, CloseIcon } from '@/components/ui/icons';

interface NewDisciplineModalProps {
  onClose: () => void;
  onCreated?: (discipline: DisciplineWithUsage) => void;
}

export const NewDisciplineModal = ({ onClose, onCreated }: NewDisciplineModalProps) => {
  const formId = useId();
  const toast = useToast();
  const { data: calendar } = useCalendar();
  const create = useCreateDiscipline();

  return (
    <Modal
      title="Nova disciplina"
      description={calendar && `Turma do semestre ${calendar.id}. Ela passa a receber demandas assim que for cadastrada.`}
      size="lg"
      onClose={onClose}
      footer={
        <DialogActions>
          <Button variant="secondary" size="xl" fullWidth onClick={onClose}>
            <CloseIcon size={20} />
            Cancelar
          </Button>
          <Button variant="primary" size="xl" fullWidth type="submit" form={formId} disabled={create.isPending}>
            <CheckIcon size={20} />
            Cadastrar
          </Button>
        </DialogActions>
      }
    >
      <DisciplineForm
        formId={formId}
        onSubmit={(values) =>
          create.mutate(values, {
            onSuccess: (discipline) => {
              toast.show(`${discipline.name} cadastrada.`);
              onCreated?.(discipline);
              onClose();
            },
          })
        }
      />
      {create.isError && (
        <p role="alert" className="mt-4 text-small text-critical">
          {create.error.message}
        </p>
      )}
    </Modal>
  );
};
