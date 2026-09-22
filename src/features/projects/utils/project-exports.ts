import { sumHours } from '@/utils/format';
import { toCsv } from '@/utils/download-file';
import type { Project } from '../types';

/** Lista pronta para anexar no cadastro do SIGAA, uma linha por estudante. */
export const participantsCsv = (project: Project) =>
  toCsv([
    ['Equipe', 'Estudante', 'Matrícula', 'Horas no projeto'],
    ...project.detail.teams.flatMap((team) => team.members.map((member) => [team.name, member.name, member.enrollment, member.hours])),
  ]);

export const hoursCsv = (project: Project) =>
  toCsv([
    ['Participante', 'Matrícula', ...project.detail.hoursColumns, 'Total'],
    ...project.detail.hoursRows.map((row) => [row.name, row.enrollment, ...row.values, `${sumHours(row.values)}h`]),
  ]);
