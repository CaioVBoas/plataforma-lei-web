import { initialsOf } from '@/utils/format';

/** Iniciais do docente no mesmo desenho do monograma: petróleo claro, cantos de 6px. */
export const Avatar = ({ name }: { name: string }) => (
  <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-monogram text-[12px] font-semibold text-monogram-ink">
    {initialsOf(name)}
  </span>
);
