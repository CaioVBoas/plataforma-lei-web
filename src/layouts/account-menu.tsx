import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { ChevronDownIcon } from '@/components/ui/icons';
import { useAccount } from '@/features/account/hooks/use-account';
import { useLogout } from '@/features/auth/hooks/use-auth';
import { usePopover } from '@/hooks/use-popover';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';

const MENU_ITEM = 'flex h-8 w-full items-center rounded-[5px] px-2.5 text-left text-sm hover:bg-accent hover:text-white';

export const AccountMenu = ({ onNavigate }: { onNavigate?: () => void }) => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: account } = useAccount();
  const { open, toggle, close, containerRef } = usePopover();

  if (!account) return null;

  const goToAccount = () => {
    close();
    onNavigate?.();
    navigate(paths.account);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={toggle}
        className={cn('flex h-11 w-full items-center gap-2.5 rounded-md px-2 text-left', open ? 'bg-fill-strong' : 'hover:bg-fill')}
      >
        <Avatar name={account.name} />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[13px] font-medium text-ink">{account.name}</span>
          <span className="block truncate text-[11px] text-ink-3">{account.email}</span>
        </span>
        <ChevronDownIcon size={13} className={cn('text-ink-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 bottom-12 left-0 z-40 rounded-md bg-surface p-1 shadow-popover animate-fade-in">
          <button type="button" role="menuitem" className={MENU_ITEM} onClick={goToAccount}>
            Minha conta
          </button>
          <div className="my-1 h-px bg-line" />
          <button type="button" role="menuitem" className={MENU_ITEM} onClick={logout}>
            Sair
          </button>
        </div>
      )}
    </div>
  );
};
