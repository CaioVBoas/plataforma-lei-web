import { Link } from 'react-router-dom';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { formatShortDate } from '@/domain/calendar';
import type { DemandInvitation } from '@/domain/types';
import { paths } from '@/routes/paths';

/**
 * Quem chega pelo e-mail do L.E.I. muitas vezes nunca fez extensão. Antes de
 * qualquer detalhe, a tela diz quem indicou e o que é extensão na disciplina.
 */
export const InvitationNote = ({ invitation }: { invitation: DemandInvitation }) => (
  <section aria-label="Indicação do L.E.I." className="mb-10 rounded-lg bg-accent-soft px-5 py-4 sm:px-6 sm:py-5">
    <p className="text-[15px] font-semibold text-ink">
      {invitation.from} indicou esta demanda para você
      <span className="ml-2 text-[13px] font-normal text-ink-3">{formatShortDate(invitation.sentAt)}</span>
    </p>
    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">"{invitation.message}"</p>
    <p className="mt-3 text-sm leading-relaxed text-ink-2">
      <span className="font-medium text-ink">Extensão na disciplina:</span> sua turma resolve este problema com a organização durante o semestre. O
      projeto é registrado no SIGAA como ação de extensão e as horas contam para os estudantes. Você reserva, leva para a turma e a plataforma já
      escreve o plano.{' '}
      <Link to={paths.guide} className={textLinkClassName}>
        Como funciona
      </Link>
    </p>
  </section>
);
