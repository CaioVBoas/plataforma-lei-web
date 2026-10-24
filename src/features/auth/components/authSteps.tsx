import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { Field, Input } from '@/components/ui/formControls';
import { ArrowLeftIcon, CheckIcon, MailIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';

/** "Etapa 1 de 2 · Seus dados", com a barra de progresso: a pessoa sabe quanto falta. */
export const StepHeader = ({ step, total, label }: { step: number; total: number; label: string }) => (
  <div className="mb-6">
    <p className="text-small text-ink-2">
      <span className="font-semibold text-ink">
        Etapa {step} de {total}
      </span>{' '}
      · {label}
    </p>
    <div aria-hidden="true" className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={cn('h-1.5 rounded-full', index < step ? 'bg-brand' : 'bg-fill-strong')} />
      ))}
    </div>
  </div>
);

/** Contagem regressiva em segundos, para o "Enviar outro código". */
const useCountdown = (seconds: number, restartKey: unknown) => {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
    const timer = window.setInterval(() => setLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds, restartKey]);
  return left;
};

interface CodeStepProps {
  email: string;
  /** Na demonstração, o código aparece na tela, já que nenhum e-mail sai de verdade. */
  demoCode: string;
  resendIn: number;
  /** O texto do botão: "Confirmar e criar a conta", "Confirmar o código". */
  confirmLabel: string;
  pending: boolean;
  error?: string;
  onConfirm: (code: string) => void;
  onResend: () => void;
  resending: boolean;
  resendError?: string;
  onBack: () => void;
  backLabel?: string;
  /** Campos extras no mesmo formulário, como a senha nova. */
  children?: ReactNode;
}

/**
 * A etapa do código de 6 números enviado ao e-mail: o campo grande, o
 * botão de confirmar, "Enviar outro código" depois de 30 segundos e o
 * caminho de volta para corrigir o e-mail.
 */
export const CodeStep = ({ email, demoCode, resendIn, confirmLabel, pending, error, onConfirm, onResend, resending, resendError, onBack, backLabel = 'Corrigir o e-mail', children }: CodeStepProps) => {
  const fieldId = useId();
  const [code, setCode] = useState('');
  const [tried, setTried] = useState(false);
  const left = useCountdown(resendIn, demoCode);
  const digits = code.replace(/\D/g, '');
  const incomplete = digits.length !== 6;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTried(true);
    if (!incomplete) onConfirm(digits);
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3.5">
        <MailIcon size={24} className="mt-0.5 shrink-0 text-brand" />
        <p className="text-body text-ink">
          Enviamos um código de 6 números para <span className="font-semibold [overflow-wrap:anywhere]">{email}</span>. Ele vale por 10 minutos.
        </p>
      </div>
      <p role="note" className="rounded-lg bg-accent-soft px-4 py-3 text-small text-ink">
        <span className="font-semibold">Demonstração:</span> nenhum e-mail sai de verdade. Use o código <span className="font-semibold tracking-wider tabular-nums">{demoCode}</span>.
      </p>
      <Field label="Código de 6 números" htmlFor={fieldId} required error={error ?? (tried && incomplete ? 'Digite os 6 números do código.' : undefined)}>
        <Input
          id={fieldId}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={7}
          autoFocus
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/[^\d\s]/g, ''))}
          className="h-14 text-center text-h3 tracking-[0.4em] tabular-nums"
          placeholder="000000"
        />
      </Field>
      {children}
      <Button variant="primary" size="xl" type="submit" fullWidth disabled={pending}>
        <CheckIcon size={20} />
        {pending ? 'Confirmando' : confirmLabel}
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-3 text-small">
        <button type="button" onClick={onBack} className={cn(textLinkClassName, 'inline-flex items-center gap-1')}>
          <ArrowLeftIcon size={16} />
          {backLabel}
        </button>
        <button type="button" onClick={onResend} disabled={left > 0 || resending} className={cn(textLinkClassName, 'disabled:cursor-not-allowed disabled:text-ink-3 disabled:no-underline')}>
          {resending ? 'Enviando' : left > 0 ? `Enviar outro código em ${left} s` : 'Enviar outro código'}
        </button>
      </div>
      {resendError && (
        <p role="alert" className="text-small text-critical">
          {resendError}
        </p>
      )}
    </form>
  );
};
