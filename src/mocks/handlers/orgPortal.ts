import { canDeleteSubmission, canEditSubmission, missingForReview, publishedStage, SUBMISSION_LIMITS, unansweredQuestions } from '@/domain/submission';
import type { Demand, DemandDraft, DemandSubmission, OrgAccount, Project } from '@/domain/types';
import type { LoginPayload } from '@/features/auth/types';
import type {
  OrgAccountInput,
  OrgDemandDetail,
  OrgDemandSummary,
  OrgImagesInput,
  OrgProfile,
  OrgProfileInput,
  OrgProjectDetail,
  OrgProjectSummary,
  OrgSignupPayload,
  SaveDraftPayload,
} from '@/features/orgPortal/types';
import { normalizeText } from '@/utils/format';
import { db, findOrThrow, NotFoundError, RuleError } from '../db';
import { checkLogin, resetAccess } from './access';
import { conversationOf, nextTime } from '@/domain/questions';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ORG_DEMO_TOKEN = 'demo-org-token';

const myOrganization = () => findOrThrow(db.organizations, db.orgAccount.organizationId, 'Organização não encontrada.');

const myOrganizationRef = () => {
  const { id, name, type } = myOrganization();
  return { id, name, type };
};

const isMine = (item: { organization: { id: string } }) => item.organization.id === db.orgAccount.organizationId;

/** Qualquer e-mail entra na conta de demonstração da organização. */
export const login = ({ email, password }: LoginPayload) => {
  if (!EMAIL.test(email.trim())) throw new RuleError('Informe um e-mail válido.');
  if (!password) throw new RuleError('Informe sua senha.');
  checkLogin('organizacao', email, password);
  return ORG_DEMO_TOKEN;
};

