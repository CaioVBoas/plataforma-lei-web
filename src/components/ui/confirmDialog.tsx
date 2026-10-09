import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Button } from './button';
import { CloseIcon, InfoIcon } from './icons';
import { Modal } from './modal';

type ConfirmTone = 'danger' | 'action' | 'caution';

const TONES: Record<ConfirmTone, string> = {
  danger: 'border-critical/40 text-critical',
  action: 'border-accent/40 text-accent',
  caution: 'border-caution/50 text-caution',
};

/** O ícone da pergunta num anel da cor do tom, sem fundo colorido, igual em toda confirmação e aviso. */
export const DialogIcon = ({ tone, children }: { tone: ConfirmTone; children: ReactNode }) => (
  <span aria-hidden="true" className={cn('flex size-12 shrink-0 items-center justify-center rounded-full border-2 bg-surface', TONES[tone])}>
    {children}
  </span>
);

/** Os botões do pé de todo pop-up: do mesmo tamanho, lado a lado, o "não" à esquerda; no celular, um embaixo do outro com o "sim" em cima. */
export const DialogActions = ({ children }: { children: ReactNode }) => (
  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 [&>*:first-child]:max-sm:order-last">{children}</div>
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
      <div className="w-full">
        {error && (
          <p role="alert" className="mb-4 flex items-start gap-1.5 text-small font-medium text-critical">
            <InfoIcon size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}
        <DialogActions>
          <Button variant="secondary" size="xl" fullWidth onClick={onClose}>
            <CloseIcon size={20} />
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} size="xl" fullWidth disabled={pending} onClick={onConfirm}>
            {confirmIcon}
            {pending ? (pendingLabel ?? 'Aguarde') : confirmLabel}
          </Button>
        </DialogActions>
      </div>
    }
  >
    {children}
  </Modal>
);
