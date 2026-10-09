import { buttonClassName } from '@/components/ui/buttonStyles';
import { MailIcon, UsersIcon } from '@/components/ui/icons';
import { LEI_CONTACT } from '@/lib/leiContact';

/** "Ainda com dúvida?": o caminho para falar com uma pessoa do L.E.I., no pé do Como funciona. */
export const LeiContact = () => (
  <section aria-labelledby="falar-com-lei" className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-xl border border-line bg-surface p-5 sm:p-6">
    <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
      <UsersIcon size={32} variant="duotone" />
    </span>
    <div className="min-w-0 flex-[1_1_260px]">
      <h2 id="falar-com-lei" className="text-h4">
        Ainda com dúvida? Fale com a gente
      </h2>
      <p className="mt-1 text-body text-ink-2">A equipe do L.E.I. responde por e-mail e ajuda no que for preciso.</p>
    </div>
    <a href={`mailto:${LEI_CONTACT.email}`} className={buttonClassName({ variant: 'secondary', size: 'xl' })}>
      <MailIcon size={20} />
      Escrever para o L.E.I.
    </a>
  </section>
);
