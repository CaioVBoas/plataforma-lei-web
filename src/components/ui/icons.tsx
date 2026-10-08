import type { ReactNode, SVGProps } from 'react';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
  strokeWidth?: number;
}

/**
 * Ícones de linha numa grade 24x24, com traço fino como os símbolos do sistema.
 * A cor vem sempre de currentColor, ou seja, da classe de texto de quem usa.
 */
const IconBase = ({ size = 18, strokeWidth = 1.7, children, ...props }: IconProps & { children: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flex: `0 0 ${size}px` }}
    {...props}
  >
    {children}
  </svg>
);

export const HomeIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 10.5L12 4l8 6.5V19a1 1 0 01-1 1h-4.5v-5.5h-5V20H5a1 1 0 01-1-1v-8.5z" />
  </IconBase>
);
export const TrayIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 13.5l2.2-7.1A1.5 1.5 0 017.6 5.3h8.8a1.5 1.5 0 011.4 1.1L20 13.5M4 13.5V18a1.5 1.5 0 001.5 1.5h13A1.5 1.5 0 0020 18v-4.5M4 13.5h4.5l1 2h5l1-2H20" />
  </IconBase>
);
export const FolderIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3.5 7.5A1.5 1.5 0 015 6h4.2l1.8 2H19a1.5 1.5 0 011.5 1.5v8A1.5 1.5 0 0119 19H5a1.5 1.5 0 01-1.5-1.5v-10z" />
  </IconBase>
);
export const BookIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 6.5C10.3 5.2 7.9 4.8 4.5 5v13c3.4-.2 5.8.2 7.5 1.5 1.7-1.3 4.1-1.7 7.5-1.5V5c-3.4-.2-5.8.2-7.5 1.5zM12 6.5v13" />
  </IconBase>
);
export const BuildingIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 20V5.5A1.5 1.5 0 016.5 4h7A1.5 1.5 0 0115 5.5V20M15 10h2.5A1.5 1.5 0 0119 11.5V20M3.5 20h17M8.5 8h3M8.5 11.5h3M8.5 15h3" />
  </IconBase>
);
export const QuestionIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.6a2.5 2.5 0 014.9.6c0 1.7-2.5 2.1-2.5 3.6M12 16.8v.01" />
  </IconBase>
);
export const ChevronRightIcon = (props: IconProps) => (
  <IconBase strokeWidth={2} {...props}>
    <path d="M9.5 6l6 6-6 6" />
  </IconBase>
);
export const ChevronLeftIcon = (props: IconProps) => (
  <IconBase strokeWidth={2} {...props}>
    <path d="M14.5 6l-6 6 6 6" />
  </IconBase>
);
export const ChevronDownIcon = (props: IconProps) => (
  <IconBase strokeWidth={2} {...props}>
    <path d="M6 9.5l6 6 6-6" />
  </IconBase>
);
export const CheckIcon = (props: IconProps) => (
  <IconBase strokeWidth={2.2} {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </IconBase>
);
export const CloseIcon = (props: IconProps) => (
  <IconBase strokeWidth={2} {...props}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </IconBase>
);
export const PlusIcon = (props: IconProps) => (
  <IconBase strokeWidth={2} {...props}>
    <path d="M12 5.5v13M5.5 12h13" />
  </IconBase>
);
export const MinusIcon = (props: IconProps) => (
  <IconBase strokeWidth={2} {...props}>
    <path d="M5.5 12h13" />
  </IconBase>
);
export const SearchIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="M15.5 15.5L20 20" />
  </IconBase>
);
export const CopyIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6.5a2 2 0 00-2-2h-7a2 2 0 00-2 2v7a2 2 0 002 2h2" />
  </IconBase>
);
export const MenuIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </IconBase>
);
export const ArrowUpRightIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7.5 16.5l9-9M9 7.5h7.5V15" />
  </IconBase>
);
/** Três pontos na vertical: o menu de ações de um item. */
export const MoreIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="5.5" r="1.1" fill="currentColor" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    <circle cx="12" cy="18.5" r="1.1" fill="currentColor" />
  </IconBase>
);
export const BellIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M6.5 16.5V11a5.5 5.5 0 0111 0v5.5l1.5 1.5H5l1.5-1.5zM10 20.5a2.2 2.2 0 004 0" />
  </IconBase>
);
export const LogoutIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14 4.5H6.5A1.5 1.5 0 005 6v12a1.5 1.5 0 001.5 1.5H14M10.5 12H20M16.5 8.5L20 12l-3.5 3.5" />
  </IconBase>
);
export const UserIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.5 20c1-3.6 4-5.5 7.5-5.5s6.5 1.9 7.5 5.5" />
  </IconBase>
);
/** Painel com a coluna da esquerda marcada: abrir e recolher a barra lateral. */
export const SidebarIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M9.5 4.5v15" />
  </IconBase>
);
export const ArrowRightIcon = (props: IconProps) => (
  <IconBase strokeWidth={2} {...props}>
    <path d="M5 12h14M13.5 6.5L19 12l-5.5 5.5" />
  </IconBase>
);
export const BookmarkIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 4.5h10A1.5 1.5 0 0118.5 6v14L12 16l-6.5 4V6A1.5 1.5 0 017 4.5z" />
  </IconBase>
);
export const MailIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </IconBase>
);
export const UsersIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="9" cy="8.5" r="3.3" />
    <path d="M3 19.5c.8-3.2 3.1-5 6-5s5.2 1.8 6 5M15.5 5.4a3.3 3.3 0 010 6.2M17.5 14.8c1.8.6 3 2.2 3.5 4.7" />
  </IconBase>
);
export const ChatIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 5.5h14A1.5 1.5 0 0120.5 7v8.5A1.5 1.5 0 0119 17h-7.5L7 20.5V17H5a1.5 1.5 0 01-1.5-1.5V7A1.5 1.5 0 015 5.5z" />
  </IconBase>
);
export const SendIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4.5 12L19.5 4.5l-4 15-3.8-6.2L4.5 12zM11.7 13.3l7.8-8.8" />
  </IconBase>
);
export const ImageIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <circle cx="9" cy="9.5" r="1.6" />
    <path d="M4 17.5l5-5 4 4 2.5-2.5 4.5 4.5" />
  </IconBase>
);
export const ClockIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </IconBase>
);
export const CalendarIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="4" y="5.5" width="16" height="14" rx="2" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </IconBase>
);
export const InfoIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8h.01" />
  </IconBase>
);
export const PencilIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14.5 5.5l4 4L9 19H5v-4l9.5-9.5zM12.5 7.5l4 4" />
  </IconBase>
);
export const LayersIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 4l8.5 4.5L12 13 3.5 8.5 12 4zM3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5" />
  </IconBase>
);
export const LightbulbIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0012 3z" />
  </IconBase>
);
export const SaveIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 4.5h11l3 3V19a.5.5 0 01-.5.5h-13A.5.5 0 015 19V4.5z" />
    <path d="M8 4.5v5h7v-5M8 19.5v-5.5h8v5.5" />
  </IconBase>
);
export const ArrowLeftIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </IconBase>
);
export const EyeIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);
export const ListIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" />
  </IconBase>
);
export const HandIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M8 13V5.5a1.5 1.5 0 013 0V11M11 10V4a1.5 1.5 0 013 0v6M14 10V5.5a1.5 1.5 0 013 0V14a6 6 0 01-6 6h-.5a6 6 0 01-4.6-2.2L4 15.2a1.6 1.6 0 012.4-2.1L8 14.5" />
  </IconBase>
);
export const AccessibilityIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="4.8" r="1.8" />
    <path d="M4.5 8.5c2.4.8 4.9 1.2 7.5 1.2s5.1-.4 7.5-1.2M12 9.7v4.3M12 14l-3 6.5M12 14l3 6.5" />
  </IconBase>
);
export const ZoomInIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L20 20M10.5 7.5v6M7.5 10.5h6" />
  </IconBase>
);
export const ZoomOutIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L20 20M7.5 10.5h6" />
  </IconBase>
);
export const UndoIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 14L4.5 9.5 9 5M4.5 9.5H14a5.5 5.5 0 010 11h-3" />
  </IconBase>
);
