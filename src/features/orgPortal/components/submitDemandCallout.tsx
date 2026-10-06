import { Link } from 'react-router-dom';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { PlusIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import type { OrgDemandSummary } from '../types';

/**
 * A ação principal do Início da organização: uma faixa curta com o botão.
 * Com rascunho parado, oferece continuar de onde parou.
 */
export const SubmitDemandCallout = ({ draft, firstTime }: { draft?: OrgDemandSummary; firstTime: boolean }) => (
  <section aria-labelledby="submeter-demanda" className="rounded-lg bg-accent-soft px-6 py-6 sm:px-8">
    <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
      <div className="min-w-0 flex-[1_1_380px]">
        <h2 id="submeter-demanda" className="text-[20px] leading-tight font-bold tracking-[-0.017em] text-balance text-ink">
          {firstTime ? 'Conte o primeiro problema da sua organização' : 'Tem outro problema que uma turma pode resolver?'}
        </h2>
        <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-ink-2">
          Quatro etapas curtas, sem precisar saber de tecnologia.{' '}
          <Link to={paths.orgGuide} className={textLinkClassName}>
            Como funciona
          </Link>
        </p>
      </div>

      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
        <Link to={paths.orgNewDemand} className={cn(buttonClassName({ variant: 'primary', size: 'lg' }), 'px-6')}>
          <PlusIcon size={18} />
          Submeter demanda
        </Link>
        {draft && (
          <Link to={paths.orgEditDemand(draft.id)} className="text-center text-sm text-accent-hover underline-offset-2 hover:underline sm:text-right">
            ou continuar o rascunho "{draft.title}"
          </Link>
        )}
      </div>
    </div>
  </section>
);
