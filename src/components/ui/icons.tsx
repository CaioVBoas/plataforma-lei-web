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
