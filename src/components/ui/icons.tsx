import type { ReactNode, SVGProps } from 'react';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
  strokeWidth?: number;
}

/**
 * Todos os ícones seguem a mesma grade 24x24 com traço em currentColor,
 * então a cor vem sempre da classe de texto de quem os usa.
 */
const IconBase = ({ size = 16, strokeWidth = 2, children, ...props }: IconProps & { children: ReactNode }) => (
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

export const SearchIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" />
  </IconBase>
);
export const ChevronDownIcon = (props: IconProps) => (
  <IconBase strokeWidth={2.4} {...props}>
    <path d="M6 9l6 6 6-6" />
  </IconBase>
);
export const ChevronUpIcon = (props: IconProps) => (
  <IconBase strokeWidth={2.4} {...props}>
    <path d="M6 15l6-6 6 6" />
  </IconBase>
);
export const ChevronLeftIcon = (props: IconProps) => (
  <IconBase strokeWidth={2.2} {...props}>
    <path d="M14 6l-6 6 6 6" />
  </IconBase>
);
export const ChevronRightIcon = (props: IconProps) => (
  <IconBase strokeWidth={2.2} {...props}>
    <path d="M10 6l6 6-6 6" />
  </IconBase>
);
export const CloseIcon = (props: IconProps) => (
  <IconBase strokeWidth={2.6} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </IconBase>
);
export const CheckIcon = (props: IconProps) => (
  <IconBase strokeWidth={3} {...props}>
    <path d="M4 12.5l5 5L20 6.5" />
  </IconBase>
);
export const PlusIcon = (props: IconProps) => (
  <IconBase strokeWidth={2.4} {...props}>
    <path d="M12 5v14M5 12h14" />
  </IconBase>
);
export const MinusIcon = (props: IconProps) => (
  <IconBase strokeWidth={2.4} {...props}>
    <path d="M5 12h14" />
  </IconBase>
);
export const ClockIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="8.5" /><path d="M12 8v4.5l3 2" />
  </IconBase>
);
export const BellIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M6.5 17V10a5.5 5.5 0 1111 0v7M4.5 17h15M10 20a2 2 0 004 0" />
  </IconBase>
);
export const CheckCircleIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <circle cx="12" cy="12" r="9" /><path d="M8 12.4l2.6 2.6L16 9.6" />
  </IconBase>
);
export const MinusCircleIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <circle cx="12" cy="12" r="9" /><path d="M9 12h6" />
  </IconBase>
);
export const CalendarIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M8 3.5v4M16 3.5v4M4 10h16" />
  </IconBase>
);
export const HexagonIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <path d="M12 3.5l8 4.5v8l-8 4.5-8-4.5v-8l8-4.5z" />
  </IconBase>
);
export const PersonIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <circle cx="12" cy="8" r="3.4" /><path d="M5.5 19.5c0-3.3 2.9-5.6 6.5-5.6s6.5 2.3 6.5 5.6" />
  </IconBase>
);
export const MapPinIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <path d="M12 21s6.5-5.7 6.5-11A6.5 6.5 0 005.5 10c0 5.3 6.5 11 6.5 11z" /><circle cx="12" cy="10" r="2.3" />
  </IconBase>
);
export const ExternalLinkIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
  </IconBase>
);
export const WarningIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <path d="M12 4.5l8.5 15h-17l8.5-15z" /><path d="M12 10v4M12 17h.01" />
  </IconBase>
);
export const MessageIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <path d="M4 5h16v11H9l-5 4V5z" />
  </IconBase>
);
export const PencilIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 20h4l10-10-4-4L4 16v4z" />
  </IconBase>
);
export const ArrowUpRightIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 17L17 7M17 7h-7M17 7v7" />
  </IconBase>
);
export const CopyIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M15 6.5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2h.5" />
  </IconBase>
);
export const FileIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 3h7l4 4v14H7V3z" />
  </IconBase>
);
export const InfoIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="8.5" /><path d="M12 8v.01M12 11v5" />
  </IconBase>
);
export const ListIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <path d="M4 6.5h16M4 12h16M4 17.5h10" />
  </IconBase>
);
export const BookmarkIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M6 4h12v16l-6-4-6 4V4z" />
  </IconBase>
);
export const FolderIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
  </IconBase>
);
export const BookIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 5.5A1.5 1.5 0 015.5 4H19v16H5.5A1.5 1.5 0 014 18.5v-13z" /><path d="M9 4v16" />
  </IconBase>
);
export const BuildingIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 20V7l7-3v16M11 20h9V11l-9-3" /><path d="M14.5 13.5h2M14.5 17h2" />
  </IconBase>
);
export const DocumentIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 3h7l4 4v14H7V3z" /><path d="M10 12h5M10 16h5" />
  </IconBase>
);
export const AccountIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
  </IconBase>
);
export const HelpIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="8.5" /><path d="M9.8 9.5c.2-1.2 1.1-2 2.2-2 1.3 0 2.2.8 2.2 2 0 1.3-1.4 1.6-1.9 2.4-.2.3-.3.7-.3 1.1M12 16.5h.01" />
  </IconBase>
);
export const MenuListIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 6h16M4 12h16M4 18h9" /><circle cx="19.5" cy="18" r="2" fill="currentColor" stroke="none" />
  </IconBase>
);
export const ChartIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
  </IconBase>
);
export const HomeIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 20V8l7-4 7 4v12M9 20v-5h4v5M4 20h16" />
  </IconBase>
);
export const CirclePauseIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <circle cx="12" cy="12" r="9" /><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
  </IconBase>
);
export const CircleArrowIcon = (props: IconProps) => (
  <IconBase strokeWidth={1.8} {...props}>
    <circle cx="12" cy="12" r="9" /><path d="M7.5 12h9M13 8.5l3.5 3.5L13 15.5" />
  </IconBase>
);
export const TeamIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 8v5M17 16v.01" />
  </IconBase>
);

/** Faísca: marca o que foi lido pela máquina, não declarado por uma pessoa. */
export const SparkleIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flex: `0 0 ${size}px` }} {...props}>
    <path d="M11 2.5c.6 4.2 1.8 5.4 6 6-4.2.6-5.4 1.8-6 6-.6-4.2-1.8-5.4-6-6 4.2-.6 5.4-1.8 6-6z" />
    <path d="M18.5 13c.3 2.1.9 2.7 3 3-2.1.3-2.7.9-3 3-.3-2.1-.9-2.7-3-3 2.1-.3 2.7-.9 3-3z" />
  </svg>
);
