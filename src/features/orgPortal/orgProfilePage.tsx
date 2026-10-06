import { useState, type FormEvent } from 'react';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Field, FormGroup, Input, Select, Textarea } from '@/components/ui/formControls';
import { CheckIcon, LogoutIcon } from '@/components/ui/icons';
import { Monogram } from '@/components/ui/monogram';
import { Page, Section } from '@/components/ui/page';
import { ProfileHeader } from '@/components/ui/profileHeader';
import type { OrgAccount } from '@/domain/types';
import { useLogout } from '@/features/auth/useAuth';
import { organizationCover } from '@/lib/covers';
import { ImageSettings } from './components/imageSettings';
import type { OrgProfile, OrgProfileInput } from './types';
import { useOrgAccount, useOrgProfile, useUpdateOrgAccount, useUpdateOrgProfile } from './useOrgPortal';
import { MEETING_SUGGESTIONS, ORGANIZATION_TYPES } from './utils/orgPresentation';

const SaveBar = ({ pending, error }: { pending: boolean; error: Error | null }) => (
  <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
    {error && (
      <p role="alert" className="mr-auto text-sm text-critical">
        {error.message}
      </p>
    )}
    <Button variant="primary" type="submit" disabled={pending}>
      <CheckIcon size={15} />
      {pending ? 'Salvando' : 'Salvar'}
    </Button>
  </div>
);

const toInput = ({ organization, contact }: OrgProfile): OrgProfileInput => ({
  type: organization.type,
  location: organization.location,
  about: organization.about,
  audience: organization.audience,
  site: organization.site,
  meetingCadence: organization.meetingCadence,
  onSiteVisit: organization.onSiteVisit,
  contact: { ...contact },
});

/** O perfil que os docentes leem antes de reservar: quem é a organização e como ela trabalha com a turma. */
const ProfileForm = ({ profile }: { profile: OrgProfile }) => {
  const toast = useToast();
  const update = useUpdateOrgProfile();
  const [input, setInput] = useState(() => toInput(profile));
  const set = (patch: Partial<OrgProfileInput>) => setInput((current) => ({ ...current, ...patch }));
  const setContact = (patch: Partial<OrgProfileInput['contact']>) => setInput((current) => ({ ...current, contact: { ...current.contact, ...patch } }));
  // Tipo cadastrado fora da lista (vindo de antes) continua escolhível.
  const types = ORGANIZATION_TYPES.includes(input.type) ? ORGANIZATION_TYPES : [input.type, ...ORGANIZATION_TYPES];

  const save = (event: FormEvent) => {
    event.preventDefault();
    update.mutate(input, { onSuccess: () => toast.show('Perfil salvo. Os docentes já veem a versão nova.') });
  };

  return (
    <form onSubmit={save} className="@container rounded-lg border border-line p-5 sm:p-6">
      <FormGroup title="Quem são vocês" hint="Aparece no perfil da organização e no detalhe de cada demanda.">
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Tipo" htmlFor="perfil-tipo">
              <Select id="perfil-tipo" value={input.type} onChange={(event) => set({ type: event.target.value })}>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Onde atuam" htmlFor="perfil-local">
              <Input id="perfil-local" value={input.location} onChange={(event) => set({ location: event.target.value })} placeholder="Ex.: Várzea, Recife" />
            </Field>
          </div>
          <Field label="Sobre" htmlFor="perfil-sobre" hint="O que a organização faz, em duas ou três frases.">
            <Textarea id="perfil-sobre" rows={4} value={input.about} onChange={(event) => set({ about: event.target.value })} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Público atendido" htmlFor="perfil-publico">
              <Input id="perfil-publico" value={input.audience} onChange={(event) => set({ audience: event.target.value })} />
            </Field>
            <Field label="Site, opcional" htmlFor="perfil-site">
              <Input id="perfil-site" value={input.site} onChange={(event) => set({ site: event.target.value })} placeholder="organizacao.org.br" />
            </Field>
          </div>
        </div>
      </FormGroup>

      <FormGroup title="Como trabalham com a turma" hint="O docente lê isso para saber se a rotina de vocês cabe na da disciplina.">
        <div className="flex flex-col gap-5">
          <Field label="Reuniões" htmlFor="perfil-reunioes" hint={`Ex.: ${MEETING_SUGGESTIONS[1]}`}>
            <Input id="perfil-reunioes" value={input.meetingCadence} onChange={(event) => set({ meetingCadence: event.target.value })} />
          </Field>
          <Field label="Visita da turma" htmlFor="perfil-visita" hint="Se a turma pode ir até vocês, e com quanta antecedência.">
            <Input id="perfil-visita" value={input.onSiteVisit} onChange={(event) => set({ onSiteVisit: event.target.value })} />
          </Field>
        </div>
      </FormGroup>

      <FormGroup title="Ponto focal" hint="Quem fala com o docente. O contato só aparece para quem levou uma demanda de vocês para a turma.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nome" htmlFor="perfil-focal-nome">
            <Input id="perfil-focal-nome" value={input.contact.focalName} onChange={(event) => setContact({ focalName: event.target.value })} />
          </Field>
          <Field label="Cargo" htmlFor="perfil-focal-cargo">
            <Input id="perfil-focal-cargo" value={input.contact.focalRole} onChange={(event) => setContact({ focalRole: event.target.value })} />
          </Field>
          <Field label="E-mail" htmlFor="perfil-focal-email">
            <Input id="perfil-focal-email" type="email" value={input.contact.email} onChange={(event) => setContact({ email: event.target.value })} />
          </Field>
          <Field label="Melhor canal" htmlFor="perfil-focal-canal">
            <Input id="perfil-focal-canal" value={input.contact.channel} onChange={(event) => setContact({ channel: event.target.value })} placeholder="Ex.: E-mail e telefone" />
          </Field>
        </div>
      </FormGroup>

      <SaveBar pending={update.isPending} error={update.error} />
    </form>
  );
};

