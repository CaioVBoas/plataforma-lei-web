import { z } from 'zod';

const wholeNumber = (message: string) => z.number({ error: message }).int(message).min(1, message);

export const disciplineSchema = z
  .object({
    name: z.string().trim().min(1, 'Informe o nome da disciplina.'),
    code: z.string().trim(),
    students: wholeNumber('Informe quantos estudantes a turma tem.'),
    teamSize: wholeNumber('Informe quantas pessoas por equipe.'),
    projectSlots: wholeNumber('A turma precisa comportar ao menos um projeto.'),
    skills: z.array(z.string()).min(1, 'Escolha ao menos uma competência. É ela que decide quais demandas combinam.'),
  })
  .refine((values) => values.teamSize <= values.students, { path: ['teamSize'], message: 'A equipe não pode ser maior que a turma.' });

export type DisciplineFormValues = z.infer<typeof disciplineSchema>;
