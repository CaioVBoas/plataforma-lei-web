import { cn } from '@/utils/cn';
import { ROLE_COPY, ROLES } from '../roles';
import type { UserRole } from '../types';

/** Quem está entrando: docente, organização ou estudante. Os perfis sem portal avisam "Em breve". */
/** Sem valor, nenhum perfil vem marcado: ninguém cai no formulário de outro perfil por engano. */
export const RoleTabs = ({ value, onChange }: { value: UserRole | null; onChange: (role: UserRole) => void }) => (
  <div role="radiogroup" aria-label="Entrar como" className="grid grid-cols-3 gap-1 rounded-md bg-fill p-1">
    {ROLES.map((role) => {
      const selected = role === value;
      return (
        <button
          key={role}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(role)}
          className={cn(
            'flex h-auto min-h-9 flex-col items-center justify-center rounded-[5px] px-1 py-1.5 text-[13px] transition-colors duration-150',
            selected ? 'bg-surface font-semibold text-ink shadow-popover' : 'text-ink-2 hover:text-ink',
          )}
        >
          {ROLE_COPY[role].short}
          {!ROLE_COPY[role].available && <span className="text-[11px] font-normal text-ink-3">em breve</span>}
        </button>
      );
    })}
  </div>
);

