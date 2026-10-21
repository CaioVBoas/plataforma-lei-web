import {
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/utils/cn';
import { ChevronDownIcon, SearchIcon } from './icons';

const FIELD_CLASSES =
  'w-full rounded-md border border-line-strong bg-surface text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] duration-150 focus:border-accent';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(FIELD_CLASSES, 'h-10 px-3 text-body', className)} {...props} />
));
Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select ref={ref} className={cn(FIELD_CLASSES, 'h-10 appearance-none pr-9 pl-3 text-body', className)} {...props}>
      {children}
    </select>
    <ChevronDownIcon size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-3" />
  </div>
));
Select.displayName = 'Select';

const TEXTAREA_CLASSES = cn(FIELD_CLASSES, 'px-3 py-2.5 text-body');

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(TEXTAREA_CLASSES, 'resize-y', className)} {...props} />
));
Textarea.displayName = 'Textarea';

/** Cresce com o conteúdo: a seção inteira do plano fica legível sem rolagem interna. */
export const AutoResizeTextarea = ({ className, value, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  }, [value]);

  return <textarea ref={ref} value={value} className={cn(TEXTAREA_CLASSES, 'min-h-[44px] resize-none overflow-hidden', className)} {...props} />;
};

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

/**
 * Campo de busca da linha de filtros: branco, com borda e a lupa à esquerda, na
 * mesma altura dos botões de filtro. Cresce para ocupar o que sobra da linha.
 */
export const SearchInput = ({ containerClassName, className, ...props }: SearchInputProps) => (
  <div className={cn('relative min-w-0 flex-[1_1_16rem]', containerClassName)}>
    <SearchIcon size={20} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-2" />
    <input
      type="search"
      className={cn(
        'h-11 w-full rounded-lg border border-line-strong bg-surface pr-3.5 pl-11 text-body text-ink placeholder:text-ink-3 hover:border-ink-3 focus:border-accent',
        className,
      )}
      {...props}
    />
  </div>
);

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Rótulo sempre visível acima do campo: placeholder nunca faz papel de label. */
export const Field = ({ label, htmlFor, hint, error, className, children }: FieldProps) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="mb-1.5 block text-small font-medium text-ink-2">
      {label}
    </label>
    {children}
    {error ? (
      <p role="alert" className="mt-1.5 text-small text-critical">
        {error}
      </p>
    ) : (
      hint && <p className="mt-1.5 text-small text-ink-3">{hint}</p>
    )}
  </div>
);

interface FormGroupProps {
  title: string;
  hint?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}

/**
 * Um bloco do formulário: título e explicação curta de um lado, campos do outro.
 * Em espaço estreito, como uma janela, o título fica em cima. Precisa de um
 * `@container` em volta.
 */
export const FormGroup = ({ title, hint, aside, children }: FormGroupProps) => {
  const titleId = useId();
  return (
    <div role="group" aria-labelledby={titleId} className="grid gap-3 border-t border-line py-6 first:border-t-0 first:pt-0 last:pb-0 @2xl:grid-cols-[200px_minmax(0,1fr)] @2xl:gap-8">
      <div>
        <h3 id={titleId} className="text-body font-semibold text-ink">
          {title}
        </h3>
        {hint && <p className="mt-1 text-small text-ink-3">{hint}</p>}
        {aside && <div className="mt-2">{aside}</div>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
};
