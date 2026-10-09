import { useSyncExternalStore } from 'react';

/**
 * Preferências de leitura de quem usa este navegador: tamanho do texto,
 * zoom da tela e componentes maiores. Ficam só neste navegador; sem
 * armazenamento, tudo começa no normal e vale até recarregar.
 */
export interface AccessibilityPrefs {
  /** Posição em TEXT_SCALES. */
  text: number;
  /** Zoom da tela inteira, em porcentagem. */
  zoom: number;
  /** Botões, campos e ícones maiores. */
  large: boolean;
}

export const TEXT_SCALES = [0.9, 1, 1.15, 1.3, 1.5];
export const ZOOM_STEPS = [90, 100, 110, 125, 150];
/** O font-size da raiz em index.css, no tamanho normal. */
const ROOT_PX = 16;
const KEY = 'plei.acessibilidade';
const EVENT = 'plei:acessibilidade';

export const DEFAULT_PREFS: AccessibilityPrefs = { text: 1, zoom: 100, large: false };

const clampIndex = (value: unknown, length: number, fallback: number) =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < length ? value : fallback;

const read = (): AccessibilityPrefs => {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<AccessibilityPrefs>;
    return {
      text: clampIndex(parsed.text, TEXT_SCALES.length, DEFAULT_PREFS.text),
      zoom: ZOOM_STEPS.includes(parsed.zoom as number) ? (parsed.zoom as number) : DEFAULT_PREFS.zoom,
      large: parsed.large === true,
    };
  } catch {
    return DEFAULT_PREFS;
  }
};

let current: AccessibilityPrefs = typeof window === 'undefined' ? DEFAULT_PREFS : read();

/**
 * Abaixo disso (celular, tablet, notebook pequeno) o zoom fica com o próprio
 * aparelho (pinça ou Ctrl e +), que reorganiza a tela em vez de espremê-la.
 */
const ZOOM_MIN_WIDTH = 1200;

/** O zoom da tela só vale em telas largas; nas menores ele espremeria o layout. */
export const zoomAvailable = () => typeof window !== 'undefined' && window.innerWidth >= ZOOM_MIN_WIDTH;

/** Quanto a tela está ampliada no total: a barra de cima esconde os rótulos quando passa de 1,3. */
export const effectiveScale = (prefs: AccessibilityPrefs) => TEXT_SCALES[prefs.text] * (zoomAvailable() ? prefs.zoom / 100 : 1);

/** Aplica na página: texto pela raiz, zoom pela página toda e "maiores" por um atributo que o CSS lê. */
export const applyAccessibility = (prefs: AccessibilityPrefs = current) => {
  const root = document.documentElement;
  root.style.fontSize = `${ROOT_PX * TEXT_SCALES[prefs.text]}px`;
  root.style.setProperty('zoom', prefs.zoom === 100 || !zoomAvailable() ? '' : String(prefs.zoom / 100));
  if (prefs.large) root.dataset.ui = 'large';
  else delete root.dataset.ui;
  // Tela muito ampliada: a barra de cima fica só com os ícones (que mantêm o nome para leitor de tela).
  if (effectiveScale(prefs) > 1.3) root.dataset.scale = 'big';
  else delete root.dataset.scale;
};

export const setAccessibility = (patch: Partial<AccessibilityPrefs>) => {
  current = { ...current, ...patch };
  applyAccessibility(current);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    // Sem armazenamento, a escolha vale só até recarregar.
  }
  window.dispatchEvent(new Event(EVENT));
};

// Girar o tablet ou mudar a janela de tamanho liga ou desliga o zoom.
if (typeof window !== 'undefined') window.addEventListener('resize', () => applyAccessibility());

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('resize', onChange);
  };
};

export const useAccessibility = () => useSyncExternalStore(subscribe, () => current, () => DEFAULT_PREFS);

export const isDefaultAccessibility = (prefs: AccessibilityPrefs) =>
  prefs.text === DEFAULT_PREFS.text && prefs.zoom === DEFAULT_PREFS.zoom && prefs.large === DEFAULT_PREFS.large;
