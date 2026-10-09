import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { Field, Input } from '@/components/ui/formControls';
import { MissingFieldsDialog, type MissingItem } from '@/components/ui/missingFieldsDialog';
import { PasswordRules } from '@/components/ui/passwordRules';
import { problemsFrom, visibleError } from '@/utils/formProblems';
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
  name: z.string().trim().min(1, 'Escreva seu nome completo.'),
  email: z
    .string()
    .trim()
    .min(1, 'Escreva seu e-mail da UFPE.')
    .regex(INSTITUTIONAL_EMAIL, 'Use seu e-mail @ufpe.br ou @cin.ufpe.br. Se você é de uma organização, escolha Organização acima.'),
  department: z.string().trim().min(1, 'Escreva seu departamento. Ex.: Centro de Informática.'),
  password: z.string().min(8, 'A senha precisa de pelo menos 8 letras ou números.'),
});

type SignupValues = z.infer<typeof signupSchema>;

const TeacherSignup = () => {
  const navigate = useNavigate();
  const signup = useSignup();
  const [problems, setProblems] = useState<MissingItem[] | null>(null);
  const {
    register,
    handleSubmit,
    setFocus,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<SignupValues>({
    mode: 'onChange',
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', department: 'Centro de Informática', password: '' },
  });

  const onSubmit = (values: SignupValues) => signup.mutate(values, { onSuccess: () => navigate(paths.home, { replace: true }) });
  const onInvalid = (formErrors: typeof errors) =>
    setProblems(problemsFrom(formErrors, { name: 'Nome', email: 'E-mail institucional', department: 'Departamento', password: 'Senha' }, setFocus));

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="flex flex-col gap-4">
      <Field label="Nome" htmlFor="signup-name" required error={visibleError(errors.name?.message, watch('name'), isSubmitted)}>
        <Input id="signup-name" autoComplete="name" autoFocus {...register('name')} />
      </Field>
      <Field label="E-mail institucional" htmlFor="signup-email" required help="O seu e-mail da UFPE, terminado em @ufpe.br ou @cin.ufpe.br." error={visibleError(errors.email?.message, watch('email'), isSubmitted)}>
        <Input id="signup-email" type="email" autoComplete="email" placeholder="nome@cin.ufpe.br" {...register('email')} />
      </Field>
      <Field label="Departamento" htmlFor="signup-department" required error={visibleError(errors.department?.message, watch('department'), isSubmitted)}>
        <Input id="signup-department" {...register('department')} />
      </Field>
      <Field label="Senha" htmlFor="signup-password" required error={visibleError(errors.password?.message, watch('password'), isSubmitted)}>
        <Input id="signup-password" type="password" autoComplete="new-password" {...register('password')} />
        <PasswordRules password={watch('password')} />
      </Field>

      {signup.isError && (
        <p role="alert" className="text-small text-critical">
          {signup.error.message}
        </p>
      )}

      <Button variant="primary" size="xl" type="submit" fullWidth disabled={signup.isPending} className="mt-1">
        {signup.isPending ? 'Criando conta' : 'Criar conta'}
        {!signup.isPending && <ArrowRightIcon size={20} />}
      </Button>
      {problems && <MissingFieldsDialog description="Para criar a conta, preencha o que está abaixo." items={problems} onClose={() => setProblems(null)} />}
    </form>
  );
};

const orgSignupSchema = z.object({
  organizationName: z.string().trim().min(1, 'Escreva o nome da organização.'),
  organizationType: z.string().min(1),
  location: z.string().trim().min(1, 'Escreva o bairro e a cidade. Ex.: Várzea, Recife.'),
  name: z.string().trim().min(1, 'Escreva seu nome.'),
  position: z.string().trim().min(1, 'Escreva seu cargo ou papel. Ex.: Coordenadora.'),
  email: z.string().trim().min(1, 'Escreva seu e-mail.').email('Confira o e-mail: ele precisa ter @ e um ponto. Ex.: nome@organizacao.org.br'),
  password: z.string().min(8, 'A senha precisa de pelo menos 8 letras ou números.'),
});

