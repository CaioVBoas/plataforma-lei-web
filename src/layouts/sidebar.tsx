import type { ReactNode } from 'react';
import { withIconVariant } from '@/components/ui/iconVariant';
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
  /** Quantos itens esperam por quem está logado, em número ao lado do nome. */
  badge?: number;
  onNavigate?: () => void;
}

const NavItem = ({ to, icon, label, active, collapsed, large, badge, onNavigate }: NavItemProps) => (
  <Link
    to={to}
    onClick={onNavigate}
    aria-current={active ? 'page' : undefined}
    title={collapsed ? label : undefined}
    className={cn(
      'flex items-center gap-2.5 rounded-lg transition-colors duration-150',
      large ? 'h-11 text-body' : 'h-9 text-small',
      collapsed ? 'justify-center' : 'px-3',
      active ? 'bg-brand font-semibold text-white' : 'text-ink-2 hover:bg-brand-50 hover:text-brand-strong',
    )}
  >
    {/* A página atual leva o ícone cheio (bold); as outras, o de linha. */}
    <span className={cn('flex', active ? 'text-white' : 'text-ink-3')}>{withIconVariant(icon, active)}</span>
    <span className={collapsed ? 'sr-only' : 'min-w-0 flex-1 truncate'}>
      {label}
      {badge ? <span className="sr-only">, {badge} esperando</span> : null}
    </span>
    {badge && !collapsed ? (
      <span aria-hidden="true" className={cn('min-w-6 rounded-full px-1.5 text-center text-small font-semibold tabular-nums', active ? 'bg-white text-brand-strong' : 'bg-accent text-white')}>
        {badge}
      </span>
    ) : null}
  </Link>
);

export interface NavEntry {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

/** O Início da organização é o prefixo de todas as rotas dela, então só vale como ativo na própria página. */
const isActive = (pathname: string, to: string, homePath: string) => (to === homePath ? pathname === to : pathname.startsWith(to));

/** Um grupo da barra, com o nome em caixa alta e uma linha separando do grupo de cima. */
export interface NavSection {
  title: string;
  items: NavEntry[];
}

export interface SidebarConfig {
  /** Nome acessível da navegação principal. */
  label: string;
  homePath: string;
  navigation: NavSection[];
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

      <nav aria-label={label} className="flex flex-col">
        {navigation.map((section, index) => (
          <div
            key={section.title}
            role="group"
            aria-label={section.title}
            className={cn('flex flex-col gap-1', index > 0 && 'mt-5 border-t border-line pt-5')}
          >
            {collapsed ? null : (
              <p aria-hidden="true" className="mb-2 px-3 text-overline text-ink-3">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <NavItem key={item.to} {...item} active={isActive(pathname, item.to, homePath)} collapsed={collapsed} large={large} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-line pt-4">
        {footer.map((item) => (
          <NavItem key={item.to} {...item} active={item.to !== paths.landing && isActive(pathname, item.to, homePath)} collapsed={collapsed} large={large} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};
