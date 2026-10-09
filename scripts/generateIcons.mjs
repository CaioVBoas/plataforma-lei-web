/**
 * Gera src/components/ui/solarIcons.ts com os ícones Solar usados na
 * plataforma, nos três estilos que a interface usa: linear (padrão), bold
 * (ativo ou escolhido) e bold-duotone (destaques e estados vazios).
 *
 * Rodar depois de mudar a lista: node scripts/generateIcons.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const set = JSON.parse(readFileSync(require.resolve('@iconify-json/solar/icons.json'), 'utf8'));

/** Nome do componente → nome no Solar. */
const ICONS = {
  Home: 'home-2',
  Tray: 'inbox',
  Folder: 'folder',
  Book: 'book',
  Building: 'buildings-2',
  Question: 'question-circle',
  ChevronRight: 'alt-arrow-right',
  ChevronLeft: 'alt-arrow-left',
  ChevronDown: 'alt-arrow-down',
  Check: 'check',
  Close: 'close',
  Plus: 'add',
  Minus: 'minus',
  Search: 'magnifier',
  Copy: 'copy',
  Menu: 'hamburger-menu',
  ArrowUpRight: 'arrow-right-up',
  More: 'menu-dots',
  Bell: 'bell',
  Logout: 'logout-2',
  User: 'user',
  Sidebar: 'sidebar',
  ArrowRight: 'arrow-right',
  Bookmark: 'bookmark',
  Mail: 'letter',
  Users: 'users-group-rounded',
  Chat: 'chat-round-dots',
  Send: 'plain',
  Image: 'gallery',
  Clock: 'clock-circle',
  Calendar: 'calendar',
  Info: 'info-circle',
  Pencil: 'pen',
  Layers: 'layers',
  Lightbulb: 'lightbulb',
  Save: 'diskette',
  ArrowLeft: 'arrow-left',
  Eye: 'eye',
  List: 'list',
  Hand: 'smartphone',
  Accessibility: 'accessibility',
  ZoomIn: 'magnifier-zoom-in',
  ZoomOut: 'magnifier-zoom-out',
  Undo: 'undo-left-round',
  DoubleCheck: 'check-read',
};
const STYLES = { linear: 'linear', bold: 'bold', duotone: 'bold-duotone' };

const resolve = (name) => {
  if (set.icons[name]) return set.icons[name];
  const alias = set.aliases?.[name];
  if (alias) return resolve(alias.parent);
  throw new Error(`Ícone ${name} não existe no Solar`);
};

const out = {};
for (const [component, solar] of Object.entries(ICONS)) {
  out[component] = {};
  for (const [style, suffix] of Object.entries(STYLES)) {
    const icon = resolve(`${solar}-${suffix}`);
    if ((icon.width ?? set.width ?? 24) !== 24 || (icon.height ?? set.height ?? 24) !== 24) throw new Error(`${solar} fora da grade 24`);
    // O traço padrão (1.5) sai do desenho e vai para o <svg>, para a espessura poder mudar por uso.
    out[component][style] = icon.body.replaceAll(' stroke-width="1.5"', '');
  }
}

const header = `// Gerado por scripts/generateIcons.mjs a partir de @iconify-json/solar (licença CC BY 4.0, 480 Design). Não editar à mão.\n`;
writeFileSync(
  new URL('../src/components/ui/solarIcons.ts', import.meta.url),
  `${header}export type SolarStyle = ${Object.keys(STYLES).map((s) => `'${s}'`).join(' | ')};\n\nexport const SOLAR = ${JSON.stringify(out, null, 2)} as const satisfies Record<string, Record<SolarStyle, string>>;\n`,
);
console.log(`${Object.keys(out).length} ícones gerados`);
