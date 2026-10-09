import { useId, useState } from 'react';
import { QuestionIcon } from './icons';

/**
 * O "?" ao lado de um rótulo que pode gerar dúvida. Abre ao passar o mouse,
 * ao focar com o teclado ou ao tocar, e fecha com Esc ou tocando de novo.
 */
export const HelpTip = ({ label, text }: { label: string; text: string }) => {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-flex align-middle" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={`O que é "${label}"?`}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((isOpen) => !isOpen)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false);
        }}
        className="inline-flex size-6 items-center justify-center rounded-full text-ink-3 hover:bg-fill hover:text-accent"
      >
        <QuestionIcon size={16} />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute top-full left-1/2 z-30 mt-1.5 w-64 max-w-[80vw] -translate-x-1/2 rounded-lg border border-line bg-surface px-3.5 py-2.5 text-small font-normal text-ink shadow-popover"
        >
          {text}
        </span>
      )}
    </span>
  );
};
