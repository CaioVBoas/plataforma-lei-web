import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/feedback/toast-context';
import { Avatar } from '@/components/ui/avatar';
import { ChevronDownIcon } from '@/components/ui/icons';
import { useCurrentUser, useLogout } from '@/features/auth/hooks/use-auth';
import { usePopover } from '@/hooks/use-popover';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { HELP_MESSAGE } from './help-message';

const MENU_ITEM = 'w-full rounded-lg px-2.5 py-[9px] text-left text-[13px] hover:bg-n-50';

export const AccountMenu = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const logout = useLogout();
  const { data: user } = useCurrentUser();
  const { open, toggle, close, containerRef } = usePopover();

  if (!user) return null;

  return (
    <div ref={containerRef} className="relative ml-1 border-l border-n-200 pl-2">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={toggle}
        className={cn('flex h-12 items-center gap-2 rounded-xl px-2', open ? 'bg-azul-50' : 'hover:bg-n-50')}
      >
        <Avatar name={user.name} strong />
        <span className="text-left leading-tight">
          <span className="block text-[13px] font-medium text-n-800">{user.name}</span>
          <span className="block text-[11px] text-n-500">{user.affiliation}</span>
        </span>
        <ChevronDownIcon size={12} className="text-n-500" />
      </button>

      {open && (
        <div role="menu" className="absolute top-12 right-0 z-60 w-[260px] overflow-hidden rounded-lg border border-n-200 bg-n-0 shadow-popover animate-painel-entra">
          <div className="flex items-start gap-[11px] border-b border-n-200 px-4 py-3.5">
            <Avatar name={user.name} size="lg" strong />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-n-800">{user.name}</span>
              <span className="mt-px block truncate text-xs text-n-500">{user.email}</span>
              <span className="mt-1.5 block text-[11px] font-semibold text-azul-800">{user.roleLabel}</span>
            </span>
          </div>
          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              className={cn(MENU_ITEM, 'text-n-700')}
              onClick={() => {
                close();
                navigate(paths.account);
              }}
            >
              Meu perfil
            </button>
            <button
              type="button"
              role="menuitem"
              className={cn(MENU_ITEM, 'text-n-700')}
              onClick={() => {
                close();
                toast.show(HELP_MESSAGE);
              }}
            >
              Ajuda
            </button>
          </div>
          <div className="h-px bg-n-200" />
          <div className="p-1.5">
            <button type="button" role="menuitem" className={cn(MENU_ITEM, 'font-medium text-erro-forte')} onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
