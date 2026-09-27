import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/ui/brandMark';
import { Field, Input } from '@/components/ui/formControls';
import { ArrowRightIcon, BookIcon, CheckIcon, TrayIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';
import { session } from './session';
import { useLogin } from './useAuth';

const INSTITUTIONAL_EMAIL = /@(cin\.)?ufpe\.br$/i;

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .regex(INSTITUTIONAL_EMAIL, 'Use seu e-mail @ufpe.br ou @cin.ufpe.br.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

type LoginValues = z.infer<typeof loginSchema>;

const PROMISES = [
  { icon: <TrayIcon size={17} />, title: 'Problemas reais', text: 'Organizações de fora da universidade publicam, o L.E.I. faz a triagem.' },
  { icon: <BookIcon size={17} />, title: 'Na sua disciplina', text: 'Você escolhe um e leva para uma turma que está lecionando.' },
  { icon: <CheckIcon size={17} />, title: 'Extensão registrada', text: 'A turma resolve com a organização e o projeto vai para o SIGAA.' },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const [resetNotice, setResetNotice] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  useEffect(() => {
    document.title = 'Entrar · Aperta o PLEI';
  }, []);

  if (session.isAuthenticated()) return <Navigate to={paths.home} replace />;

  const from = (location.state as { from?: string } | null)?.from ?? paths.home;
  const onSubmit = (values: LoginValues) => login.mutate(values, { onSuccess: () => navigate(from, { replace: true }) });

  return (
    // Fundo claro de marca com dois círculos discretos, e o cartão dividido no centro:
    // a promessa em petróleo à esquerda, a entrada à direita.
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-50 px-4 py-10 sm:px-8">
      <span aria-hidden="true" className="absolute -top-24 -left-24 size-80 rounded-full bg-brand-100" />
      <span aria-hidden="true" className="absolute -right-32 -bottom-32 size-96 rounded-full bg-brand-100" />

      <div className="relative grid w-full max-w-[980px] overflow-hidden rounded-lg bg-surface shadow-sheet lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="hidden flex-col justify-between gap-12 bg-brand px-10 py-10 lg:flex">
          <BrandMark onDark className="h-10" />
          <div>
            <h1 className="text-[34px] leading-[1.15] font-bold tracking-[-0.02em] text-balance text-white">Leve um problema real de Pernambuco para a sua disciplina.</h1>
            <ul className="mt-9 space-y-5">
              {PROMISES.map(({ icon, title, text }) => (
                <li key={title} className="flex items-start gap-3.5">
                  <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-brand-on-dark">
                    {icon}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-white">{title}</span>
                    <span className="block text-sm leading-snug text-brand-100">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[13px] text-brand-100">L.E.I. · Centro de Informática da UFPE</p>
        </section>

        <section className="flex flex-col justify-center px-6 py-10 sm:px-14 sm:py-14">
          <div className="mx-auto w-full max-w-[380px]">
            <div className="mb-10 lg:hidden">
              <BrandMark />
            </div>
            <h2 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-ink">Entrar</h2>
            <p className="mt-2 text-[15px] text-ink-2">Use sua conta institucional da UFPE.</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
              <Field label="E-mail" htmlFor="login-email" error={errors.email?.message}>
                <Input id="login-email" type="email" autoComplete="username" placeholder="nome@cin.ufpe.br" autoFocus {...register('email')} />
              </Field>
              <Field label="Senha" htmlFor="login-senha" error={errors.password?.message}>
                <Input id="login-senha" type="password" autoComplete="current-password" {...register('password')} />
              </Field>

              {login.isError && (
                <p role="alert" className="text-sm text-critical">
                  {login.error.message}
                </p>
              )}

              <Button variant="primary" size="lg" type="submit" fullWidth disabled={login.isPending}>
                {login.isPending ? 'Entrando' : 'Entrar'}
                {!login.isPending && <ArrowRightIcon size={16} />}
              </Button>
            </form>

            <button type="button" onClick={() => setResetNotice(true)} className="mt-4 text-sm text-accent hover:text-accent-hover">
              Esqueci minha senha
            </button>
            {resetNotice && (
              <p role="status" className="mt-2 text-[13px] leading-relaxed text-ink-2">
                Nesta demonstração qualquer senha funciona com um e-mail institucional. A recuperação de senha chega com o login da UFPE.
              </p>
            )}

            <p className="mt-10 rounded-md border border-fact-line bg-fact px-4 py-3 text-[13px] leading-relaxed text-ink-2">
              Este é o portal dos docentes. Organizações publicam demandas por convite da coordenação de extensão do CIn.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
