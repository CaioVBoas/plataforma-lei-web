import ruaDaAurora from '@/assets/portal/entrada/rua-da-aurora.webp';
import type { PhotoCredit } from '@/components/ui/photoCredit';
import olindaVista from '@/assets/portal/capa/olinda-vista.webp';
import ponteCapibaribe from '@/assets/portal/capa/ponte-capibaribe.webp';
import recifeAntigoCais from '@/assets/portal/capa/recife-antigo-cais.webp';
import ruaDoBomJesus from '@/assets/portal/capa/rua-do-bom-jesus.webp';

export interface PortalPhoto {
  src: string;
  alt: string;
  /** Nome do lugar, mostrado no canto da abertura. */
  place?: string;
}

/** Fotos da abertura, passando uma de cada vez. Todas do Pexels, que dispensa crédito. */
export const HERO_PHOTOS: PortalPhoto[] = [
  { src: recifeAntigoCais, alt: 'Cais do Recife Antigo visto do rio Capibaribe', place: 'Cais do Recife Antigo' },
  { src: ruaDoBomJesus, alt: 'Rua do Bom Jesus, no Recife Antigo', place: 'Rua do Bom Jesus, Recife' },
  { src: ponteCapibaribe, alt: 'Ponte sobre o rio Capibaribe, no centro do Recife', place: 'Rio Capibaribe, Recife' },
  { src: olindaVista, alt: 'Vista do Recife a partir do alto de Olinda', place: 'Alto da Sé, Olinda' },
];

/**
 * Créditos que a licença de alguma foto do portal público exige. As fotos do
 * Pexels dispensam crédito; uma foto CC entra aqui e aparece sozinha no rodapé.
 */
export const PHOTO_CREDITS: PhotoCredit[] = [];

export type { PhotoCredit };

/**
 * Foto do painel da entrada e do cadastro, do Wikimedia Commons. A licença
 * CC BY-SA 4.0 pede autor, link para a licença e aviso de alteração, então o
 * crédito vai no pé do próprio painel.
 */
export const AUTH_PHOTO: PortalPhoto & { credit: PhotoCredit } = {
  src: ruaDaAurora,
  alt: 'Rua da Aurora e a ponte Princesa Isabel sobre o rio Capibaribe, no Recife',
  credit: {
    author: 'Hansfotos (Hans von Manteuffel)',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rua_da_Aurora_com_rio_Capibaribe1x.jpg',
    changes: 'recortada',
  },
};
