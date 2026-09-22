import { Tag } from '@/components/ui/tag';
import { THEMES } from '../../constants/onboarding-options';
import type { ThemeStance } from '../../types';

const MAX_FREE_THEMES = 5;

interface ThemesEditorProps {
  themes: Record<string, ThemeStance>;
  onChange: (theme: string, stance: ThemeStance | null) => void;
}

export const ThemesEditor = ({ themes, onChange }: ThemesEditorProps) => {
  const byStance = (stance: ThemeStance) => Object.keys(themes).filter((theme) => themes[theme] === stance);
  const free = THEMES.filter((theme) => !themes[theme]).slice(0, MAX_FREE_THEMES);

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8">
        <div>
          <h4 className="mb-3 text-sm font-medium text-n-700">Tenho interesse</h4>
          <div className="flex flex-wrap gap-2">
            {byStance('interest').map((theme) => (
              <Tag key={theme} label={theme} onRemove={() => onChange(theme, null)} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium text-n-700">Não conduzo</h4>
          <div className="flex flex-wrap gap-2">
            {byStance('excluded').map((theme) => (
              <Tag key={theme} label={theme} muted onRemove={() => onChange(theme, null)} />
            ))}
          </div>
        </div>
      </div>
      {free.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2" aria-label="Temas ainda não marcados">
          {free.map((theme) => (
            <button
              key={theme}
              type="button"
              title="Marcar como tema de interesse"
              onClick={() => onChange(theme, 'interest')}
              className="h-10 rounded-full border border-dashed border-n-300 bg-n-0 px-3 text-sm text-n-600 hover:bg-n-50"
            >
              {theme}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
