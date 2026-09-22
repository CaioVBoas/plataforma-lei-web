import { useState } from 'react';
import { useToast } from '@/components/feedback/toast-context';
import { Avatar } from '@/components/ui/avatar';
import { Field, SearchInput } from '@/components/ui/form-controls';
import { cn } from '@/utils/cn';
import { useColleagues } from '../hooks/use-demands';

interface ColleagueInviteProps {
  invited: string[];
  onInvite: (colleagueId: string) => void;
  /** Competência sem par na prática do docente, que justifica chamar um colega. */
  missingCompetency?: string;
}

export const ColleagueInvite = ({ invited, onInvite, missingCompetency }: ColleagueInviteProps) => {
  const toast = useToast();
  const { data: colleagues = [] } = useColleagues();
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const results = query ? colleagues.filter((colleague) => `${colleague.name} ${colleague.area}`.toLowerCase().includes(query)) : [];

  return (
    <Field
      label="Convidar outro docente para coordenar junto"
      htmlFor="busca-docente"
      hint={`Útil quando a demanda exige competência que você não conduz.${missingCompetency ? ` Nesta demanda faltou ${missingCompetency.toLowerCase()}.` : ''}`}
    >
      <SearchInput
        id="busca-docente"
        placeholder="Buscar por nome ou área de atuação, opcional"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="h-11"
      />
      {results.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {results.map((colleague) => {
            const alreadyInvited = invited.includes(colleague.id);
            return (
              <li key={colleague.id}>
                <button
                  type="button"
                  disabled={alreadyInvited}
                  onClick={() => {
                    onInvite(colleague.id);
                    toast.show(`Convite enviado a ${colleague.name}. A coordenação é notificada.`);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left disabled:cursor-default',
                    alreadyInvited ? 'border-azul-500 bg-azul-50' : 'border-n-200 bg-n-0 hover:bg-n-50',
                  )}
                >
                  <Avatar name={colleague.name} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-n-800">{colleague.name}</span>
                    <span className="block text-xs text-n-600">{colleague.area}</span>
                  </span>
                  <span className="text-[13px] font-semibold text-azul-500">{alreadyInvited ? 'Convidado' : 'Convidar'}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Field>
  );
};
