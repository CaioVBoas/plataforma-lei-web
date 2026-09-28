import estudantes from '@/assets/portal/boas-vindas/estudantes.webp';
import ruaDaAurora from '@/assets/portal/boas-vindas/rua-da-aurora.webp';
import olindaVista from '@/assets/portal/capa/olinda-vista.webp';
import ponteCapibaribe from '@/assets/portal/capa/ponte-capibaribe.webp';
import recifeAntigoCais from '@/assets/portal/capa/recife-antigo-cais.webp';
import ruaDoBomJesus from '@/assets/portal/capa/rua-do-bom-jesus.webp';

export interface PortalPhoto {
  src: string;
  alt: string;
}

/** Fotos da abertura, passando uma de cada vez. Todas do Pexels, que dispensa crédito. */
export const HERO_PHOTOS: PortalPhoto[] = [
  { src: recifeAntigoCais, alt: 'Cais do Recife Antigo visto do rio Capibaribe' },
  { src: ruaDoBomJesus, alt: 'Rua do Bom Jesus, no Recife Antigo' },
  { src: ponteCapibaribe, alt: 'Ponte sobre o rio Capibaribe, no centro do Recife' },
  { src: olindaVista, alt: 'Vista do Recife a partir do alto de Olinda' },
];

export const WELCOME_PHOTOS = {
  students: { src: estudantes, alt: 'Dois estudantes estudando juntos com um notebook' },
  city: { src: ruaDaAurora, alt: 'Rua da Aurora e a ponte Princesa Isabel sobre o rio Capibaribe' },
} satisfies Record<string, PortalPhoto>;

/**
 * Créditos que a licença exige. Só a foto do Wikimedia Commons precisa:
 * autor, licença com link, origem e a indicação de que foi recortada.
 */
export const PHOTO_CREDITS = [
  {
    subject: 'Rua da Aurora',
    author: 'Hans von Manteuffel',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rua_da_Aurora_com_rio_Capibaribe1x.jpg',
    source: 'Wikimedia Commons',
    changes: 'recortada',
  },
];
