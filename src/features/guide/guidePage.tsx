import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { ChevronDownIcon } from '@/components/ui/icons';
import { Page, Section } from '@/components/ui/page';
import { formatShortDate } from '@/domain/calendar';
import { MILESTONE_ORDER } from '@/domain/projectLifecycle';
import { MAX_ACTIVE_RESERVATIONS, RESERVATION_DAYS } from '@/domain/reservation';
import { useAccount, useUpdateAccount } from '@/features/account/useAccount';
import { useCalendar } from '@/features/calendar/useCalendar';
import { MILESTONE_COPY } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';

interface JourneyStep {
  title: string;
  text: string;
  link?: { to: string; label: string };
}

const JOURNEY: JourneyStep[] = [
  {
    title: 'Cadastre suas disciplinas',
    text: 'Diga quantos estudantes cada turma tem e o que ela trabalha. É isso que decide quais demandas combinam com ela.',
    link: { to: paths.disciplines, label: 'Disciplinas' },
  },
  {
    title: 'Reserve no cardápio',
    text: `O cardápio reúne problemas reais de organizações parceiras, já triados pelo L.E.I. Achou um que serve? Reserve: ele fica guardado para você por ${RESERVATION_DAYS} dias enquanto você conversa com a turma e com colegas.`,
    link: { to: paths.menu, label: 'o cardápio' },
  },
  {
    title: 'Leve para a disciplina',
    text: 'Decidiu? Escolha a turma e o número de equipes. O projeto nasce com o plano já escrito e o contato da organização liberado.',
  },
  {
    title: 'Planeje com a organização',
    text: 'Revise o plano, faça a reunião de abertura e registre no SIGAA. Até o registro, você pode desistir sem custo.',
  },
  {
    title: 'Execute e encerre',
    text: 'A turma faz uma entrega parcial e uma final. No encerramento, você conta em duas linhas o que ficou com a organização.',
    link: { to: paths.projects, label: 'Projetos' },
  },
];

const MILESTONE_TIMING: Record<(typeof MILESTONE_ORDER)[number], string> = {
  plan: 'Primeira semana',
  kickoff: 'Até duas semanas',
  sigaa: 'Até o prazo de vinculação',
  midterm: 'Meio do semestre',
  final: 'Última semana de aula',
  closing: 'Fim do semestre',
};

const RULES = [
  `A reserva vale ${RESERVATION_DAYS} dias e cada docente tem até ${MAX_ACTIVE_RESERVATIONS} ao mesmo tempo. Se não virar projeto, a demanda volta sozinha para o cardápio.`,
  'Demanda reservada por um colega aparece no cardápio com o nome de quem reservou. Você pode pedir aviso para quando ela voltar.',
  'Cada demanda vai para uma única turma. Quando vira projeto, ela sai do cardápio de todo mundo.',
  'Só disciplinas do semestre atual e com vaga recebem demandas. Você decide quantos projetos cada turma comporta.',
  'Uma demanda combina com a turma quando a turma trabalha pelo menos metade das competências pedidas. A plataforma mostra quais cobre e quais faltam.',
  'O contato da organização aparece quando a demanda vira projeto seu.',
  'Até o registro no SIGAA dá para desistir e a demanda volta para o cardápio. Depois, o compromisso é institucional e o plano fica travado.',
  'O resultado que você escreve no encerramento entra no histórico da organização, para o próximo docente saber o que já foi feito.',
];

