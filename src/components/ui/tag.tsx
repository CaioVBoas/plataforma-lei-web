import { cn } from '@/utils/cn';
import { CheckIcon, CloseIcon } from './icons';

interface TagProps {
  label: string;
  /** Borda tracejada marca competência sugerida pela leitura automática, ainda não confirmada. */
  inferred?: boolean;
  muted?: boolean;
  size?: 'sm' | 'md';
  onRemove?: () => void;
  onConfirm?: () => void;
}

const ROUND_ACTION = 'flex size-[22px] shrink-0 items-center justify-center rounded-full border border-n-300 bg-n-0 hover:bg-n-50';

export const Tag = ({ label, inferred, muted, size = 'md', onRemove, onConfirm }: TagProps) => (
  <span
    className={cn(
      'inline-flex h-10 items-center gap-1.5 rounded-lg bg-n-0 pr-2 pl-3',
      size === 'md' ? 'text-sm' : 'text-[13px]',
      inferred ? 'border border-dashed border-n-400' : 'border border-n-300',
      muted ? 'text-n-600' : 'text-n-700',
      !onRemove && !onConfirm && 'pr-3',
    )}
  >
    <span>{label}</span>
    {onConfirm && (
      <button type="button" title="Confirmar, eu pratico" aria-label={`Confirmar ${label}`} onClick={onConfirm} className={cn(ROUND_ACTION, 'text-n-700')}>
        <CheckIcon size={11} />
      </button>
    )}
    {onRemove &&
      (inferred ? (
        <button type="button" title="Descartar sugestão" aria-label={`Descartar ${label}`} onClick={onRemove} className={cn(ROUND_ACTION, 'text-n-500')}>
          <CloseIcon size={11} />
        </button>
      ) : (
        <button
          type="button"
          title="Remover"
          aria-label={`Remover ${label}`}
          onClick={onRemove}
          className="flex size-5 shrink-0 items-center justify-center rounded-full text-n-500 hover:bg-n-50"
        >
          <CloseIcon size={10} />
        </button>
      ))}
  </span>
);