const AccountForm = ({ account }: { account: OrgAccount }) => {
  const toast = useToast();
  const update = useUpdateOrgAccount();
  const [name, setName] = useState(account.name);
  const [position, setPosition] = useState(account.position);
  const [phone, setPhone] = useState(account.phone);

  const save = (event: FormEvent) => {
    event.preventDefault();
    update.mutate({ name, position, phone }, { onSuccess: () => toast.show('Dados salvos.') });
  };

  return (
    <form onSubmit={save} className="rounded-lg border border-line p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome" htmlFor="conta-org-nome">
          <Input id="conta-org-nome" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
        </Field>
        <Field label="Cargo" htmlFor="conta-org-cargo">
          <Input id="conta-org-cargo" value={position} onChange={(event) => setPosition(event.target.value)} />
        </Field>
        <Field label="E-mail" htmlFor="conta-org-email" hint="É o seu login e não muda aqui.">
          <Input id="conta-org-email" value={account.email} readOnly className="bg-canvas text-ink-2" />
        </Field>
        <Field label="Telefone, opcional" htmlFor="conta-org-telefone">
          <Input id="conta-org-telefone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(81) 90000-0000" autoComplete="tel" />
        </Field>
      </div>
      <SaveBar pending={update.isPending} error={update.error} />
    </form>
  );
};

export const OrgProfilePage = () => {
  const profileQuery = useOrgProfile();
  const accountQuery = useOrgAccount();
  const logout = useLogout();
  const organization = profileQuery.data?.organization;

  return (
    <Page
      title="Perfil da organização"
      hero={
        organization && (
          <ProfileHeader
            avatar={<Monogram name={organization.name} logo={organization.logo} size="xl" />}
            eyebrow={organization.type}
            title={organization.name}
            meta={organization.location}
            cover={organizationCover(organization.id, organization.cover)}
          />
        )
      }
    >
      <Section
        title="Perfil público"
        description="O mesmo que os docentes veem ao abrir a organização. Para mudar o nome, fale com o L.E.I."
      >
        <QueryView query={profileQuery}>
          {(profile) => (
            <>
              <ImageSettings organization={profile.organization} />
              <ProfileForm key={profile.organization.id} profile={profile} />
            </>
          )}
        </QueryView>
      </Section>
      <Section title="Sua conta">
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
