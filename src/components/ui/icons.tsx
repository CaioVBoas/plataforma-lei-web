import type { SVGProps } from 'react';
import { SOLAR, type SolarStyle } from './solarIcons';

export type IconVariant = SolarStyle;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /**
   * Tamanho em px, pela hierarquia: 16 dentro de texto e campos, 20 em botões
   * e itens de lista, 24 na navegação (o padrão), 32 em destaques e cartões
   * de recurso, 48 a 64 em estados vazios.
   */
  size?: number;
  /**
   * linear é o padrão de toda a interface; bold marca o ativo ou escolhido
   * (a página atual na barra lateral); duotone é para destaques e estados
   * vazios. No máximo dois estilos juntos na mesma área.
   */
  variant?: IconVariant;
  strokeWidth?: number;
}

/**
 * Ícones Solar (480 Design) numa grade 24x24. A cor vem sempre de
 * currentColor, ou seja, é a mesma do texto que o ícone acompanha; no
 * duotone, a segunda camada é a mesma cor com transparência.
 */
const SolarIcon = ({ glyph, size = 24, variant = 'linear', strokeWidth = 1.5, style, ...props }: IconProps & { glyph: keyof typeof SOLAR }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    aria-hidden="true"
    data-icon=""
    style={{ flex: `0 0 ${size}px`, ...style }}
    {...props}
    dangerouslySetInnerHTML={{ __html: SOLAR[glyph][variant] }}
  />
);

export const HomeIcon = (props: IconProps) => <SolarIcon glyph="Home" {...props} />;
export const TrayIcon = (props: IconProps) => <SolarIcon glyph="Tray" {...props} />;
export const FolderIcon = (props: IconProps) => <SolarIcon glyph="Folder" {...props} />;
export const BookIcon = (props: IconProps) => <SolarIcon glyph="Book" {...props} />;
export const BuildingIcon = (props: IconProps) => <SolarIcon glyph="Building" {...props} />;
export const QuestionIcon = (props: IconProps) => <SolarIcon glyph="Question" {...props} />;
export const ChevronRightIcon = (props: IconProps) => <SolarIcon glyph="ChevronRight" {...props} />;
export const ChevronLeftIcon = (props: IconProps) => <SolarIcon glyph="ChevronLeft" {...props} />;
export const ChevronDownIcon = (props: IconProps) => <SolarIcon glyph="ChevronDown" {...props} />;
export const CheckIcon = (props: IconProps) => <SolarIcon glyph="Check" {...props} />;
export const CloseIcon = (props: IconProps) => <SolarIcon glyph="Close" {...props} />;
export const PlusIcon = (props: IconProps) => <SolarIcon glyph="Plus" {...props} />;
export const MinusIcon = (props: IconProps) => <SolarIcon glyph="Minus" {...props} />;
export const SearchIcon = (props: IconProps) => <SolarIcon glyph="Search" {...props} />;
export const CopyIcon = (props: IconProps) => <SolarIcon glyph="Copy" {...props} />;
export const MenuIcon = (props: IconProps) => <SolarIcon glyph="Menu" {...props} />;
export const ArrowUpRightIcon = (props: IconProps) => <SolarIcon glyph="ArrowUpRight" {...props} />;
/** Três pontos: o menu de ações de um item. */
export const MoreIcon = (props: IconProps) => <SolarIcon glyph="More" {...props} />;
export const BellIcon = (props: IconProps) => <SolarIcon glyph="Bell" {...props} />;
export const LogoutIcon = (props: IconProps) => <SolarIcon glyph="Logout" {...props} />;
export const UserIcon = (props: IconProps) => <SolarIcon glyph="User" {...props} />;
export const SidebarIcon = (props: IconProps) => <SolarIcon glyph="Sidebar" {...props} />;
export const ArrowRightIcon = (props: IconProps) => <SolarIcon glyph="ArrowRight" {...props} />;
export const BookmarkIcon = (props: IconProps) => <SolarIcon glyph="Bookmark" {...props} />;
export const MailIcon = (props: IconProps) => <SolarIcon glyph="Mail" {...props} />;
export const UsersIcon = (props: IconProps) => <SolarIcon glyph="Users" {...props} />;
export const ChatIcon = (props: IconProps) => <SolarIcon glyph="Chat" {...props} />;
export const SendIcon = (props: IconProps) => <SolarIcon glyph="Send" {...props} />;
export const ImageIcon = (props: IconProps) => <SolarIcon glyph="Image" {...props} />;
export const ClockIcon = (props: IconProps) => <SolarIcon glyph="Clock" {...props} />;
export const CalendarIcon = (props: IconProps) => <SolarIcon glyph="Calendar" {...props} />;
export const InfoIcon = (props: IconProps) => <SolarIcon glyph="Info" {...props} />;
export const PencilIcon = (props: IconProps) => <SolarIcon glyph="Pencil" {...props} />;
export const LayersIcon = (props: IconProps) => <SolarIcon glyph="Layers" {...props} />;
export const LightbulbIcon = (props: IconProps) => <SolarIcon glyph="Lightbulb" {...props} />;
export const SaveIcon = (props: IconProps) => <SolarIcon glyph="Save" {...props} />;
export const ArrowLeftIcon = (props: IconProps) => <SolarIcon glyph="ArrowLeft" {...props} />;
export const EyeIcon = (props: IconProps) => <SolarIcon glyph="Eye" {...props} />;
export const ListIcon = (props: IconProps) => <SolarIcon glyph="List" {...props} />;
export const HandIcon = (props: IconProps) => <SolarIcon glyph="Hand" {...props} />;
export const AccessibilityIcon = (props: IconProps) => <SolarIcon glyph="Accessibility" {...props} />;
export const ZoomInIcon = (props: IconProps) => <SolarIcon glyph="ZoomIn" {...props} />;
export const ZoomOutIcon = (props: IconProps) => <SolarIcon glyph="ZoomOut" {...props} />;
export const UndoIcon = (props: IconProps) => <SolarIcon glyph="Undo" {...props} />;
export const DoubleCheckIcon = (props: IconProps) => <SolarIcon glyph="DoubleCheck" {...props} />;
