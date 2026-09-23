import {
  forwardRef,
  useLayoutEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/utils/cn';
import { SearchIcon } from './icons';

const FIELD_CLASSES =
  'w-full rounded-md border border-line-strong bg-surface text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] duration-150 focus:border-accent';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(FIELD_CLASSES, 'h-10 px-3 text-[15px]', className)} {...props} />
));
Input.displayName = 'Input';

const TEXTAREA_CLASSES = cn(FIELD_CLASSES, 'px-3 py-2.5 text-[15px] leading-relaxed');

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

export const SearchInput = ({ containerClassName, className, ...props }: SearchInputProps) => (
  <div className={cn('relative', containerClassName)}>
    <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-ink-3" />
    <input
      type="search"
      className={cn(
        'h-9 w-full rounded-md border border-transparent bg-fill pr-3 pl-8 text-sm text-ink placeholder:text-ink-3 focus:border-accent focus:bg-surface',
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
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-ink-2">
      {label}
    </label>
    {children}
    {error ? (
      <p role="alert" className="mt-1.5 text-[13px] text-critical">
        {error}
      </p>
    ) : (
      hint && <p className="mt-1.5 text-[13px] leading-normal text-ink-3">{hint}</p>
    )}
  </div>
);
