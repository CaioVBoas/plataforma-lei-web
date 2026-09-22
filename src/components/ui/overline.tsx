import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export const Overline = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('text-overline text-n-500', className)}>{children}</div>
);
