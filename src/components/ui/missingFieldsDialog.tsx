import { useEffect } from 'react';
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
 * Desligado por enquanto: a borda vermelha e a mensagem embaixo de cada campo,
 * com o bloqueio de avançar, já dizem o que falta. Desligado, o aviso não abre
 * e só leva o cursor ao primeiro campo a corrigir. Para voltar, troque para true.
 */
const DIALOG_ENABLED = false;

/** Sem a janela: põe o cursor no primeiro campo (trocando de etapa, se precisar) e fecha. */
const FocusFirstProblem = ({ items, onClose }: MissingFieldsDialogProps) => {
  useEffect(() => {
    onClose();
    items[0]?.onGo?.();
    // Roda uma vez por tentativa: cada tentativa monta o componente de novo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

/**
 * O aviso antes de avançar ou salvar com campo obrigatório vazio ou errado:
 * a lista do que falta, como corrigir e um botão que leva até cada campo.
 */
export const MissingFieldsDialog = (props: MissingFieldsDialogProps) => (DIALOG_ENABLED ? <MissingFieldsModal {...props} /> : <FocusFirstProblem {...props} />);

const MissingFieldsModal = ({ title = 'Falta preencher', description = 'Preencha o que está abaixo para continuar.', items, onClose }: MissingFieldsDialogProps) => {
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
          fullWidth
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
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.label} className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-line border-l-4 border-l-caution bg-surface py-3 pr-3 pl-4">
            <div className="min-w-0 flex-[1_1_200px]">
              <p className="text-body font-semibold text-ink">{item.label}</p>
              <p className="mt-0.5 text-small text-ink-2">{item.fix}</p>
            </div>
            {item.onGo && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  item.onGo?.();
                }}
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-small font-semibold text-accent hover:bg-accent-soft"
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
