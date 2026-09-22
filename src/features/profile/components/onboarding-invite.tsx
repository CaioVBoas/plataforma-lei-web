import { Link } from 'react-router-dom';
import { buttonClassName } from '@/components/ui/button-styles';
import { SparkleIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';
import { useAccount } from '../hooks/use-profile';

/** Porta de entrada do onboarding: aparece até o docente responder, porque as sugestões dependem dele. */
export const OnboardingInvite = () => {
  const { data: account } = useAccount();
  if (!account || account.onboardingCompleted) return null;

  return (
    <aside className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-azul-100 bg-azul-50 px-6 py-4">
      <div className="flex min-w-0 flex-[1_1_380px] items-start gap-3">
        <SparkleIcon size={18} className="mt-0.5 text-azul-500" />
        <div>
          <p className="text-[15px] font-medium text-azul-800">Conte o que você pratica de verdade</p>
          <p className="mt-0.5 text-[13px] leading-normal text-n-600">
            Hoje as sugestões usam só a ementa e o catálogo do CIn. Três perguntas rápidas deixam os percentuais mais precisos.
          </p>
        </div>
      </div>
      <Link to={paths.onboarding} className={buttonClassName({ variant: 'primary' })}>
        Responder em 2 minutos
      </Link>
    </aside>
  );
};
