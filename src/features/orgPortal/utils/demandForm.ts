import { z } from 'zod';
import { SUBMISSION_LIMITS } from '@/domain/submission';
import type { DemandConstraint, DemandDraft } from '@/domain/types';

const required = (message: string, limit: number) =>
  z
    .string()
    .trim()
    .min(1, message)
    .max(limit, `Passou do limite de ${limit} caracteres. Apague um pouco do texto.`);

const URL = /^https?:\/\/\S+\.\S+/;

/**
 * Validação do formulário, etapa por etapa. As regras são as mesmas que o
 * mock confere ao enviar para a triagem (`missingForReview`).
 */
export const demandFormSchema = z.object({
  title: required('Escreva o nome da demanda. Ex.: Fila de consultas do interior.', SUBMISSION_LIMITS.title),
  problem: required('Escreva o problema em uma frase. Ex.: Pacientes esperam meses por uma consulta.', SUBMISSION_LIMITS.problem),
  description: required('Conte, em poucas linhas, como é hoje e onde o problema aparece.', SUBMISSION_LIMITS.description),
  affectedPublic: required('Diga quem sofre com o problema. Ex.: Pacientes do interior.', SUBMISSION_LIMITS.affectedPublic),
  expectedOutcome: required('Diga o que já ajudaria. Ex.: Um protótipo da agenda para testar com a equipe.', SUBMISSION_LIMITS.expectedOutcome),
  skills: z.array(z.string()),
  constraints: z.array(z.enum(['on-site', 'sensitive-data', 'confidential'])),
  meetingCadence: required('Toque numa das sugestões abaixo ou escreva como vocês podem se reunir.', SUBMISSION_LIMITS.meetingCadence),
  offers: z
    .array(z.object({ value: z.string().trim().max(SUBMISSION_LIMITS.offer, `Passou do limite de ${SUBMISSION_LIMITS.offer} caracteres. Encurte o texto.`) }))
    .refine((offers) => offers.some((offer) => offer.value), 'Escreva pelo menos uma coisa que vocês oferecem. Ex.: Planilha de atendimentos.'),
  references: z.array(
    z
      .object({ name: z.string().trim(), url: z.string().trim(), description: z.string().trim() })
      .superRefine((reference, context) => {
        if (!reference.name && !reference.url && !reference.description) return;
        if (!reference.name) context.addIssue({ code: 'custom', path: ['name'], message: 'Dê um nome à referência.' });
        if (!URL.test(reference.url)) context.addIssue({ code: 'custom', path: ['url'], message: 'Cole o link completo, começando com https://.' });
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

/** Nome e conserto de cada campo, para o aviso de "Falta preencher" e para levar até ele. */
export const FIELD_COPY: Record<keyof DemandFormValues, { label: string; focus: string }> = {
  title: { label: 'Nome da demanda', focus: 'title' },
  problem: { label: 'O problema em uma frase', focus: 'problem' },
  description: { label: 'Contexto', focus: 'description' },
  affectedPublic: { label: 'Quem sente o problema', focus: 'affectedPublic' },
  expectedOutcome: { label: 'O que já ajudaria ao fim do semestre', focus: 'expectedOutcome' },
  skills: { label: 'Competências', focus: 'skills' },
  constraints: { label: 'O que pesa na rotina', focus: 'constraints' },
  meetingCadence: { label: 'Ritmo das reuniões', focus: 'meetingCadence' },
  offers: { label: 'O que vocês oferecem', focus: 'offers.0.value' },
  references: { label: 'Referência para se inspirar', focus: 'references.0.name' },
};

/** Em que etapa o campo mora: o aviso leva até ela. */
export const stepOf = (field: keyof DemandFormValues) => STEP_FIELDS.findIndex((fields) => fields.includes(field));

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
