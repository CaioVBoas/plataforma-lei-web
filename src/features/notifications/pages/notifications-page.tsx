import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SelectMenu } from '@/components/ui/select-menu';
import { UnderlineTabs } from '@/components/ui/underline-tabs';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { cn } from '@/utils/cn';
import { NotificationIcon } from '../components/notification-icon';
import { NotificationPreferences } from '../components/notification-preferences';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications, useToggleNotificationArchive } from '../hooks/use-notifications';
import type { AppNotification, NotificationType } from '../types';
import { groupByDay } from '../utils/group-by-day';

type ListFilter = 'all' | 'unread' | 'archived';
type TypeFilter = 'all' | NotificationType;

const LIST_FILTERS: { value: ListFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'unread', label: 'Não lidas' },
  { value: 'archived', label: 'Arquivadas' },
];

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'demand', label: 'Demanda nova compatível' },
  { value: 'reservation', label: 'Reserva expirando' },
  { value: 'partner', label: 'Parceiro respondeu' },
  { value: 'deadline', label: 'Prazo institucional' },
  { value: 'team', label: 'Equipe sem registro' },
  { value: 'invite', label: 'Convite de outro docente' },
];

const EMPTY_COPY: Record<ListFilter, { title: string; description: string }> = {
  all: { title: 'Nada por aqui', description: 'Avisamos quando uma demanda compatível entrar, um parceiro responder ou um prazo se aproximar.' },
  unread: { title: 'Nenhuma não lida', description: 'Avisamos quando uma demanda compatível entrar, um parceiro responder ou um prazo se aproximar.' },
  archived: { title: 'Nada arquivado', description: 'Avisos que você arquivar saem da lista principal e ficam guardados aqui.' },
};

const LIST_RULES: Record<ListFilter, (notification: AppNotification) => boolean> = {
  all: (notification) => !notification.archived,
  unread: (notification) => !notification.archived && !notification.read,
  archived: (notification) => notification.archived,
};

const NotificationRow = ({ notification }: { notification: AppNotification }) => {
  const navigate = useNavigate();
  const markRead = useMarkNotificationRead();
  const toggleArchive = useToggleNotificationArchive();
  const muted = notification.read || notification.archived;

  const open = () => {
    markRead.mutate(notification.id);
    navigate(notification.link);
  };

  return (
    <li className={cn('group flex min-h-[72px] items-center gap-3.5 border-b border-n-200 py-3.5', notification.archived && 'opacity-65')}>
      <NotificationIcon type={notification.type} variant="outlined" />
      <div className="min-w-0 flex-1">
        <p className={cn('text-[15px] leading-normal', muted ? 'text-n-600' : 'text-n-800', notification.urgent && !notification.archived && 'font-medium')}>
          {notification.text}
        </p>
        <p className="mt-0.5 truncate text-[13px] text-n-600">{notification.context}</p>
      </div>
      {/*
        Tempo e ações ocupam o mesmo lugar. As ações ficam só transparentes (não ocultas),
        para continuarem alcançáveis pelo Tab e aparecerem no foco do teclado.
      */}
      <div className="relative flex shrink-0 items-center">
        <div className="flex items-center gap-[9px] transition-opacity group-focus-within:opacity-0 group-hover:opacity-0">
          <span className="text-[13px] whitespace-nowrap text-n-500">{notification.timeAgo}</span>
          {!muted && <span aria-label="Não lida" className="size-[7px] rounded-full bg-azul-500" />}
        </div>
        <div className="pointer-events-none absolute right-0 flex items-center gap-2.5 opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
          <Button variant="outline-muted" size="sm" onClick={() => toggleArchive.mutate(notification.id)}>
            {notification.archived ? 'Restaurar' : 'Arquivar'}
          </Button>
          <Button variant="outline-accent" size="sm" onClick={open}>
            Abrir
          </Button>
        </div>
      </div>
    </li>
  );
};

const NotificationCenter = ({ notifications }: { notifications: AppNotification[] }) => {
  const [listFilter, setListFilter] = useState<ListFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const markAllRead = useMarkAllNotificationsRead();

  const ofType = notifications.filter((notification) => typeFilter === 'all' || notification.type === typeFilter);
  const visible = ofType.filter(LIST_RULES[listFilter]);

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <UnderlineTabs
            label="Filtro de notificações"
            value={listFilter}
            onChange={setListFilter}
            items={LIST_FILTERS.map((filter) => ({ ...filter, count: ofType.filter(LIST_RULES[filter.value]).length }))}
          />
          <SelectMenu label="Tipo de notificação" shape="field" value={typeFilter} neutralValue="all" onChange={setTypeFilter} options={TYPE_OPTIONS} menuWidth={260} />
        </div>
        <Button variant="outline-accent" size="sm" onClick={() => markAllRead.mutate(undefined)}>
          Marcar todas como lidas
        </Button>
      </div>

      {visible.length > 0 ? (
        <div className="mb-12">
          {groupByDay(visible).map((group, index) => (
            <section key={group.day} aria-label={group.day}>
              <h2 className={cn('sticky top-0 z-5 border-b border-n-300 bg-n-0 py-2.5 text-[13px] font-medium text-n-500', index > 0 && 'mt-8')}>{group.day}</h2>
              <ul>
                {group.items.map((notification) => (
                  <NotificationRow key={notification.id} notification={notification} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="mb-12">
          <EmptyState title={EMPTY_COPY[listFilter].title} description={EMPTY_COPY[listFilter].description} />
        </div>
      )}

      <NotificationPreferences />
    </div>
  );
};

export const NotificationsPage = () => {
  usePageHeader('Notificações', 'Tudo que aconteceu nas suas demandas, projetos e prazos');
  const notificationsQuery = useNotifications();
  return <QueryView query={notificationsQuery}>{(notifications) => <NotificationCenter notifications={notifications} />}</QueryView>;
};
