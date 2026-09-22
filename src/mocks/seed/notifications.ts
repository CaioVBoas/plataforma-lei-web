import type { AppNotification, NotificationPreferences } from '@/features/notifications/types';

type NotificationSeed = Omit<AppNotification, 'read' | 'archived' | 'urgent'> & { urgent?: boolean };

const SEED: NotificationSeed[] = [
  { id: 'n1', dayGroup: 'Hoje', type: 'demand', timeAgo: 'há 40 minutos', link: '/demandas/hc', context: 'Demanda · Hospital das Clínicas', text: 'Nova demanda compatível com Desenvolvimento de Software: Hospital das Clínicas, 84%.' },
  { id: 'n2', dayGroup: 'Hoje', type: 'reservation', timeAgo: 'há 2 horas', link: '/minhas-reservas', context: 'Reserva · NASE, Núcleo de Atenção à Saúde do Estudante', text: 'Sua reserva do NASE expira em 3 dias úteis. Depois a demanda volta ao cardápio.' },
  { id: 'n3', dayGroup: 'Hoje', type: 'partner', timeAgo: 'há 5 horas', link: '/demandas/nase', context: 'Demanda · NASE, Núcleo de Atenção à Saúde do Estudante', text: 'Ana Cláudia Souto, do NASE, respondeu sobre o formato das planilhas.' },
  { id: 'n4', dayGroup: 'Ontem', type: 'deadline', timeAgo: 'há 1 dia', link: '/minhas-reservas', context: 'Prazo · Vinculação de projetos', text: 'Vinculação de projetos ao SIGAA encerra em 12/09. Você tem uma reserva ainda sem disciplina.' },
  { id: 'n5', dayGroup: 'Ontem', type: 'team', timeAgo: 'há 1 dia', link: '/projetos/p2', context: 'Projeto · Histórico que acompanha', text: 'A Equipe 1 do projeto da Casa de Passagem está há 3 semanas sem registro de andamento.', urgent: true },
  { id: 'n6', dayGroup: 'Esta semana', type: 'invite', timeAgo: 'há 3 dias', link: '/demandas/recife', context: 'Demanda · Prefeitura do Recife', text: 'Thiago Albuquerque convidou você para coordenar junto a demanda da Prefeitura do Recife.' },
  { id: 'n7', dayGroup: 'Esta semana', type: 'deadline', timeAgo: 'há 4 dias', link: '/projetos/p1?aba=horas', context: 'Projeto · Estoque à vista', text: 'Confirmar a carga horária das equipes antes do relatório parcial.', urgent: true },
  { id: 'n8', dayGroup: 'Esta semana', type: 'demand', timeAgo: 'há 5 dias', link: '/demandas/recife', context: 'Demanda · Prefeitura do Recife', text: 'Nova demanda compatível com Desenvolvimento de Software: Prefeitura do Recife, 71%.' },
  { id: 'n9', dayGroup: 'Mais antigas', type: 'reservation', timeAgo: 'há 2 semanas', link: '/minhas-reservas', context: 'Reserva · Prefeitura do Recife', text: 'Sua reserva da Prefeitura do Recife expirou e voltou ao cardápio.' },
  { id: 'n10', dayGroup: 'Mais antigas', type: 'team', timeAgo: 'há 3 semanas', link: '/projetos/p1', context: 'Projeto · Estoque à vista', text: 'As duas equipes do projeto da Mesa Brasil registraram o primeiro andamento.' },
];

export const NOTIFICATIONS: AppNotification[] = SEED.map((seed) => ({ urgent: false, ...seed, read: false, archived: false }));

export const NOTIFICATION_PREFERENCES: NotificationPreferences = {
  demand: { inApp: true, email: true },
  reservation: { inApp: true, email: true },
  deadline: { inApp: true, email: false },
  team: { inApp: true, email: false },
};
