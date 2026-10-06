interface WelcomeHeroProps {
  /** Foto de fundo, coberta pelo petróleo escuro para o texto passar AA. */
  photo: string;
  title: string;
  line: string;
  stats: { value: number; label: string }[];
}

/**
 * Boas-vindas em petróleo sobre uma foto, para o Início ter cara de ponto de
 * partida. Os números são a situação de quem entrou, em um olhar.
 */
export const WelcomeHero = ({ photo, title, line, stats }: WelcomeHeroProps) => (
  <section className="relative isolate overflow-hidden rounded-lg bg-brand px-6 py-9 text-white sm:px-8 sm:py-11">
    <img src={photo} alt="" aria-hidden="true" className="absolute inset-0 -z-10 size-full object-cover" />
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-900/80" />
    <div className="relative flex flex-wrap items-end justify-between gap-6">
      <div className="min-w-0 flex-[1_1_360px]">
        <h1 className="text-[32px] leading-tight font-bold tracking-[-0.021em]">{title}</h1>
        <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-brand-100">{line}</p>
      </div>
      <dl className="grid w-full auto-cols-fr grid-flow-col gap-2.5 sm:flex sm:w-auto">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0 rounded-md sm:min-w-[104px] bg-white/12 px-4 py-3 backdrop-blur-sm">
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-[24px] leading-none font-bold tabular-nums">{stat.value}</dd>
            <dd className="mt-1.5 text-[12px] text-brand-100">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);
