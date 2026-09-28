/**
 * Fotos de capa das organizações e das demandas, lidas pelo nome do arquivo:
 * `organizacoes/<id da organização>.webp` e `demandas/<id da demanda>.webp`.
 * Sem foto, quem usa mostra o desenho de sempre (monograma e capa petróleo).
 */
const files = import.meta.glob<string>('/src/assets/covers/*/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' });

const byFolder = (folder: string) =>
  Object.fromEntries(
    Object.entries(files)
      .filter(([path]) => path.includes(`/covers/${folder}/`))
      .map(([path, url]) => [path.split('/').pop()?.replace(/\.\w+$/, '') ?? '', url]),
  );

const ORGANIZATION_COVERS = byFolder('organizacoes');
const DEMAND_COVERS = byFolder('demandas');

export const organizationCover = (organizationId: string): string | undefined => ORGANIZATION_COVERS[organizationId];

/** A foto da própria demanda ou, na falta, a da organização que a publicou. */
export const demandCover = (demandId: string, organizationId: string): string | undefined => DEMAND_COVERS[demandId] ?? ORGANIZATION_COVERS[organizationId];
