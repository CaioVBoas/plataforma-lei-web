import { Link } from 'react-router-dom';
import { buttonClassName } from './buttonStyles';
import { CloseIcon } from './icons';
import { QuestionIcon } from '@/components/ui/icons';

interface TutorialInviteProps {
  to: string;
  text: string;
  onDismiss: () => void;
}

/** Convite discreto para o Como funciona, no topo do Início, até a pessoa abrir ou dispensar. */
export const TutorialInvite = ({ to, text, onDismiss }: TutorialInviteProps) => (
  <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg bg-accent-soft px-5 py-4">
    <div className="min-w-0 flex-[1_1_320px]">
      <p className="text-body font-medium text-ink">Primeira vez por aqui?</p>
      <p className="mt-0.5 text-small text-ink-2">{text}</p>
    </div>
    <div className="flex items-center gap-1">
      <Link to={to} className={buttonClassName({ variant: 'primary', size: 'sm' })}>
        <QuestionIcon size={16} />
        Ver como funciona
      </Link>
      <button
        type="button"
        aria-label="Dispensar convite"
        onClick={onDismiss}
        className="flex size-8 items-center justify-center rounded-md text-ink-2 hover:bg-surface/60"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  </div>
);
