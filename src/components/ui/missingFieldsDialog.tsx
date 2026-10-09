import { Button } from './button';
import { DialogIcon } from './confirmDialog';
import { ArrowRightIcon, CheckIcon, InfoIcon } from './icons';
import { Modal } from './modal';

export interface MissingItem {
  label: string;
  /** Como resolver, em poucas palavras: "Escreva o nome da demanda". */
  fix: string;
  /** Leva até o campo (ou até a etapa dele). */
  onGo?: () => void;
}

interface MissingFieldsDialogProps {
  title?: string;
  description?: string;
  items: MissingItem[];
  onClose: () => void;
}

/**
 * O aviso antes de avançar ou salvar com campo obrigatório vazio ou errado:
 * a lista do que falta, como corrigir e um botão que leva até cada campo.
 */
export const MissingFieldsDialog = ({ title = 'Falta preencher', description = 'Preencha o que está abaixo para continuar.', items, onClose }: MissingFieldsDialogProps) => {
  const first = items[0];
  return (
    <Modal
      title={title}
      description={description}
      onClose={onClose}
      icon={
        <DialogIcon tone="caution">
          <InfoIcon size={28} />
        </DialogIcon>
      }
      footer={
        <Button
          variant="primary"
          size="xl"
          onClick={() => {
            onClose();
            first?.onGo?.();
          }}
        >
          <CheckIcon size={20} />
          {first?.onGo ? 'Entendi, ir para o primeiro' : 'Entendi'}
        </Button>
      }
    >
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.label} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-caution-soft px-4 py-3">
            <div className="min-w-0 flex-[1_1_200px]">
              <p className="text-body font-semibold text-ink">{item.label}</p>
              <p className="text-small text-ink-2">{item.fix}</p>
            </div>
            {item.onGo && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  item.onGo?.();
                }}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 text-small font-semibold text-accent hover:bg-surface"
              >
                Ir para o campo
                <ArrowRightIcon size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </Modal>
  );
};
