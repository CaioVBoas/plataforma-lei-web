import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-controls';
import { CloseIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import type { PortalOption } from '../constants/portals';
import { useLogin, useRequestPasswordReset } from '../hooks/use-auth';
import { createLoginSchema, type LoginFormValues } from '../schemas/login-schema';

interface LoginFormProps {
  portal: PortalOption;
  onChangePortal: () => void;
  onSignedIn: () => void;
  onChooseArea: () => void;
}

export const LoginForm = ({ portal, onChangePortal, onSignedIn, onChooseArea }: LoginFormProps) => {
  const [notice, setNotice] = useState<string | null>(null);
  const login = useLogin();
  const passwordReset = useRequestPasswordReset();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(portal.id !== 'organization')),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit((values) => {
    setNotice(null);
    login.mutate(
      { portal: portal.id, ...values },
      {
        onSuccess: (result) => {
          if (result.outcome === 'notice') setNotice(result.message);
          else if (result.outcome === 'choose-area') onChooseArea();
          else onSignedIn();
        },
        onError: (error) => setError('email', { message: error.message }),
      },
    );
  });

  return (
    <form onSubmit={submit} noValidate>
      <h2 className="mb-1 text-[22px] leading-[1.3] font-bold text-n-800">Entrar na plataforma</h2>
      <p className="mb-5 text-sm text-n-600">{portal.loginHint}</p>

      <span
        className={cn(
          'mb-5 inline-flex h-8 items-center gap-[7px] rounded-full border pr-1.5 pl-[11px] text-[13px] font-medium',
          portal.tone === 'azul' ? 'border-azul-100 bg-azul-50 text-azul-800' : 'border-laranja-100 bg-laranja-50 text-laranja-800',
        )}
      >
        {portal.title}
        <button type="button" aria-label="Escolher outro portal" onClick={onChangePortal} className="flex size-5 items-center justify-center rounded-full hover:bg-n-0/60">
          <CloseIcon size={10} />
        </button>
      </span>

      <Field label="E-mail institucional" htmlFor="login-email" error={errors.email?.message}>
        <Input id="login-email" type="email" autoComplete="username" placeholder="seu.nome@cin.ufpe.br" className="h-12 rounded-xl px-3.5" {...register('email')} />
      </Field>
      <Field label="Senha" htmlFor="login-password" error={errors.password?.message} className="mt-4">
        <Input id="login-password" type="password" autoComplete="current-password" placeholder="Sua senha institucional" className="h-12 rounded-xl px-3.5" {...register('password')} />
      </Field>

      <div className="mt-2.5 mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => passwordReset.mutate(undefined, { onSuccess: setNotice })}
          className="text-[13px] font-medium text-azul-500 hover:text-azul-600"
        >
          Esqueci minha senha
        </button>
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={login.isPending} className="h-12 rounded-xl">
        Entrar
      </Button>

      {notice && (
        <p role="status" className="mt-3.5 rounded-xl bg-n-50 px-3 py-[11px] text-[13px] leading-[1.45] text-n-600">
          {notice}
        </p>
      )}
    </form>
  );
};
