import type { ReactNode } from 'react';
import { BookIcon, ChartIcon, HomeIcon } from '@/components/ui/icons';
import type { PortalId } from '../types';

export interface PortalOption {
  id: PortalId;
  title: string;
  description: string;
  loginHint: string;
  tone: 'azul' | 'laranja';
  icon: ReactNode;
}

/** Pontos de entrada separados; a identidade da pessoa é uma só (ver alternância de área). */
export const PORTALS: PortalOption[] = [
  {
    id: 'professor',
    title: 'Sou professor',
    description: 'Recebo demandas que combinam com minhas disciplinas.',
    loginHint: 'Use o e-mail institucional do CIn ou da UFPE',
    tone: 'azul',
    icon: <BookIcon size={18} />,
  },
  {
    id: 'coordination',
    title: 'Sou da Coordenação de Extensão',
    description: 'Acompanho as demandas e os projetos do centro.',
    loginHint: 'Use o e-mail institucional do CIn ou da UFPE',
    tone: 'azul',
    icon: <ChartIcon size={18} />,
  },
  {
    id: 'organization',
    title: 'Represento uma organização',
    description: 'Tenho um problema e quero apoio do CIn.',
    loginHint: 'Organizações entram com e-mail livre, sem vínculo institucional',
    tone: 'laranja',
    icon: <HomeIcon size={18} />,
  },
];

export const WORK_AREAS = [
  { id: 'professor', title: 'Professor', description: 'Cardápio de demandas, disciplinas e propostas.', icon: <BookIcon size={18} /> },
  { id: 'coordination', title: 'Coordenação de Extensão', description: 'Triagem, projetos do centro e prazos.', icon: <ChartIcon size={18} /> },
] as const;
