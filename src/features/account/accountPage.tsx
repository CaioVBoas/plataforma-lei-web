import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { CloseIcon, PencilIcon, SaveIcon, UserIcon } from '@/components/ui/icons';
import { InfoList } from '@/components/ui/infoList';
import { Avatar } from '@/components/ui/avatar';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Field, FormGroup, Input } from '@/components/ui/formControls';
import { Page, Section } from '@/components/ui/page';
import { ProfileHeader } from '@/components/ui/profileHeader';
import { resizeToSquare } from '@/utils/resizeImage';
import type { Account } from '@/domain/types';
import { AccountAccess } from './components/accountAccess';
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

const DATA_GROUP = { title: 'Seus dados', hint: 'As organizações veem seu nome e departamento; o telefone, só nos seus projetos com elas.' };

/** Os dados para ler: tudo já preenchido, sem campo aberto. */
const AccountView = ({ account }: { account: Account }) => (
  <div className="@container rounded-lg border border-line bg-surface p-6 sm:p-7">
    <FormGroup {...DATA_GROUP}>
      <InfoList
        items={[
          { label: 'Nome', value: account.name },
          { label: 'Departamento', value: account.department },
          { label: 'Telefone', value: account.phone },
        ]}
      />
    </FormGroup>
  </div>
);

/** Os mesmos dados com os campos abertos, depois de "Editar perfil". */
const AccountForm = ({ account, onClose }: { account: Account; onClose: () => void }) => {
  const toast = useToast();
  const update = useUpdateAccount();
  const [name, setName] = useState(account.name);
  const [department, setDepartment] = useState(account.department);
  const [phone, setPhone] = useState(account.phone);

  const save = (event: FormEvent) => {
    event.preventDefault();
    update.mutate(
      { name, department, phone },
      {
        onSuccess: () => {
          toast.show('Dados salvos.');
          onClose();
        },
      },
    );
  };

  return (
    <form onSubmit={save} aria-label="Editar perfil" className="@container rounded-lg border border-accent bg-surface p-6 sm:p-7">
      <FormGroup {...DATA_GROUP}>
        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-1.5 text-small font-medium text-ink-2">Foto</p>
            <div className="flex flex-wrap items-center gap-3">
              <Avatar name={account.name} photo={account.photo || undefined} size="xl" />
              <PhotoActions account={account} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Nome" htmlFor="conta-nome">
              <Input id="conta-nome" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
            </Field>
            <Field label="Departamento" htmlFor="conta-departamento">
              <Input id="conta-departamento" value={department} onChange={(event) => setDepartment(event.target.value)} />
            </Field>
            <Field label="Telefone, opcional" htmlFor="conta-telefone">
              <Input id="conta-telefone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(81) 90000-0000" autoComplete="tel" />
            </Field>
          </div>
        </div>
      </FormGroup>
      <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-6">
        {update.isError && (
          <p role="alert" className="mr-auto text-small text-critical">
            {update.error.message}
          </p>
        )}
        <Button variant="secondary" size="xl" onClick={onClose}>
          <CloseIcon size={20} />
          Cancelar
        </Button>
        <Button variant="primary" size="xl" type="submit" disabled={update.isPending}>
          <SaveIcon size={20} />
          {update.isPending ? 'Salvando' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  );
};

export const AccountPage = () => {
  const accountQuery = useAccount();
  const [editing, setEditing] = useState(false);

  return (
    <Page
      title="Minha conta"
      hero={
        accountQuery.data && (
          <ProfileHeader
            avatar={<Avatar name={accountQuery.data.name} photo={accountQuery.data.photo || undefined} size="xl" />}
            eyebrow={accountQuery.data.department}
            title={accountQuery.data.name}
            meta={accountQuery.data.email}
          />
        )
      }
    >
      <Section
        title="Perfil"
        description="O que as organizações e o L.E.I. veem sobre você."
        aside={
          !editing && (
            <Button variant="primary" size="xl" onClick={() => setEditing(true)}>
              <PencilIcon size={20} />
              Editar perfil
            </Button>
          )
        }
      >
        <QueryView query={accountQuery}>
          {(account) => (editing ? <AccountForm account={account} onClose={() => setEditing(false)} /> : <AccountView account={account} />)}
        </QueryView>
      </Section>

      <Section title="Conta" description="Como você entra no PLEI. Fica separado do perfil e não muda com o Editar perfil.">
        <QueryView query={accountQuery}>
          {(account) => (
            <AccountAccess
              role="docente"
              email={account.email}
              emailHint="Vem do seu e-mail institucional e não muda aqui."
              deleteConsequence="Seu acesso ao PLEI é apagado e você sai na hora. Projetos já registrados no SIGAA continuam com o L.E.I. e com as organizações."
            />
          )}
        </QueryView>
      </Section>
    </Page>
  );
};
