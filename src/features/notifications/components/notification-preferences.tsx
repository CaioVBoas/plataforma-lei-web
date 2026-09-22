import { SectionBlock } from '@/components/ui/section-card';
import { ToggleChip } from '@/components/ui/toggle-chip';
import { useNotificationPreferences, useToggleNotificationChannel } from '../hooks/use-notifications';
import type { ChannelPreference, PreferenceType } from '../types';

const PREFERENCE_COPY: Record<PreferenceType, { title: string; description: string }> = {
  demand: { title: 'Demanda nova compatível', description: 'Quando entra uma demanda que combina com suas disciplinas.' },
  reservation: { title: 'Reserva expirando', description: 'A partir de dois dias úteis antes do prazo de decisão.' },
  deadline: { title: 'Prazo institucional', description: 'Vinculação, relatório parcial e fechamento do semestre.' },
  team: { title: 'Equipe sem registro de andamento', description: 'Quando uma equipe passa duas semanas sem registrar.' },
};

const CHANNEL_LABEL: Record<keyof ChannelPreference, string> = { inApp: 'Na plataforma', email: 'Por e-mail' };

export const NotificationPreferences = () => {
  const { data: preferences } = useNotificationPreferences();
  const toggleChannel = useToggleNotificationChannel();
  if (!preferences) return null;

  return (
    <SectionBlock title="Preferências" description="Escolha por onde cada tipo chega até você.">
      <ul>
        {(Object.keys(PREFERENCE_COPY) as PreferenceType[]).map((type) => (
          <li key={type} className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b border-n-200 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-[15px] text-n-800">{PREFERENCE_COPY[type].title}</p>
              <p className="mt-0.5 text-[13px] leading-normal text-n-500">{PREFERENCE_COPY[type].description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {(Object.keys(CHANNEL_LABEL) as (keyof ChannelPreference)[]).map((channel) => (
                <ToggleChip
                  key={channel}
                  size="sm"
                  selected={preferences[type][channel]}
                  aria-label={`${PREFERENCE_COPY[type].title}: ${CHANNEL_LABEL[channel]}`}
                  onClick={() => toggleChannel.mutate({ type, channel })}
                >
                  {CHANNEL_LABEL[channel]}
                </ToggleChip>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[13px] text-n-500">O e-mail avisa, a plataforma guarda o histórico.</p>
    </SectionBlock>
  );
};
