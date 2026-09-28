/**
 * Fotos do portal público, lidas de `src/assets/portal` pelo nome. Faltando o
 * arquivo, a função devolve undefined e a tela mostra o fundo liso no lugar.
 */
const files = import.meta.glob<string>('/src/assets/portal/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

export const portalPhoto = (name: 'capa' | 'boas-vindas') =>
  Object.entries(files).find(([path]) => path.split('/').pop()?.replace(/\.\w+$/, '') === name)?.[1];
