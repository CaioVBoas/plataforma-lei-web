import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { ChevronDownIcon, LogoutIcon, UserIcon } from '@/components/ui/icons';
import { useLogout } from '@/features/auth/useAuth';
import { usePopover } from '@/hooks/usePopover';
import { cn } from '@/utils/cn';

const MENU_ITEM = 'flex h-9 w-full items-center gap-2.5 rounded-[5px] px-2.5 text-left text-sm';

interface AccountMenuProps {
  name: string;
  email: string;
  photo?: string;
  /** Página da conta ou do perfil, e o nome dela no menu. */
  accountPath: string;
  accountLabel: string;
  /** No pé da barra lateral: cartão com nome e uma segunda linha, e o menu abre para cima. */
  inSidebar?: boolean;
  /** Barra lateral recolhida: só o avatar. */
  collapsed?: boolean;
  /** Segunda linha do cartão na barra lateral, como o nome da organização. */
  detail?: string;
}

/** A conta fica no canto da barra superior: quem está logado, a página da conta e sair. */
export const AccountMenu = ({ name, email, photo, accountPath, accountLabel, inSidebar, collapsed, detail }: AccountMenuProps) => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { open, toggle, close, containerRef } = usePopover();

  const goToAccount = () => {
    close();
    navigate(accountPath);
  };

  return (
    <div ref={containerRef} className="relative">
      {inSidebar ? (
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={`Conta de ${name}`}
          title={collapsed ? name : undefined}
          onClick={toggle}
          className={cn('flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left', collapsed && 'justify-center', open ? 'bg-fill' : 'hover:bg-fill')}
        >
          <Avatar name={name} photo={photo} />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-ink">{name}</span>
                <span className="block truncate text-[12px] text-ink-3">{detail ?? accountLabel}</span>
              </span>
              <ChevronDownIcon size={13} className={cn('shrink-0 text-ink-3 transition-transform', !open && 'rotate-180')} />
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={`Conta de ${name}`}
          onClick={toggle}
          className={cn('flex h-10 items-center gap-2 rounded-md pr-2 pl-1 text-left', open ? 'bg-fill' : 'hover:bg-fill')}
        >
          <Avatar name={name} photo={photo} />
          <span className="hidden max-w-[160px] truncate text-[13px] font-medium text-ink sm:block">{name}</span>
          <ChevronDownIcon size={13} className={cn('hidden text-ink-3 transition-transform sm:block', open && 'rotate-180')} />
        </button>
      )}

      {open && (
        <div
          role="menu"
          className={cn('absolute z-40 w-60 rounded-md bg-surface p-1 shadow-popover animate-fade-in', inSidebar ? 'bottom-full left-0 mb-2' : 'top-12 right-0')}
        >
          <div className="px-2.5 pt-2 pb-2.5">
            <p className="truncate text-[13px] font-semibold text-ink">{name}</p>
            <p className="truncate text-[12px] text-ink-3">{email}</p>
          </div>
          <div className="mb-1 h-px bg-line" />
          <button type="button" role="menuitem" className={cn(MENU_ITEM, 'text-ink hover:bg-brand-50 hover:text-brand-strong')} onClick={goToAccount}>
            <UserIcon size={16} />
            {accountLabel}
          </button>
          <button type="button" role="menuitem" className={cn(MENU_ITEM, 'text-critical hover:bg-critical-soft')} onClick={logout}>
            <LogoutIcon size={16} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
};
