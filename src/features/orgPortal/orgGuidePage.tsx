import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { ArrowRightIcon, ChatIcon, CheckIcon, FolderIcon, PlusIcon } from '@/components/ui/icons';
import { Page, Section } from '@/components/ui/page';
import { RESERVATION_DAYS } from '@/domain/reservation';
import type { OrgDemandStage } from '@/domain/submission';
import { Faq, Rules, Stages, StepTabs, type FaqItem, type GuideStep, type RuleGroup } from '@/features/guide/components/guideBlocks';
import { LeiContact } from '@/features/guide/components/leiContact';
import { paths } from '@/routes/paths';
import { useMarkOrgTutorialSeen, useOrgAccount, useOrgDemands } from './useOrgPortal';
import { ORG_MILESTONE_COPY } from './utils/orgPresentation';

const goTo = (to: string, label: string) => (
  <Link to={to} className={buttonClassName({ variant: 'plain', size: 'sm' })}>
    {label}
    <ArrowRightIcon size={14} />
  </Link>
);

/** O caminho de uma demanda, marcando até onde as da organização já chegaram. */
const useJourney = (): GuideStep[] => {
  const { data: demands = [] } = useOrgDemands();
  const reached = (...stages: OrgDemandStage[]) => demands.some((demand) => stages.includes(demand.stage));
  return [
    {
      title: 'Contem o problema',
      text: 'Quem sente, como é hoje e o que já ajudaria. São quatro etapas curtas, e dá para salvar rascunho. Não precisa saber de tecnologia.',
      aside: goTo(paths.orgNewDemand, 'Submeter demanda'),
      done: reached('in-review', 'needs-changes', 'open', 'reserved', 'in-project', 'done'),
    },
    {
      title: 'O L.E.I. faz a triagem',
      text: 'O L.E.I. lê, indica as competências e, se precisar, pede um ajuste. Aprovada, a demanda entra no cardápio.',
      done: reached('open', 'reserved', 'in-project', 'done'),
    },
    {
      title: 'Um docente escolhe',
      text: `Docentes do CIn veem a demanda e podem perguntar antes de decidir. Quem se interessa guarda a demanda por ${RESERVATION_DAYS} dias enquanto conversa com a turma.`,
      aside: goTo(paths.orgDemands('cardapio'), 'No cardápio'),
      done: reached('reserved', 'in-project', 'done'),
    },
    {
      title: 'A turma trabalha com vocês',
      text: 'Vocês recebem o contato do docente e combinam tudo na reunião de abertura. Durante o semestre, há uma entrega parcial e uma final.',
      aside: goTo(paths.orgProjects, 'Projetos'),
      done: reached('in-project', 'done'),
    },
    {
      title: 'O resultado fica com vocês',
      text: 'No fim, o docente conta o que ficou com vocês. O texto entra no perfil da organização, para a próxima turma não começar do zero.',
      done: reached('done'),
    },
  ];
};

const RULE_GROUPS: RuleGroup[] = [
  {
    icon: <CheckIcon size={20} />,
    title: 'Triagem',
    rules: [
      'O L.E.I. lê toda demanda antes de ela entrar no cardápio.',
      'Se pedir ajuste, o pedido aparece no topo da demanda. É só ajustar e reenviar.',
      'Rascunho só vocês veem e pode ser apagado. O que foi enviado fica registrado.',
    ],
  },
  {
    icon: <ChatIcon size={20} />,
    title: 'No cardápio',
    rules: [
      'Docentes perguntam pela própria demanda. A resposta de vocês fica visível para todos.',
      'Quando um docente está avaliando, ninguém mais leva a demanda até ele decidir.',
      'Cada demanda vai para uma única turma.',
    ],
  },
  {
    icon: <FolderIcon size={20} />,
    title: 'Durante o projeto',
    rules: [
      'O contato de vocês só aparece para o docente que levou a demanda.',
      'Vocês participam da reunião de abertura, da entrega parcial e da entrega final.',
      'O plano e as anotações da turma são do docente. Vocês acompanham as etapas.',
    ],
  },
];

const FAQ: FaqItem[] = [
  {
    question: 'Tem algum custo?',
    answer: 'Não. É extensão universitária: a turma aprende resolvendo um problema real de vocês, e a UFPE registra as horas dos estudantes.',
  },
  {
    question: 'O que a organização recebe no fim?',
    answer:
      'O que cabe num semestre: pesquisa com usuários, protótipo ou prova de conceito. Um sistema pronto para uso costuma ficar fora. Isso é combinado na reunião de abertura.',
  },
  {
    question: 'Quanto tempo a equipe de vocês vai gastar?',
    answer: 'A reunião de abertura, as reuniões no ritmo que vocês indicaram e as duas entregas. O ritmo fica no perfil e em cada demanda.',
  },
  {
    question: 'Precisamos saber de tecnologia?',
    answer: 'Não. Contem o problema como vocês vivem. A triagem do L.E.I. traduz isso nas competências que a turma precisa.',
  },
  {
    question: 'E se o problema envolver dados pessoais?',
    answer: 'Marquem na demanda. A turma trabalha com dados anonimizados e segue a LGPD. As regras de sigilo são combinadas na reunião de abertura.',
  },
  {
    question: 'E se nenhum docente escolher a demanda?',
    answer: 'Ela continua no cardápio, à vista dos docentes do semestre seguinte.',
  },
  {
    question: 'Podemos enviar mais de uma demanda?',
    answer: 'Pode. Cada problema vira uma demanda. Se um pedido junta vários problemas, o L.E.I. costuma sugerir separar.',
  },
];

export const OrgGuidePage = () => {
  const journey = useJourney();
  const { data: account } = useOrgAccount();
  const { mutate: markSeen } = useMarkOrgTutorialSeen();

  // Abrir o Como funciona já conta como visto: o convite some do Início.
  useEffect(() => {
    if (account && !account.tutorialSeen) markSeen();
  }, [account, markSeen]);

  return (
    <Page title="Como funciona" subtitle="Vocês contam um problema real, o L.E.I. faz a triagem e uma turma do CIn trabalha nele durante o semestre.">
      <Section title="O caminho de uma demanda" description="Clique num número para ver o passo.">
        <StepTabs label="O caminho de uma demanda" steps={journey} />
      </Section>

      <Section title="As seis etapas do projeto" description="Clique numa etapa para ver o que acontece nela.">
        <Stages copy={ORG_MILESTONE_COPY} />
      </Section>

      <Section title="Regras">
        <Rules groups={RULE_GROUPS} />
      </Section>

      <Section title="Perguntas frequentes">
        <Faq items={FAQ} />
      </Section>

      <LeiContact />

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
        <p className="text-[15px] font-medium text-ink">Tem um problema que uma turma pode resolver?</p>
        <Link to={paths.orgNewDemand} className={buttonClassName({ variant: 'primary' })}>
          <PlusIcon size={16} />
          Submeter demanda
        </Link>
      </div>
    </Page>
  );
};
