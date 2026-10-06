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
  /** Ativo em petróleo claro com texto petróleo, em vez do bloco petróleo cheio. */
  soft?: boolean;
  onNavigate?: () => void;
}

const NavItem = ({ to, icon, label, active, collapsed, soft, onNavigate }: NavItemProps) => (
  <Link
    to={to}
    onClick={onNavigate}
    aria-current={active ? 'page' : undefined}
    title={collapsed ? label : undefined}
    className={cn(
      'flex items-center gap-2.5 rounded-lg text-sm transition-colors duration-150',
      soft ? 'h-10 text-[15px]' : 'h-9',
      collapsed ? 'justify-center' : 'px-3',
      active
        ? soft
          ? 'bg-brand-50 font-semibold text-brand-strong'
          : 'bg-brand font-semibold text-white'
        : 'text-ink-2 hover:bg-brand-50 hover:text-brand-strong',
    )}
  >
    <span className={active ? (soft ? 'text-brand' : 'text-white') : 'text-ink-3'}>{icon}</span>
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

export interface NavSection {
  /** Rótulo pequeno em caixa alta acima do grupo. */
  title: string;
  items: NavEntry[];
}

export interface SidebarConfig {
  /** Nome acessível da navegação principal. */
  label: string;
  homePath: string;
  navigation: NavEntry[];
  /** Links de apoio no pé da barra. O portal público nunca aparece como ativo. */
  footer: NavEntry[];
  /** Linha pequena abaixo do logo, dizendo de qual portal é. */
  subtitle?: string;
  /** Grupos com título, abaixo da navegação principal. Com eles, o ativo fica em petróleo claro. */
  sections?: NavSection[];
  /** Quem está logado, no pé da barra. Recebe se a barra está recolhida. */
  user?: (collapsed: boolean) => ReactNode;
}

interface SidebarProps extends SidebarConfig {
  /** Só ícones, para dar mais largura às telas. */
  collapsed?: boolean;
  onNavigate?: () => void;
}

export const Sidebar = ({ label, homePath, navigation, footer, subtitle, sections, user, collapsed, onNavigate }: SidebarProps) => {
  const { pathname } = useLocation();
  const soft = Boolean(sections);
  const activeOf = (to: string) => to !== paths.landing && isActive(pathname, to, homePath);

  return (
    <div className={cn('flex h-full flex-col pt-3 pb-3', collapsed ? 'px-2.5' : 'px-3')}>
      <Link to={homePath} onClick={onNavigate} className={cn('mb-6 flex min-h-10 flex-col justify-center', collapsed ? 'items-center' : 'px-2.5')}>
        {collapsed ? <BrandSymbol /> : <BrandMark />}
        {subtitle && !collapsed && <span className="mt-1 text-[12px] text-ink-3">{subtitle}</span>}
      </Link>

      <nav aria-label={label} className="flex flex-col gap-0.5">
        {navigation.map((item) => (
          <NavItem key={item.to} {...item} active={isActive(pathname, item.to, homePath)} collapsed={collapsed} soft={soft} onNavigate={onNavigate} />
        ))}
        {sections?.map((section) => (
          <div key={section.title} className="mt-5 flex flex-col gap-0.5">
            {collapsed ? (
              <span aria-hidden="true" className="mx-2 mb-1.5 h-px bg-line" />
            ) : (
              <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.06em] text-ink-3 uppercase">{section.title}</p>
            )}
            {section.items.map((item) => (
              <NavItem key={item.to} {...item} active={activeOf(item.to)} collapsed={collapsed} soft onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      {footer.length > 0 && (
        <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-3">
          {footer.map((item) => (
            <NavItem key={item.to} {...item} active={activeOf(item.to)} collapsed={collapsed} soft={soft} onNavigate={onNavigate} />
          ))}
        </div>
      )}
      {user && <div className={cn('border-t border-line pt-3', footer.length === 0 && 'mt-auto')}>{user(Boolean(collapsed))}</div>}
    </div>
  );
};
