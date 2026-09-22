import { z } from 'zod';

export const DISCIPLINE_LEVELS = ['Iniciante', 'Intermediário', 'Avançado'] as const;

export const newDisciplineSchema = z.object({
  name: z.string().trim().min(1, 'Escolha a disciplina no catálogo ou informe o nome.'),
  code: z.string().trim(),
  semester: z.string().trim(),
  course: z.string().trim(),
  students: z.string().regex(/^\d*$/, 'Use apenas números.'),
  executionStart: z.string().trim(),
  executionEnd: z.string().trim(),
  level: z.enum(DISCIPLINE_LEVELS),
  syllabus: z.string(),
  acceptsDemands: z.boolean(),
  projectCapacity: z.number().int().min(1).max(6),
});

export type NewDisciplineFormValues = z.infer<typeof newDisciplineSchema>;

export const NEW_DISCIPLINE_DEFAULTS: NewDisciplineFormValues = {
  name: '',
  code: '',
  semester: '',
  course: '',
  students: '45',
  executionStart: '02/09/2026',
  executionEnd: '12/12/2026',
  level: 'Intermediário',
  syllabus: '',
  acceptsDemands: true,
  projectCapacity: 2,
};
