import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { CheckIcon, PlusIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import type { OrgDemandSummary } from '../types';

const REASSURANCES = ['Quatro etapas curtas, em uns 10 minutos', 'Dá para salvar rascunho e voltar depois', 'Não precisa saber de tecnologia'];

/**
 * A ação principal do Início da organização, em bloco próprio logo abaixo das
 * boas-vindas: diz o que acontece com a demanda e tira o medo de começar.
 * Com rascunho parado, oferece continuar de onde parou.
 */
export const SubmitDemandCallout = ({ draft, firstTime }: { draft?: OrgDemandSummary; firstTime: boolean }) => (
  <section aria-labelledby="submeter-demanda" className="mb-12 rounded-lg bg-accent-soft px-6 py-7 sm:px-8 sm:py-8">
    <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
      <div className="min-w-0 flex-[1_1_420px]">
        <h2 id="submeter-demanda" className="text-[24px] leading-tight font-bold tracking-[-0.019em] text-balance text-ink">
          {firstTime ? 'Conte o primeiro problema da sua organização' : 'Tem outro problema que uma turma pode resolver?'}
        </h2>
        <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">
          Uma turma do CIn trabalha nele durante o semestre, com a orientação de um docente. O L.E.I. lê antes de a demanda entrar no cardápio.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {REASSURANCES.map((text) => (
            <li key={text} className="flex items-center gap-1.5 text-sm text-ink">
              <CheckIcon size={14} className="shrink-0 text-accent" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
        <Link to={paths.orgNewDemand} className={cn(buttonClassName({ variant: 'primary', size: 'lg' }), 'h-12 px-7 text-base')}>
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
