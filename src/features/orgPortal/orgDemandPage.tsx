import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { CoverBanner } from '@/components/ui/coverBanner';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { ArrowRightIcon } from '@/components/ui/icons';
import { Modal } from '@/components/ui/modal';
import { Page } from '@/components/ui/page';
import { SideCard } from '@/components/ui/sideCard';
import { Tag } from '@/components/ui/tag';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { formatShortDate } from '@/domain/calendar';
import { canDeleteSubmission, canEditSubmission, unansweredQuestions } from '@/domain/submission';
import type { DemandSubmission } from '@/domain/types';
import { useTabParam } from '@/hooks/useTabParam';
import { demandCover } from '@/lib/covers';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import { DemandContent } from './components/demandContent';
import { DemandPreviewCard } from './components/demandPreviewCard';
import { JourneyTrack } from './components/journeyTrack';
import { QuestionsInbox } from './components/questionsInbox';
import { ReviewNote } from './components/reviewNote';
import type { OrgDemandDetail } from './types';
import { useDeleteDraft, useOrgDemand, useOrgProfile } from './useOrgPortal';
import { STAGE_COPY } from './utils/orgPresentation';

const TABS = ['demanda', 'perguntas', 'cardapio'] as const;

const SideText = ({ children }: { children: ReactNode }) => <p className="text-sm leading-relaxed text-ink-2">{children}</p>;

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

/** A coluna da situação: o que está acontecendo com o pedido e a única ação que cabe agora. */
const StatusPanel = ({ detail }: { detail: OrgDemandDetail }) => {
  if (detail.kind === 'submission') {
    const { submission } = detail;
    return (
      <SideCard title="Situação">
        {submission.stage === 'draft' && <SideText>Rascunho salvo em {formatShortDate(submission.updatedAt)}. Só vocês veem até enviar para a triagem.</SideText>}
        {submission.stage === 'needs-changes' && <SideText>O L.E.I. leu e pediu um ajuste antes de publicar. Ajuste o texto e reenvie.</SideText>}
        {submission.stage === 'in-review' && (
          <SideText>
            Enviada em {formatShortDate(submission.submittedAt ?? submission.updatedAt)}. O L.E.I. lê cada demanda antes de ela entrar no cardápio e, se precisar, pede ajuste por aqui.
          </SideText>
        )}
        {canEditSubmission(submission) && (
          <div className="mt-4 flex flex-col gap-2">
            <Link to={paths.orgEditDemand(submission.id)} className={buttonClassName({ variant: 'primary', fullWidth: true })}>
              {submission.stage === 'needs-changes' ? 'Ajustar e reenviar' : 'Continuar editando'}
              <ArrowRightIcon size={15} />
            </Link>
            {canDeleteSubmission(submission) && <DeleteDraft submission={submission} />}
          </div>
        )}
      </SideCard>
    );
  }

  const { demand, project, stage } = detail;
  const unanswered = unansweredQuestions(demand).length;

  return (
    <SideCard title="Situação">
      {stage === 'open' && <SideText>No cardápio desde {formatShortDate(demand.publishedAt)}. Os docentes do CIn já podem ver, perguntar e reservar.</SideText>}
      {stage === 'reserved' && demand.reservation && (
        <SideText>
          <span className="font-medium text-ink">{demand.reservation.teacherName}</span> está avaliando até {formatShortDate(demand.reservation.until)}. Se levar para uma disciplina, a demanda vira projeto e vocês recebem o contato.
        </SideText>
      )}
      {(stage === 'in-project' || stage === 'done') && project && (
        <>
          <SideText>
            {stage === 'done' ? 'Projeto concluído' : 'Virou projeto'} na disciplina <span className="font-medium text-ink">{project.disciplineName}</span>, com {project.teacherName}, em {project.semester}.
          </SideText>
          <Link to={paths.orgProject(project.id)} className={cn(buttonClassName({ variant: 'primary', fullWidth: true }), 'mt-4')}>
            Acompanhar o projeto
            <ArrowRightIcon size={15} />
          </Link>
        </>
      )}
      {unanswered > 0 && (
        <p className="mt-4 border-t border-line pt-3 text-sm text-ink">
          {pluralize(unanswered, 'pergunta espera', 'perguntas esperam')} resposta.{' '}
          <Link to={paths.orgDemand(demand.id, 'perguntas')} className={textLinkClassName}>
            Responder
          </Link>
        </p>
      )}
    </SideCard>
  );
};

const DemandView = ({ detail }: { detail: OrgDemandDetail }) => {
  const [tab, setTab] = useTabParam(TABS);
  const stage = STAGE_COPY[detail.stage];
  const isSubmission = detail.kind === 'submission';
  const title = isSubmission ? detail.submission.title || 'Demanda sem nome' : detail.demand.title;
  const problem = isSubmission ? detail.submission.problem : detail.demand.problem;
  const draft = isSubmission ? detail.submission : detail.demand;
  const { data: profile } = useOrgProfile();
  const cover = demandCover(isSubmission ? detail.submission.id : detail.demand.id, draft.organization.id, profile?.organization.cover);
  const previewDraft = isSubmission ? detail.submission : { ...detail.demand, expectedOutcome: detail.demand.scopeNote };
  // Perguntas só existem depois de publicada; antes disso a aba não aparece.
  const activeTab = isSubmission && tab === 'perguntas' ? 'demanda' : tab;

  return (
    <Page title={title} eyebrow={<Tag tone={stage.tone}>{stage.label}</Tag>} subtitle={problem} back={{ to: paths.orgDemands(), label: 'Demandas' }}>
      {cover && <CoverBanner cover={cover} />}
      <div className="mb-10">
        <JourneyTrack stage={detail.stage} />
      </div>
      {isSubmission && detail.submission.stage === 'needs-changes' && detail.submission.review && <ReviewNote review={detail.submission.review} />}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <UnderlineTabs
            label="Sobre a demanda"
            value={activeTab}
            onChange={setTab}
            className="mb-7"
            options={[
              { value: 'demanda', label: 'Demanda' },
              ...(isSubmission ? [] : [{ value: 'perguntas' as const, label: 'Perguntas', count: detail.demand.questions.length }]),
              { value: 'cardapio', label: 'No cardápio' },
            ]}
          />

          {activeTab === 'demanda' && (
            <DemandContent
              {...draft}
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

        <aside className="-order-1 lg:sticky lg:top-20 lg:order-none lg:self-start">
          <StatusPanel detail={detail} />
        </aside>
      </div>
    </Page>
  );
};

export const OrgDemandPage = () => {
  const { demandId = '' } = useParams();
  const query = useOrgDemand(demandId);
  return <QueryView query={query}>{(detail) => <DemandView detail={detail} />}</QueryView>;
};
