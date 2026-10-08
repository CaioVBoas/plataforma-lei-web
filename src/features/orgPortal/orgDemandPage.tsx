import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { CoverBanner } from '@/components/ui/coverBanner';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { ArrowRightIcon, ChatIcon, PencilIcon } from '@/components/ui/icons';
import { Modal } from '@/components/ui/modal';
import { Page } from '@/components/ui/page';
import { SideCard } from '@/components/ui/sideCard';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { formatShortDate } from '@/domain/calendar';
import { canDeleteSubmission, canEditSubmission, unansweredQuestions } from '@/domain/submission';
import type { DemandSubmission } from '@/domain/types';
import { useTabParam } from '@/hooks/useTabParam';
import { demandCover } from '@/lib/covers';
import { paths } from '@/routes/paths';
import { DemandContent, DemandFacts } from './components/demandContent';
import { DemandPreviewCard } from './components/demandPreviewCard';
import { JourneyTrack } from './components/journeyTrack';
import { StageTag } from './components/orgDemandCard';
import { QuestionsInbox } from './components/questionsInbox';
import { ReviewNote } from './components/reviewNote';
import type { OrgDemandDetail } from './types';
import { useDeleteDraft, useOrgDemand, useOrgProfile } from './useOrgPortal';

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

/** A coluna da situação: o que está acontecendo com o pedido e a única ação que cabe agora. */
/** O que vem depois de cada estado, para ninguém ficar sem saber o próximo passo. */
const NEXT: Record<OrgDemandDetail['stage'], string> = {
  draft: 'Depois de enviar, o L.E.I. lê e responde por aqui.',
  'in-review': 'Se estiver tudo certo, a demanda entra no cardápio e os docentes passam a ver.',
  'needs-changes': 'Depois de reenviar, o L.E.I. lê de novo.',
  open: 'Quando um docente escolher a demanda, vocês recebem o contato dele e combinam a primeira reunião.',
  reserved: 'Se o docente levar para a turma, a demanda vira projeto e vocês recebem o contato dele.',
  'in-project': 'Vocês participam da reunião de abertura, da entrega parcial e da entrega final.',
  done: 'O resultado fica no perfil de vocês, para a próxima turma não começar do zero.',
};

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="border-t border-line pt-3.5 first:border-t-0 first:pt-0">
    <p className="text-[12px] font-semibold tracking-[0.04em] text-ink-3 uppercase">{title}</p>
    <div className="mt-1 text-sm leading-relaxed text-ink">{children}</div>
  </div>
);

