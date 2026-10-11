import { cloneElement, isValidElement, type ReactNode } from 'react';
import type { IconProps, IconVariant } from './icons';

/** O ícone escolhido ou ativo vira bold; os outros seguem em linha. */
export const withIconVariant = (icon: ReactNode, active: boolean, variant: IconVariant = 'bold') =>
  active && isValidElement<IconProps>(icon) ? cloneElement(icon, { variant }) : icon;
