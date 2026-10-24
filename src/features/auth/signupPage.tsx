import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { useForm, type FieldErrors, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
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
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icons';
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
  <>
    <Field label="Senha" htmlFor={`${idPrefix}-password`} required invalid={attempted && invalid.password}>
      <Input id={`${idPrefix}-password`} type="password" autoComplete="new-password" {...register('password')} />
    </Field>
    <Field label="Repita a senha" htmlFor={`${idPrefix}-confirm`} required invalid={attempted && invalid.confirm}>
      <Input id={`${idPrefix}-confirm`} type="password" autoComplete="new-password" {...register('confirm')} />
      <div className="mt-3">
        <PasswordRules password={value} confirm={confirm} attempted={attempted} />
      </div>
    </Field>
  </>
);

/** Uma fase do cadastro: o nome na barra de etapas, uma frase do que se pede e os campos que ela confere. */
interface Phase<Values extends FieldValues> {
  label: string;
  intro: string;
  fields: Path<Values>[];
}

/**
 * Avança fase a fase: "Continuar" confere só os campos da fase atual e, se
 * algo faltar, abre o aviso "Falta preencher". Na última, pede o código.
 */
const usePhases = <Values extends FieldValues>(form: UseFormReturn<Values>, phases: Phase<Values>[], labels: Partial<Record<Path<Values>, string>>, onLast: () => void) => {
  const [phase, setPhase] = useState(0);
  const [tried, setTried] = useState<number[]>([]);
  const [problems, setProblems] = useState<MissingItem[] | null>(null);
  const { trigger, getFieldState, setFocus } = form;
  const first = phases[phase].fields[0];

  // Cada fase abre com o cursor no primeiro campo.
  useEffect(() => {
    setFocus(first);
  }, [first, setFocus]);

  const next = async (event?: FormEvent) => {
    event?.preventDefault();
    const fields = phases[phase].fields;
    setTried((current) => (current.includes(phase) ? current : [...current, phase]));
    if (!(await trigger(fields))) {
      const errors = Object.fromEntries(fields.map((field) => [field, getFieldState(field).error])) as FieldErrors<Values>;
      setProblems(problemsFrom(errors, labels, setFocus));
      return;
    }
    if (phase < phases.length - 1) setPhase(phase + 1);
    else onLast();
  };

  return {
    phase,
    setPhase,
    current: phases[phase],
    isLast: phase === phases.length - 1,
    attempted: tried.includes(phase),
    next,
    back: () => setPhase((current) => Math.max(0, current - 1)),
    problems: problems && <MissingFieldsDialog description="Para continuar, preencha o que está abaixo." items={problems} onClose={() => setProblems(null)} />,
  };
};

/** O topo da fase: a barra de etapas e uma frase curta do que vem nela. */
const PhaseIntro = ({ step, total, label, intro }: { step: number; total: number; label: string; intro: string }) => (
  <>
    <StepHeader step={step} total={total} label={label} />
    <p className="mb-7 text-body text-ink-2">{intro}</p>
  </>
);

/** "Voltar" e "Continuar" no pé de cada fase; na primeira, só "Continuar". */
const PhaseActions = ({ onBack, pending, isLast, error }: { onBack?: () => void; pending: boolean; isLast: boolean; error?: string }) => (
  <div className="mt-8 flex flex-col gap-4">
    {error && (
      <p role="alert" className="text-small font-medium text-critical">
        {error}
      </p>
    )}
    <div className={onBack ? 'grid grid-cols-[auto_1fr] gap-3' : undefined}>
      {onBack && (
        <Button variant="secondary" size="xl" onClick={onBack}>
          <ArrowLeftIcon size={20} />
          Voltar
        </Button>
      )}
      <Button variant="primary" size="xl" type="submit" fullWidth disabled={pending}>
        {pending ? 'Enviando o código' : 'Continuar'}
        {!pending && <ArrowRightIcon size={20} />}
      </Button>
    </div>
    {isLast && <p className="text-center text-small text-ink-3">Na próxima etapa, confirme o e-mail com o código que vamos enviar.</p>}
  </div>
);

