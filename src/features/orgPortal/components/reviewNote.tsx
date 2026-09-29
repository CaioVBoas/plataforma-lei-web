import { formatShortDate } from '@/domain/calendar';
import type { SubmissionReview } from '@/domain/types';

/** O pedido de ajuste do L.E.I., no topo do detalhe e do formulário, para a organização ver o que mudar. */
export const ReviewNote = ({ review }: { review: SubmissionReview }) => (
  <div className="mb-8 rounded-lg bg-caution-soft px-5 py-4">
    <p className="text-[15px] font-semibold text-caution">O L.E.I. pediu um ajuste</p>
    <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{review.note}</p>
    <p className="mt-2 text-[13px] text-ink-2">
      {review.by} · {formatShortDate(review.at)}
    </p>
  </div>
);
