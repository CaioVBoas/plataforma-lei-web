import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { CheckIcon } from '@/components/ui/icons';
import { formatShortDate } from '@/domain/calendar';
import type { DemandInvitation } from '@/domain/types';
import { paths } from '@/routes/paths';

const WHAT_HAPPENS = ['A turma resolve com a organização no semestre', 'Vira ação de extensão no SIGAA', 'O plano já vem escrito'];

/**
 * Quem chega pelo e-mail do L.E.I. muitas vezes nunca fez extensão. Antes de
 * qualquer detalhe, a tela mostra quem indicou, o recado e, em três pontos,
 * o que é levar a demanda para a disciplina.
 */
export const InvitationNote = ({ invitation }: { invitation: DemandInvitation }) => {
  const [name, role = 'L.E.I.'] = invitation.from.split(',').map((part) => part.trim());

  return (
    <section aria-label="Indicação do L.E.I." className="mb-10 rounded-lg bg-accent-soft p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <Avatar name={name} />
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <p className="min-w-0 text-sm text-ink-2">
            <span className="font-semibold text-ink">{name}</span>, {role}, indicou esta demanda para você
          </p>
          <span className="text-[13px] text-ink-3">{formatShortDate(invitation.sentAt)}</span>
        </div>
      </div>

      <blockquote className="mt-4 border-l-2 border-accent pl-4 text-[16px] leading-relaxed text-ink">{invitation.message}</blockquote>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-accent/15 pt-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {WHAT_HAPPENS.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-[13px] text-ink-2">
              <CheckIcon size={13} className="text-accent" />
              {item}
            </li>
          ))}
        </ul>
        <Link to={paths.guide} className={`${textLinkClassName} text-[13px] sm:ml-auto`}>
          Como funciona
        </Link>
      </div>
    </section>
  );
};
