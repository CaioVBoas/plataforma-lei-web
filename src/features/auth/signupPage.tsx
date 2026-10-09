import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/feedback/toastContext';
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
import type { CodeSent } from '@/mocks/handlers/access';
import { paths } from '@/routes/paths';
import { AuthShell, ChooseRoleNotice, SoonNotice } from './components/authShell';
import { CodeStep, StepHeader } from './components/authSteps';
import { RoleTabs } from './components/roleTabs';
import { ROLE_COPY, isRole } from './roles';
import type { UserRole } from './types';
import { useOrgSignup, useOrgSignupCode, useSignup, useSignupCode } from './useAuth';

const INSTITUTIONAL_EMAIL = /@(cin\.)?ufpe\.br$/i;

/** A senha de todo cadastro: 8 caracteres ou mais, com letras e números, e repetida igual. */
const password = z
  .string()
  .min(8, 'A senha precisa de pelo menos 8 caracteres.')
  .refine((value) => /[a-zA-ZÀ-ÿ]/.test(value) && /\d/.test(value), 'Use letras e números na senha.');
const samePassword = <T extends { password: string; confirm: string }>(values: T) => values.password === values.confirm;
const SAME_PASSWORD = { message: 'As duas senhas não são iguais. Digite a mesma senha nos dois campos.', path: ['confirm'] };

const signupSchema = z
  .object({
    name: z.string().trim().min(1, 'Escreva seu nome completo.'),
    email: z
      .string()
      .trim()
      .min(1, 'Escreva seu e-mail da UFPE.')
      .regex(INSTITUTIONAL_EMAIL, 'Use seu e-mail @ufpe.br ou @cin.ufpe.br. Se você é de uma organização, escolha Organização acima.'),
    department: z.string().trim().min(1, 'Escreva seu departamento. Ex.: Centro de Informática.'),
    password,
    confirm: z.string(),
  })
  .refine(samePassword, SAME_PASSWORD);

type SignupValues = z.infer<typeof signupSchema>;

/** O erro do servidor vai para o campo de que ele fala; o resto fica acima do botão. */
const serverErrorFor = (message: string | undefined, field: 'email' | 'organizationName' | 'general') => {
  if (!message) return undefined;
  const about = /e-mail/i.test(message) ? 'email' : /organização já tem cadastro/i.test(message) ? 'organizationName' : 'general';
  return about === field ? message : undefined;
};

/** O par senha e repetição, com as regras ao vivo embaixo; a borda fica vermelha depois de uma tentativa com algo faltando. */
const PasswordFields = ({ idPrefix, register, value, confirm, attempted, invalid }: { idPrefix: string; register: (name: 'password' | 'confirm') => object; value: string; confirm: string; attempted: boolean; invalid: { password: boolean; confirm: boolean } }) => (
  <div className="flex flex-col gap-4">
    <Field label="Senha" htmlFor={`${idPrefix}-password`} required invalid={attempted && invalid.password}>
      <Input id={`${idPrefix}-password`} type="password" autoComplete="new-password" {...register('password')} />
    </Field>
    <Field label="Repita a senha" htmlFor={`${idPrefix}-confirm`} required invalid={attempted && invalid.confirm}>
      <Input id={`${idPrefix}-confirm`} type="password" autoComplete="new-password" {...register('confirm')} />
      <PasswordRules password={value} confirm={confirm} attempted={attempted} />
    </Field>
  </div>
);

/** A etapa 2 do cadastro, igual nos dois perfis: o código enviado ao e-mail cria a conta. */
const ConfirmEmailStep = ({
  sent,
  creating,
  createError,
  onCreate,
  resend,
  onBack,
}: {
  sent: CodeSent;
  creating: boolean;
  createError?: string;
  onCreate: (code: string) => void;
  resend: { run: () => void; pending: boolean; error?: string };
  onBack: () => void;
}) => (
  <>
    <StepHeader step={2} total={2} label="Confirmar o e-mail" />
    <CodeStep
      email={sent.sentTo}
      demoCode={sent.demoCode}
      resendIn={sent.resendIn}
      confirmLabel="Confirmar e criar a conta"
      pending={creating}
      error={createError}
      onConfirm={onCreate}
      onResend={resend.run}
      resending={resend.pending}
      resendError={resend.error}
      onBack={onBack}
    />
  </>
);

