import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '@/components/ui/brandMark';
import { BookIcon, CheckIcon, ChevronLeftIcon, TrayIcon } from '@/components/ui/icons';
import { AUTH_PHOTO } from '@/features/landing/portalPhotos';
import { paths } from '@/routes/paths';

const PROMISES = [
  { icon: <TrayIcon size={17} />, title: 'Problemas reais', text: 'Organizações de fora da universidade publicam, o L.E.I. faz a triagem.' },
  { icon: <BookIcon size={17} />, title: 'Na disciplina', text: 'O docente escolhe um e leva para uma turma que está lecionando.' },
  { icon: <CheckIcon size={17} />, title: 'Extensão registrada', text: 'A turma resolve com a organização e o projeto vai para o SIGAA.' },
];

/**
 * Moldura da entrada e do cadastro: fundo neutro e o cartão dividido, com a
 * foto da Rua da Aurora e a promessa à esquerda e o formulário à direita.
 */
export const AuthShell = ({ children }: { children: ReactNode }) => (
  <div className="relative flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-10 sm:px-8">

    <div className="relative mb-4 w-full max-w-[980px]">
      <Link to={paths.landing} className="inline-flex items-center gap-0.5 text-sm text-ink-2 hover:text-ink">
        <ChevronLeftIcon size={16} />
        Página inicial
      </Link>
    </div>

    <div className="relative grid w-full max-w-[980px] overflow-hidden rounded-lg bg-surface shadow-sheet lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="relative isolate hidden flex-col justify-between gap-10 overflow-hidden bg-brand-900 px-10 pt-10 pb-6 lg:flex">
        <img src={AUTH_PHOTO.src} alt={AUTH_PHOTO.alt} className="absolute inset-0 -z-10 size-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/55" />
        <Link to={paths.landing}>
          <BrandMark onDark className="h-10" />
        </Link>
        <div>
          <h1 className="text-[34px] leading-[1.15] font-bold tracking-[-0.02em] text-balance text-white">Problemas reais de Pernambuco viram projeto de disciplina.</h1>
          <ul className="mt-9 space-y-5">
            {PROMISES.map(({ icon, title, text }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  {icon}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-white">{title}</span>
                  <span className="block text-sm leading-snug text-white/80">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[11px] leading-snug text-white/65">
          Foto {AUTH_PHOTO.credit.subject}:{' '}
          <a href={AUTH_PHOTO.credit.sourceUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:text-white hover:underline">
            {AUTH_PHOTO.credit.author}, {AUTH_PHOTO.credit.source}
          </a>
          ,{' '}
          <a href={AUTH_PHOTO.credit.licenseUrl} target="_blank" rel="license noreferrer" className="underline-offset-2 hover:text-white hover:underline">
            {AUTH_PHOTO.credit.license}
          </a>
          , {AUTH_PHOTO.credit.changes}.
        </p>
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
    <p className="text-[15px] font-semibold text-ink">{title}</p>
    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{text}</p>
    {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
  </div>
);