/** O que está acontecendo, o que fazer (se for a vez de vocês) e o que vem depois. */
const situationText = (detail: OrgDemandDetail): ReactNode => {
  if (detail.kind === 'submission') {
    const { submission } = detail;
    if (submission.stage === 'draft') return <>Rascunho salvo em {formatShortDate(submission.updatedAt)}. Só vocês veem até enviar para o L.E.I.</>;
    if (submission.stage === 'needs-changes') return 'O L.E.I. leu e pediu um ajuste antes de publicar. O pedido está no topo da página.';
    return <>Enviada em {formatShortDate(submission.submittedAt ?? submission.updatedAt)}. O L.E.I. está lendo.</>;
  }
  const { demand, project, stage } = detail;
  if (stage === 'reserved' && demand.reservation) {
    return (
      <>
        <span className="font-semibold">{demand.reservation.teacherName}</span> está avaliando a demanda até {formatShortDate(demand.reservation.until)}.
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
  return <>No cardápio desde {formatShortDate(demand.publishedAt)}. Os docentes do CIn já podem ver, perguntar e escolher.</>;
};

/**
 * A coluna "O que acontece agora", no lugar da coluna de decisão do docente:
 * o estado, a frase do momento, a única ação que cabe (quando a vez é de
 * vocês) e o que vem depois. Embaixo, o caminho para o Como funciona.
 */
const StatusPanel = ({ detail }: { detail: OrgDemandDetail }) => {
  const isSubmission = detail.kind === 'submission';
  const unanswered = isSubmission ? 0 : unansweredQuestions(detail.demand).length;
  const editable = isSubmission && canEditSubmission(detail.submission);
  const yourTurn = editable || unanswered > 0;

  let action: ReactNode = null;
  if (editable && isSubmission) {
    action = (
      <Link to={paths.orgEditDemand(detail.submission.id)} className={buttonClassName({ variant: 'primary', size: 'xl', fullWidth: true })}>
        <PencilIcon size={20} />
        {detail.submission.stage === 'needs-changes' ? 'Fazer o ajuste' : 'Continuar escrevendo'}
      </Link>
    );
  } else if (unanswered > 0 && !isSubmission) {
    action = (
      <Link to={paths.orgDemand(detail.demand.id, 'perguntas')} className={buttonClassName({ variant: 'primary', size: 'xl', fullWidth: true })}>
        <ChatIcon size={20} />
        {unanswered === 1 ? 'Responder a pergunta' : `Responder ${unanswered} perguntas`}
      </Link>
    );
  } else if (!isSubmission && detail.project) {
    action = (
      <Link to={paths.orgProject(detail.project.id)} className={buttonClassName({ variant: 'secondary', fullWidth: true })}>
        Acompanhar o projeto
        <ArrowRightIcon size={15} />
      </Link>
    );
  }

  return (
    <SideCard title="O que acontece agora">
      <div className="mb-4">
        <StageTag stage={detail.stage} />
      </div>
      <div className="flex flex-col gap-3.5">
        <Block title="Agora">{situationText(detail)}</Block>
        <Block title="Vocês">
          {yourTurn ? (
            <span className="font-semibold text-accent">
              É a vez de vocês.{' '}
              {editable ? (isSubmission && detail.submission.stage === 'needs-changes' ? 'Façam o ajuste e enviem de novo.' : 'Terminem de escrever e enviem.') : 'Um docente espera a resposta.'}
            </span>
          ) : (
            'Não precisam fazer nada agora.'
          )}
        </Block>
        <Block title="Depois">{NEXT[detail.stage]}</Block>
      </div>
      {(action || (isSubmission && canDeleteSubmission(detail.submission))) && (
        <div className="mt-5 flex flex-col gap-2">
          {action}
          {isSubmission && canDeleteSubmission(detail.submission) && <DeleteDraft submission={detail.submission} />}
        </div>
      )}
      <p className="mt-5 border-t border-line pt-3.5 text-[13px] text-ink-2">
        Dúvidas sobre o caminho?{' '}
        <Link to={paths.orgGuide} className={textLinkClassName}>
          Veja como funciona
        </Link>
      </p>
    </SideCard>
  );
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

  return (
    <Page title={title} eyebrow={`${draft.organization.name} · ${draft.organization.type}`} subtitle={problem} back={{ to: paths.orgDemands(), label: 'Demandas' }}>
      {cover && <CoverBanner cover={cover} />}
      <div className="mb-10">
        <JourneyTrack stage={detail.stage} />
      </div>
      {isSubmission && detail.submission.stage === 'needs-changes' && detail.submission.review && <ReviewNote review={detail.submission.review} />}

      <div className="grid grid-cols-1 gap-10 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <DemandFacts affectedPublic={draft.affectedPublic} meetingCadence={draft.meetingCadence} />
          <UnderlineTabs
            label="Sobre a demanda"
            value={activeTab}
            onChange={setTab}
            className="mt-8 mb-7"
            options={[
              { value: 'demanda', label: 'Demanda' },
              ...(isSubmission ? [] : [{ value: 'perguntas' as const, label: 'Perguntas', count: detail.demand.questions.length }]),
              { value: 'cardapio', label: 'No cardápio' },
            ]}
          />

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