const slugify = (text: string) =>
  normalizeText(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Cadastro da organização: cria o perfil com quem se cadastrou como ponto focal e já entra no portal. */
export const signup = (payload: OrgSignupPayload) => {
  const organizationName = payload.organizationName.trim();
  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();
  if (!organizationName) throw new RuleError('Informe o nome da organização.');
  if (!name) throw new RuleError('Informe seu nome.');
  if (!EMAIL.test(email)) throw new RuleError('Informe um e-mail válido.');
  if (payload.password.length < 8) throw new RuleError('A senha precisa de pelo menos 8 caracteres.');
  if (db.organizations.some((organization) => normalizeText(organization.name) === normalizeText(organizationName))) {
    throw new RuleError('Esta organização já tem cadastro. Peça a quem cadastrou para entrar, ou fale com o L.E.I.');
  }

  const base = slugify(organizationName) || 'organizacao';
  const id = db.organizations.some((organization) => organization.id === base) ? `${base}-${db.organizations.length + 1}` : base;
  db.organizations.push({
    id,
    name: organizationName,
    type: payload.organizationType.trim(),
    location: payload.location.trim(),
    about: '',
    audience: '',
    site: '',
    meetingCadence: '',
    onSiteVisit: '',
    history: [],
    contact: { focalName: name, focalRole: payload.position.trim(), email, channel: 'E-mail' },
  });
  db.orgAccount = { organizationId: id, name, email, position: payload.position.trim(), phone: '' };
  resetAccess('organizacao', email, payload.password);
  return ORG_DEMO_TOKEN;
};

export const getAccount = (): OrgAccount => db.orgAccount;

export const updateAccount = (input: OrgAccountInput): OrgAccount => {
  if (!input.name.trim()) throw new RuleError('Informe seu nome.');
  Object.assign(db.orgAccount, { name: input.name.trim(), position: input.position.trim(), phone: input.phone.trim() });
  return db.orgAccount;
};

export const markTutorialSeen = (): OrgAccount => {
  db.orgAccount.tutorialSeen = true;
  return db.orgAccount;
};

export const getProfile = (): OrgProfile => {
  const { contact, ...organization } = myOrganization();
  return { organization, contact };
};

/** O perfil é o mesmo que os docentes veem na página da organização. */
export const updateProfile = (input: OrgProfileInput): OrgProfile => {
  if (!input.contact.focalName.trim()) throw new RuleError('Informe quem é o ponto focal.');
  if (!EMAIL.test(input.contact.email.trim())) throw new RuleError('Informe um e-mail válido para o ponto focal.');
  const record = myOrganization();
  Object.assign(record, input, { contact: { ...input.contact, email: input.contact.email.trim() } });
  return getProfile();
};

/** Logo e capa chegam como data URL de imagem; texto vazio tira a imagem. */
export const updateImages = (input: OrgImagesInput): OrgProfile => {
  const record = myOrganization();
  for (const key of ['logo', 'cover'] as const) {
    const value = input[key];
    if (value === undefined) continue;
    if (value && !value.startsWith('data:image/')) throw new RuleError('Envie uma imagem.');
    record[key] = value || undefined;
  }
  return getProfile();
};

const projectOfDemand = (demandId: string) => db.projects.find((project) => project.demandId === demandId);

/**
 * Na demonstração há um docente só, dono de todos os projetos. As anotações
 * das etapas são do docente e não vão para a organização.
 */
const toProjectSummary = (project: Project): OrgProjectSummary => ({
  id: project.id,
  demandId: project.demandId,
  title: project.title,
  disciplineName: project.disciplineName,
  semester: project.semester,
  teams: project.teams,
  teacherName: db.account.name,
  milestones: project.milestones.map(({ note: _note, ...milestone }) => milestone),
  outcome: project.outcome,
});

const summarizeSubmission = (submission: DemandSubmission): OrgDemandSummary => ({
  id: submission.id,
  title: submission.title || 'Demanda sem nome',
  problem: submission.problem,
  stage: submission.stage,
  date: submission.review?.at ?? submission.updatedAt,
  unanswered: 0,
  review: submission.review,
});

const summarizeDemand = (demand: Demand): OrgDemandSummary => {
  const project = projectOfDemand(demand.id);
  return {
    id: demand.id,
    title: demand.title,
    problem: demand.problem,
    stage: publishedStage(demand, project?.milestones),
    date: project?.createdAt ?? demand.publishedAt,
    unanswered: demand.status === 'in-project' ? 0 : unansweredQuestions(demand).length,
    reservation: demand.reservation && { teacherName: demand.reservation.teacherName, until: demand.reservation.until },
    projectId: project?.id,
  };
};

/** Projeto antigo cuja demanda já saiu da plataforma: continua na lista como concluída, levando ao projeto. */
const summarizeArchived = (project: Project): OrgDemandSummary => ({
  id: project.demandId,
  title: project.title,
  problem: project.outcome?.summary ?? '',
  stage: 'done',
  date: project.createdAt,
  unanswered: 0,
  projectId: project.id,
  archived: true,
});

export const listDemands = (): OrgDemandSummary[] => {
  const archived = db.projects.filter((project) => isMine(project) && !db.demands.some((demand) => demand.id === project.demandId));
  return [
    ...db.submissions.filter(isMine).map(summarizeSubmission),
    ...db.demands.filter(isMine).map(summarizeDemand),
    ...archived.map(summarizeArchived),
  ].sort((a, b) => b.date.localeCompare(a.date));
};

const findMySubmission = (id: string) => {
  const submission = db.submissions.find((candidate) => candidate.id === id && isMine(candidate));
  if (!submission) throw new NotFoundError('Demanda não encontrada.');
  return submission;
};

const findMyDemand = (id: string) => {
  const demand = db.demands.find((candidate) => candidate.id === id && isMine(candidate));
  if (!demand) throw new NotFoundError('Demanda não encontrada.');
  return demand;
};

/** A organização vê a própria demanda sem o que é do docente: indicação do L.E.I. e aviso de liberação. */
const forOrganization = ({ invitation: _invitation, ...demand }: Demand): Demand => ({
  ...demand,
  organization: { ...demand.organization, logo: myOrganization().logo },
  watching: false,
});

export const getDemand = (id: string): OrgDemandDetail => {
  const submission = db.submissions.find((candidate) => candidate.id === id && isMine(candidate));
  if (submission) {
    return { kind: 'submission', stage: submission.stage, submission: { ...submission, organization: { ...submission.organization, logo: myOrganization().logo } } };
  }

  const demand = findMyDemand(id);
  const project = projectOfDemand(id);
  return {
    kind: 'published',
    stage: publishedStage(demand, project?.milestones),
    demand: forOrganization(demand),
    project: project && toProjectSummary(project),
  };
};

/** Tira espaços e itens vazios e confere os limites de tamanho que o formulário também mostra. */
const cleanDraft = (draft: DemandDraft): DemandDraft => {
  const clean: DemandDraft = {
    title: draft.title.trim(),
    problem: draft.problem.trim(),
    description: draft.description.trim(),
    affectedPublic: draft.affectedPublic.trim(),
    expectedOutcome: draft.expectedOutcome.trim(),
    skills: [...new Set(draft.skills)],
    constraints: [...new Set(draft.constraints)],
    meetingCadence: draft.meetingCadence.trim(),
    offers: draft.offers.map((offer) => offer.trim()).filter(Boolean),
    references: draft.references
      .map((reference) => ({ name: reference.name.trim(), url: reference.url.trim(), description: reference.description.trim() }))
      .filter((reference) => reference.name || reference.url),
  };
  if (!clean.title) throw new RuleError('Dê um nome à demanda antes de salvar.');
  const tooLong = (['title', 'problem', 'description', 'affectedPublic', 'expectedOutcome', 'meetingCadence'] as const).find(
    (field) => clean[field].length > SUBMISSION_LIMITS[field],
  );
  if (tooLong) throw new RuleError('Um dos textos passou do tamanho máximo. Encurte e tente de novo.');
  if (clean.offers.length > SUBMISSION_LIMITS.maxOffers) throw new RuleError(`Liste até ${SUBMISSION_LIMITS.maxOffers} coisas que vocês oferecem.`);
  if (clean.references.length > SUBMISSION_LIMITS.maxReferences) throw new RuleError(`Indique até ${SUBMISSION_LIMITS.maxReferences} referências.`);
  if (clean.references.some((reference) => !reference.name || !/^https?:\/\/\S+\.\S+/.test(reference.url))) {
    throw new RuleError('Cada referência precisa de um nome e de um link que comece com http:// ou https://.');
  }
  return clean;
};

/** Salva o rascunho, novo ou existente. Demanda devolvida continua devolvida até ser reenviada. */
export const saveDraft = ({ id, draft }: SaveDraftPayload): DemandSubmission => {
  const clean = cleanDraft(draft);
  if (!id) {
    const submission: DemandSubmission = {
      id: `${slugify(clean.title).slice(0, 40) || 'demanda'}-${db.submissions.length + db.demands.length + 1}`,
      organization: myOrganizationRef(),
      stage: 'draft',
      updatedAt: db.calendar.today,
      ...clean,
    };
    db.submissions.push(submission);
    return submission;
  }
  const submission = findMySubmission(id);
  if (!canEditSubmission(submission)) throw new RuleError('Esta demanda está na triagem do L.E.I. e não pode ser editada agora.');
  Object.assign(submission, clean, { updatedAt: db.calendar.today });
  return submission;
};

/** Enviar é salvar e passar para a triagem, desde que a demanda esteja completa. */
export const submitForReview = (payload: SaveDraftPayload): DemandSubmission => {
  const submission = saveDraft(payload);
  const missing = missingForReview(submission);
  if (missing.length > 0) throw new RuleError(`Falta preencher: ${missing.join(', ')}.`);
  submission.stage = 'in-review';
  submission.submittedAt = db.calendar.today;
  submission.review = undefined;
  return submission;
};

export const deleteDraft = (id: string) => {
  const submission = findMySubmission(id);
  if (!canDeleteSubmission(submission)) throw new RuleError('Só rascunho pode ser excluído.');
  db.submissions = db.submissions.filter((candidate) => candidate.id !== id);
  return { id };
};

/**
 * Mais uma resposta a uma pergunta, sem limite: a organização pode completar
 * ou corrigir o que disse. Aparece na hora para todos os docentes que abrirem
 * a demanda, com data e hora.
 */
export const answerQuestion = ({ demandId, questionId, text }: { demandId: string; questionId: string; text: string }): Demand => {
  const demand = findMyDemand(demandId);
  const answer = text.trim();
  if (!answer) throw new RuleError('Escreva a resposta.');
  if (answer.length > SUBMISSION_LIMITS.answer) throw new RuleError(`A resposta passa de ${SUBMISSION_LIMITS.answer} caracteres. Divida em duas mensagens.`);
  if (demand.status === 'in-project') throw new RuleError('A demanda virou projeto. Agora a conversa é direto com o docente.');
  const question = demand.questions.find((candidate) => candidate.id === questionId);
  if (!question) throw new NotFoundError('Pergunta não encontrada.');
  const today = db.calendar.today;
  question.replies.push({
    id: `${question.id}-r${question.replies.length + 1}`,
    text: answer,
    at: today,
    time: nextTime(today, conversationOf(demand.questions).map((message) => message.stamp)),
    by: `${db.orgAccount.name}, ${demand.organization.name}`,
  });
  return forOrganization(demand);
};

/** As demandas publicadas que já receberam perguntas, primeiro as que esperam resposta. */
export const listQuestionDemands = (): Demand[] =>
  db.demands
    .filter((demand) => isMine(demand) && demand.questions.length > 0)
    .map(forOrganization)
    // Primeiro as que esperam resposta; entre elas, a do movimento mais recente.
    .sort(
      (a, b) =>
        Number(unansweredQuestions(b).length > 0) - Number(unansweredQuestions(a).length > 0) ||
        (conversationOf(b.questions).at(-1)?.stamp ?? '').localeCompare(conversationOf(a.questions).at(-1)?.stamp ?? ''),
    );

export const listProjects = (): OrgProjectSummary[] =>
  db.projects
    .filter(isMine)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toProjectSummary);

export const getProject = (id: string): OrgProjectDetail => {
  const project = db.projects.find((candidate) => candidate.id === id && isMine(candidate));
  if (!project) throw new NotFoundError('Projeto não encontrado.');
  const discipline = db.disciplines.find((candidate) => candidate.id === project.disciplineId);
  return {
    ...toProjectSummary(project),
    teacherEmail: db.account.email,
    teacherPhone: db.account.phone || undefined,
    coTeachers: (discipline?.coTeachers ?? []).map((coTeacher) => coTeacher.name ?? coTeacher.email),
    hasDemand: db.demands.some((demand) => demand.id === project.demandId),
  };
};
