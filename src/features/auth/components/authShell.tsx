import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '@/components/ui/brandMark';
import { ChevronLeftIcon } from '@/components/ui/icons';
import { PhotoCreditLine } from '@/components/ui/photoCredit';
import { AUTH_PHOTO } from '@/features/landing/portalPhotos';
import { paths } from '@/routes/paths';

/**
 * Moldura da entrada e do cadastro: fundo neutro e o cartão dividido, com a
 * foto da Rua da Aurora, o logo e uma frase à esquerda e o formulário à direita.
 */
export const AuthShell = ({ children }: { children: ReactNode }) => (
  <div className="relative flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-10 sm:px-8">

    <div className="relative mb-4 w-full max-w-[980px]">
      <Link to={paths.landing} className="inline-flex items-center gap-0.5 text-small text-ink-2 hover:text-ink">
        <ChevronLeftIcon size={16} />
        Página inicial
      </Link>
    </div>

    <div className="relative grid w-full max-w-[980px] overflow-hidden rounded-lg bg-surface shadow-sheet lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="relative isolate hidden min-h-[560px] flex-col justify-between gap-10 overflow-hidden bg-brand-900 px-10 pt-10 pb-6 lg:flex">
        <img src={AUTH_PHOTO.src} alt={AUTH_PHOTO.alt} className="absolute inset-0 -z-10 size-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/55" />
        <Link to={paths.landing}>
          <BrandMark onDark className="h-10" />
        </Link>
        <div>
          <p className="text-h1 text-balance text-white">Aperte o play num problema real.</p>
          <p className="mt-3 max-w-[36ch] text-body text-white/85">
            Organizações de Pernambuco trazem o problema, o L.E.I. faz a triagem e a turma resolve durante o semestre.
          </p>
        </div>
        <PhotoCreditLine credit={AUTH_PHOTO.credit} onDark />
      </section>

      <section className="flex flex-col justify-center px-6 py-10 sm:px-14 sm:py-12">
        <div className="mx-auto w-full max-w-[400px]">
          <Link to={paths.landing} className="mb-8 block lg:hidden">
            <BrandMark />
          </Link>
          {children}
        </div>
      </section>
    </div>
  </div>
);

/** Aviso de portal ainda em construção, para organização e estudante. */
export const SoonNotice = ({ title, text, children }: { title: string; text: string; children?: ReactNode }) => (
  <div className="rounded-lg border border-line px-5 py-5">
    <p className="text-body font-semibold text-ink">{title}</p>
    <p className="mt-1.5 text-small text-ink-2">{text}</p>
    {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
  </div>
);

/** Antes de escolher o perfil: o que cada um usa para entrar, para a organização não esbarrar no e-mail da UFPE. */
export const ChooseRoleNotice = ({ action }: { action: string }) => (
  <div className="rounded-lg border border-fact-line bg-fact px-5 py-5">
    <p className="text-body font-semibold text-ink">Como você participa?</p>
    <p className="mt-1.5 text-small text-ink-2">Escolha acima para {action}.</p>
    <ul className="mt-3 space-y-1.5 text-small text-ink-2">
      <li>
        <span className="font-medium text-ink">Docente:</span> e-mail institucional @ufpe.br ou @cin.ufpe.br.
      </li>
      <li>
        <span className="font-medium text-ink">Organização:</span> o e-mail de quem cuida das demandas, de qualquer domínio.
      </li>
    </ul>
  </div>
);
