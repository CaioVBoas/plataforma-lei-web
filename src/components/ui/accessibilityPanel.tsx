import { DEFAULT_PREFS, isDefaultAccessibility, setAccessibility, TEXT_SCALES, THEMES, useAccessibility, ZOOM_STEPS, zoomAvailable, type ThemeChoice } from '@/lib/accessibility';
import { cn } from '@/utils/cn';
import { HandIcon, MonitorIcon, MoonIcon, SunIcon, UndoIcon, ZoomInIcon, ZoomOutIcon } from './icons';
import { withIconVariant } from './iconVariant';

const TEXT_LABELS = ['Texto pequeno', 'Texto normal', 'Texto grande', 'Texto maior', 'Texto muito grande'];
const THEME_COPY: Record<ThemeChoice, { label: string; icon: typeof SunIcon }> = {
  claro: { label: 'Claro', icon: SunIcon },
  escuro: { label: 'Escuro', icon: MoonIcon },
  automatico: { label: 'Automático', icon: MonitorIcon },
};

/** Os cinco "A" crescem como o texto que eles escolhem. */
const A_SIZES = ['text-small', 'text-body', 'text-h4', 'text-h3', 'text-h2'];

const GROUP = 'flex gap-1 rounded-lg bg-fill p-1';
const OPTION = 'flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md text-body transition-colors duration-100';
const ON = 'bg-surface font-semibold text-ink shadow-[0_1px_3px_rgba(10,50,50,0.15)]';
const OFF = 'text-ink-2 hover:bg-surface/60 hover:text-ink';

/**
 * O perfil de acessibilidade: tamanho do texto, zoom da tela, componentes
 * maiores e a aparência (claro, escuro ou automático, que segue o aparelho). Vale para o portal inteiro, na hora, e fica guardado neste navegador.
 */
export const AccessibilityPanel = () => {
  const prefs = useAccessibility();
  const zoomIndex = ZOOM_STEPS.indexOf(prefs.zoom);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p id="a11y-texto" className="mb-1.5 text-small font-medium text-ink">
          Tamanho do texto
        </p>
        <div role="radiogroup" aria-labelledby="a11y-texto" className={GROUP}>
          {TEXT_SCALES.map((_, index) => (
            <button
              key={TEXT_LABELS[index]}
              type="button"
              role="radio"
              aria-checked={prefs.text === index}
              aria-label={TEXT_LABELS[index]}
              title={TEXT_LABELS[index]}
              onClick={() => setAccessibility({ text: index })}
              className={cn(OPTION, 'font-semibold', prefs.text === index ? ON : OFF)}
            >
              <span aria-hidden="true" className={cn('leading-none', A_SIZES[index])}>
                A
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-small font-medium text-ink">Zoom da tela</p>
        {!zoomAvailable() ? (
          <p className="flex items-start gap-2.5 rounded-lg bg-fill px-3 py-2.5 text-small text-ink-2">
            <HandIcon size={24} className="mt-0.5 shrink-0 text-brand" />
            Nesta tela, aumente com o próprio aparelho: afaste dois dedos na tela, ou aperte Ctrl e + no teclado.
          </p>
        ) : (
          <div className={GROUP}>
            <button
              type="button"
              aria-label="Diminuir o zoom"
              disabled={zoomIndex <= 0}
              onClick={() => setAccessibility({ zoom: ZOOM_STEPS[zoomIndex - 1] })}
              className={cn(OPTION, OFF, 'disabled:opacity-40')}
            >
              <ZoomOutIcon size={20} />
              Menos
            </button>
            <span aria-live="polite" className="flex min-w-16 items-center justify-center text-body font-semibold text-ink tabular-nums">
              {prefs.zoom}%
            </span>
            <button
              type="button"
              aria-label="Aumentar o zoom"
              disabled={zoomIndex >= ZOOM_STEPS.length - 1}
              onClick={() => setAccessibility({ zoom: ZOOM_STEPS[zoomIndex + 1] })}
              className={cn(OPTION, OFF, 'disabled:opacity-40')}
            >
              <ZoomInIcon size={20} />
              Mais
            </button>
          </div>
        )}
      </div>

      <div>
        <p id="a11y-botoes" className="mb-1.5 text-small font-medium text-ink">
          Botões e campos
        </p>
        <div role="radiogroup" aria-labelledby="a11y-botoes" className={GROUP}>
          {[
            { value: false, label: 'Normais' },
            { value: true, label: 'Maiores' },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={prefs.large === option.value}
              onClick={() => setAccessibility({ large: option.value })}
              className={cn(OPTION, prefs.large === option.value ? ON : OFF, option.value && 'text-h4')}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p id="a11y-aparencia" className="mb-1.5 text-small font-medium text-ink">
          Aparência
        </p>
        <div role="radiogroup" aria-labelledby="a11y-aparencia" className={GROUP}>
          {THEMES.map((theme) => {
            const { label, icon: Icon } = THEME_COPY[theme];
            const selected = prefs.theme === theme;
            return (
              <button
                key={theme}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setAccessibility({ theme })}
                className={cn(OPTION, 'flex-col gap-1 py-1.5 text-small', selected ? ON : OFF)}
              >
                {withIconVariant(<Icon size={20} />, selected)}
                {label}
              </button>
            );
          })}
        </div>
        {prefs.theme === 'automatico' && <p className="mt-1.5 text-caption text-ink-3">Segue o aparelho: escuro à noite ou quando ele estiver no modo escuro.</p>}
      </div>

      {!isDefaultAccessibility(prefs) && (
        <button
          type="button"
          onClick={() => setAccessibility(DEFAULT_PREFS)}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md text-small font-medium text-accent hover:bg-accent-soft"
        >
          <UndoIcon size={20} />
          Voltar tudo ao normal
        </button>
      )}
    </div>
  );
};
