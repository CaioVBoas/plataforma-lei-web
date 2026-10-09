import type { FieldErrors, FieldValues, Path } from 'react-hook-form';
import type { MissingItem } from '@/components/ui/missingFieldsDialog';

/**
 * Os erros do formulário, na ordem dos rótulos, no formato do aviso
 * "Falta preencher": nome do campo, como corrigir e o caminho até ele.
 */
export const problemsFrom = <Values extends FieldValues>(
  errors: FieldErrors<Values>,
  labels: Partial<Record<Path<Values>, string>>,
  focus: (field: Path<Values>) => void,
): MissingItem[] =>
  (Object.keys(labels) as Path<Values>[]).flatMap((field) => {
    const message = (errors as Record<string, { message?: string } | undefined>)[field]?.message;
    return message ? [{ label: labels[field] ?? field, fix: message, onGo: () => focus(field) }] : [];
  });

/**
 * Quando mostrar o erro de um campo: enquanto a pessoa digita, só os erros de
 * formato e de tamanho (o campo tem texto); o "falta preencher" espera ela
 * tentar avançar ou enviar, para não acusar um campo que ela nem começou.
 */
export const visibleError = (message: string | undefined, value: unknown, attempted: boolean) => {
  if (!message) return undefined;
  const filled = Array.isArray(value) ? value.length > 0 : String(value ?? '').trim().length > 0;
  return filled || attempted ? message : undefined;
};
