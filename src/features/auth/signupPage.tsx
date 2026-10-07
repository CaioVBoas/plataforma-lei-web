import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { Field, Input } from '@/components/ui/formControls';
import { OrgTypePicker } from '@/features/orgPortal/components/orgTypePicker';
import { ORGANIZATION_TYPES } from '@/features/orgPortal/utils/orgPresentation';
import { ArrowRightIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';
import { AuthShell, ChooseRoleNotice, SoonNotice } from './components/authShell';
import { RoleTabs } from './components/roleTabs';
import { ROLE_COPY, isRole } from './roles';
import type { UserRole } from './types';
import { useOrgSignup, useSignup } from './useAuth';

const INSTITUTIONAL_EMAIL = /@(cin\.)?ufpe\.br$/i;

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome.'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .regex(INSTITUTIONAL_EMAIL, 'Use seu e-mail @ufpe.br ou @cin.ufpe.br. Se você é de uma organização, escolha Organização acima.'),
  department: z.string().trim().min(1, 'Informe seu departamento.'),
  password: z.string().min(8, 'Use pelo menos 8 caracteres.'),
});

type SignupValues = z.infer<typeof signupSchema>;

const TeacherSignup = () => {
  const navigate = useNavigate();
  const signup = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', department: 'Centro de Informática', password: '' },
  });

  const onSubmit = (values: SignupValues) => signup.mutate(values, { onSuccess: () => navigate(paths.home, { replace: true }) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Field label="Nome" htmlFor="signup-name" error={errors.name?.message}>
        <Input id="signup-name" autoComplete="name" autoFocus {...register('name')} />
      </Field>
      <Field label="E-mail institucional" htmlFor="signup-email" error={errors.email?.message}>
        <Input id="signup-email" type="email" autoComplete="email" placeholder="nome@cin.ufpe.br" {...register('email')} />
      </Field>
      <Field label="Departamento" htmlFor="signup-department" error={errors.department?.message}>
        <Input id="signup-department" {...register('department')} />
      </Field>
      <Field label="Senha" htmlFor="signup-password" hint="Pelo menos 8 caracteres." error={errors.password?.message}>
        <Input id="signup-password" type="password" autoComplete="new-password" {...register('password')} />
      </Field>

      {signup.isError && (
        <p role="alert" className="text-sm text-critical">
          {signup.error.message}
        </p>
      )}

      <Button variant="primary" size="lg" type="submit" fullWidth disabled={signup.isPending} className="mt-1">
        {signup.isPending ? 'Criando conta' : 'Criar conta'}
        {!signup.isPending && <ArrowRightIcon size={16} />}
      </Button>
    </form>
  );
};

const orgSignupSchema = z.object({
  organizationName: z.string().trim().min(1, 'Informe o nome da organização.'),
  organizationType: z.string().min(1),
  location: z.string().trim().min(1, 'Informe onde a organização atua.'),
  name: z.string().trim().min(1, 'Informe seu nome.'),
  position: z.string().trim().min(1, 'Informe seu cargo ou papel.'),
  email: z.string().trim().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.'),
  password: z.string().min(8, 'Use pelo menos 8 caracteres.'),
});

type OrgSignupValues = z.infer<typeof orgSignupSchema>;

/** Cadastro da organização: quem ela é e quem vai cuidar das demandas, que vira o ponto focal. */
const OrganizationSignup = () => {
  const navigate = useNavigate();
  const signup = useOrgSignup();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrgSignupValues>({
    resolver: zodResolver(orgSignupSchema),
    defaultValues: { organizationName: '', organizationType: ORGANIZATION_TYPES[1], location: '', name: '', position: '', email: '', password: '' },
  });

  const onSubmit = (values: OrgSignupValues) => signup.mutate(values, { onSuccess: () => navigate(paths.orgHome, { replace: true }) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Field label="Nome da organização" htmlFor="signup-org-name" error={errors.organizationName?.message}>
        <Input id="signup-org-name" autoComplete="organization" autoFocus {...register('organizationName')} />
      </Field>
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink">Tipo</p>
        <OrgTypePicker compact value={watch('organizationType')} onChange={(type) => setValue('organizationType', type)} />
      </div>
      <Field label="Onde atua" htmlFor="signup-org-location" error={errors.location?.message}>
        <Input id="signup-org-location" placeholder="Ex.: Várzea, Recife" {...register('location')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Seu nome" htmlFor="signup-org-person" error={errors.name?.message}>
          <Input id="signup-org-person" autoComplete="name" {...register('name')} />
        </Field>
        <Field label="Seu cargo" htmlFor="signup-org-position" error={errors.position?.message}>
          <Input id="signup-org-position" autoComplete="organization-title" {...register('position')} />
        </Field>
      </div>
      <Field label="E-mail" htmlFor="signup-org-email" hint="Os docentes recebem este contato quando levarem uma demanda de vocês." error={errors.email?.message}>
        <Input id="signup-org-email" type="email" autoComplete="email" {...register('email')} />
      </Field>
      <Field label="Senha" htmlFor="signup-org-password" hint="Pelo menos 8 caracteres." error={errors.password?.message}>
        <Input id="signup-org-password" type="password" autoComplete="new-password" {...register('password')} />
      </Field>

      {signup.isError && (
        <p role="alert" className="text-sm text-critical">
          {signup.error.message}
        </p>
      )}

      <Button variant="primary" size="lg" type="submit" fullWidth disabled={signup.isPending} className="mt-1">
        {signup.isPending ? 'Cadastrando' : 'Cadastrar a organização'}
        {!signup.isPending && <ArrowRightIcon size={16} />}
      </Button>
    </form>
  );
};

export const SignupPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('perfil');
  const role: UserRole | null = isRole(requested) ? requested : null;

  useEffect(() => {
    document.title = 'Criar conta · PLEI';
  }, []);

  return (
    <AuthShell>
      <h2 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-ink">Criar conta</h2>
      <div className="mt-6 mb-7">
        <RoleTabs value={role} onChange={(next) => setSearchParams({ perfil: next }, { replace: true })} />
      </div>

      {role === null ? (
        <ChooseRoleNotice action="criar sua conta" />
      ) : role === 'docente' ? (
        <TeacherSignup />
      ) : ROLE_COPY[role].available ? (
        <OrganizationSignup />
      ) : (
        <SoonNotice title={`${ROLE_COPY[role].label}: em breve`} text={ROLE_COPY[role].soon}>
          <Link to={paths.landing} className={buttonClassName({ variant: 'secondary' })}>
            Conhecer o PLEI
          </Link>
        </SoonNotice>
      )}

      <p className="mt-6 text-sm text-ink-2">
        Já tem conta?{' '}
        <Link to={role ? paths.loginAs(role) : paths.login} className={textLinkClassName}>
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
};
