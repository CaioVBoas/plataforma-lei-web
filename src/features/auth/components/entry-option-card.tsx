import type { ReactNode } from 'react';
import { ChevronRightIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';

interface EntryOptionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  /** Laranja identifica o portal do parceiro; azul, os portais institucionais. */
  tone: 'azul' | 'laranja';
  withAccentBar?: boolean;
  onSelect: () => void;
}

export const EntryOptionCard = ({ icon, title, description, tone, withAccentBar, onSelect }: EntryOptionCardProps) => (
  <button
    type="button"
    onClick={onSelect}
    className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-n-200 bg-n-0 py-4 pr-4 pl-5 text-left transition-colors hover:border-n-300 hover:bg-n-50"
  >
    {withAccentBar && <span aria-hidden="true" className={cn('absolute inset-y-0 left-0 w-[3px]', tone === 'azul' ? 'bg-azul-500' : 'bg-laranja-500')} />}
    <span
      aria-hidden="true"
      className={cn('flex size-[38px] shrink-0 items-center justify-center rounded-xl', tone === 'azul' ? 'bg-azul-50 text-azul-500' : 'bg-laranja-50 text-laranja-800')}
    >
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-[15px] font-semibold text-n-800">{title}</span>
      <span className="mt-0.5 block text-[13px] leading-[1.4] text-n-600">{description}</span>
    </span>
    <ChevronRightIcon className="text-n-400" />
  </button>
);
