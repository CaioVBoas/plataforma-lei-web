import { useState, type FormEvent, type ReactNode } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/formControls';
import { CloseIcon, LockIcon, LogoutIcon, MailIcon, SaveIcon, TrashIcon } from '@/components/ui/icons';
import { Modal } from '@/components/ui/modal';
import { PasswordRules } from '@/components/ui/passwordRules';
import { DialogActions, DialogIcon } from '@/components/ui/confirmDialog';
import { useLogout } from '@/features/auth/useAuth';
import type { AccessRole } from '../accessApi';
import { useChangePassword, useDeleteAccount } from '../useAccess';

/** Uma linha da seção Conta: ícone, o que é, uma frase e a ação à direita. */
const AccessRow = ({ icon, title, text, action, children }: { icon: ReactNode; title: string; text: ReactNode; action?: ReactNode; children?: ReactNode }) => (
  <div className="border-t border-line py-5 first:border-t-0 first:pt-0 last:pb-0">
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-fill text-ink-2">
        {icon}
      </span>
      <div className="min-w-0 flex-[1_1_240px]">
        <p className="text-body font-semibold text-ink">{title}</p>
        <div className="mt-0.5 text-small text-ink-2">{text}</div>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
    {children}
  </div>
);

const PasswordForm = ({ role, onDone }: { role: AccessRole; onDone: () => void }) => {
  const toast = useToast();
  const change = useChangePassword(role);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const save = (event: FormEvent) => {
    event.preventDefault();
    change.mutate(
      { current, next, confirm },
      {
        onSuccess: () => {
          toast.show('Senha trocada. Use a nova na próxima vez que entrar.');
          onDone();
        },
      },
    );
  };

  return (
    <form onSubmit={save} className="mt-5 rounded-lg bg-canvas p-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field label="Senha atual" htmlFor={`${role}-senha-atual`}>
          <Input id={`${role}-senha-atual`} type="password" value={current} onChange={(event) => setCurrent(event.target.value)} autoComplete="current-password" />
        </Field>
        <Field label="Senha nova" htmlFor={`${role}-senha-nova`}>
          <Input id={`${role}-senha-nova`} type="password" value={next} onChange={(event) => setNext(event.target.value)} autoComplete="new-password" />
        </Field>
        <Field label="Repita a senha nova" htmlFor={`${role}-senha-confirma`}>
          <Input id={`${role}-senha-confirma`} type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" />
        </Field>
      </div>
      <PasswordRules password={next} confirm={confirm} />
      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
        {change.error && (
          <p role="alert" className="mr-auto text-small text-critical">
            {change.error.message}
          </p>
        )}
        <Button variant="secondary" size="xl" onClick={onDone}>
          <CloseIcon size={20} />
          Cancelar
        </Button>
        <Button variant="primary" size="xl" type="submit" disabled={change.isPending}>
          <SaveIcon size={20} />
          {change.isPending ? 'Salvando' : 'Salvar senha'}
        </Button>
      </div>
    </form>
  );
};

const DeleteAccountModal = ({ role, email, consequence, onClose }: { role: AccessRole; email: string; consequence: string; onClose: () => void }) => {
  const toast = useToast();
  const remove = useDeleteAccount(role);
  const [typed, setTyped] = useState('');

  const confirm = (event: FormEvent) => {
    event.preventDefault();
    remove.mutate(typed, { onSuccess: () => toast.show('Conta excluída. Até a próxima.') });
  };

  return (
    <Modal
      title="Excluir a conta?"
      description={consequence}
      onClose={onClose}
      icon={
        <DialogIcon tone="danger">
          <TrashIcon size={26} />
        </DialogIcon>
      }
      footer={
        <DialogActions>
          <Button variant="secondary" size="xl" fullWidth onClick={onClose}>
            <CloseIcon size={20} />
            Não, manter
          </Button>
          <Button variant="danger" size="xl" fullWidth type="submit" form="excluir-conta" disabled={remove.isPending}>
            <TrashIcon size={20} />
            {remove.isPending ? 'Excluindo' : 'Excluir para sempre'}
          </Button>
        </DialogActions>
      }
    >
      <form id="excluir-conta" onSubmit={confirm} noValidate>
        <Field label={`Para confirmar, digite o e-mail da conta: ${email}`} htmlFor="excluir-email" error={remove.error?.message}>
          <Input id="excluir-email" type="email" value={typed} onChange={(event) => setTyped(event.target.value)} autoComplete="off" autoFocus />
        </Field>
      </form>
    </Modal>
  );
};

interface AccountAccessProps {
  role: AccessRole;
  email: string;
  /** Quem cuida da troca de e-mail, já que ele é o login. */
  emailHint: string;
  /** O que some e o que fica quando a conta é excluída. */
  deleteConsequence: string;
}

/**
 * A seção Conta, separada do perfil: o e-mail de acesso, a senha, sair e
 * excluir. Nada aqui muda com o "Editar perfil".
 */
export const AccountAccess = ({ role, email, emailHint, deleteConsequence }: AccountAccessProps) => {
  const logout = useLogout();
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="rounded-lg border border-line bg-surface p-6 sm:p-7">
      <AccessRow icon={<MailIcon size={20} />} title="E-mail de acesso" text={<><span className="font-medium [overflow-wrap:anywhere] text-ink">{email}</span>. {emailHint}</>} />
      <AccessRow
        icon={<LockIcon size={20} />}
        title="Senha"
        text="Troque quando quiser. Depois de trocar, só a senha nova entra."
        action={
          !changingPassword && (
            <Button variant="secondary" size="xl" onClick={() => setChangingPassword(true)}>
              <LockIcon size={20} />
              Trocar senha
            </Button>
          )
        }
      >
        {changingPassword && <PasswordForm role={role} onDone={() => setChangingPassword(false)} />}
      </AccessRow>
      <AccessRow
        icon={<LogoutIcon size={20} />}
        title="Sair"
        text="Encerra a sessão neste aparelho. Seus dados continuam guardados."
        action={
          <Button variant="secondary" size="xl" onClick={logout}>
            <LogoutIcon size={20} />
            Sair
          </Button>
        }
      />
      <AccessRow
        icon={<TrashIcon size={20} />}
        title="Excluir a conta"
        text="Apaga o seu acesso de vez. Pedimos o e-mail para confirmar."
        action={
          <Button variant="destructive" size="xl" onClick={() => setDeleting(true)}>
            <TrashIcon size={20} />
            Excluir a conta
          </Button>
        }
      />
      {deleting && <DeleteAccountModal role={role} email={email} consequence={deleteConsequence} onClose={() => setDeleting(false)} />}
    </div>
  );
};
