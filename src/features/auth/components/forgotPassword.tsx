import { useState, type FormEvent } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { Field, Input } from '@/components/ui/formControls';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icons';
import { PasswordRules } from '@/components/ui/passwordRules';
import type { CodeSent } from '@/mocks/handlers/access';
import { cn } from '@/utils/cn';
import { usePasswordResetCode, useResetPassword } from '../useAuth';
import { CodeStep, StepHeader } from './authSteps';

interface ForgotPasswordProps {
  role: 'docente' | 'organizacao';
  /** O e-mail que já estava no campo de entrar. */
  initialEmail: string;
  onCancel: () => void;
  /** Senha trocada: volta para entrar, com o e-mail preenchido. */
  onDone: (email: string) => void;
}

/**
 * "Esqueci minha senha" em duas etapas: o e-mail recebe um código, e com ele
 * a pessoa escolhe a senha nova. No fim, volta para entrar.
 */
export const ForgotPassword = ({ role, initialEmail, onCancel, onDone }: ForgotPasswordProps) => {
  const toast = useToast();
  const sendCode = usePasswordResetCode();
  const reset = useResetPassword();
  const [email, setEmail] = useState(initialEmail);
  const [sent, setSent] = useState<CodeSent | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [tried, setTried] = useState(false);
  const [emailTried, setEmailTried] = useState(false);
  const emailMissing = !email.trim();

  const request = (event?: FormEvent) => {
    event?.preventDefault();
    setEmailTried(true);
    if (emailMissing) return;
    sendCode.mutate({ role, email }, { onSuccess: setSent });
  };

  if (!sent) {
    return (
      <form onSubmit={request} noValidate className="flex flex-col gap-5">
        <StepHeader step={1} total={2} label="Recuperar a senha" />
        <p className="text-body text-ink-2">Digite o e-mail da sua conta. Vamos enviar um código para você criar uma senha nova.</p>
        <Field label={role === 'docente' ? 'E-mail institucional' : 'E-mail'} htmlFor="reset-email" required error={emailTried && emailMissing ? 'Escreva o e-mail da sua conta.' : sendCode.error?.message}>
          <Input id="reset-email" type="email" autoComplete="username" autoFocus value={email} onChange={(event) => setEmail(event.target.value)} placeholder={role === 'docente' ? 'nome@cin.ufpe.br' : 'nome@organizacao.org.br'} />
        </Field>
        <Button variant="primary" size="xl" type="submit" fullWidth disabled={sendCode.isPending}>
          {sendCode.isPending ? 'Enviando o código' : 'Enviar o código'}
          {!sendCode.isPending && <ArrowRightIcon size={20} />}
        </Button>
        <button type="button" onClick={onCancel} className={cn(textLinkClassName, 'inline-flex items-center gap-1 self-start text-small')}>
          <ArrowLeftIcon size={16} />
          Voltar para entrar
        </button>
      </form>
    );
  }

  const rulesOk = password.length >= 8 && /[a-zA-ZÀ-ÿ]/.test(password) && /\d/.test(password) && password === confirm;

  return (
    <>
      <StepHeader step={2} total={2} label="Senha nova" />
      <CodeStep
        email={sent.sentTo}
        demoCode={sent.demoCode}
        resendIn={sent.resendIn}
        confirmLabel="Salvar a senha nova"
        pending={reset.isPending}
        error={reset.error?.message}
        onConfirm={(code) => {
          setTried(true);
          if (!rulesOk) return;
          reset.mutate(
            { role, email: sent.sentTo, code, password, confirm },
            {
              onSuccess: () => {
                toast.show('Senha nova salva. Entre com ela.');
                onDone(sent.sentTo);
              },
            },
          );
        }}
        onResend={() => request()}
        resending={sendCode.isPending}
        resendError={sendCode.error?.message}
        onBack={() => {
          sendCode.reset();
          reset.reset();
          setSent(null);
        }}
      >
        <Field label="Senha nova" htmlFor="reset-password" required invalid={tried && !rulesOk}>
          <Input id="reset-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Field>
        <Field label="Repita a senha nova" htmlFor="reset-confirm" required invalid={tried && password !== confirm}>
          <Input id="reset-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
          <PasswordRules password={password} confirm={confirm} attempted={tried} />
        </Field>
      </CodeStep>
    </>
  );
};
