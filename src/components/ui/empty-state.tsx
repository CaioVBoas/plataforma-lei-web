import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="rounded-lg border border-line bg-canvas px-6 py-12 text-center">
    <p className="text-headline">{title}</p>
    {description && <p className="mx-auto mt-1.5 max-w-[52ch] text-sm leading-relaxed text-ink-2">{description}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
);
