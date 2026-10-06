import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { DetailHeader } from '@/components/ui/detailHeader';
import { ArrowRightIcon, CalendarIcon, ChatIcon, ClockIcon, PencilIcon, UsersIcon } from '@/components/ui/icons';
import { InfoBanner } from '@/components/ui/infoBanner';
import { Modal } from '@/components/ui/modal';
import { Page } from '@/components/ui/page';
import { Tag } from '@/components/ui/tag';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { formatShortDate } from '@/domain/calendar';
import { canDeleteSubmission, canEditSubmission, unansweredQuestions } from '@/domain/submission';
import type { DemandSubmission } from '@/domain/types';
import { useTabParam } from '@/hooks/useTabParam';
import { demandCover } from '@/lib/covers';
import { paths } from '@/routes/paths';
import { DemandContent } from './components/demandContent';
import { DemandPreviewCard } from './components/demandPreviewCard';
import { JourneyTrack } from './components/journeyTrack';
import { StageIcon, StageTag } from './components/orgDemandRow';
import { QuestionsInbox } from './components/questionsInbox';
import { ReviewNote } from './components/reviewNote';
import type { OrgDemandDetail } from './types';
import { useDeleteDraft, useOrgDemand, useOrgProfile } from './useOrgPortal';
import { JOURNEY, journeyIndex } from './utils/orgPresentation';

const TABS = ['demanda', 'perguntas', 'cardapio'] as const;

const DeleteDraft = ({ submission }: { submission: DemandSubmission }) => {
  const [confirming, setConfirming] = useState(false);
  const remove = useDeleteDraft();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
        Excluir rascunho
      </Button>
      {confirming && (
        <Modal
          title="Excluir o rascunho?"
          description={`"${submission.title}" ainda não foi enviado ao L.E.I. Excluído, o texto não volta.`}
          onClose={() => setConfirming(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirming(false)}>
                Manter
              </Button>
              <Button
                variant="primary"
                disabled={remove.isPending}
                onClick={() =>
                  remove.mutate(submission.id, {
                    onSuccess: () => {
                      toast.show('Rascunho excluído.');
                      navigate(paths.orgDemands(), { replace: true });
                    },
                  })
                }
              >
                Excluir
              </Button>
            </>
          }
        />
      )}
    </>
  );
};

/** A situação em uma frase, num aviso logo abaixo das abas. */
const situation = (detail: OrgDemandDetail): ReactNode => {
  if (detail.kind === 'submission') {
    const { submission } = detail;
    if (submission.stage === 'draft') return `Rascunho salvo em ${formatShortDate(submission.updatedAt)}. Só vocês veem até enviar para a triagem.`;
    if (submission.stage === 'needs-changes') return 'O L.E.I. leu e pediu um ajuste antes de publicar. Ajuste o texto e reenvie.';
    return `Enviada em ${formatShortDate(submission.submittedAt ?? submission.updatedAt)}. O L.E.I. lê cada demanda antes de ela entrar no cardápio e, se precisar, pede ajuste por aqui.`;
  }
  const { demand, project, stage } = detail;
  if (stage === 'open') return `No cardápio desde ${formatShortDate(demand.publishedAt)}. Os docentes do CIn já podem ver, perguntar e escolher.`;
  if (stage === 'reserved' && demand.reservation) {
    return (
      <>
        <span className="font-semibold">{demand.reservation.teacherName}</span> está avaliando até {formatShortDate(demand.reservation.until)}. Se levar para uma disciplina, a demanda vira projeto e vocês recebem o contato.
      </>
    );
  }
  if (project) {
    return (
      <>
        {stage === 'done' ? 'Projeto concluído' : 'Virou projeto'} na disciplina <span className="font-semibold">{project.disciplineName}</span>, com {project.teacherName}, em {project.semester}.
      </>
    );
  }
  return null;
};

/** A única ação que cabe agora, à direita do título. Rascunho também pode ser excluído. */
const HeaderActions = ({ detail }: { detail: OrgDemandDetail }) => {
  if (detail.kind === 'submission') {
    const { submission } = detail;
    if (!canEditSubmission(submission)) return null;
    return (
      <>
        {canDeleteSubmission(submission) && <DeleteDraft submission={submission} />}
        <Link to={paths.orgEditDemand(submission.id)} className={buttonClassName({ variant: 'primary' })}>
          <PencilIcon size={15} />
          {submission.stage === 'needs-changes' ? 'Ajustar e reenviar' : 'Continuar editando'}
        </Link>
      </>
    );
  }
  const { demand, project } = detail;
  if (project) {
    return (
      <Link to={paths.orgProject(project.id)} className={buttonClassName({ variant: 'primary' })}>
        Acompanhar o projeto
        <ArrowRightIcon size={15} />
      </Link>
    );
  }
  const unanswered = unansweredQuestions(demand).length;
  if (unanswered > 0) {
    return (
      <Link to={paths.orgDemand(demand.id, 'perguntas')} className={buttonClassName({ variant: 'primary' })}>
        <ChatIcon size={15} />
        {unanswered === 1 ? 'Responder a pergunta' : `Responder ${unanswered} perguntas`}
      </Link>
    );
  }
  return null;
};

