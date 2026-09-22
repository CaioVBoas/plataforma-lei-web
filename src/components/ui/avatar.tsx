import { initialsOf } from '@/utils/format';

export const Avatar = ({ name }: { name: string }) => (
  <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink-3 text-[11px] font-semibold text-white">
    {initialsOf(name)}
  </span>
);
