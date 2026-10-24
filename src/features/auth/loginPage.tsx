import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { Field, Input } from '@/components/ui/formControls';
import { ArrowRightIcon } from '@/components/ui/icons';
import { homeFor, paths } from '@/routes/paths';
import { AuthShell, ChooseRoleNotice, SoonNotice } from './components/authShell';
import { RoleTabs } from './components/roleTabs';
import { ROLE_COPY, isRole } from './roles';
import { session } from './session';
import type { UserRole } from './types';
import { useLogin, useOrgLogin } from './useAuth';
import { visibleError } from '@/utils/formProblems';
import { ForgotPassword } from './components/forgotPassword';

const INSTITUTIONAL_EMAIL = /@(cin\.)?ufpe\.br$/i;

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Escreva seu e-mail da UFPE.')
    .regex(INSTITUTIONAL_EMAIL, 'Use seu e-mail @ufpe.br ou @cin.ufpe.br. Se você é de uma organização, escolha Organização acima.'),
  password: z.string().min(1, 'Escreva sua senha.'),
});

type LoginValues = z.infer<typeof loginSchema>;

const orgLoginSchema = z.object({
  email: z.string().trim().min(1, 'Escreva o e-mail do cadastro.').email('Confira o e-mail: ele precisa ter @ e um ponto. Ex.: nome@organizacao.org.br'),
  password: z.string().min(1, 'Escreva sua senha.'),
});

type OrgLoginValues = z.infer<typeof orgLoginSchema>;

/** Organização entra com o e-mail de quem cuida das demandas; não há login institucional como o da UFPE. */
const OrganizationLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useOrgLogin();
  const [recovering, setRecovering] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<OrgLoginValues>({ mode: 'onChange', resolver: zodResolver(orgLoginSchema), defaultValues: { email: '', password: '' } });

  const requested = (location.state as { from?: string } | null)?.from;
  const from = requested?.startsWith(paths.orgHome) ? requested : paths.orgHome;
  const onSubmit = (values: OrgLoginValues) => login.mutate(values, { onSuccess: () => navigate(from, { replace: true }) });

  if (recovering) {
    return (
      <ForgotPassword
        role="organizacao"
        initialEmail={getValues('email')}
        onCancel={() => setRecovering(false)}
        onDone={(email) => {
          setRecovering(false);
          setValue('email', email);
          setValue('password', '');
          login.reset();
        }}
      />
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Field label="E-mail" htmlFor="login-org-email" error={visibleError(errors.email?.message, watch('email'), isSubmitted)}>
          <Input id="login-org-email" type="email" autoComplete="username" placeholder="nome@organizacao.org.br" autoFocus {...register('email')} />
        </Field>
        <Field label="Senha" htmlFor="login-org-senha" error={visibleError(errors.password?.message, watch('password'), isSubmitted)}>
          <Input id="login-org-senha" type="password" autoComplete="current-password" {...register('password')} />
        </Field>

        {login.isError && (
          <div role="alert" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small font-medium text-critical">
            {login.error.message}
            {login.error.message.startsWith('Senha incorreta') && (
              <button type="button" onClick={() => setRecovering(true)} className={textLinkClassName}>
                Recuperar a senha
              </button>
            )}
          </div>
        )}

        <Button variant="primary" size="xl" type="submit" fullWidth disabled={login.isPending}>
          {login.isPending ? 'Entrando' : 'Entrar'}
          {!login.isPending && <ArrowRightIcon size={20} />}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-small">
        <button type="button" onClick={() => setRecovering(true)} className={textLinkClassName}>
          Esqueci minha senha
        </button>
        <span className="text-ink-2">
          Primeira vez?{' '}
          <Link to={paths.signup('organizacao')} className={textLinkClassName}>
            Cadastrar a organização
          </Link>
        </span>
      </div>
      <p className="mt-4 text-small text-ink-3">Demonstração: qualquer e-mail entra na conta do Hospital das Clínicas, com qualquer senha até alguém trocar a senha.</p>
    </>
  );
};

const TeacherLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const [recovering, setRecovering] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<LoginValues>({ mode: 'onChange', resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const from = (location.state as { from?: string } | null)?.from ?? paths.home;
  const onSubmit = (values: LoginValues) => login.mutate(values, { onSuccess: () => navigate(from, { replace: true }) });

  if (recovering) {
    return (
      <ForgotPassword
        role="docente"
        initialEmail={getValues('email')}
        onCancel={() => setRecovering(false)}
        onDone={(email) => {
          setRecovering(false);
          setValue('email', email);
          setValue('password', '');
          login.reset();
        }}
      />
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Field label="E-mail institucional" htmlFor="login-email" error={visibleError(errors.email?.message, watch('email'), isSubmitted)}>
          <Input id="login-email" type="email" autoComplete="username" placeholder="nome@cin.ufpe.br" autoFocus {...register('email')} />
        </Field>
        <Field label="Senha" htmlFor="login-senha" error={visibleError(errors.password?.message, watch('password'), isSubmitted)}>
          <Input id="login-senha" type="password" autoComplete="current-password" {...register('password')} />
        </Field>

        {login.isError && (
          <div role="alert" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small font-medium text-critical">
            {login.error.message}
            {login.error.message.startsWith('Senha incorreta') && (
              <button type="button" onClick={() => setRecovering(true)} className={textLinkClassName}>
                Recuperar a senha
              </button>
            )}
          </div>
        )}

        <Button variant="primary" size="xl" type="submit" fullWidth disabled={login.isPending}>
          {login.isPending ? 'Entrando' : 'Entrar'}
          {!login.isPending && <ArrowRightIcon size={20} />}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-small">
        <button type="button" onClick={() => setRecovering(true)} className={textLinkClassName}>
          Esqueci minha senha
        </button>
        <span className="text-ink-2">
          Primeira vez?{' '}
          <Link to={paths.signup('docente')} className={textLinkClassName}>
            Criar conta
          </Link>
        </span>
      </div>
      <p className="mt-4 text-small text-ink-3">Demonstração: qualquer e-mail institucional entra na conta da docente, com qualquer senha até alguém trocar a senha.</p>
    </>
  );
};

export const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('perfil');
  const role: UserRole | null = isRole(requested) ? requested : null;

  useEffect(() => {
    document.title = 'Entrar · PLEI';
  }, []);

  if (session.isAuthenticated() && (role === null || session.role() === role)) return <Navigate to={homeFor(session.role())} replace />;

  return (
    <AuthShell>
      <h2 className="text-h2 text-ink">Entrar</h2>
      <div className="mt-6 mb-7">
        <RoleTabs value={role} onChange={(next) => setSearchParams({ perfil: next }, { replace: true })} />
      </div>

      {role === null ? (
        <ChooseRoleNotice action="entrar" />
      ) : role === 'docente' ? (
        <TeacherLogin />
      ) : ROLE_COPY[role].available ? (
        <OrganizationLogin />
      ) : (
        <SoonNotice title={`${ROLE_COPY[role].label}: em breve`} text={ROLE_COPY[role].soon}>
          <Link to={paths.landing} className={buttonClassName({ variant: 'secondary' })}>
            <ArrowRightIcon size={16} />
            Conhecer o PLEI
          </Link>
        </SoonNotice>
      )}
    </AuthShell>
  );
};
