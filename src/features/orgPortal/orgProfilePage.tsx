import { useState, type FormEvent } from 'react';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Field, FormGroup, Input, Textarea } from '@/components/ui/formControls';
import { CloseIcon, PencilIcon, SaveIcon } from '@/components/ui/icons';
import { InfoList } from '@/components/ui/infoList';
import { Monogram } from '@/components/ui/monogram';
import { Page, Section } from '@/components/ui/page';
import { ProfileHeader } from '@/components/ui/profileHeader';
import type { OrgAccount } from '@/domain/types';
import { AccountAccess } from '@/features/account/components/accountAccess';
import { organizationCover } from '@/lib/covers';
import { ImageSettings } from './components/imageSettings';
import { OrgTypePicker } from './components/orgTypePicker';
import type { OrgProfile, OrgProfileInput } from './types';
import { useOrgAccount, useOrgProfile, useUpdateOrgAccount, useUpdateOrgProfile } from './useOrgPortal';
import { MEETING_SUGGESTIONS } from './utils/orgPresentation';

const EditBar = ({ pending, error, onCancel }: { pending: boolean; error: Error | null; onCancel: () => void }) => (
  <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-6">
    {error && (
      <p role="alert" className="mr-auto text-small text-critical">
        {error.message}
      </p>
    )}
    <Button variant="secondary" size="xl" onClick={onCancel}>
      <CloseIcon size={20} />
      Cancelar
    </Button>
    <Button variant="primary" size="xl" type="submit" disabled={pending}>
      <SaveIcon size={20} />
      {pending ? 'Salvando' : 'Salvar alterações'}
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

const GROUPS = {
  who: { title: 'Quem são vocês', hint: 'Aparece no perfil da organização e no detalhe de cada demanda.' },
  how: { title: 'Como trabalham com a turma', hint: 'O docente lê isso para saber se a rotina de vocês cabe na da disciplina.' },
  focal: { title: 'Ponto focal', hint: 'Quem fala com o docente. O contato só aparece para quem levou uma demanda de vocês para a turma.' },
  you: { title: 'Quem usa esta conta', hint: 'Seu nome e cargo aparecem nas respostas às perguntas dos docentes.' },
};

/** O perfil para ler: tudo já preenchido, sem campo aberto. */
const ProfileView = ({ profile, account }: { profile: OrgProfile; account: OrgAccount }) => {
  const { organization, contact } = profile;
  return (
    <div className="@container rounded-lg border border-line bg-surface p-6 sm:p-7">
      <FormGroup {...GROUPS.who}>
        <InfoList
          items={[
            { label: 'Tipo', value: organization.type },
            { label: 'Onde atuam', value: organization.location },
            { label: 'Público atendido', value: organization.audience },
            { label: 'Site', value: organization.site },
            { label: 'Sobre', value: organization.about, wide: true },
          ]}
        />
      </FormGroup>
      <FormGroup {...GROUPS.how}>
        <InfoList
          items={[
            { label: 'Reuniões', value: organization.meetingCadence },
            { label: 'Visita da turma', value: organization.onSiteVisit },
          ]}
        />
      </FormGroup>
      <FormGroup {...GROUPS.focal}>
        <InfoList
          items={[
            { label: 'Nome', value: contact.focalName },
            { label: 'Cargo', value: contact.focalRole },
            { label: 'E-mail', value: contact.email },
            { label: 'Melhor canal', value: contact.channel },
          ]}
        />
      </FormGroup>
      <FormGroup {...GROUPS.you}>
        <InfoList
          items={[
            { label: 'Nome', value: account.name },
            { label: 'Cargo', value: account.position },
            { label: 'Telefone', value: account.phone },
          ]}
        />
      </FormGroup>
    </div>
  );
};

/** O mesmo perfil com os campos abertos, depois de "Editar perfil". Salvar ou cancelar volta para a leitura. */
const ProfileForm = ({ profile, account, onClose }: { profile: OrgProfile; account: OrgAccount; onClose: () => void }) => {
  const toast = useToast();
  const updateProfile = useUpdateOrgProfile();
  const updateAccount = useUpdateOrgAccount();
  const [input, setInput] = useState(() => toInput(profile));
  const [you, setYou] = useState({ name: account.name, position: account.position, phone: account.phone });
  const [error, setError] = useState<Error | null>(null);
  const set = (patch: Partial<OrgProfileInput>) => setInput((current) => ({ ...current, ...patch }));
  const setContact = (patch: Partial<OrgProfileInput['contact']>) => setInput((current) => ({ ...current, contact: { ...current.contact, ...patch } }));
  const pending = updateProfile.isPending || updateAccount.isPending;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await Promise.all([updateProfile.mutateAsync(input), updateAccount.mutateAsync(you)]);
      toast.show('Perfil salvo. Os docentes já veem a versão nova.');
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason : new Error('Não deu para salvar.'));
    }
  };

  return (
    <form onSubmit={save} aria-label="Editar perfil" className="@container rounded-lg border border-accent bg-surface p-6 sm:p-7">
      <FormGroup {...GROUPS.who}>
        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-1.5 text-small font-medium text-ink">Tipo</p>
            <OrgTypePicker value={input.type} onChange={(type) => set({ type })} />
          </div>
          <Field label="Onde atuam" htmlFor="perfil-local">
            <Input id="perfil-local" value={input.location} onChange={(event) => set({ location: event.target.value })} placeholder="Ex.: Várzea, Recife" />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Público atendido" htmlFor="perfil-publico">
              <Input id="perfil-publico" value={input.audience} onChange={(event) => set({ audience: event.target.value })} />
            </Field>
            <Field label="Site, opcional" htmlFor="perfil-site">
              <Input id="perfil-site" value={input.site} onChange={(event) => set({ site: event.target.value })} placeholder="organizacao.org.br" />
            </Field>
          </div>
          <Field label="Sobre" htmlFor="perfil-sobre" hint="O que a organização faz, em duas ou três frases.">
            <Textarea id="perfil-sobre" rows={4} value={input.about} onChange={(event) => set({ about: event.target.value })} />
          </Field>
        </div>
      </FormGroup>

      <FormGroup {...GROUPS.how}>
        <div className="flex flex-col gap-5">
          <Field label="Reuniões" htmlFor="perfil-reunioes" hint={`Ex.: ${MEETING_SUGGESTIONS[1]}`}>
            <Input id="perfil-reunioes" value={input.meetingCadence} onChange={(event) => set({ meetingCadence: event.target.value })} />
          </Field>
          <Field label="Visita da turma" htmlFor="perfil-visita" hint="Se a turma pode ir até vocês, e com quanta antecedência.">
            <Input id="perfil-visita" value={input.onSiteVisit} onChange={(event) => set({ onSiteVisit: event.target.value })} />
          </Field>
        </div>
      </FormGroup>

      <FormGroup {...GROUPS.focal}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

      <FormGroup {...GROUPS.you}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Seu nome" htmlFor="conta-org-nome">
            <Input id="conta-org-nome" value={you.name} onChange={(event) => setYou({ ...you, name: event.target.value })} autoComplete="name" />
          </Field>
          <Field label="Seu cargo" htmlFor="conta-org-cargo">
            <Input id="conta-org-cargo" value={you.position} onChange={(event) => setYou({ ...you, position: event.target.value })} />
          </Field>
          <Field label="Telefone, opcional" htmlFor="conta-org-telefone">
            <Input id="conta-org-telefone" type="tel" value={you.phone} onChange={(event) => setYou({ ...you, phone: event.target.value })} placeholder="(81) 90000-0000" autoComplete="tel" />
          </Field>
        </div>
      </FormGroup>

      <EditBar pending={pending} error={error} onCancel={onClose} />
    </form>
  );
};

