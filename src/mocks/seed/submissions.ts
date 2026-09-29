import type { DemandSubmission } from '@/domain/types';

const HC = { id: 'hospital-das-clinicas', name: 'Hospital das Clínicas', type: 'Órgão público' };

/**
 * Pedidos do Hospital das Clínicas que ainda não estão no cardápio: um
 * devolvido pelo L.E.I. para ajuste, um na triagem e um rascunho pela metade.
 */
export const SUBMISSIONS: DemandSubmission[] = [
  {
    id: 'hc-exames',
    organization: HC,
    stage: 'needs-changes',
    title: 'Agenda de exames de imagem',
    problem: 'Pacientes esperam meses por ressonância enquanto horários do aparelho ficam vagos por falta de confirmação.',
    description:
      'O setor de imagem marca exames por telefone e confirma um a um na véspera. Quando o paciente não atende, o horário fica vago. Ao mesmo tempo, queremos um aplicativo para o paciente acompanhar o resultado do exame e um painel de produtividade dos técnicos.',
    affectedPublic: 'Pacientes na fila de ressonância e tomografia e a equipe do setor de imagem',
    expectedOutcome: 'Uma forma de confirmar os exames com antecedência e ocupar os horários que ficam vagos.',
    skills: ['Engenharia de software', 'Desenvolvimento móvel'],
    constraints: ['sensitive-data'],
    meetingCadence: 'Reunião quinzenal de 1 hora, por vídeo',
    offers: ['Agenda de três meses, anonimizada', 'Conversa com a equipe de marcação'],
    references: [],
    updatedAt: '2026-08-14',
    submittedAt: '2026-08-14',
    review: {
      note: 'O problema da confirmação está muito claro e cabe numa turma. O aplicativo de resultados e o painel dos técnicos são outros dois projetos. Sugiro deixar só a confirmação e os horários vagos nesta demanda; os outros dois podem virar demandas separadas.',
      by: 'Kiev Santos da Gama, L.E.I.',
      at: '2026-08-19',
    },
  },
  {
    id: 'hc-alta',
    organization: HC,
    stage: 'in-review',
    title: 'Acompanhamento depois da alta',
    problem: 'Pacientes voltam ao hospital com complicações que um contato na primeira semana depois da alta teria evitado.',
    description:
      'A equipe de enfermagem liga para alguns pacientes depois da alta, quando dá tempo, e anota em papel. Não há critério de quem ligar primeiro nem registro do que foi dito. Queremos priorizar quem tem mais risco e registrar os contatos.',
    affectedPublic: 'Pacientes que recebem alta da clínica médica e a equipe de enfermagem',
    expectedOutcome: 'Uma lista diária de quem ligar, por risco, e um registro simples do contato.',
    skills: ['Levantamento de requisitos', 'Banco de dados', 'LGPD e privacidade'],
    constraints: ['sensitive-data', 'confidential'],
    meetingCadence: 'Reunião quinzenal de 1 hora, por vídeo',
    offers: ['Planilha de altas de 2025, anonimizada', 'Acompanhar um turno das ligações'],
    references: [],
    updatedAt: '2026-08-21',
    submittedAt: '2026-08-21',
  },
  {
    id: 'hc-leitos',
    organization: HC,
    stage: 'draft',
    title: 'Painel de ocupação de leitos',
    problem: 'A regulação descobre que não há leito livre só depois de ligar para cada enfermaria.',
    description: '',
    affectedPublic: '',
    expectedOutcome: '',
    skills: [],
    constraints: [],
    meetingCadence: '',
    offers: [],
    references: [],
    updatedAt: '2026-08-23',
  },
];
