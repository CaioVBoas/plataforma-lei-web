import type { StatusTone } from '@/components/ui/statusLabel';
import type { OrgDemandStage } from '@/domain/submission';
import type { MilestoneId } from '@/domain/types';
import type { OrgDemandsView } from '@/routes/paths';

/** Cada estado do pedido com o nome que a organização entende e a cor de estado dos tokens. */
export const STAGE_COPY: Record<OrgDemandStage, { label: string; tone: StatusTone }> = {
  draft: { label: 'Rascunho', tone: 'neutral' },
  'in-review': { label: 'Na triagem do L.E.I.', tone: 'accent' },
  'needs-changes': { label: 'Ajuste pedido', tone: 'caution' },
  open: { label: 'No cardápio', tone: 'positive' },
  // A reserva é do docente: para a organização, alguém está avaliando. Laranja fica só no portal do docente.
  reserved: { label: 'Um docente está avaliando', tone: 'accent' },
  'in-project': { label: 'Em projeto', tone: 'positive' },
  done: { label: 'Concluída', tone: 'neutral' },
};

/** As abas da lista de demandas, na ordem do caminho de um pedido. */
export const VIEW_STAGES: Record<OrgDemandsView, OrgDemandStage[]> = {
  preparo: ['draft', 'needs-changes', 'in-review'],
  cardapio: ['open', 'reserved'],
  projeto: ['in-project'],
  concluidas: ['done'],
};

export const VIEW_LABELS: Record<OrgDemandsView, string> = {
  preparo: 'Em preparo',
  cardapio: 'No cardápio',
  projeto: 'Em projeto',
  concluidas: 'Concluídas',
};

/** Os cinco passos que a organização acompanha, do envio ao fim do projeto. */
export const JOURNEY = [
  { label: 'Envio', stages: ['draft'] },
  { label: 'Triagem do L.E.I.', stages: ['in-review', 'needs-changes'] },
  { label: 'No cardápio', stages: ['open', 'reserved'] },
  { label: 'Projeto com a turma', stages: ['in-project'] },
  { label: 'Concluída', stages: ['done'] },
] as const satisfies readonly { label: string; stages: readonly OrgDemandStage[] }[];

export const journeyIndex = (stage: OrgDemandStage) => JOURNEY.findIndex((step) => (step.stages as readonly OrgDemandStage[]).includes(stage));

/** As seis etapas do projeto contadas do lado da organização: o que ela vive em cada uma. */
export const ORG_MILESTONE_COPY: Record<MilestoneId, { title: string; description: string }> = {
  plan: {
    title: 'O docente revisa o plano',
    description: 'O docente ajusta o plano à disciplina antes de falar com vocês.',
  },
  kickoff: {
    title: 'Reunião de abertura',
    description: 'Vocês combinam com o docente o que a turma faz, as reuniões e o sigilo.',
  },
  sigaa: {
    title: 'Registro na UFPE',
    description: 'O docente registra o projeto na UFPE. Daqui em diante, é compromisso oficial.',
  },
  midterm: {
    title: 'Entrega parcial',
    description: 'A turma mostra o que já funciona. Digam o que ajustar.',
  },
  final: {
    title: 'Entrega final',
    description: 'A turma entrega o resultado do semestre.',
  },
  closing: {
    title: 'Encerramento',
    description: 'O docente registra o que ficou com vocês, para a próxima turma não começar do zero.',
  },
};

/** Etapas em que a organização participa: entram nos avisos e no Início quando se aproximam. */
export const ORG_FACING_MILESTONES: MilestoneId[] = ['kickoff', 'midterm', 'final'];

export const ORGANIZATION_TYPES = ['Órgão público', 'Organização social', 'Coletivo', 'Unidade da UFPE'];

/** Sugestões de ritmo de reunião: um clique preenche, e o campo continua livre. */
export const MEETING_SUGGESTIONS = [
  'Reunião semanal de 30 minutos, por vídeo',
  'Reunião quinzenal de 1 hora, por vídeo',
  'Reunião quinzenal presencial ou por vídeo',
  'Reunião mensal presencial',
];
