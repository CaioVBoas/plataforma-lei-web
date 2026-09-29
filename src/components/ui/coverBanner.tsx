import type { Cover } from '@/lib/covers';
import { cn } from '@/utils/cn';
import { PhotoCreditLine } from './photoCredit';

/** Foto larga no topo de uma tela de detalhe (demanda, projeto), com o crédito no canto quando a licença pede. */
export const CoverBanner = ({ cover, className }: { cover: Cover; className?: string }) => (
  <figure className={cn('relative mb-8', className)}>
    <img src={cover.src} alt="" className="block h-48 w-full rounded-lg object-cover sm:h-60" />
    {cover.credit && (
      <figcaption className="absolute right-2 bottom-2 max-w-[90%] rounded-sm bg-black/55 px-2 py-1">
        <PhotoCreditLine credit={cover.credit} onDark />
      </figcaption>
    )}
  </figure>
);
