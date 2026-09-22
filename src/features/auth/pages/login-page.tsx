import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/ui/brand-mark';
import { Field, Input } from '@/components/ui/form-controls';
import { paths } from '@/routes/paths';
import { session } from '../api/session';
import { useLogin } from '../hooks/use-auth';

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
  'Organizações de fora da universidade publicam problemas reais.',
  'Você escolhe um e leva para uma disciplina que está lecionando.',
  'A turma resolve com a organização, dentro do semestre.',
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
    <div className="grid min-h-screen bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="hidden flex-col justify-between bg-canvas px-14 py-12 lg:flex">
        <BrandMark />
        <div className="max-w-[440px]">
          <h1 className="text-[40px] leading-[1.1] font-bold tracking-[-0.025em] text-ink">Problemas reais para as suas turmas.</h1>
          <ul className="mt-8 space-y-4">
            {PROMISES.map((promise, index) => (
              <li key={promise} className="flex gap-4 text-[17px] leading-snug text-ink-2">
                <span className="w-4 shrink-0 text-ink-3 tabular-nums">{index + 1}</span>
                {promise}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[13px] text-ink-3">L.E.I. · Centro de Informática da UFPE</p>
      </section>

      <section className="flex flex-col justify-center px-6 py-12 sm:px-14">
        <div className="mx-auto w-full max-w-[360px]">
          <div className="mb-10 lg:hidden">
            <BrandMark />
          </div>
          <h2 className="text-large-title">Entrar</h2>
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

          <p className="mt-12 border-t border-line pt-6 text-[13px] leading-relaxed text-ink-3">
            Este é o portal dos docentes. Organizações publicam demandas por convite da coordenação de extensão do CIn.
          </p>
        </div>
      </section>
    </div>
  );
};
