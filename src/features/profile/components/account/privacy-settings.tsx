import { SectionBlock } from '@/components/ui/section-card';
import { ToggleChip } from '@/components/ui/toggle-chip';
import type { PrivacySetting } from '../../types';

const PRIVACY_COPY: Record<PrivacySetting, { title: string; description: string }> = {
  partnersSeeContact: { title: 'Parceiros veem meu contato', description: 'Telefone e canal preferido, só depois do vínculo do projeto.' },
  partnersSeeProjects: { title: 'Parceiros veem meus projetos anteriores', description: 'Ajuda o parceiro a entender o que esperar de um semestre.' },
  studentsSeePractice: { title: 'Estudantes veem meu perfil de prática', description: 'As competências que você confirmou, não as inferidas.' },
  studentsSeeEmail: { title: 'Estudantes veem meu e-mail', description: 'A conversa do projeto acontece na plataforma por padrão.' },
};

interface PrivacySettingsProps {
  privacy: Record<PrivacySetting, boolean>;
  onToggle: (setting: PrivacySetting) => void;
  onShowPolicy: () => void;
}

export const PrivacySettings = ({ privacy, onToggle, onShowPolicy }: PrivacySettingsProps) => (
  <SectionBlock title="Privacidade">
    <ul>
      {(Object.keys(PRIVACY_COPY) as PrivacySetting[]).map((setting) => (
        <li key={setting} className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b border-n-200 py-4">
          <div className="min-w-0 flex-[1_1_340px]">
            <p className="text-[15px] text-n-800">{PRIVACY_COPY[setting].title}</p>
            <p className="mt-0.5 text-[13px] leading-normal text-n-500">{PRIVACY_COPY[setting].description}</p>
          </div>
          <ToggleChip selected={privacy[setting]} showCheck={false} aria-label={PRIVACY_COPY[setting].title} onClick={() => onToggle(setting)}>
            {privacy[setting] ? 'Visível' : 'Oculto'}
          </ToggleChip>
        </li>
      ))}
    </ul>
    <button type="button" onClick={onShowPolicy} className="mt-4 h-[34px] rounded-full border border-n-300 bg-n-0 px-[13px] text-[13px] font-medium text-azul-500 hover:bg-n-50">
      Política de dados da plataforma
    </button>
  </SectionBlock>
);