export const OrgProfilePage = () => {
  const profileQuery = useOrgProfile();
  const accountQuery = useOrgAccount();
  const [editing, setEditing] = useState(false);
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
        aside={
          !editing && (
            <Button variant="primary" size="xl" onClick={() => setEditing(true)}>
              <PencilIcon size={20} />
              Editar perfil
            </Button>
          )
        }
      >
        <QueryView query={profileQuery}>
          {(profile) => (
            <QueryView query={accountQuery}>
              {(account) =>
                editing ? (
                  <>
                    <ImageSettings organization={profile.organization} />
                    <ProfileForm profile={profile} account={account} onClose={() => setEditing(false)} />
                  </>
                ) : (
                  <ProfileView profile={profile} account={account} />
                )
              }
            </QueryView>
          )}
        </QueryView>
      </Section>

      <Section title="Conta" description="Como você entra no PLEI. Fica separado do perfil e não muda com o Editar perfil.">
        <QueryView query={accountQuery}>
          {(account) => (
            <AccountAccess
              role="organizacao"
              email={account.email}
              emailHint="É com ele que você entra. Para trocar, fale com o L.E.I."
              deleteConsequence="Seu acesso ao PLEI é apagado e você sai na hora. O perfil da organização, as demandas e os projetos continuam com o L.E.I. e com os docentes."
            />
          )}
        </QueryView>
      </Section>
    </Page>
  );
};
