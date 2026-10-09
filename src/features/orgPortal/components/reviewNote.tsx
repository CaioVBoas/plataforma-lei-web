import { formatShortDate } from '@/domain/calendar';
import type { SubmissionReview } from '@/domain/types';
import { WarningNote } from '@/components/ui/warningNote';

/** O pedido de ajuste do L.E.I., no topo do detalhe e do formulário, para a organização ver o que mudar. */
export const ReviewNote = ({ review }: { review: SubmissionReview }) => (
  <WarningNote title="O L.E.I. pediu um ajuste" className="mb-8">
    <p className="text-body text-ink">{review.note}</p>
    <p className="mt-2 text-small text-ink-2">
      {review.by} · {formatShortDate(review.at)}
    </p>
  </WarningNote>
);
