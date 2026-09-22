import { NavLink } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';

const TABS = [
  { to: paths.account, label: 'Dados' },
  { to: paths.practice, label: 'Prática' },
  { to: paths.corrections, label: 'Histórico' },
];

/** As três áreas do perfil são rotas próprias, então as abas são links e o endereço é compartilhável. */
export const ProfileTabs = () => (
  <nav aria-label="Seções do perfil" className="mb-12 flex flex-wrap items-center border-b border-n-200">
    {TABS.map((tab) => (
      <NavLink
        key={tab.to}
        to={tab.to}
        end
        className={({ isActive }) =>
          cn(
            'mr-[22px] flex h-10 items-center border-b-2 px-0.5 text-sm transition-colors',
            isActive ? 'border-azul-500 font-bold text-azul-800' : 'border-transparent text-n-700 hover:text-n-900',
          )
        }
      >
        {tab.label}
      </NavLink>
    ))}
  </nav>
);
