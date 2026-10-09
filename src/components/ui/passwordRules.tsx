import { cn } from '@/utils/cn';
import { CheckIcon, CloseIcon } from './icons';

/**
 * As regras da senha com o sinal de pronto ao lado, que muda enquanto a
 * pessoa digita: ela vê o que falta antes de tentar salvar.
 */
export const PasswordRules = ({ password, confirm }: { password: string; confirm?: string }) => {
  const rules = [{ label: 'Pelo menos 8 letras ou números', ok: password.length >= 8 }];
  if (confirm !== undefined) rules.push({ label: 'As duas senhas iguais', ok: confirm.length > 0 && confirm === password });
  return (
    <ul aria-live="polite" className="mt-2 flex flex-col gap-1">
      {rules.map((rule) => (
        <li key={rule.label} className={cn('flex items-center gap-1.5 text-small', rule.ok ? 'font-medium text-positive' : 'text-ink-3')}>
          {rule.ok ? <CheckIcon size={16} strokeWidth={2} /> : <CloseIcon size={16} />}
          {rule.label}
          <span className="sr-only">{rule.ok ? ': pronto' : ': falta'}</span>
        </li>
      ))}
    </ul>
  );
};
