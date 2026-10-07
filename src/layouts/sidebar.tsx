import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandMark, BrandSymbol } from '@/components/ui/brandMark';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  collapsed?: boolean;
  /** Alvo e texto maiores, para quem tem pouca prática com o mouse. */
  large?: boolean;
  onNavigate?: () => void;
}

const NavItem = ({ to, icon, label, active, collapsed, large, onNavigate }: NavItemProps) => (
  <Link
    to={to}
    onClick={onNavigate}
    aria-current={active ? 'page' : undefined}
    title={collapsed ? label : undefined}
    className={cn(
      'flex items-center gap-2.5 rounded-lg transition-colors duration-150',
      large ? 'h-11 text-[15px]' : 'h-9 text-sm',
      collapsed ? 'justify-center' : 'px-3',
      active ? 'bg-brand font-semibold text-white' : 'text-ink-2 hover:bg-brand-50 hover:text-brand-strong',
    )}
  >
    <span className={active ? 'text-white' : 'text-ink-3'}>{icon}</span>
    <span className={collapsed ? 'sr-only' : 'min-w-0 flex-1 truncate'}>{label}</span>
  </Link>
);

export interface NavEntry {
  to: string;
  label: string;
  icon: ReactNode;
}

/** O Início da organização é o prefixo de todas as rotas dela, então só vale como ativo na própria página. */
const isActive = (pathname: string, to: string, homePath: string) => (to === homePath ? pathname === to : pathname.startsWith(to));

export interface SidebarConfig {
  /** Nome acessível da navegação principal. */
  label: string;
  homePath: string;
  navigation: NavEntry[];
  /** Links de apoio no pé da barra. O portal público nunca aparece como ativo. */
  footer: NavEntry[];
  /** Itens maiores, com ícone de 20px. */
  large?: boolean;
}

interface SidebarProps extends SidebarConfig {
  /** Só ícones, para dar mais largura às telas. */
  collapsed?: boolean;
  onNavigate?: () => void;
}

export const Sidebar = ({ label, homePath, navigation, footer, large, collapsed, onNavigate }: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <div className={cn('flex h-full flex-col pt-3 pb-3', collapsed ? 'px-2.5' : 'px-3')}>
      <Link to={homePath} onClick={onNavigate} className={cn('mb-6 flex h-10 items-center', collapsed ? 'justify-center' : 'px-2.5')}>
        {collapsed ? <BrandSymbol /> : <BrandMark />}
      </Link>

      <nav aria-label={label} className="flex flex-col gap-0.5">
        {navigation.map((item) => (
          <NavItem key={item.to} {...item} active={isActive(pathname, item.to, homePath)} collapsed={collapsed} large={large} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-3">
        {footer.map((item) => (
          <NavItem key={item.to} {...item} active={item.to !== paths.landing && isActive(pathname, item.to, homePath)} collapsed={collapsed} large={large} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};
