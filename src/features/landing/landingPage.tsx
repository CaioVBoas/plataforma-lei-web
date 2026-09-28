import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '@/components/ui/brandMark';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { BellIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, FolderIcon, TrayIcon, UsersIcon } from '@/components/ui/icons';
import { session } from '@/features/auth/session';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { HERO_PHOTOS, PHOTO_CREDITS, WELCOME_PHOTOS } from './portalPhotos';

/** Mesma largura e margens do portal, para a passagem do site para a plataforma não pular. */
const FRAME = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8';

const PublicHeader = () => {
  const signedIn = session.isAuthenticated();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className={cn(FRAME, 'flex h-16 items-center gap-4')}>
        <Link to={paths.landing} aria-label="Aperta o PL.E.I., página inicial">
          <BrandMark />
        </Link>
        <nav aria-label="Acesso" className="ml-auto flex items-center gap-5">
          <a href="#sobre" className="hidden text-sm text-ink-2 hover:text-ink sm:block">
            Sobre
          </a>
          {signedIn ? (
            <Link to={paths.home} className={buttonClassName({ variant: 'primary' })}>
              Ir para o portal
            </Link>
          ) : (
            <>
              <Link to={paths.login} className="text-sm font-medium text-ink hover:text-accent-hover">
                Entrar
              </Link>
              <Link to={paths.signup()} className={buttonClassName({ variant: 'primary' })}>
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const SLIDE_MS = 7000;

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

/**
 * Faixa de abertura como a de um portal institucional: fotos do Recife passando
 * uma de cada vez, véu escuro e o título centralizado. Com movimento reduzido, a foto fica parada.
 */
const Hero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % HERO_PHOTOS.length), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <section aria-label="Abertura" className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-brand-900 sm:min-h-[600px]">
      {HERO_PHOTOS.map((photo, index) => (
        <img
          key={photo.src}
          src={photo.src}
          alt={index === active ? photo.alt : ''}
          aria-hidden={index !== active}
          fetchPriority={index === 0 ? 'high' : 'low'}
          loading={index === 0 ? 'eager' : 'lazy'}
          className={cn('absolute inset-0 -z-10 size-full object-cover transition-opacity duration-1000', index === active ? 'opacity-100' : 'opacity-0')}
        />
      ))}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/50" />
      <div className={cn(FRAME, 'py-20 text-center text-white')}>
        <h1 className="mx-auto max-w-[820px] text-[36px] leading-[1.1] font-bold tracking-[-0.022em] text-balance sm:text-[52px]">
          Problemas reais viram projetos de extensão no CIn
        </h1>
        <p className="mt-5 text-[17px] text-white/85 sm:text-[19px]">Organizações, docentes e estudantes na mesma plataforma.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to={paths.login} className={buttonClassName({ variant: 'primary', size: 'lg' })}>
            Acessar a plataforma
          </Link>
          <a href="#sobre" className={buttonClassName({ variant: 'onDarkOutline', size: 'lg' })}>
            Conhecer o L.E.I.
          </a>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
        {HERO_PHOTOS.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`Foto ${index + 1}: ${photo.alt}`}
            aria-current={index === active}
            onClick={() => setActive(index)}
            className={cn('h-1.5 rounded-full transition-all', index === active ? 'w-8 bg-white' : 'w-5 bg-white/45 hover:bg-white/70')}
          />
        ))}
      </div>
    </section>
  );
};

const Welcome = () => (
    <section id="sobre" className="scroll-mt-16 py-16 sm:py-24">
      <div className={cn(FRAME, 'grid items-center gap-10 lg:grid-cols-2 lg:gap-16')}>
        <div>
          <h2 className="text-[28px] leading-tight font-bold tracking-[-0.018em] text-balance text-ink sm:text-[32px]">
            Bem-vindo(a) ao Aperta o PL.E.I., a plataforma de extensão do L.E.I.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-2">
            O Laboratório de Extensão e Inovação do Centro de Informática da UFPE aproxima a universidade de quem precisa de tecnologia: ONGs, coletivos, órgãos
            públicos e unidades da própria UFPE.
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
            Aqui, a organização apresenta um problema real, o docente leva para uma disciplina e a turma resolve durante o semestre, com o projeto registrado no SIGAA.
          </p>
        </div>
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-3">
          <img src={WELCOME_PHOTOS.students.src} alt={WELCOME_PHOTOS.students.alt} loading="lazy" className="aspect-[4/5] size-full rounded-lg object-cover" />
          <img src={WELCOME_PHOTOS.city.src} alt={WELCOME_PHOTOS.city.alt} loading="lazy" className="aspect-[5/8] size-full rounded-lg object-cover" />
        </div>
      </div>
    </section>
);

const FEATURES: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <TrayIcon size={24} />, title: 'Cardápio de demandas', text: 'Problemas reais de organizações parceiras, já triados pelo L.E.I.' },
  { icon: <UsersIcon size={24} />, title: 'Projetos na disciplina', text: 'O docente leva a demanda para a turma que já trabalha o que ela pede.' },
  { icon: <CopyIcon size={24} />, title: 'Plano pronto para o SIGAA', text: 'O projeto nasce com o plano escrito, no formato do sistema.' },
  { icon: <FolderIcon size={24} />, title: 'Acompanhamento em etapas', text: 'Da reunião de abertura ao encerramento, com os prazos do semestre.' },
  { icon: <BellIcon size={24} />, title: 'Avisos no tempo certo', text: 'Prazos chegando, reservas e respostas das organizações.' },
];

