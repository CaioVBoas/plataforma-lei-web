import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Button } from './button';
import { CloseIcon, InfoIcon } from './icons';
import { Modal } from './modal';

type ConfirmTone = 'danger' | 'action' | 'caution';

const TONES: Record<ConfirmTone, string> = {
  danger: 'bg-critical-soft text-critical',
  action: 'bg-accent-soft text-accent',
  caution: 'bg-caution-soft text-caution',
};

/** O círculo colorido com o ícone da pergunta, igual em toda confirmação e aviso. */
export const DialogIcon = ({ tone, children }: { tone: ConfirmTone; children: ReactNode }) => (
  <span aria-hidden="true" className={cn('flex size-12 shrink-0 items-center justify-center rounded-full', TONES[tone])}>
    {children}
  </span>
);

interface ConfirmDialogProps {
  /** danger: apaga algo de vez; action: envia ou conclui. */
  tone?: Exclude<ConfirmTone, 'caution'>;
  icon: ReactNode;
  title: string;
  /** O que acontece depois, em uma ou duas frases. */
  description: ReactNode;
  confirmLabel: string;
  confirmIcon?: ReactNode;
  /** O "não" diz o que fica como está: "Manter o rascunho", "Continuar editando". */
  cancelLabel?: string;
  pending?: boolean;
  pendingLabel?: string;
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
}

/**
 * A pergunta antes de toda ação que não volta atrás (excluir, enviar, concluir).
 * Botões grandes, com ícone, e o "não" sempre à esquerda do "sim".
 */
export const ConfirmDialog = ({
  tone = 'danger',
  icon,
  title,
  description,
  confirmLabel,
  confirmIcon,
  cancelLabel = 'Cancelar',
  pending,
  pendingLabel,
  error,
  onConfirm,
  onClose,
  children,
}: ConfirmDialogProps) => (
  <Modal
    title={title}
    description={description}
    onClose={onClose}
    icon={<DialogIcon tone={tone}>{icon}</DialogIcon>}
    footer={
      <>
        {error && (
          <p role="alert" className="mr-auto flex items-start gap-1.5 text-small text-critical">
            <InfoIcon size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}
        <Button variant="secondary" size="xl" onClick={onClose}>
          <CloseIcon size={20} />
          {cancelLabel}
        </Button>
        <Button variant={tone === 'danger' ? 'danger' : 'primary'} size="xl" disabled={pending} onClick={onConfirm}>
          {confirmIcon}
          {pending ? (pendingLabel ?? 'Aguarde') : confirmLabel}
        </Button>
      </>
    }
  >
    {children}
  </Modal>
);
