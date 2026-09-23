import { useState, type FormEvent } from 'react';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/formControls';
import { Page, Section } from '@/components/ui/page';
import type { Account } from '@/domain/types';
import { useLogout } from '@/features/auth/useAuth';
import { useAccount, useUpdateAccount } from './useAccount';

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
        <p role="alert" className="text-sm text-critical">
          {update.error.message}
        </p>
      )}
      <div className="flex justify-end">
        <Button variant="primary" type="submit" disabled={update.isPending}>
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
    <Page title="Minha conta" width="narrow">
      <Section title="Seus dados">
        <QueryView query={accountQuery}>{(account) => <AccountForm account={account} />}</QueryView>
      </Section>
      <Section title="Sessão">
        <Button variant="secondary" onClick={logout}>
          Sair
        </Button>
      </Section>
    </Page>
  );
};
