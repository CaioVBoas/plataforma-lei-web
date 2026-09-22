import { forwardRef, useLayoutEffect, useRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { SearchIcon } from './icons';

const FIELD_CLASSES =
  'w-full rounded-lg border border-n-300 bg-n-0 text-n-700 placeholder:text-n-400 transition-[border-color,box-shadow] duration-200 focus:border-azul-500';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(FIELD_CLASSES, 'h-11 px-3 text-[15px]', className)} {...props} />
));
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(FIELD_CLASSES, 'resize-y px-3 py-3 text-sm leading-[1.55]', className)} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

/** Cresce com o conteúdo: a seção inteira da proposta fica legível sem barra de rolagem interna. */
export const AutoResizeTextarea = ({ className, value, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  }, [value]);

  return <Textarea ref={ref} value={value} className={cn('min-h-[46px] resize-none overflow-hidden', className)} {...props} />;
};

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchInput = ({ containerClassName, className, ...props }: SearchInputProps) => (
  <div className={cn('relative', containerClassName)}>
    <SearchIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-n-400" />
    <input type="search" className={cn(FIELD_CLASSES, 'h-10 pr-3 pl-9 text-sm', className)} {...props} />
  </div>
);

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Rótulo sempre visível acima do campo: placeholder nunca faz papel de label. */
export const Field = ({ label, htmlFor, hint, error, aside, className, children }: FieldProps) => (
  <div className={className}>
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-sm font-medium text-n-700">
        {label}
      </label>
      {aside}
    </div>
    {children}
    {error ? (
      <p role="alert" className="mt-1.5 text-xs text-erro">
        {error}
      </p>
    ) : (
      hint && <p className="mt-1.5 text-[13px] leading-normal text-n-500">{hint}</p>
    )}
  </div>
);
