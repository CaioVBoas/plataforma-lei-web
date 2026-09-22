import { THEMES } from '../../constants/onboarding-options';
import type { ThemeStance } from '../../types';
import { ChoiceChip } from './choice-chip';

interface ThemesStepProps {
  themes: Record<string, ThemeStance>;
  onToggle: (theme: string, stance: ThemeStance) => void;
}

const COLUMNS: { stance: ThemeStance; title: string; description: string }[] = [
  { stance: 'interest', title: 'Tenho interesse', description: 'Temas em que você aceita receber demanda.' },
  { stance: 'excluded', title: 'Não conduzo', description: 'Serve para você não receber demandas fora do que você defende.' },
];

export const ThemesStep = ({ themes, onToggle }: ThemesStepProps) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-4">
    {COLUMNS.map((column) => (
      <section key={column.stance} className="rounded-2xl border border-n-200 bg-n-0 p-5">
        <h2 className="mb-1 text-[15px] font-semibold text-n-800">{column.title}</h2>
        <p className="mb-3.5 text-[13px] leading-[1.45] text-n-500">{column.description}</p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((theme) => (
            <ChoiceChip
              key={theme}
              tone={column.stance === 'interest' ? 'accept' : 'decline'}
              selected={themes[theme] === column.stance}
              onToggle={() => onToggle(theme, column.stance)}
            >
              {theme}
            </ChoiceChip>
          ))}
        </div>
      </section>
    ))}
  </div>
);
