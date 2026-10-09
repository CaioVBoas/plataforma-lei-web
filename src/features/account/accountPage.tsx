import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { CheckIcon, LogoutIcon, UserIcon } from '@/components/ui/icons';
import { Avatar } from '@/components/ui/avatar';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/formControls';
import { Page, Section } from '@/components/ui/page';
import { ProfileHeader } from '@/components/ui/profileHeader';
import { resizeToSquare } from '@/utils/resizeImage';
import type { Account } from '@/domain/types';
import { useLogout } from '@/features/auth/useAuth';
import { useAccount, useUpdateAccount } from './useAccount';

/** Trocar ou tirar a foto de perfil. A imagem é reduzida no navegador antes de salvar. */
const PhotoActions = ({ account }: { account: Account }) => {
  const toast = useToast();
  const update = useUpdateAccount();
  const inputRef = useRef<HTMLInputElement>(null);

  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const photo = await resizeToSquare(file);
      update.mutate({ photo }, { onSuccess: () => toast.show('Foto atualizada.') });
    } catch (error) {
      toast.show(error instanceof Error ? error.message : 'Não deu para usar esta imagem.');
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={choose} />
      <Button variant="secondary" size="sm" disabled={update.isPending} onClick={() => inputRef.current?.click()}>
        <UserIcon size={16} />
        {account.photo ? 'Trocar foto' : 'Adicionar foto'}
      </Button>
      {account.photo && (
        <Button variant="destructive" size="sm" disabled={update.isPending} onClick={() => update.mutate({ photo: '' }, { onSuccess: () => toast.show('Foto removida.') })}>
          Remover
        </Button>
      )}
    </>
  );
};

const AccountForm = ({ account }: { account: Account }) => {
  const toast = useToast();
  const update = useUpdateAccount();
  const [name, setName] = useState(account.name);
  const [department, setDepartment] = useState(account.department);
  const [phone, setPhone] = useState(account.phone);

  const save = (event: FormEvent) => {
    event.preventDefault();
    update.mutate({ name, department, phone }, { onSuccess: () => toast.show('Dados salvos.') });
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-5 rounded-lg border border-line p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome" htmlFor="conta-nome">
          <Input id="conta-nome" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
        </Field>
        <Field label="Departamento" htmlFor="conta-departamento">
          <Input id="conta-departamento" value={department} onChange={(event) => setDepartment(event.target.value)} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-mail institucional" htmlFor="conta-email" hint="Vem do seu login e não muda aqui.">
          <Input id="conta-email" value={account.email} readOnly className="bg-canvas text-ink-2" />
        </Field>
        <Field label="Telefone, opcional" htmlFor="conta-telefone" hint="As organizações veem só nos seus projetos com elas.">
          <Input
            id="conta-telefone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="(81) 90000-0000"
            autoComplete="tel"
          />
        </Field>
      </div>
      {update.isError && (
        <p role="alert" className="text-small text-critical">
          {update.error.message}
        </p>
      )}
      <div className="flex justify-end">
        <Button variant="primary" type="submit" disabled={update.isPending}>
          <CheckIcon size={16} />
          Salvar
        </Button>
      </div>
    </form>
  );
};

export const AccountPage = () => {
  const accountQuery = useAccount();
  const logout = useLogout();

  return (
    <Page
      title="Minha conta"
      hero={
        accountQuery.data && (
          <ProfileHeader
            avatar={<Avatar name={accountQuery.data.name} photo={accountQuery.data.photo || undefined} size="xl" />}
            actions={<PhotoActions account={accountQuery.data} />}
            eyebrow={accountQuery.data.department}
            title={accountQuery.data.name}
            meta={accountQuery.data.email}
          />
        )
      }
    >
      <Section title="Seus dados">
        <QueryView query={accountQuery}>{(account) => <AccountForm account={account} />}</QueryView>
      </Section>
      <Section title="Sessão">
        <Button variant="secondary" onClick={logout}>
          <LogoutIcon size={16} />
          Sair
        </Button>
      </Section>
    </Page>
  );
};