type OrgSignupValues = z.infer<typeof orgSignupSchema>;

/** Cadastro da organização: quem ela é e quem vai cuidar das demandas, que vira o ponto focal. */
const OrganizationSignup = () => {
  const navigate = useNavigate();
  const signup = useOrgSignup();
  const [problems, setProblems] = useState<MissingItem[] | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors, isSubmitted },
  } = useForm<OrgSignupValues>({
    mode: 'onChange',
    resolver: zodResolver(orgSignupSchema),
    defaultValues: { organizationName: '', organizationType: ORGANIZATION_TYPES[1], location: '', name: '', position: '', email: '', password: '' },
  });

  const onSubmit = (values: OrgSignupValues) => signup.mutate(values, { onSuccess: () => navigate(paths.orgHome, { replace: true }) });
  const onInvalid = (formErrors: typeof errors) =>
    setProblems(
      problemsFrom(
        formErrors,
        { organizationName: 'Nome da organização', location: 'Onde atua', name: 'Seu nome', position: 'Seu cargo', email: 'E-mail', password: 'Senha' },
        setFocus,
      ),
    );

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="flex flex-col gap-4">
      <Field label="Nome da organização" htmlFor="signup-org-name" required error={visibleError(errors.organizationName?.message, watch('organizationName'), isSubmitted)}>
        <Input id="signup-org-name" autoComplete="organization" autoFocus {...register('organizationName')} />
      </Field>
      <div>
        <p className="mb-1.5 text-small font-medium text-ink">Tipo</p>
        <OrgTypePicker compact value={watch('organizationType')} onChange={(type) => setValue('organizationType', type)} />
      </div>
      <Field label="Onde atua" htmlFor="signup-org-location" required error={visibleError(errors.location?.message, watch('location'), isSubmitted)}>
        <Input id="signup-org-location" placeholder="Ex.: Várzea, Recife" {...register('location')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Seu nome" htmlFor="signup-org-person" required error={visibleError(errors.name?.message, watch('name'), isSubmitted)}>
          <Input id="signup-org-person" autoComplete="name" {...register('name')} />
        </Field>
        <Field label="Seu cargo" htmlFor="signup-org-position" required error={visibleError(errors.position?.message, watch('position'), isSubmitted)}>
          <Input id="signup-org-position" autoComplete="organization-title" {...register('position')} />
        </Field>
      </div>
      <Field label="E-mail" htmlFor="signup-org-email" required help="É com ele que você entra. Os docentes recebem este contato quando levarem uma demanda de vocês para a turma." error={visibleError(errors.email?.message, watch('email'), isSubmitted)}>
        <Input id="signup-org-email" type="email" autoComplete="email" {...register('email')} />
      </Field>
      <Field label="Senha" htmlFor="signup-org-password" required error={visibleError(errors.password?.message, watch('password'), isSubmitted)}>
        <Input id="signup-org-password" type="password" autoComplete="new-password" {...register('password')} />
        <PasswordRules password={watch('password')} />
      </Field>

      {signup.isError && (
        <p role="alert" className="text-small text-critical">
          {signup.error.message}
        </p>
      )}

      <Button variant="primary" size="xl" type="submit" fullWidth disabled={signup.isPending} className="mt-1">
        {signup.isPending ? 'Cadastrando' : 'Cadastrar a organização'}
        {!signup.isPending && <ArrowRightIcon size={20} />}
      </Button>
      {problems && <MissingFieldsDialog description="Para cadastrar a organização, preencha o que está abaixo." items={problems} onClose={() => setProblems(null)} />}
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
      <h2 className="text-h2 text-ink">Criar conta</h2>
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

      <p className="mt-6 text-small text-ink-2">
        Já tem conta?{' '}
        <Link to={role ? paths.loginAs(role) : paths.login} className={textLinkClassName}>
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
};
