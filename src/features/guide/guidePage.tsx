import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { ArrowRightIcon, BookmarkIcon, CheckIcon, ChevronDownIcon, FolderIcon, TrayIcon } from '@/components/ui/icons';
import { Page, Section } from '@/components/ui/page';
import { formatShortDate } from '@/domain/calendar';
import { MILESTONE_ORDER, projectStage } from '@/domain/projectLifecycle';
import { isMyReservation, MAX_ACTIVE_RESERVATIONS, RESERVATION_DAYS } from '@/domain/reservation';
import type { MilestoneId } from '@/domain/types';
import { useAccount, useUpdateAccount } from '@/features/account/useAccount';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useMenu } from '@/features/demands/useDemands';
import { useCurrentDisciplines } from '@/features/disciplines/useDisciplines';
import { useProjects } from '@/features/projects/shared/hooks/useProjects';
import { MILESTONE_COPY } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';

interface Step {
  title: string;
  text: string;
  /** Rótulo pequeno à direita do texto: prazo ou atalho. */
  aside?: ReactNode;
  done?: boolean;
}

/**
 * Passos numa linha, ligados por um traço. Clicar num passo mostra a frase
 * dele embaixo. É o caminho do docente, do cadastro ao encerramento.
 */
const StepTabs = ({ label, steps }: { label: string; steps: Step[] }) => {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div>
      <ol aria-label={label} className="relative flex justify-between gap-2">
        <span aria-hidden="true" className="absolute top-4 right-[5%] left-[5%] h-px bg-line-strong" />
        {steps.map((item, index) => {
          const current = index === active;
          return (
            <li key={item.title} className="relative flex min-w-0 flex-1 justify-center">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={current ? 'step' : undefined}
                className="flex min-w-0 flex-col items-center gap-2 text-center"
              >
                <span
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums ring-4 ring-surface transition-colors',
                    current ? 'bg-brand text-white' : item.done ? 'bg-positive-soft text-positive' : 'bg-fill text-ink-2 hover:bg-fill-strong',
                  )}
                >
                  {item.done && !current ? <CheckIcon size={14} /> : index + 1}
                </span>
                <span className={cn('hidden text-[13px] leading-snug sm:block', current ? 'font-semibold text-ink' : 'text-ink-2')}>{item.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div aria-live="polite" className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-line pt-5">
        <div className="min-w-0 flex-[1_1_420px]">
          <p className="text-[17px] font-semibold text-ink">{step.title}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{step.text}</p>
        </div>
        {step.aside}
      </div>
    </div>
  );
};

const goTo = (to: string, label: string) => (
  <Link to={to} className={buttonClassName({ variant: 'plain', size: 'sm' })}>
    {label}
    <ArrowRightIcon size={14} />
  </Link>
);

/** O caminho do docente, marcando o que ele já fez a partir dos dados dele. */
const useJourney = (): Step[] => {
  const { data: disciplines = [] } = useCurrentDisciplines();
  const { data: menu = [] } = useMenu();
  const { data: projects = [] } = useProjects();
  const hasProject = projects.length > 0;
  return [
    {
      title: 'Cadastre as disciplinas',
      text: 'Diga quantos estudantes cada turma tem e o que ela trabalha. É isso que decide quais demandas combinam com ela.',
      aside: goTo(paths.disciplines, 'Disciplinas'),
      done: disciplines.length > 0,
    },
    {
      title: 'Reserve no cardápio',
      text: `Achou um problema que serve? Reserve: ele fica guardado para você por ${RESERVATION_DAYS} dias enquanto conversa com a turma.`,
      aside: goTo(paths.menu, 'Cardápio'),
      done: hasProject || menu.some(isMyReservation),
    },
    {
      title: 'Leve para a turma',
      text: 'Escolha a disciplina e quantas equipes. O projeto nasce com o plano escrito e o contato da organização liberado.',
      done: hasProject,
    },
    {
      title: 'Planeje e registre',
      text: 'Revise o plano, faça a reunião de abertura e registre no SIGAA. Até o registro, dá para desistir sem custo.',
      done: projects.some((project) => projectStage(project.milestones) !== 'planning'),
    },
    {
      title: 'Entregue e encerre',
      text: 'A turma faz uma entrega parcial e uma final. No fim, você conta em duas linhas o que ficou com a organização.',
      aside: goTo(paths.projects, 'Projetos'),
      done: projects.some((project) => projectStage(project.milestones) === 'done'),
    },
  ];
};

const MILESTONE_TIMING: Record<MilestoneId, string> = {
  plan: 'Primeira semana',
  kickoff: 'Até duas semanas',
  sigaa: 'Até o prazo de vinculação',
  midterm: 'Meio do semestre',
  final: 'Última semana de aula',
  closing: 'Fim do semestre',
};

/** Em que fase o projeto fica em cada etapa, dito uma vez em cada troca. */
const PHASE_START: Partial<Record<MilestoneId, string>> = { plan: 'Planejamento', midterm: 'Em andamento', closing: 'Concluído' };

/**
 * As seis etapas de cima para baixo. Clicar numa abre o que acontece nela;
 * as outras ficam fechadas, só com o título e o prazo.
 */
const Stages = () => {
  const [open, setOpen] = useState<MilestoneId>('plan');

  return (
    <ol className="overflow-hidden rounded-lg border border-line">
      {MILESTONE_ORDER.map((id, index) => {
        const current = id === open;
        const phase = PHASE_START[id];
        return (
          <li key={id} className="border-t border-line first:border-t-0">
            {phase && <p className="bg-canvas px-5 py-1.5 text-[12px] font-semibold text-ink-2">{phase}</p>}
            <button
              type="button"
              onClick={() => setOpen(id)}
              aria-expanded={current}
              className={cn('flex w-full items-start gap-4 px-5 py-4 text-left transition-colors', current ? 'bg-surface' : 'hover:bg-canvas')}
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums transition-colors',
                  current ? 'bg-brand text-white' : 'bg-fill text-ink-2',
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 pt-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <span className={cn('text-[15px] text-ink', current ? 'font-semibold' : 'font-medium')}>{MILESTONE_COPY[id].title}</span>
                  <span className={cn('text-[13px]', current ? 'font-medium text-brand-strong' : 'text-ink-3')}>{MILESTONE_TIMING[id]}</span>
                </span>
                {current && <span className="mt-1.5 block text-sm leading-relaxed text-ink-2 animate-fade-in">{MILESTONE_COPY[id].description}</span>}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

const RULE_GROUPS: { icon: ReactNode; title: string; rules: string[] }[] = [
  {
    icon: <BookmarkIcon size={20} />,
    title: 'Reserva',
    rules: [
      `Vale ${RESERVATION_DAYS} dias, até ${MAX_ACTIVE_RESERVATIONS} por docente. Se não virar projeto, volta sozinha para o cardápio.`,
      'Reservada por um colega, aparece com o nome dele, e você pode pedir aviso para quando voltar.',
      'Cada demanda vai para uma única turma.',
    ],
  },
  {
    icon: <CheckIcon size={20} />,
    title: 'Quando combina',
    rules: [
      'Só turmas do semestre atual e com vaga recebem demandas.',
      'A turma precisa cobrir metade das competências e estar na altura do curso que a demanda pede.',
      'Dúvidas vão pela própria demanda, e a resposta fica para todos.',
    ],
  },
  {
    icon: <FolderIcon size={20} />,
    title: 'Durante o projeto',
    rules: [
      'O contato da organização aparece quando a demanda vira projeto seu.',
      'Depois do registro no SIGAA, o plano fica travado e não dá mais para desistir.',
      'O resultado do encerramento vai para o histórico da organização e para o relatório que libera as horas.',
    ],
  },
];

/** As regras no mesmo desenho da faixa de perfis do portal: um cartão, três colunas. */
const Rules = () => (
  <ul className="grid overflow-hidden rounded-lg border border-line md:grid-cols-3">
    {RULE_GROUPS.map((group) => (
      <li key={group.title} className="border-line p-6 not-first:border-t md:not-first:border-t-0 md:not-first:border-l">
        <span className="flex size-10 items-center justify-center rounded-md bg-brand text-white">{group.icon}</span>
        <p className="mt-4 text-[17px] font-semibold text-ink">{group.title}</p>
        <ul className="mt-2 space-y-2">
          {group.rules.map((rule) => (
            <li key={rule} className="text-sm leading-relaxed text-ink-2">
              {rule}
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);

const FAQ: { question: string; answer: ReactNode }[] = [
  {
    question: 'Para que serve reservar?',
    answer:
      'Para pensar sem pressa e sem perder a demanda. Enquanto a reserva vale, ninguém mais consegue levá-la. Se desistir, libere a reserva: outra turma pode aproveitar.',
  },
  {
    question: 'Isso é um projeto de extensão?',
    answer:
      'É extensão dentro da disciplina: a turma resolve um problema real de uma organização de fora da universidade, com ela, durante o semestre. O projeto começa e termina com a turma, sem edital nem bolsa. O registro no SIGAA continua necessário para a carga horária de extensão contar.',
  },
  {
    question: 'Como os estudantes recebem as horas?',
    answer:
      'Pelo SIGAA. Depois do encerramento, você envia o relatório final com o resultado que escreveu aqui. Quando a PROExC aprova, o certificado de horas sai para os estudantes.',
  },
  {
    question: 'O que a organização recebe no fim?',
    answer:
      'O que cabe num semestre: pesquisa com usuários, protótipo ou prova de conceito. Um sistema pronto para uso costuma ficar fora. Combine isso na reunião de abertura para ninguém se frustrar.',
  },
  {
    question: 'Divido a disciplina com outro professor. Como fica?',
    answer: 'Convide o colega pelo e-mail institucional na página da disciplina. Vocês dois veem e editam os mesmos projetos.',
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
    answer: 'Você e as equipes, pelo canal que a organização prefere. O ponto focal e o e-mail ficam no card Organização, ao lado das etapas do projeto.',
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

const Journey = () => <StepTabs label="Seu caminho" steps={useJourney()} />;

export const GuidePage = () => {
  const { data: account } = useAccount();
  const { data: calendar } = useCalendar();
  const { mutate: markSeen } = useUpdateAccount();

  // Abrir o tutorial já conta como visto: o convite some do Início.
  useEffect(() => {
    if (account && !account.tutorialSeen) markSeen({ tutorialSeen: true });
  }, [account, markSeen]);

  return (
    <Page title="Como funciona" subtitle="Uma organização traz um problema real, o L.E.I. faz a triagem e a sua turma resolve durante o semestre.">
      <Section title="Seu caminho" description="Clique num número para ver o passo.">
        <Journey />
      </Section>

      <Section
        title="As seis etapas do projeto"
        description={`Clique numa etapa para ver o que acontece nela.${calendar ? ` Em ${calendar.id}, o prazo para levar e registrar é ${formatShortDate(calendar.linkDeadline)}.` : ''}`}
      >
        <Stages />
      </Section>

      <Section title="Regras">
        <Rules />
      </Section>

      <Section title="Perguntas frequentes">
        <Faq />
      </Section>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
        <p className="text-[15px] font-medium text-ink">Pronto para escolher a primeira demanda?</p>
        <Link to={paths.menu} className={buttonClassName({ variant: 'primary' })}>
          <TrayIcon size={16} />
          Abrir o cardápio
        </Link>
      </div>
    </Page>
  );
};
