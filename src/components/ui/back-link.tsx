import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { buttonClassName } from './button-styles';
import { ChevronLeftIcon } from './icons';

export const BackLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className={cn(buttonClassName({ variant: 'outline-muted', size: 'sm' }), 'mb-4')}>
    <ChevronLeftIcon size={15} className="text-n-500" />
    {children}
  </Link>
);
