import { cn } from '@/utils/cn';

export interface PhotoCredit {
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
  sourceUrl: string;
  /** Exigido pelas licenças CC BY: dizer se a foto foi alterada. */
  changes?: string;
}

/**
 * A linha de crédito que as licenças Creative Commons pedem: autor com link
 * para a origem, licença com link e aviso de alteração. Pequena e discreta.
 */
export const PhotoCreditLine = ({ credit, onDark, className }: { credit: PhotoCredit; onDark?: boolean; className?: string }) => {
  const link = cn('underline-offset-2 hover:underline', onDark ? 'hover:text-white' : 'hover:text-ink-2');
  return (
    <p className={cn('text-[11px] leading-snug', onDark ? 'text-white/70' : 'text-ink-3', className)}>
      Foto:{' '}
      <a href={credit.sourceUrl} target="_blank" rel="noreferrer" className={link}>
        {credit.author}, {credit.source}
      </a>
      ,{' '}
      <a href={credit.licenseUrl} target="_blank" rel="license noreferrer" className={link}>
        {credit.license}
      </a>
      {credit.changes && `, ${credit.changes}`}.
    </p>
  );
};
