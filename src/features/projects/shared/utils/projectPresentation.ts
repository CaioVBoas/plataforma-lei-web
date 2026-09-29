import { formatRelativeDays, formatShortDate } from '@/domain/calendar';
import type { ProjectStage } from '@/domain/projectLifecycle';
import type { IsoDate, Milestone, MilestoneId, OutcomeAdoption } from '@/domain/types';
import type { StatusTone } from '@/components/ui/statusLabel';

interface MilestoneCopy {
  title: string;
  /** O que fazer, dito para quem nunca usou a plataforma. */
  description: string;
  action: string;
  /** Confirmação depois de concluir. Escrita por etapa porque o gênero do título varia. */
  doneMessage: string;
}

export const MILESTONE_COPY: Record<MilestoneId, MilestoneCopy> = {
  plan: {
    title: 'Revisar o plano',
    description: 'O plano já vem escrito a partir da demanda. Leia, ajuste o que precisar e confirme.',
    action: 'Revisar o plano',
    doneMessage: 'Plano confirmado. O próximo passo é a reunião de abertura.',
  },
  kickoff: {
    title: 'Reunião de abertura',
    description:
      'Encontre a organização para combinar escopo, calendário de reuniões, regras de sigilo e o que a turma entrega no fim: protótipo ou prova de conceito, não um sistema pronto.',
    action: 'Registrar reunião',
    doneMessage: 'Reunião de abertura registrada.',
  },
  sigaa: {
    title: 'Registro no SIGAA',
    description: 'Copie as seções do plano para o cadastro de ação de extensão no SIGAA e informe a data do registro.',
    action: 'Informar registro',
    doneMessage: 'Registro no SIGAA informado. O projeto está em andamento.',
  },
  midterm: {
    title: 'Entrega parcial',
    description: 'A turma mostra à organização o que já funciona. Registre como ela recebeu.',
    action: 'Registrar entrega parcial',
    doneMessage: 'Entrega parcial registrada.',
  },
  final: {
    title: 'Entrega final',
    description: 'A turma entrega o resultado do semestre à organização.',
    action: 'Registrar entrega final',
    doneMessage: 'Entrega final registrada.',
  },
  closing: {
    title: 'Encerramento',
    description:
      'Conte em poucas linhas o que ficou com a organização. O texto entra no histórico dela e serve de base para o relatório final no SIGAA, que libera as horas dos estudantes.',
    action: 'Encerrar projeto',
    doneMessage: 'Projeto concluído. Falta enviar o relatório final no SIGAA para liberar as horas.',
  },
};

export const STAGE_COPY: Record<ProjectStage, { label: string; tone: StatusTone }> = {
  planning: { label: 'Planejamento', tone: 'accent' },
  running: { label: 'Em andamento', tone: 'positive' },
  done: { label: 'Concluído', tone: 'neutral' },
};

export const ADOPTION_COPY: Record<OutcomeAdoption, string> = {
  'in-use': 'A organização usa o que foi entregue',
  partial: 'A organização usa parte do que foi entregue',
  'not-used': 'A organização não usa o que foi entregue',
};

/** "Feito em 6 ago 2026", "Até 31 ago 2026, em 7 dias", "Atrasada desde 28 ago 2026" */
export const milestoneDateLine = (milestone: Milestone, today: IsoDate, isNext: boolean) => {
  if (milestone.doneAt) return `Feito em ${formatShortDate(milestone.doneAt)}`;
  if (isNext && milestone.dueAt < today) return `Atrasada desde ${formatShortDate(milestone.dueAt)}`;
  if (isNext) return `Até ${formatShortDate(milestone.dueAt)}, ${formatRelativeDays(today, milestone.dueAt)}`;
  return `Previsto para ${formatShortDate(milestone.dueAt)}`;
};