/** A última etapa do cadastro, igual nos dois perfis: o código enviado ao e-mail cria a conta. */
const ConfirmEmailStep = ({
  step,
  sent,
  creating,
  createError,
  onCreate,
  resend,
  onBack,
}: {
  step: number;
  sent: CodeSent;
  creating: boolean;
  createError?: string;
  onCreate: (code: string) => void;
  resend: { run: () => void; pending: boolean; error?: string };
  onBack: () => void;
}) => (
  <>
    <StepHeader step={step} total={step} label="Confirmar o e-mail" />
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

/** Os campos de uma fase, com espaço de sobra entre um e outro. */
const PhaseFields = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-6">{children}</div>;

const TEACHER_PHASES: Phase<SignupValues>[] = [
  { label: 'Seus dados', intro: 'Comece por quem você é na UFPE.', fields: ['name', 'email', 'department'] },
  { label: 'Sua senha', intro: 'Crie a senha que você vai usar para entrar, junto com o e-mail.', fields: ['password', 'confirm'] },
];
const TEACHER_LABELS = { name: 'Nome', email: 'E-mail institucional', department: 'Departamento', password: 'Senha', confirm: 'Repita a senha' };

const TeacherSignup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const sendCode = useSignupCode();
  const signup = useSignup();
  const [sent, setSent] = useState<CodeSent | null>(null);
  const form = useForm<SignupValues>({
    mode: 'onChange',
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', department: 'Centro de Informática', password: '', confirm: '' },
  });
  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = form;

  const payload = () => {
    const { name, email, department, password: secret } = getValues();
    return { name, email, department, password: secret };
  };
  // Se o servidor recusar o e-mail, a pessoa volta para a fase dele, com o erro no campo.
  const requestCode = () =>
    sendCode.mutate(payload(), {
      onSuccess: setSent,
      onError: (error) => serverErrorFor(error.message, 'email') && phases.setPhase(0),
    });
  const phases = usePhases(form, TEACHER_PHASES, TEACHER_LABELS, requestCode);
  const total = TEACHER_PHASES.length + 1;

  if (sent) {
    return (
      <ConfirmEmailStep
        step={total}
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
          phases.setPhase(0);
        }}
      />
    );
  }

  const { phase, current, attempted } = phases;
  return (
    <form onSubmit={phases.next} noValidate>
      <PhaseIntro step={phase + 1} total={total} label={current.label} intro={current.intro} />
      <PhaseFields>
        {phase === 0 ? (
          <>
            <Field label="Nome" htmlFor="signup-name" required error={visibleError(errors.name?.message, watch('name'), attempted)}>
              <Input id="signup-name" autoComplete="name" {...register('name')} />
            </Field>
            <Field label="E-mail institucional" htmlFor="signup-email" required help="O seu e-mail da UFPE, terminado em @ufpe.br ou @cin.ufpe.br. Ele recebe o código de confirmação." error={visibleError(errors.email?.message, watch('email'), attempted) ?? serverErrorFor(sendCode.error?.message, 'email')}>
              <Input id="signup-email" type="email" autoComplete="email" placeholder="nome@cin.ufpe.br" {...register('email', { onChange: () => sendCode.reset() })} />
            </Field>
            <Field label="Departamento" htmlFor="signup-department" required error={visibleError(errors.department?.message, watch('department'), attempted)}>
              <Input id="signup-department" {...register('department')} />
            </Field>
          </>
        ) : (
          <PasswordFields idPrefix="signup" register={register} value={watch('password')} confirm={watch('confirm')} attempted={attempted} invalid={{ password: Boolean(errors.password), confirm: Boolean(errors.confirm) }} />
        )}
      </PhaseFields>
      <PhaseActions onBack={phase > 0 ? phases.back : undefined} pending={sendCode.isPending} isLast={phases.isLast} error={serverErrorFor(sendCode.error?.message, 'general')} />
      {phases.problems}
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

const ORG_PHASES: Phase<OrgSignupValues>[] = [
  { label: 'A organização', intro: 'Conte quem é a organização e onde ela atua.', fields: ['organizationName', 'organizationType', 'location'] },
  { label: 'Quem cuida das demandas', intro: 'A pessoa que fala com os docentes. É ela quem entra na conta.', fields: ['name', 'position', 'email'] },
  { label: 'Sua senha', intro: 'Crie a senha que você vai usar para entrar, junto com o e-mail.', fields: ['password', 'confirm'] },
];
const ORG_LABELS = { organizationName: 'Nome da organização', location: 'Onde atua', name: 'Seu nome', position: 'Seu cargo', email: 'E-mail', password: 'Senha', confirm: 'Repita a senha' };

/** Cadastro da organização: quem ela é e quem vai cuidar das demandas, que vira o ponto focal. */
const OrganizationSignup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const sendCode = useOrgSignupCode();
  const signup = useOrgSignup();
  const [sent, setSent] = useState<CodeSent | null>(null);
  const form = useForm<OrgSignupValues>({
    mode: 'onChange',
    resolver: zodResolver(orgSignupSchema),
    defaultValues: { organizationName: '', organizationType: ORGANIZATION_TYPES[1], location: '', name: '', position: '', email: '', password: '', confirm: '' },
  });
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const payload = () => {
    const { confirm: _confirm, ...values } = getValues();
    return values;
  };
  // Se o servidor recusar o nome ou o e-mail, a pessoa volta para a fase dele, com o erro no campo.
  const requestCode = () =>
    sendCode.mutate(payload(), {
      onSuccess: setSent,
      onError: (error) => {
        if (serverErrorFor(error.message, 'organizationName')) phases.setPhase(0);
        else if (serverErrorFor(error.message, 'email')) phases.setPhase(1);
      },
    });
  const phases = usePhases(form, ORG_PHASES, ORG_LABELS, requestCode);
  const total = ORG_PHASES.length + 1;

  if (sent) {
    return (
      <ConfirmEmailStep
        step={total}
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
          phases.setPhase(1);
        }}
      />
    );
  }

  const { phase, current, attempted } = phases;
  return (
    <form onSubmit={phases.next} noValidate>
      <PhaseIntro step={phase + 1} total={total} label={current.label} intro={current.intro} />
      <PhaseFields>
        {phase === 0 && (
          <>
            <Field label="Nome da organização" htmlFor="signup-org-name" required error={visibleError(errors.organizationName?.message, watch('organizationName'), attempted) ?? serverErrorFor(sendCode.error?.message, 'organizationName')}>
              <Input id="signup-org-name" autoComplete="organization" {...register('organizationName', { onChange: () => sendCode.reset() })} />
            </Field>
            <div>
              <p className="mb-2 text-small font-medium text-ink-2">Tipo</p>
              <OrgTypePicker compact value={watch('organizationType')} onChange={(type) => setValue('organizationType', type)} />
            </div>
            <Field label="Onde atua" htmlFor="signup-org-location" required error={visibleError(errors.location?.message, watch('location'), attempted)}>
              <Input id="signup-org-location" placeholder="Ex.: Várzea, Recife" {...register('location')} />
            </Field>
          </>
        )}
        {phase === 1 && (
          <>
            <Field label="Seu nome" htmlFor="signup-org-person" required error={visibleError(errors.name?.message, watch('name'), attempted)}>
              <Input id="signup-org-person" autoComplete="name" {...register('name')} />
            </Field>
            <Field label="Seu cargo" htmlFor="signup-org-position" required error={visibleError(errors.position?.message, watch('position'), attempted)}>
              <Input id="signup-org-position" autoComplete="organization-title" placeholder="Ex.: Coordenadora" {...register('position')} />
            </Field>
            <Field label="E-mail" htmlFor="signup-org-email" required help="É com ele que você entra, e ele recebe o código de confirmação. Os docentes recebem este contato quando levarem uma demanda de vocês para a turma." error={visibleError(errors.email?.message, watch('email'), attempted) ?? serverErrorFor(sendCode.error?.message, 'email')}>
              <Input id="signup-org-email" type="email" autoComplete="email" placeholder="nome@organizacao.org.br" {...register('email', { onChange: () => sendCode.reset() })} />
            </Field>
          </>
        )}
        {phase === 2 && (
          <PasswordFields idPrefix="signup-org" register={register} value={watch('password')} confirm={watch('confirm')} attempted={attempted} invalid={{ password: Boolean(errors.password), confirm: Boolean(errors.confirm) }} />
        )}
      </PhaseFields>
      <PhaseActions onBack={phase > 0 ? phases.back : undefined} pending={sendCode.isPending} isLast={phases.isLast} error={serverErrorFor(sendCode.error?.message, 'general')} />
      {phases.problems}
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
