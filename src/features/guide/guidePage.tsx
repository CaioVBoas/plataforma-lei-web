import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { ArrowRightIcon, BookmarkIcon, CheckIcon, FolderIcon, TrayIcon } from '@/components/ui/icons';
import { Page, Section } from '@/components/ui/page';
import { formatShortDate } from '@/domain/calendar';
import { projectStage } from '@/domain/projectLifecycle';
import { isMyReservation, MAX_ACTIVE_RESERVATIONS, RESERVATION_DAYS } from '@/domain/reservation';
import { useAccount, useUpdateAccount } from '@/features/account/useAccount';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useMenu } from '@/features/demands/useDemands';
import { useCurrentDisciplines } from '@/features/disciplines/useDisciplines';
import { useProjects } from '@/features/projects/shared/hooks/useProjects';
import { MILESTONE_COPY } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { Faq, Rules, Stages, StepTabs, type FaqItem, type GuideStep, type RuleGroup } from './components/guideBlocks';

const goTo = (to: string, label: string) => (
  <Link to={to} className={buttonClassName({ variant: 'plain', size: 'sm' })}>
    {label}
    <ArrowRightIcon size={14} />
  </Link>
);

/** O caminho do docente, marcando o que ele já fez a partir dos dados dele. */
const useJourney = (): GuideStep[] => {
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

const RULE_GROUPS: RuleGroup[] = [
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

const FAQ: FaqItem[] = [
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
        <Stages copy={MILESTONE_COPY} />
      </Section>

      <Section title="Regras">
        <Rules groups={RULE_GROUPS} />
      </Section>

      <Section title="Perguntas frequentes">
        <Faq items={FAQ} />
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
