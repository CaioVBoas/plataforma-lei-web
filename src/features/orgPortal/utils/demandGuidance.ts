import { formatShortDate } from '@/domain/calendar';
import { paths } from '@/routes/paths';
import type { OrgDemandSummary } from '../types';

export interface DemandGuidance {
  /** O que está acontecendo, em uma frase simples. */
  now: string;
  /** Se a vez é da organização: o botão fica em azul cheio e o cartão ganha o aviso "Sua vez". */
  yourTurn: boolean;
  action: { label: string; to: string };
}

/**
 * Para quem não está acostumado com sistemas: cada demanda diz o que está
 * acontecendo, se precisa de alguma coisa de vocês e qual botão apertar.
 */
export const demandGuidance = (demand: OrgDemandSummary): DemandGuidance => {
  const detail = demand.archived && demand.projectId ? paths.orgProject(demand.projectId) : paths.orgDemand(demand.id);
  const questions = demand.unanswered;

  switch (demand.stage) {
    case 'draft':
      return {
        now: 'Só vocês veem este rascunho. Terminem de escrever e enviem para o L.E.I.',
        yourTurn: true,
        action: { label: 'Continuar escrevendo', to: paths.orgEditDemand(demand.id) },
      };
    case 'needs-changes':
      return {
        now: 'O L.E.I. leu e pediu um ajuste. Vejam o que mudar e enviem de novo.',
        yourTurn: true,
        action: { label: 'Ver o que mudar', to: paths.orgEditDemand(demand.id) },
      };
    case 'in-review':
      return {
        now: `O L.E.I. está lendo desde ${formatShortDate(demand.date)}. Vocês não precisam fazer nada agora.`,
        yourTurn: false,
        action: { label: 'Ver a demanda', to: detail },
      };
    case 'open':
    case 'reserved': {
      const waiting =
        demand.stage === 'reserved' && demand.reservation
          ? `${demand.reservation.teacherName} está avaliando até ${formatShortDate(demand.reservation.until)}.`
          : 'Os docentes do CIn já podem ver e escolher.';
      if (questions > 0) {
        return {
          now: `${waiting} ${questions === 1 ? 'Uma pergunta espera' : `${questions} perguntas esperam`} resposta de vocês.`,
          yourTurn: true,
          action: { label: questions === 1 ? 'Responder a pergunta' : `Responder ${questions} perguntas`, to: paths.orgDemand(demand.id, 'perguntas') },
        };
      }
      return { now: `${waiting} Vocês não precisam fazer nada agora.`, yourTurn: false, action: { label: 'Ver a demanda', to: detail } };
    }
    case 'in-project':
      return {
        now: 'Uma turma está trabalhando nesta demanda. Acompanhem as etapas do projeto.',
        yourTurn: false,
        action: { label: 'Acompanhar o projeto', to: demand.projectId ? paths.orgProject(demand.projectId) : detail },
      };
    default:
      return {
        now: 'Projeto concluído. O resultado ficou registrado no perfil de vocês.',
        yourTurn: false,
        action: { label: 'Ver o resultado', to: demand.projectId ? paths.orgProject(demand.projectId) : detail },
      };
  }
};
