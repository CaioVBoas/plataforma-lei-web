import { cn } from '@/utils/cn';
import { CheckIcon, CloseIcon } from './icons';

/** As regras que valem para toda senha da plataforma. */
const passwordRuleChecks = (password: string) => ({
  length: password.length >= 8,
  mixed: /[a-zA-ZÀ-ÿ]/.test(password) && /\d/.test(password),
});

/**
 * As regras da senha com o sinal de pronto ao lado, que muda enquanto a
 * pessoa digita: ela vê o que falta antes de tentar salvar. Depois de uma
 * tentativa, o que ainda falta fica em vermelho.
 */
export const PasswordRules = ({ password, confirm, attempted = false }: { password: string; confirm?: string; attempted?: boolean }) => {
  const checks = passwordRuleChecks(password);
  const rules = [
    { label: 'Pelo menos 8 caracteres', ok: checks.length },
    { label: 'Letras e números', ok: checks.mixed },
  ];
  if (confirm !== undefined) rules.push({ label: 'As duas senhas iguais', ok: confirm.length > 0 && confirm === password });
  return (
    <ul aria-live="polite" className="mt-2 flex flex-col gap-1">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={cn('flex items-center gap-1.5 text-small', rule.ok ? 'font-medium text-positive' : attempted ? 'font-medium text-critical' : 'text-ink-3')}
        >
          {rule.ok ? <CheckIcon size={16} strokeWidth={2} /> : <CloseIcon size={16} />}
          {rule.label}
          <span className="sr-only">{rule.ok ? ': pronto' : ': falta'}</span>
        </li>
      ))}
    </ul>
  );
};
