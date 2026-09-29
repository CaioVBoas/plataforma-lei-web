import type { UserRole } from './types';

interface RoleCopy {
  label: string;
  /** Rótulo curto para abas e escolhas. */
  short: string;
  pitch: string;
  /** Falso enquanto o portal desse perfil não existe. */
  available: boolean;
  soon: string;
}

export const ROLES: UserRole[] = ['docente', 'organizacao', 'estudante'];

export const ROLE_COPY: Record<UserRole, RoleCopy> = {
  docente: {
    label: 'Docente do CIn',
    short: 'Docente',
    pitch: 'Escolha um problema real no cardápio e leve para uma disciplina que você está lecionando.',
    available: true,
    soon: '',
  },
  organizacao: {
    label: 'Organização parceira',
    short: 'Organização',
    pitch: 'ONG, órgão público ou coletivo: publique um problema e acompanhe a turma que vai resolver.',
    available: true,
    soon: '',
  },
  estudante: {
    label: 'Estudante',
    short: 'Estudante',
    pitch: 'Trabalhe num problema de verdade durante a disciplina e conte as horas de extensão.',
    available: false,
    soon: 'O portal dos estudantes está em construção. Por enquanto, quem organiza a turma no projeto é o docente da disciplina.',
  },
};

export const isRole = (value: string | null): value is UserRole => ROLES.includes(value as UserRole);
