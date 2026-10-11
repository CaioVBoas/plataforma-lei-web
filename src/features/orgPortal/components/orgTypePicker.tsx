import { BookIcon, BuildingIcon, ChatIcon, UsersIcon } from '@/components/ui/icons';
import { OptionList } from '@/components/ui/optionList';
import { ORGANIZATION_TYPES } from '../utils/orgPresentation';

const TYPE_LOOK: Record<string, { icon: typeof BuildingIcon; description: string }> = {
  'Órgão público': { icon: BuildingIcon, description: 'Prefeitura, secretaria, hospital público' },
  'Organização social': { icon: UsersIcon, description: 'ONG, associação, instituto' },
  Coletivo: { icon: ChatIcon, description: 'Grupo de moradores, cultural ou de bairro' },
  'Unidade da UFPE': { icon: BookIcon, description: 'Setor, núcleo ou departamento da universidade' },
};

/**
 * O tipo da organização em opções sempre à vista, com ícone e exemplo, no
 * lugar do menu suspenso. Tipo antigo, fora da lista, continua escolhível.
 */
export const OrgTypePicker = ({ value, onChange, compact }: { value: string; onChange: (type: string) => void; /** Sem a linha de exemplo, para telas estreitas. */ compact?: boolean }) => {
  const types = ORGANIZATION_TYPES.includes(value) ? ORGANIZATION_TYPES : [value, ...ORGANIZATION_TYPES];
  return (
    <OptionList
      label="Tipo da organização"
      value={value}
      onChange={onChange}
      compact={compact}
      options={types.map((type) => {
        const look = TYPE_LOOK[type] ?? { icon: BuildingIcon, description: '' };
        const Icon = look.icon;
        return { value: type, label: type, icon: <Icon size={20} />, description: compact ? undefined : look.description || undefined };
      })}
    />
  );
};
