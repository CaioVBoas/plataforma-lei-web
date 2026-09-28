import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { Field, Input } from '@/components/ui/formControls';
import { ArrowRightIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';
import { AuthShell, SoonNotice } from './components/authShell';
import { RoleTabs } from './components/roleTabs';
import { ROLE_COPY, isRole } from './roles';
import { session } from './session';
import type { UserRole } from './types';
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

const TeacherLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const [resetNotice, setResetNotice] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const from = (location.state as { from?: string } | null)?.from ?? paths.home;
  const onSubmit = (values: LoginValues) => login.mutate(values, { onSuccess: () => navigate(from, { replace: true }) });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Field label="E-mail institucional" htmlFor="login-email" error={errors.email?.message}>
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <button type="button" onClick={() => setResetNotice(true)} className={textLinkClassName}>
          Esqueci minha senha
        </button>
        <span className="text-ink-2">
          Primeira vez?{' '}
          <Link to={paths.signup('docente')} className={textLinkClassName}>
            Criar conta
          </Link>
        </span>
      </div>
      {resetNotice && (
        <p role="status" className="mt-2 text-[13px] leading-relaxed text-ink-2">
          Nesta demonstração qualquer senha funciona com um e-mail institucional. A recuperação de senha chega com o login da UFPE.
        </p>
      )}
    </>
  );
};

export const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('perfil');
  const role: UserRole = isRole(requested) ? requested : 'docente';
  const copy = ROLE_COPY[role];

  useEffect(() => {
    document.title = 'Entrar · Aperta o PL.E.I.';
  }, []);

  if (session.isAuthenticated() && role === 'docente') return <Navigate to={paths.home} replace />;

  return (
    <AuthShell>
      <h2 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-ink">Entrar</h2>
      <div className="mt-6 mb-7">
        <RoleTabs value={role} onChange={(next) => setSearchParams(next === 'docente' ? {} : { perfil: next }, { replace: true })} />
      </div>

      {copy.available ? (
        <TeacherLogin />
      ) : (
        <SoonNotice title={`${copy.label}: em breve`} text={copy.soon}>
          <Link to={paths.landing} className={buttonClassName({ variant: 'secondary' })}>
            Conhecer o Aperta o PL.E.I.
          </Link>
        </SoonNotice>
      )}
    </AuthShell>
  );
};
