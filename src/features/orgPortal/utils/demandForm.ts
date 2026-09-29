import { z } from 'zod';
import { SUBMISSION_LIMITS } from '@/domain/submission';
import type { DemandConstraint, DemandDraft } from '@/domain/types';

const required = (message: string, limit: number) =>
  z
    .string()
    .trim()
    .min(1, message)
    .max(limit, `Use até ${limit} caracteres.`);

const URL = /^https?:\/\/\S+\.\S+/;

/**
 * Validação do formulário, etapa por etapa. As regras são as mesmas que o
 * mock confere ao enviar para a triagem (`missingForReview`).
 */
export const demandFormSchema = z.object({
  title: required('Dê um nome à demanda.', SUBMISSION_LIMITS.title),
  problem: required('Conte o problema em uma frase.', SUBMISSION_LIMITS.problem),
  description: required('Conte o contexto do problema.', SUBMISSION_LIMITS.description),
  affectedPublic: required('Diga quem sente o problema.', SUBMISSION_LIMITS.affectedPublic),
  expectedOutcome: required('Diga o que já ajudaria ao fim do semestre.', SUBMISSION_LIMITS.expectedOutcome),
  skills: z.array(z.string()),
  constraints: z.array(z.enum(['on-site', 'sensitive-data', 'confidential'])),
  meetingCadence: required('Diga como vocês podem se reunir com a turma.', SUBMISSION_LIMITS.meetingCadence),
  offers: z
    .array(z.object({ value: z.string().trim().max(SUBMISSION_LIMITS.offer, `Use até ${SUBMISSION_LIMITS.offer} caracteres.`) }))
    .refine((offers) => offers.some((offer) => offer.value), 'Liste pelo menos uma coisa que vocês oferecem à turma.'),
  references: z.array(
    z
      .object({ name: z.string().trim(), url: z.string().trim(), description: z.string().trim() })
      .superRefine((reference, context) => {
        if (!reference.name && !reference.url && !reference.description) return;
        if (!reference.name) context.addIssue({ code: 'custom', path: ['name'], message: 'Dê um nome.' });
        if (!URL.test(reference.url)) context.addIssue({ code: 'custom', path: ['url'], message: 'Use um link que comece com https://.' });
      }),
  ),
});

export type DemandFormValues = z.input<typeof demandFormSchema>;

export const FORM_STEPS = ['O problema', 'O que a turma faz', 'Como vocês trabalham', 'Revisar e enviar'] as const;

/** Campos que cada etapa valida antes de seguir. A última revisa tudo. */
export const STEP_FIELDS: (keyof DemandFormValues)[][] = [
  ['title', 'problem', 'description', 'affectedPublic'],
  ['expectedOutcome', 'skills', 'constraints'],
  ['meetingCadence', 'offers', 'references'],
  [],
];

export const toFormValues = (draft: DemandDraft): DemandFormValues => ({
  ...draft,
  offers: draft.offers.length > 0 ? draft.offers.map((value) => ({ value })) : [{ value: '' }],
  references: draft.references.map((reference) => ({ ...reference })),
});

export const toDraft = (values: DemandFormValues): DemandDraft => ({
  title: values.title,
  problem: values.problem,
  description: values.description,
  affectedPublic: values.affectedPublic,
  expectedOutcome: values.expectedOutcome,
  skills: values.skills,
  constraints: values.constraints as DemandConstraint[],
  meetingCadence: values.meetingCadence,
  offers: values.offers.map((offer) => offer.value.trim()).filter(Boolean),
  references: values.references.filter((reference) => reference.name.trim() || reference.url.trim()),
});
