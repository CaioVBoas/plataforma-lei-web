import { z } from 'zod';

const INSTITUTIONAL_EMAIL = /@(cin\.)?ufpe\.br$/i;

/** Docente e coordenação entram só com e-mail institucional; organizações usam e-mail livre. */
export const createLoginSchema = (requireInstitutionalEmail: boolean) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, 'Informe seu e-mail.')
      .refine((email) => !requireInstitutionalEmail || INSTITUTIONAL_EMAIL.test(email), 'Use seu e-mail @cin.ufpe.br ou @ufpe.br'),
    password: z.string().min(1, 'Informe sua senha.'),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
