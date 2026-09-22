import type { AppNotification, NotificationPreferences } from '@/features/notifications/types';

type NotificationSeed = Omit<AppNotification, 'read' | 'archived' | 'urgent'> & { urgent?: boolean };

const SEED: NotificationSeed[] = [
  { id: 'n1', dayGroup: 'Hoje', type: 'demand', timeAgo: 'há 40 minutos', link: '/cardapio', context: 'Demanda · Hospital das Clínicas', text: 'Nova demanda compatível com Desenvolvimento de Software: Hospital das Clínicas, 84%.' },
  { id: 'n2', dayGroup: 'Hoje', type: 'reservation', timeAgo: 'há 2 horas', link: '/minhas-propostas', context: 'Reserva · NASE, Núcleo de Atenção à Saúde do Estudante', text: 'Sua reserva do NASE expira em 1 dia útil. Depois a demanda volta ao cardápio.' },
  { id: 'n3', dayGroup: 'Hoje', type: 'partner', timeAgo: 'há 5 horas', link: '/demandas/hc', context: 'Demanda · Hospital das Clínicas', text: 'Renata Vasconcelos, do Hospital das Clínicas, respondeu à sua pergunta sobre a base de dados.' },
  { id: 'n4', dayGroup: 'Ontem', type: 'deadline', timeAgo: 'há 1 dia', link: '/rascunhos', context: 'Propostas · 2 prontas para registro', text: 'Vinculação de projetos ao SIGAA encerra em 12/09. Duas propostas prontas aguardam registro.' },
  { id: 'n5', dayGroup: 'Ontem', type: 'team', timeAgo: 'há 1 dia', link: '/projetos/em-execucao', context: 'Projeto · Consolidação da fila de atendimento do NASE', text: 'A Equipe 1 do projeto do NASE está há 3 semanas sem registro de andamento.' },
  { id: 'n6', dayGroup: 'Esta semana', type: 'invite', timeAgo: 'há 3 dias', link: '/demandas/recife', context: 'Demanda · Prefeitura do Recife', text: 'Thiago Albuquerque convidou você para coordenar junto a demanda da Prefeitura do Recife.' },
  { id: 'n7', dayGroup: 'Esta semana', type: 'deadline', timeAgo: 'há 4 dias', link: '/projetos/p1', context: 'Projeto · Agendamento por perfil clínico e agenda médica', text: 'Confirmar a carga horária das equipes antes do relatório parcial.', urgent: true },
  { id: 'n8', dayGroup: 'Esta semana', type: 'demand', timeAgo: 'há 5 dias', link: '/cardapio', context: 'Demanda · Coletivo Griô, Várzea', text: 'Nova demanda compatível com Engenharia de Software 1: Coletivo Griô, 58%.' },
  { id: 'n9', dayGroup: 'Esta semana', type: 'partner', timeAgo: 'há 6 dias', link: '/demandas/nase', context: 'Demanda · NASE, Núcleo de Atenção à Saúde do Estudante', text: 'Ana Cláudia Souto anexou as três planilhas já anonimizadas.' },
  { id: 'n10', dayGroup: 'Mais antigas', type: 'reservation', timeAgo: 'há 2 semanas', link: '/minhas-propostas', context: 'Reserva · Prefeitura do Recife', text: 'Sua reserva da Prefeitura do Recife expirou e voltou ao cardápio.' },
  { id: 'n11', dayGroup: 'Mais antigas', type: 'team', timeAgo: 'há 3 semanas', link: '/projetos/p1', context: 'Projeto · Agendamento por perfil clínico e agenda médica', text: 'A Equipe 2 do Hospital das Clínicas registrou andamento depois de duas semanas em silêncio.' },
];

export const NOTIFICATIONS: AppNotification[] = SEED.map((seed) => ({ urgent: false, ...seed, read: false, archived: false }));

export const NOTIFICATION_PREFERENCES: NotificationPreferences = {
  demand: { inApp: true, email: true },
  reservation: { inApp: true, email: true },
  deadline: { inApp: true, email: false },
  team: { inApp: true, email: false },
};