const TeacherSignup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const sendCode = useSignupCode();
  const signup = useSignup();
  const [sent, setSent] = useState<CodeSent | null>(null);
  const [problems, setProblems] = useState<MissingItem[] | null>(null);
  const {
    register,
    handleSubmit,
    setFocus,
    watch,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<SignupValues>({
    mode: 'onChange',
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', department: 'Centro de Informática', password: '', confirm: '' },
  });

  const payload = () => {
    const { name, email, department, password: secret } = getValues();
    return { name, email, department, password: secret };
  };
  const requestCode = () => sendCode.mutate(payload(), { onSuccess: setSent });
  const onInvalid = (formErrors: typeof errors) =>
    setProblems(
      problemsFrom(formErrors, { name: 'Nome', email: 'E-mail institucional', department: 'Departamento', password: 'Senha', confirm: 'Repita a senha' }, setFocus),
    );

  if (sent) {
    return (
      <ConfirmEmailStep
        sent={sent}
        creating={signup.isPending}
        createError={signup.error?.message}
        onCreate={(code) =>
          signup.mutate(
            { payload: payload(), code },
            {
              onSuccess: () => {
                toast.show('Conta criada. Boas-vindas ao PLEI!');
                navigate(paths.home, { replace: true });
              },
            },
          )
        }
        resend={{ run: requestCode, pending: sendCode.isPending, error: sendCode.error?.message }}
        onBack={() => {
          sendCode.reset();
          setSent(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(requestCode, onInvalid)} noValidate className="flex flex-col gap-4">
      <StepHeader step={1} total={2} label="Seus dados" />
      <Field label="Nome" htmlFor="signup-name" required error={visibleError(errors.name?.message, watch('name'), isSubmitted)}>
        <Input id="signup-name" autoComplete="name" autoFocus {...register('name')} />
      </Field>
      <Field label="E-mail institucional" htmlFor="signup-email" required help="O seu e-mail da UFPE, terminado em @ufpe.br ou @cin.ufpe.br. Ele recebe o código de confirmação." error={visibleError(errors.email?.message, watch('email'), isSubmitted) ?? serverErrorFor(sendCode.error?.message, 'email')}>
        <Input id="signup-email" type="email" autoComplete="email" placeholder="nome@cin.ufpe.br" {...register('email', { onChange: () => sendCode.reset() })} />
      </Field>
      <Field label="Departamento" htmlFor="signup-department" required error={visibleError(errors.department?.message, watch('department'), isSubmitted)}>
        <Input id="signup-department" {...register('department')} />
      </Field>
      <PasswordFields idPrefix="signup" register={register} value={watch('password')} confirm={watch('confirm')} attempted={isSubmitted} invalid={{ password: Boolean(errors.password), confirm: Boolean(errors.confirm) }} />

      {serverErrorFor(sendCode.error?.message, 'general') && (
        <p role="alert" className="text-small font-medium text-critical">
          {sendCode.error?.message}
        </p>
      )}

      <Button variant="primary" size="xl" type="submit" fullWidth disabled={sendCode.isPending} className="mt-1">
        {sendCode.isPending ? 'Enviando o código' : 'Continuar'}
        {!sendCode.isPending && <ArrowRightIcon size={20} />}
      </Button>
      <p className="text-center text-small text-ink-3">Na próxima etapa, confirme o e-mail com o código que vamos enviar.</p>
      {problems && <MissingFieldsDialog description="Para continuar, preencha o que está abaixo." items={problems} onClose={() => setProblems(null)} />}
    </form>
  );
};

const orgSignupSchema = z
  .object({
    organizationName: z.string().trim().min(1, 'Escreva o nome da organização.'),
    organizationType: z.string().min(1),
    location: z.string().trim().min(1, 'Escreva o bairro e a cidade. Ex.: Várzea, Recife.'),
    name: z.string().trim().min(1, 'Escreva seu nome.'),
    position: z.string().trim().min(1, 'Escreva seu cargo ou papel. Ex.: Coordenadora.'),
    email: z.string().trim().min(1, 'Escreva seu e-mail.').email('Confira o e-mail: ele precisa ter @ e um ponto. Ex.: nome@organizacao.org.br'),
    password,
    confirm: z.string(),
  })
  .refine(samePassword, SAME_PASSWORD);

type OrgSignupValues = z.infer<typeof orgSignupSchema>;

/** Cadastro da organização: quem ela é e quem vai cuidar das demandas, que vira o ponto focal. */
const OrganizationSignup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const sendCode = useOrgSignupCode();
  const signup = useOrgSignup();
  const [sent, setSent] = useState<CodeSent | null>(null);
  const [problems, setProblems] = useState<MissingItem[] | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<OrgSignupValues>({
    mode: 'onChange',
    resolver: zodResolver(orgSignupSchema),
    defaultValues: { organizationName: '', organizationType: ORGANIZATION_TYPES[1], location: '', name: '', position: '', email: '', password: '', confirm: '' },
  });

  const payload = () => {
    const { confirm: _confirm, ...values } = getValues();
    return values;
  };
  const requestCode = () => sendCode.mutate(payload(), { onSuccess: setSent });
  const onInvalid = (formErrors: typeof errors) =>
    setProblems(
      problemsFrom(
        formErrors,
        { organizationName: 'Nome da organização', location: 'Onde atua', name: 'Seu nome', position: 'Seu cargo', email: 'E-mail', password: 'Senha', confirm: 'Repita a senha' },
        setFocus,
      ),
    );

  if (sent) {
    return (
      <ConfirmEmailStep
        sent={sent}
        creating={signup.isPending}
        createError={signup.error?.message}
        onCreate={(code) =>
          signup.mutate(
            { payload: payload(), code },
            {
              onSuccess: () => {
                toast.show('Organização cadastrada. Boas-vindas ao PLEI!');
                navigate(paths.orgHome, { replace: true });
              },
            },
          )
        }
        resend={{ run: requestCode, pending: sendCode.isPending, error: sendCode.error?.message }}
        onBack={() => {
          sendCode.reset();
          setSent(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(requestCode, onInvalid)} noValidate className="flex flex-col gap-4">
      <StepHeader step={1} total={2} label="Dados da organização" />
      <Field label="Nome da organização" htmlFor="signup-org-name" required error={visibleError(errors.organizationName?.message, watch('organizationName'), isSubmitted) ?? serverErrorFor(sendCode.error?.message, 'organizationName')}>
        <Input id="signup-org-name" autoComplete="organization" autoFocus {...register('organizationName', { onChange: () => sendCode.reset() })} />
      </Field>
      <div>
        <p className="mb-1.5 text-small font-medium text-ink-2">Tipo</p>
        <OrgTypePicker compact value={watch('organizationType')} onChange={(type) => setValue('organizationType', type)} />
      </div>
      <Field label="Onde atua" htmlFor="signup-org-location" required error={visibleError(errors.location?.message, watch('location'), isSubmitted)}>
        <Input id="signup-org-location" placeholder="Ex.: Várzea, Recife" {...register('location')} />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Seu nome" htmlFor="signup-org-person" required error={visibleError(errors.name?.message, watch('name'), isSubmitted)}>
          <Input id="signup-org-person" autoComplete="name" {...register('name')} />
        </Field>
        <Field label="Seu cargo" htmlFor="signup-org-position" required error={visibleError(errors.position?.message, watch('position'), isSubmitted)}>
          <Input id="signup-org-position" autoComplete="organization-title" {...register('position')} />
        </Field>
      </div>
      <Field label="E-mail" htmlFor="signup-org-email" required help="É com ele que você entra, e ele recebe o código de confirmação. Os docentes recebem este contato quando levarem uma demanda de vocês para a turma." error={visibleError(errors.email?.message, watch('email'), isSubmitted) ?? serverErrorFor(sendCode.error?.message, 'email')}>
        <Input id="signup-org-email" type="email" autoComplete="email" {...register('email', { onChange: () => sendCode.reset() })} />
      </Field>
      <PasswordFields idPrefix="signup-org" register={register} value={watch('password')} confirm={watch('confirm')} attempted={isSubmitted} invalid={{ password: Boolean(errors.password), confirm: Boolean(errors.confirm) }} />

      {serverErrorFor(sendCode.error?.message, 'general') && (
        <p role="alert" className="text-small font-medium text-critical">
          {sendCode.error?.message}
        </p>
      )}

      <Button variant="primary" size="xl" type="submit" fullWidth disabled={sendCode.isPending} className="mt-1">
        {sendCode.isPending ? 'Enviando o código' : 'Continuar'}
        {!sendCode.isPending && <ArrowRightIcon size={20} />}
      </Button>
      <p className="text-center text-small text-ink-3">Na próxima etapa, confirme o e-mail com o código que vamos enviar.</p>
      {problems && <MissingFieldsDialog description="Para continuar, preencha o que está abaixo." items={problems} onClose={() => setProblems(null)} />}
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
            <ArrowRightIcon size={16} />
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
