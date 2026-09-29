import type { PhotoCredit } from '@/components/ui/photoCredit';

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

/**
 * Crédito das capas cuja licença pede (as do Pexels dispensam). A chave é
 * `pasta/arquivo` sem extensão. O crédito aparece junto da foto.
 */
const COVER_CREDITS: Record<string, PhotoCredit> = {
  'organizacoes/coletivo-grio': {
    author: 'thld',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt-br',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Instituto_Ricardo_Brennand_-_V%C3%A1rzea_-_Recife-_PE_-_panoramio_(6).jpg',
    changes: 'recortada',
  },
  'organizacoes/hospital-das-clinicas': {
    author: 'Leonaardog',
    license: 'CC0 1.0, domínio público',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.pt-br',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:%22Teatro_de_Santa_Isabel_-_Rua_da_Aurora,_Recife_-_PE_%22.jpg',
  },
};

export interface Cover {
  src: string;
  credit?: PhotoCredit;
}

const cover = (folder: string, id: string, covers: Record<string, string>): Cover | undefined =>
  covers[id] ? { src: covers[id], credit: COVER_CREDITS[`${folder}/${id}`] } : undefined;

export const organizationCover = (organizationId: string) => cover('organizacoes', organizationId, ORGANIZATION_COVERS);

/** A foto da própria demanda ou, na falta, a da organização que a publicou. */
export const demandCover = (demandId: string, organizationId: string) =>
  cover('demandas', demandId, DEMAND_COVERS) ?? organizationCover(organizationId);
