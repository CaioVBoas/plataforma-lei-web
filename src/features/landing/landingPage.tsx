import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import centeredOnDark from '@/assets/brand/centralizado/branco.svg';
import { BrandMark } from '@/components/ui/brandMark';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { CoverageMeter } from '@/components/ui/coverageMeter';
import {
  ArrowRightIcon,
  BellIcon,
  BookIcon,
  BuildingIcon,
  ChatIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  FolderIcon,
  TrayIcon,
  UsersIcon,
} from '@/components/ui/icons';
import { Tag } from '@/components/ui/tag';
import { ROLE_COPY } from '@/features/auth/roles';
import { session } from '@/features/auth/session';
import type { UserRole } from '@/features/auth/types';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';

/** Mesma largura e margens do portal, para a passagem do site para a plataforma não pular. */
const FRAME = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8';

const NAV = [
  { href: '#lei', label: 'O L.E.I.' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#para-quem', label: 'Para quem' },
  { href: '#plataforma', label: 'A plataforma' },
];

const PublicHeader = () => {
  const signedIn = session.isAuthenticated();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-md">
      <div className={cn(FRAME, 'flex h-16 items-center gap-6')}>
        <Link to={paths.landing} aria-label="Aperta o PL.E.I., página inicial">
          <BrandMark />
        </Link>
        <nav aria-label="Seções" className="ml-4 hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-ink-2 hover:text-brand-strong">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {signedIn ? (
            <Link to={paths.home} className={buttonClassName({ variant: 'primary' })}>
              Ir para o portal
              <ArrowRightIcon size={15} />
            </Link>
          ) : (
            <>
              <Link to={paths.login} className={buttonClassName({ variant: 'secondary' })}>
                Entrar
              </Link>
              <Link to={paths.signup()} className={cn(buttonClassName({ variant: 'primary' }), 'hidden sm:inline-flex')}>
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

/** Um cartão do cardápio desenhado, só ilustração: mostra o produto sem prometer dado real. */
const MenuPreview = () => (
  <div aria-hidden="true" className="relative mx-auto w-full max-w-[420px]">
    <div className="absolute inset-x-6 -bottom-4 h-full rounded-lg bg-brand-700" />
    <div className="absolute inset-x-3 -bottom-2 h-full rounded-lg bg-brand-500" />
    <div className="relative rounded-lg bg-surface p-5 shadow-sheet">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-sm bg-monogram text-[13px] font-bold text-monogram-ink">C</span>
          <span className="text-[13px] font-semibold text-ink-2">Coletivo comunitário</span>
        </span>
        <Tag tone="positive">Livre no cardápio</Tag>
      </div>
      <p className="mt-4 text-[17px] leading-snug font-semibold text-ink">Mapa dos alagamentos do bairro</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">A comunidade anota tudo em caderno e, sem mapa, a informação não sustenta cobrança pública.</p>
      <div className="mt-4 border-t border-line pt-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] text-ink">Desenvolvimento Web</span>
          <CoverageMeter covered={3} total={4} fits />
        </div>
        <p className="mt-1 text-[12px] text-ink-3">3 de 4 competências · Cabe no semestre</p>
      </div>
    </div>
  </div>
);

const Hero = () => (
  <section className="relative overflow-hidden bg-brand text-white">
    <span aria-hidden="true" className="absolute -top-32 -right-24 size-[420px] rounded-full bg-brand-500" />
    <span aria-hidden="true" className="absolute -bottom-40 -left-32 size-[360px] rounded-full bg-brand-700" />
    <div className={cn(FRAME, 'relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:py-24')}>
      <div>
        <p className="text-[13px] font-semibold tracking-wide text-brand-on-dark uppercase">Extensão no Centro de Informática da UFPE</p>
        <h1 className="mt-4 text-[38px] leading-[1.08] font-bold tracking-[-0.025em] text-balance sm:text-[52px]">Problemas reais viram projetos de extensão.</h1>
        <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-brand-100">
          Organizações de Pernambuco trazem o problema. Docentes levam para a disciplina. Estudantes resolvem durante o semestre.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#para-quem" className={buttonClassName({ variant: 'onDark', size: 'lg' })}>
            Quero participar
            <ArrowRightIcon size={16} />
          </a>
          <a href="#como-funciona" className={buttonClassName({ variant: 'onDarkOutline', size: 'lg' })}>
            Como funciona
          </a>
        </div>
      </div>
      <MenuPreview />
    </div>
  </section>
);

const SectionHead = ({ eyebrow, title, text, center }: { eyebrow: string; title: string; text?: string; center?: boolean }) => (
  <div className={cn('max-w-[640px]', center && 'mx-auto text-center')}>
    <p className="text-[13px] font-semibold text-brand-strong">{eyebrow}</p>
    <h2 className="mt-2 text-[30px] leading-tight font-bold tracking-[-0.02em] text-balance text-ink sm:text-[34px]">{title}</h2>
    {text && <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{text}</p>}
  </div>
);

const About = () => (
  <section id="lei" className="scroll-mt-16 py-16 sm:py-24">
    <div className={cn(FRAME, 'grid items-center gap-12 lg:grid-cols-2')}>
      <div>
        <SectionHead
          eyebrow="O L.E.I."
          title="O Laboratório de Extensão e Inovação do CIn"
          text="O L.E.I. aproxima o Centro de Informática de quem precisa de tecnologia fora da universidade: ONGs, coletivos, órgãos públicos e unidades da própria UFPE."
        />
        <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
          O <span className="font-semibold text-ink">Aperta o PL.E.I.</span> é a plataforma do laboratório. O nome vem de apertar o play: tirar o problema do papel e colocar
          uma turma para resolver.
        </p>
        <dl className="mt-8 grid grid-cols-3 gap-3">
          {[
            { value: '1', label: 'semestre por projeto' },
            { value: '6', label: 'etapas acompanhadas' },
            { value: '7', label: 'dias de reserva para decidir' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-md border border-fact-line bg-fact px-4 py-3.5">
              <dd className="text-[26px] leading-none font-bold text-brand-strong tabular-nums">{stat.value}</dd>
              <dt className="mt-1.5 text-[13px] leading-snug text-ink-2">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-lg bg-brand-800 p-10">
        <span aria-hidden="true" className="absolute -top-20 -left-20 size-64 rounded-full bg-brand-700" />
        <span aria-hidden="true" className="absolute -right-16 -bottom-24 size-72 rounded-full bg-brand-600" />
        <img src={centeredOnDark} alt="Aperta o PL.E.I." className="relative w-full max-w-[300px]" />
      </div>
    </div>
  </section>
);

const STEPS = [
  { icon: <BuildingIcon size={20} />, title: 'A organização publica', text: 'Conta o problema, quem sente e o que oferece à turma.' },
  { icon: <CheckIcon size={20} />, title: 'O L.E.I. faz a triagem', text: 'Só entra no cardápio o que cabe num semestre de disciplina.' },
  { icon: <BookIcon size={20} />, title: 'O docente leva para a turma', text: 'Escolhe a demanda que combina com o que a turma já trabalha.' },
  { icon: <FolderIcon size={20} />, title: 'A turma entrega', text: 'Com reuniões, entrega parcial e final, e o registro no SIGAA.' },
];

const HowItWorks = () => (
  <section id="como-funciona" className="scroll-mt-16 bg-canvas py-16 sm:py-24">
    <div className={FRAME}>
      <SectionHead eyebrow="Como funciona" title="Do problema ao projeto em quatro passos" center />
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-md bg-monogram text-monogram-ink">{step.icon}</span>
              <span className="text-[13px] font-bold text-brand-strong tabular-nums">0{index + 1}</span>
            </div>
            <p className="mt-5 text-[17px] font-semibold text-ink">{step.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

const ROLE_ICON: Record<UserRole, ReactNode> = {
  organizacao: <BuildingIcon size={22} />,
  docente: <BookIcon size={22} />,
  estudante: <UsersIcon size={22} />,
};

const ROLE_ORDER: UserRole[] = ['organizacao', 'docente', 'estudante'];

const Audiences = () => (
  <section id="para-quem" className="scroll-mt-16 py-16 sm:py-24">
    <div className={FRAME}>
      <SectionHead eyebrow="Para quem" title="Escolha como você participa" text="Cada perfil tem a sua porta de entrada na plataforma." center />
      <ul className="mt-12 grid gap-4 lg:grid-cols-3">
        {ROLE_ORDER.map((role) => {
          const copy = ROLE_COPY[role];
          const featured = copy.available;
          return (
            <li
              key={role}
              className={cn('flex flex-col rounded-lg p-6 sm:p-7', featured ? 'bg-brand text-white' : 'border border-line bg-surface')}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={cn('flex size-12 items-center justify-center rounded-md', featured ? 'bg-brand-700 text-brand-on-dark' : 'bg-monogram text-monogram-ink')}>
                  {ROLE_ICON[role]}
                </span>
                {!copy.available && <Tag>Em breve</Tag>}
              </div>
              <p className={cn('mt-6 text-[20px] font-bold', featured ? 'text-white' : 'text-ink')}>{copy.label}</p>
              <p className={cn('mt-2 flex-1 text-[15px] leading-relaxed', featured ? 'text-brand-100' : 'text-ink-2')}>{copy.pitch}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {featured ? (
                  <>
                    <Link to={paths.loginAs(role)} className={buttonClassName({ variant: 'onDark' })}>
                      Entrar como docente
                      <ArrowRightIcon size={15} />
                    </Link>
                    <Link to={paths.signup(role)} className={buttonClassName({ variant: 'onDarkOutline' })}>
                      Criar conta
                    </Link>
                  </>
                ) : (
                  <Link to={paths.signup(role)} className={buttonClassName({ variant: 'secondary' })}>
                    Quero participar
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

const FEATURES = [
  { icon: <TrayIcon size={20} />, title: 'Cardápio de demandas', text: 'Problemas triados, com o que a organização oferece e se cabem no semestre.' },
  { icon: <CheckIcon size={20} />, title: 'Combina com a turma', text: 'A plataforma mostra quanto das competências a disciplina já cobre.' },
  { icon: <ChatIcon size={20} />, title: 'Pergunte antes de decidir', text: 'Dúvidas vão para a organização e as respostas ficam para todos os docentes.' },
  { icon: <CopyIcon size={20} />, title: 'Plano pronto para o SIGAA', text: 'O projeto nasce com o plano escrito, no limite de caracteres do sistema.' },
  { icon: <FolderIcon size={20} />, title: 'Seis etapas acompanhadas', text: 'Da reunião de abertura ao encerramento, com prazos do calendário.' },
  { icon: <BellIcon size={20} />, title: 'Avisos no tempo certo', text: 'Reserva perto de vencer, prazo chegando e resposta da organização.' },
];

/** Carrossel simples: a fileira rola de lado e as setas andam um cartão por vez. */
const Features = () => {
  const rowRef = useRef<HTMLUListElement>(null);
  const scroll = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const card = row.querySelector('li');
    row.scrollBy({ left: direction * ((card?.clientWidth ?? 320) + 16), behavior: 'smooth' });
  };

  return (
    <section id="plataforma" className="scroll-mt-16 bg-canvas py-16 sm:py-24">
      <div className={FRAME}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="A plataforma" title="O que você encontra no Aperta o PL.E.I." />
          <div className="flex gap-2">
            <button type="button" aria-label="Anterior" onClick={() => scroll(-1)} className="flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface text-ink hover:bg-brand-50">
              <ChevronLeftIcon size={18} />
            </button>
            <button type="button" aria-label="Próximo" onClick={() => scroll(1)} className="flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface text-ink hover:bg-brand-50">
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>
        <ul ref={rowRef} className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="w-[78%] shrink-0 snap-start rounded-lg border border-line bg-surface p-6 sm:w-[46%] lg:w-[calc((100%-32px)/3)]">
              <span className="flex size-11 items-center justify-center rounded-md bg-brand text-white">{feature.icon}</span>
              <p className="mt-5 text-[17px] font-semibold text-ink">{feature.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const CallToAction = () => (
  <section className="py-16 sm:py-20">
    <div className={FRAME}>
      <div className="relative overflow-hidden rounded-lg bg-brand px-6 py-12 text-center text-white sm:px-12">
        <span aria-hidden="true" className="absolute -top-20 -left-16 size-56 rounded-full bg-brand-500" />
        <span aria-hidden="true" className="absolute -right-16 -bottom-24 size-64 rounded-full bg-brand-700" />
        <div className="relative">
          <h2 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-balance sm:text-[34px]">Pronto para apertar o play?</h2>
          <p className="mx-auto mt-3 max-w-[48ch] text-[16px] text-brand-100">Docentes do CIn já podem escolher a primeira demanda para a turma deste semestre.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to={paths.signup('docente')} className={buttonClassName({ variant: 'onDark', size: 'lg' })}>
              Criar conta de docente
              <ArrowRightIcon size={16} />
            </Link>
            <Link to={paths.login} className={buttonClassName({ variant: 'onDarkOutline', size: 'lg' })}>
              Já tenho conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FooterColumn = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <p className="text-sm font-semibold text-ink">{title}</p>
    <ul className="mt-3 space-y-2 text-sm text-ink-2">{children}</ul>
  </div>
);

const Footer = () => (
  <footer className="border-t border-line bg-canvas">
    <div className={cn(FRAME, 'grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]')}>
      <div>
        <BrandMark />
        <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-ink-2">Plataforma de extensão do L.E.I., o Laboratório de Extensão e Inovação do Centro de Informática da UFPE.</p>
      </div>
      <FooterColumn title="Plataforma">
        <li>
          <Link to={paths.login} className="hover:text-brand-strong">
            Entrar
          </Link>
        </li>
        <li>
          <Link to={paths.signup()} className="hover:text-brand-strong">
            Criar conta
          </Link>
        </li>
        <li>
          <a href="#plataforma" className="hover:text-brand-strong">
            O que você encontra
          </a>
        </li>
      </FooterColumn>
      <FooterColumn title="O L.E.I.">
        <li>
          <a href="#lei" className="hover:text-brand-strong">
            Sobre o laboratório
          </a>
        </li>
        <li>
          <a href="#como-funciona" className="hover:text-brand-strong">
            Como funciona
          </a>
        </li>
        <li>
          <a href="#para-quem" className="hover:text-brand-strong">
            Para quem
          </a>
        </li>
      </FooterColumn>
      <FooterColumn title="Onde estamos">
        <li>Centro de Informática, UFPE</li>
        <li>Cidade Universitária, Recife, PE</li>
      </FooterColumn>
    </div>
    <div className={FRAME}>
      <p className="border-t border-line py-5 text-[13px] text-ink-3">© 2026 L.E.I. · Centro de Informática da UFPE</p>
    </div>
  </footer>
);

/** Portal público: apresenta o L.E.I. e o Aperta o PL.E.I. e leva cada perfil para a entrada ou o cadastro. */
export const LandingPage = () => {
  useEffect(() => {
    document.title = 'Aperta o PL.E.I. · Extensão no CIn da UFPE';
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <PublicHeader />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Audiences />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};