type Feature = (typeof FEATURES)[number];

/** Vizinho esmaecido do carrossel: clicar traz o cartão para o meio. */
const SideCard = ({ feature, onSelect }: { feature: Feature; onSelect: () => void }) => (
  <button
    type="button"
    onClick={onSelect}
    aria-label={`Ver ${feature.title}`}
    className="hidden h-[220px] w-[240px] shrink-0 flex-col items-center justify-center gap-4 rounded-lg bg-fill px-6 text-center text-ink-3 transition-colors hover:bg-fill-strong md:flex"
  >
    <span className="flex size-12 items-center justify-center rounded-full bg-surface">{feature.icon}</span>
    <span className="text-[15px] font-semibold text-ink-2">{feature.title}</span>
  </button>
);

/** Carrossel como o da referência: o cartão do meio em destaque, os vizinhos esmaecidos, setas e pontos. */
const Features = () => {
  const [active, setActive] = useState(0);
  const count = FEATURES.length;
  const at = (offset: number) => FEATURES[(active + offset + count) % count];
  const move = (step: number) => setActive((current) => (current + step + count) % count);

  const current = at(0);

  return (
    <section className="bg-canvas py-16 sm:py-24">
      <div className={FRAME}>
        <h2 className="text-center text-[28px] font-bold tracking-[-0.018em] text-ink sm:text-[32px]">O que você encontra na plataforma</h2>

        <div className="mt-12 flex items-center justify-center gap-3 sm:gap-5">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => move(-1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-ink hover:bg-fill"
          >
            <ChevronLeftIcon size={18} />
          </button>

          <SideCard feature={at(-1)} onSelect={() => move(-1)} />
          <div aria-live="polite" className="flex h-[260px] w-full max-w-[320px] flex-col items-center justify-center rounded-lg bg-brand px-7 text-center text-white shadow-sheet">
            <span className="flex size-14 items-center justify-center rounded-full bg-brand-700">{current.icon}</span>
            <p className="mt-5 text-[18px] font-semibold">{current.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{current.text}</p>
          </div>
          <SideCard feature={at(1)} onSelect={() => move(1)} />

          <button
            type="button"
            aria-label="Próximo"
            onClick={() => move(1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-ink hover:bg-fill"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {FEATURES.map((feature, index) => (
            <button
              key={feature.title}
              type="button"
              aria-label={feature.title}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={cn('h-2 rounded-full transition-all', index === active ? 'w-6 bg-brand' : 'w-2 bg-line-strong hover:bg-ink-3')}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FooterColumn = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <p className="text-sm font-semibold text-ink">{title}</p>
    <ul className="mt-3 space-y-2 text-sm text-ink-2">{children}</ul>
  </div>
);

const Footer = () => (
  <footer className="border-t border-line bg-surface">
    <div className={cn(FRAME, 'grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]')}>
      <div>
        <BrandMark />
        <p className="mt-4 text-sm text-ink-2">Laboratório de Extensão e Inovação</p>
        <p className="mt-1 text-sm text-ink-3">Centro de Informática, UFPE · Cidade Universitária, Recife, PE</p>
      </div>
      <FooterColumn title="Plataforma">
        <li>
          <Link to={paths.login} className="hover:text-ink">
            Entrar
          </Link>
        </li>
        <li>
          <Link to={paths.signup()} className="hover:text-ink">
            Criar conta
          </Link>
        </li>
      </FooterColumn>
      <FooterColumn title="Acesso">
        <li>
          <Link to={paths.loginAs('docente')} className="hover:text-ink">
            Docentes
          </Link>
        </li>
        <li>
          <Link to={paths.loginAs('organizacao')} className="hover:text-ink">
            Organizações
          </Link>
        </li>
        <li>
          <Link to={paths.loginAs('estudante')} className="hover:text-ink">
            Estudantes
          </Link>
        </li>
      </FooterColumn>
      <FooterColumn title="O L.E.I.">
        <li>
          <a href="#sobre" className="hover:text-ink">
            Sobre o laboratório
          </a>
        </li>
      </FooterColumn>
    </div>
    <div className={FRAME}>
      <div className="border-t border-line py-5 text-center">
      <p className="text-[13px] text-ink-3">© 2026 L.E.I. · Centro de Informática da UFPE.</p>
      {PHOTO_CREDITS.map((credit) => (
        <p key={credit.sourceUrl} className="mt-1.5 text-[11px] text-ink-3">
          Foto {credit.subject}:{' '}
          <a href={credit.sourceUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:text-ink-2 hover:underline">
            {credit.author}, {credit.source}
          </a>
          ,{' '}
          <a href={credit.licenseUrl} target="_blank" rel="license noreferrer" className="underline-offset-2 hover:text-ink-2 hover:underline">
            {credit.license}
          </a>
          , {credit.changes}.
        </p>
      ))}
      </div>
    </div>
  </footer>
);

/** Portal público, simples como um portal institucional: abertura com foto, boas-vindas, o que há na plataforma e o rodapé. */
export const LandingPage = () => {
  useEffect(() => {
    document.title = 'Aperta o PL.E.I. · Extensão no CIn da UFPE';
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <PublicHeader />
      <main>
        <Hero />
        <Welcome />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

