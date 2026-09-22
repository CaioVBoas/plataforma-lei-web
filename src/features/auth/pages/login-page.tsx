import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SparkleIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';
import { EntryOptionCard } from '../components/entry-option-card';
import { LoginForm } from '../components/login-form';
import { PORTALS, WORK_AREAS, type PortalOption } from '../constants/portals';

type Step = { name: 'portals' } | { name: 'login'; portal: PortalOption } | { name: 'areas' };

const Hero = () => (
  <div className="flex min-w-0 flex-1 basis-1/2 flex-col bg-linear-160 from-azul-900 to-azul-800 p-12">
    <div className="flex items-center gap-2.5">
      <span aria-hidden="true" className="flex size-[30px] items-center justify-center rounded-[10px] bg-n-0/15 text-n-0">
        <SparkleIcon />
      </span>
      <span className="text-base font-bold tracking-[-.01em] text-n-0">Aperta o PLEI</span>
    </div>
    <div className="my-auto max-w-[520px]">
      <h1 className="mb-[18px] font-display text-[32px] leading-tight font-semibold text-pretty text-n-0">
        A extensão deixa de ser um peso e vira uma oportunidade.
      </h1>
      <p className="max-w-[46ch] text-base leading-relaxed text-azul-200">
        Demandas reais de organizações externas chegam já ligadas às disciplinas que você leciona, com a proposta de registro quase pronta.
      </p>
    </div>
    <p className="text-[13px] leading-normal text-azul-300">
      Laboratório de Extensão e Inovação
      <br />
      Centro de Informática, UFPE
    </p>
  </div>
);

/** Entrada: escolha de portal, autenticação e, para quem acumula papéis, a escolha da área. */
export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<Step>({ name: 'portals' });

  useEffect(() => {
    document.title = 'Entrar · Aperta o PLEI';
  }, []);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? paths.menu;
  const enterPortal = () => navigate(redirectTo, { replace: true });

  return (
    <div className="flex min-h-screen w-full bg-n-0 font-body text-n-700">
      <Hero />
      <main className="flex min-w-0 flex-1 basis-1/2 items-center justify-center p-12">
        <div className="w-full max-w-[400px]">
          {step.name === 'portals' && (
            <>
              <h2 className="mb-1 text-[22px] leading-[1.3] font-bold text-n-800">Entrar na plataforma</h2>
              <p className="mb-6 text-sm text-n-600">Escolha como você vai usar o Aperta o PLEI</p>
              <div className="flex flex-col gap-2.5">
                {PORTALS.map((portal) => (
                  <EntryOptionCard
                    key={portal.id}
                    withAccentBar
                    tone={portal.tone}
                    icon={portal.icon}
                    title={portal.title}
                    description={portal.description}
                    onSelect={() => setStep({ name: 'login', portal })}
                  />
                ))}
              </div>
              <div className="mt-6 mb-3.5 h-px bg-n-200" />
              <p className="text-[13px] leading-normal text-n-500">Professores e coordenação entram com o e-mail institucional.</p>
            </>
          )}

          {step.name === 'login' && (
            <LoginForm
              key={step.portal.id}
              portal={step.portal}
              onChangePortal={() => setStep({ name: 'portals' })}
              onSignedIn={enterPortal}
              onChooseArea={() => setStep({ name: 'areas' })}
            />
          )}

          {step.name === 'areas' && (
            <>
              <h2 className="mb-1 text-[22px] leading-[1.3] font-bold text-n-800">Onde você quer trabalhar agora?</h2>
              <p className="mb-6 text-sm text-n-600">Sua conta tem dois papéis no Centro de Informática.</p>
              <div className="flex flex-col gap-2.5">
                {/* O portal da coordenação ainda não existe; as duas áreas abrem o portal docente. */}
                {WORK_AREAS.map((area) => (
                  <EntryOptionCard key={area.id} tone="azul" icon={area.icon} title={area.title} description={area.description} onSelect={enterPortal} />
                ))}
              </div>
              <p className="mt-4 text-[13px] leading-normal text-n-500">Você pode alternar a qualquer momento pelo topo da barra lateral.</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