const FAQ: { question: string; answer: ReactNode }[] = [
  {
    question: 'Para que serve reservar?',
    answer:
      'Para pensar sem pressa e sem perder a demanda. Enquanto a reserva vale, ninguém mais consegue levá-la. Se desistir, libere a reserva: outra turma pode aproveitar.',
  },
  {
    question: 'Isso é um projeto de extensão?',
    answer:
      'É extensão dentro da disciplina. O projeto começa e termina com a turma, sem edital nem bolsa. O registro no SIGAA continua necessário para a carga horária de extensão contar.',
  },
  {
    question: 'A plataforma registra no SIGAA por mim?',
    answer: 'Não. Ela entrega o texto de cada campo pronto para copiar, com os limites do SIGAA, e guarda a data e o código que você informar.',
  },
  {
    question: 'E se a demanda for grande demais para um semestre?',
    answer:
      'Demandas marcadas como "Precisa de recorte" já avisam isso. O recorte é combinado na reunião de abertura e registrado no plano antes de ir para o SIGAA.',
  },
  {
    question: 'Quem fala com a organização?',
    answer: 'Você e as equipes, pelo canal que a organização prefere. O ponto focal e o e-mail ficam na aba Organização do projeto.',
  },
  {
    question: 'Posso levar duas demandas para a mesma turma?',
    answer: 'Pode, se a disciplina comportar. Cada disciplina tem um número de vagas que você define no cadastro, e cada projeto ocupa uma.',
  },
];

const Faq = () => (
  <div className="divide-y divide-line overflow-hidden rounded-lg border border-line">
    {FAQ.map((item) => (
      <details key={item.question} className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-[15px] font-medium text-ink hover:bg-canvas [&::-webkit-details-marker]:hidden">
          {item.question}
          <ChevronDownIcon size={15} className="shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
        </summary>
        <p className="px-4 pb-4 text-sm leading-relaxed text-ink-2">{item.answer}</p>
      </details>
    ))}
  </div>
);

export const GuidePage = () => {
  const { data: account } = useAccount();
  const { data: calendar } = useCalendar();
  const { mutate: markSeen } = useUpdateAccount();

  // Abrir o tutorial já conta como visto: o convite some do Início.
  useEffect(() => {
    if (account && !account.tutorialSeen) markSeen({ tutorialSeen: true });
  }, [account, markSeen]);

  return (
    <Page
      title="Como funciona"
      width="narrow"
      subtitle="Organizações de fora da universidade publicam problemas reais no cardápio. Você reserva um, leva para uma disciplina, e a turma resolve com a organização durante o semestre."
    >
      <Section title="Em cinco passos">
        <ol className="flex flex-col gap-3">
          {JOURNEY.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-lg border border-line p-4 sm:p-5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-white tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{step.text}</p>
                {step.link && (
                  <Link to={step.link.to} className="mt-2 inline-block text-sm text-accent hover:text-accent-hover">
                    Ir para {step.link.label}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="As seis etapas de todo projeto"
        description={
          calendar
            ? `Os prazos seguem o calendário do semestre. Em ${calendar.id}, o prazo de vinculação e registro é ${formatShortDate(calendar.linkDeadline)}.`
            : 'Os prazos seguem o calendário do semestre.'
        }
      >
        <ol className="divide-y divide-line overflow-hidden rounded-lg border border-line">
          {MILESTONE_ORDER.map((id, index) => (
            <li key={id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-3.5">
              <span className="w-5 text-[13px] text-ink-3 tabular-nums">{index + 1}</span>
              <div className="min-w-0 flex-[1_1_320px]">
                <p className="text-[15px] font-medium text-ink">{MILESTONE_COPY[id].title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-ink-2">{MILESTONE_COPY[id].description}</p>
              </div>
              <span className="text-[13px] text-ink-3">{MILESTONE_TIMING[id]}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[13px] text-ink-3">
          Até o registro no SIGAA o projeto está em planejamento. Depois, em andamento. Com o encerramento, concluído.
        </p>
      </Section>

      <Section title="Regras que valem para todos">
        <ul className="space-y-2.5">
          {RULES.map((rule) => (
            <li key={rule} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
              <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-3" />
              {rule}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Perguntas frequentes">
        <Faq />
      </Section>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-canvas px-5 py-5">
        <p className="text-[15px] font-medium text-ink">Pronto para reservar a primeira demanda?</p>
        <Link to={paths.menu} className={buttonClassName({ variant: 'primary' })}>
          Abrir o cardápio
        </Link>
      </div>
    </Page>
  );
};
