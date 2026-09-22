import { useState } from 'react';
import { QueryView } from '@/components/feedback/query-states';
import { useToast } from '@/components/feedback/toast-context';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-controls';
import { NumberStepper } from '@/components/ui/number-stepper';
import { SectionBlock } from '@/components/ui/section-card';
import { SelectMenu } from '@/components/ui/select-menu';
import { ToggleChip } from '@/components/ui/toggle-chip';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { pluralize } from '@/utils/format';
import { PrivacySettings } from '../components/account/privacy-settings';
import { ProfileTabs } from '../components/profile-tabs';
import { useAccount, useUpdateAccount } from '../hooks/use-profile';
import type { Account } from '../types';

const CHANNELS = ['E-mail institucional', 'Telefone', 'Conversa na plataforma'];
const MAX_PROJECTS_PER_SEMESTER = 8;

const AccountForm = ({ account }: { account: Account }) => {
  const toast = useToast();
  const update = useUpdateAccount();
  const { copiedKey, copy } = useCopyToClipboard();
  const [name, setName] = useState(account.name);
  const [department, setDepartment] = useState(account.department);
  const [phone, setPhone] = useState(account.phone);

  const saveIdentity = () => update.mutate({ name, department, phone }, { onSuccess: () => toast.show('Dados salvos.') });

  return (
    <div className="flex flex-col gap-12">
      <SectionBlock title="Identificação">
        <div className="mt-2 mb-6 flex items-center gap-4">
          <Avatar name={account.name} size="xl" strong />
          <Button variant="outline-accent" size="sm" onClick={() => toast.show('Escolha uma imagem quadrada de pelo menos 200 por 200 pixels.')}>
            Trocar foto
          </Button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          <Field label="Nome" htmlFor="conta-nome">
            <Input id="conta-nome" value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Departamento" htmlFor="conta-departamento">
            <Input id="conta-departamento" value={department} onChange={(event) => setDepartment(event.target.value)} />
          </Field>
        </div>
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-n-700">E-mail institucional</p>
          <p className="text-[15px] text-n-800">{account.email}</p>
          <p className="mt-1 text-[13px] text-n-500">Vem do seu login e não muda aqui.</p>
        </div>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <div className="min-w-0 flex-[1_1_320px]">
            <p className="text-sm font-medium text-n-700">Link público do perfil</p>
            <p className="mt-[3px] text-[15px] text-n-800">{account.publicProfileLink}</p>
            <p className="mt-[3px] text-[13px] text-n-500">Existe porque você tem um caso publicado na vitrine de resultados.</p>
          </div>
          <Button variant="outline-accent" size="sm" onClick={() => copy('link', `https://${account.publicProfileLink}`)}>
            {copiedKey === 'link' ? 'Copiado' : 'Copiar link'}
          </Button>
        </div>
        <div className="mt-6">
          <Button variant="primary" size="lg" disabled={update.isPending} onClick={saveIdentity}>
            Salvar alterações
          </Button>
        </div>
      </SectionBlock>

      <SectionBlock title="Contato" description="A organização vê isso quando um projeto é vinculado, nunca antes.">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          <Field label="Telefone, opcional" htmlFor="conta-telefone">
            <Input
              id="conta-telefone"
              type="tel"
              placeholder="(81) 90000-0000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              onBlur={() => update.mutate({ phone })}
              className="tabular-nums"
            />
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium text-n-700">Canal preferido</p>
            <SelectMenu
              label="Canal preferido"
              shape="field"
              value={account.preferredChannel}
              onChange={(preferredChannel) => update.mutate({ preferredChannel })}
              options={CHANNELS.map((channel) => ({ value: channel, label: channel }))}
            />
          </div>
        </div>
      </SectionBlock>

      <SectionBlock title="Disponibilidade">
        <p className="mb-2 text-sm font-medium text-n-700">Projetos que você aceita conduzir por semestre</p>
        <NumberStepper
          label="Projetos que você aceita conduzir por semestre"
          value={account.projectsPerSemester}
          min={1}
          max={MAX_PROJECTS_PER_SEMESTER}
          onChange={(projectsPerSemester) => update.mutate({ projectsPerSemester })}
          formatValue={(value) => pluralize(value, 'projeto', 'projetos')}
          className="w-[200px]"
        />
        <div className="mt-6">
          <ToggleChip selected={account.receivingPaused} showCheck={false} onClick={() => update.mutate({ receivingPaused: !account.receivingPaused })}>
            Pausar recebimento de demandas
          </ToggleChip>
          <p className="mt-2.5 max-w-[62ch] text-[13px] leading-normal text-n-500">
            {account.receivingPaused
              ? 'Nenhuma demanda nova aparece no seu cardápio até você retomar.'
              : 'Você continua recebendo demandas compatíveis neste semestre.'}
          </p>
        </div>
      </SectionBlock>

      <PrivacySettings
        privacy={account.privacy}
        onToggle={(setting) => update.mutate({ privacy: { ...account.privacy, [setting]: !account.privacy[setting] } })}
        onShowPolicy={() => toast.show('Política de dados: o que a plataforma guarda e por quanto tempo.')}
      />

      <SectionBlock title="Sessão">
        <dl>
          <div className="flex items-baseline justify-between gap-4 border-b border-n-200 py-3.5">
            <dt className="text-[15px] text-n-500">Dispositivo atual</dt>
            <dd className="text-[15px] text-n-800">{account.currentDevice}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-n-200 py-3.5">
            <dt className="text-[15px] text-n-500">Último acesso</dt>
            <dd className="text-[15px] text-n-800 tabular-nums">{account.lastAccess}</dd>
          </div>
        </dl>
        <Button
          variant="outline-muted"
          size="sm"
          className="mt-4"
          onClick={() => toast.show('Sessões encerradas em todos os dispositivos. Esta sessão continua aberta.')}
        >
          Sair de todos os dispositivos
        </Button>
      </SectionBlock>
    </div>
  );
};

export const AccountPage = () => {
  usePageHeader('Meu perfil', 'Seus dados na plataforma');
  const accountQuery = useAccount();
  return (
    <div className="max-w-[760px]">
      <ProfileTabs />
      <QueryView query={accountQuery}>{(account) => <AccountForm account={account} />}</QueryView>
    </div>
  );
};