const DemandView = ({ detail }: { detail: OrgDemandDetail }) => {
  const [tab, setTab] = useTabParam(TABS);
  const isSubmission = detail.kind === 'submission';
  const title = isSubmission ? detail.submission.title || 'Demanda sem nome' : detail.demand.title;
  const problem = isSubmission ? detail.submission.problem : detail.demand.problem;
  const draft = isSubmission ? detail.submission : detail.demand;
  const { data: profile } = useOrgProfile();
  const cover = demandCover(isSubmission ? detail.submission.id : detail.demand.id, draft.organization.id, profile?.organization.cover);
  const previewDraft = isSubmission ? detail.submission : { ...detail.demand, expectedOutcome: detail.demand.scopeNote };
  // Perguntas só existem depois de publicada; antes disso a aba não aparece.
  const activeTab = isSubmission && tab === 'perguntas' ? 'demanda' : tab;
  const step = journeyIndex(detail.stage);
  const questions = isSubmission ? [] : detail.demand.questions;
  const unanswered = questions.filter((question) => !question.answer).length;
  const updated = isSubmission ? detail.submission.updatedAt : detail.demand.publishedAt;
  const text = situation(detail);

  return (
    <Page title={title} back={{ to: paths.orgDemands(), label: 'Demandas' }} bare>
      <DetailHeader
        cover={cover}
        chips={
          <>
            <StageTag demand={detail} />
            <Tag pill>{draft.organization.type}</Tag>
          </>
        }
        title={title}
        description={problem || undefined}
        actions={<HeaderActions detail={detail} />}
        progress={{
          label: detail.stage === 'done' ? 'Concluída' : `Passo ${step + 1} de ${JOURNEY.length}: ${JOURNEY[step].label}`,
          bar: <JourneyTrack stage={detail.stage} hideMobileLabel />,
        }}
        facts={[
          { icon: <UsersIcon size={17} />, label: 'Quem sente', value: draft.affectedPublic || 'Ainda não preenchido' },
          { icon: <CalendarIcon size={17} />, label: 'Reuniões', value: draft.meetingCadence || 'Ainda não preenchido' },
          {
            icon: <ChatIcon size={17} />,
            label: 'Perguntas de docentes',
            value: isSubmission ? 'Depois de publicada' : unanswered > 0 ? `${questions.length}, ${unanswered} sem resposta` : String(questions.length),
          },
          { icon: <ClockIcon size={17} />, label: isSubmission ? 'Salva em' : 'No cardápio desde', value: formatShortDate(updated) },
        ]}
      />

      {isSubmission && detail.submission.stage === 'needs-changes' && detail.submission.review && (
        <div className="mt-6">
          <ReviewNote review={detail.submission.review} />
        </div>
      )}

      <UnderlineTabs
        label="Sobre a demanda"
        value={activeTab}
        onChange={setTab}
        className="mt-8 mb-6"
        options={[
          { value: 'demanda', label: 'Demanda' },
          ...(isSubmission ? [] : [{ value: 'perguntas' as const, label: 'Perguntas', count: questions.length }]),
          { value: 'cardapio', label: 'No cardápio' },
        ]}
      />

      {text && (
        <InfoBanner className="mb-6" icon={<StageIcon stage={detail.stage} />}>
          {text}
        </InfoBanner>
      )}

      <div className="max-w-[860px]">
        {activeTab === 'demanda' && (
          <DemandContent
            {...draft}
            facts={false}
            outcome={
              isSubmission
                ? { title: 'O que ajudaria ao fim do semestre', text: detail.submission.expectedOutcome }
                : { title: 'O que cabe no semestre', text: detail.demand.scopeNote }
            }
          />
        )}

        {activeTab === 'perguntas' && !isSubmission && <QuestionsInbox demand={detail.demand} />}

        {activeTab === 'cardapio' && (
          <div className="max-w-[460px]">
            <p className="mb-4 text-sm leading-relaxed text-ink-2">
              {isSubmission
                ? 'Assim o cartão vai aparecer para os docentes quando a demanda entrar no cardápio.'
                : 'Assim o cartão aparece para os docentes. Cada um vê também qual turma dele combina com a demanda.'}
            </p>
            <DemandPreviewCard draft={previewDraft} organization={draft.organization} />
          </div>
        )}
      </div>
    </Page>
  );
};

export const OrgDemandPage = () => {
  const { demandId = '' } = useParams();
  const query = useOrgDemand(demandId);
  return <QueryView query={query}>{(detail) => <DemandView detail={detail} />}</QueryView>;
};
