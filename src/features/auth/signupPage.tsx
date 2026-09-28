import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { Field, Input } from '@/components/ui/formControls';
import { ArrowRightIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';
import { AuthShell, SoonNotice } from './components/authShell';
import { RoleTabs } from './components/roleTabs';
import { ROLE_COPY, isRole } from './roles';
import type { UserRole } from './types';
import { useSignup } from './useAuth';

const INSTITUTIONAL_EMAIL = /@(cin\.)?ufpe\.br$/i;

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome.'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .regex(INSTITUTIONAL_EMAIL, 'Use seu e-mail @ufpe.br ou @cin.ufpe.br.'),
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

export const SignupPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('perfil');
  const role: UserRole = isRole(requested) ? requested : 'docente';
  const copy = ROLE_COPY[role];

  useEffect(() => {
    document.title = 'Criar conta · Aperta o PL.E.I.';
  }, []);

  return (
    <AuthShell>
      <h2 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-ink">Criar conta</h2>
      <div className="mt-6 mb-7">
        <RoleTabs value={role} onChange={(next) => setSearchParams({ perfil: next }, { replace: true })} />
      </div>

      {copy.available ? (
        <TeacherSignup />
      ) : (
        <SoonNotice title={`${copy.label}: em breve`} text={copy.soon}>
          <Link to={paths.landing} className={buttonClassName({ variant: 'secondary' })}>
            Conhecer o Aperta o PL.E.I.
          </Link>
        </SoonNotice>
      )}

      <p className="mt-6 text-sm text-ink-2">
        Já tem conta?{' '}
        <Link to={paths.loginAs(role)} className={textLinkClassName}>
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
};
