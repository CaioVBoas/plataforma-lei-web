import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { Overline } from '@/components/ui/overline';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { downloadFile } from '@/utils/download-file';
import { JourneySteps } from '../components/journey-steps';
import { SectionEditor } from '../components/section-editor';
import { SigaaHandoff } from '../components/sigaa-handoff';
import { WorkloadTable } from '../components/workload-table';
import { useMarkProposalReady, useProposal, useRegisterProposal, useSaveProposal } from '../hooks/use-proposals';
import type { Proposal, ProposalStatus } from '../types';
import { STATUS_LABEL, STATUS_TEXT_CLASS, listStatusOf, sectionsAsText } from '../utils/proposal-presentation';

const MetaItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <Overline className="mb-[3px] text-n-600">{label}</Overline>
    <p className="text-sm text-azul-800 tabular-nums">{value}</p>
  </div>
);

/** Em edição = etapa 2 (revisar); pronta = etapa 3 (registrar); registrada = jornada concluída. */
const JOURNEY_STEP: Record<ProposalStatus, number> = { draft: 2, ready: 3, registered: 4 };

const ProposalEditor = ({ proposal }: { proposal: Proposal }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const save = useSaveProposal();
  const markReady = useMarkProposalReady();
  const register = useRegisterProposal(proposal.id);
  const { copiedKey, copy } = useCopyToClipboard<number | 'all'>();

  // Edição local: o texto só vai ao servidor ao salvar ou marcar como pronta, como num editor de documento.
  const [sections, setSections] = useState(proposal.sections);
  const [workload, setWorkload] = useState(proposal.workload);
  const [copiedSections, setCopiedSections] = useState<number[]>([]);
  const [registrationDate, setRegistrationDate] = useState('');

  const status = listStatusOf(proposal);
  const registered = proposal.status === 'registered';
  const emptySections = sections.filter((section) => !section.text.trim()).length;

  const updateSection = (index: number, text: string) =>
    setSections((current) => current.map((section, position) => (position === index ? { ...section, text } : section)));

  const updateHours = (index: number, hours: string) =>
    setWorkload((current) => current.map((row, position) => (position === index ? { ...row, hours } : row)));

  const copySection = (index: number) => {
    copy(index, sections[index].text);
    setCopiedSections((current) => (current.includes(index) ? current : [...current, index]));
    toast.show(`Seção “${sections[index].title}” copiada. Cole no campo correspondente do SIGAA.`);
  };

  const copyAll = () => {
    copy('all', sectionsAsText(sections));
    toast.show(emptySections > 0 ? `Copiado. Atenção: ${emptySections} seção obrigatória ainda está vazia.` : 'Proposta completa copiada.');
  };

  const downloadText = () => {
    downloadFile(`${proposal.title}.txt`, sectionsAsText(sections));
    toast.show('Arquivo de texto gerado com as sete seções.');
  };

  const saveDraft = () =>
    save.mutate({ id: proposal.id, sections, workload }, { onSuccess: () => toast.show('Proposta salva.') });

  const markAsReady = () =>
    markReady.mutate(
      { id: proposal.id, sections, workload },
      {
        onSuccess: () => toast.show('Proposta pronta. Agora copie as seções para o SIGAA e declare a data do registro.'),
        onError: (error) => toast.show(error.message),
      },
    );

  const confirmRegistration = () =>
    register.mutate(registrationDate, {
      onSuccess: (projectId) =>
        toast.show('Proposta registrada. O projeto já aparece em Meus projetos.', {
          label: 'Ver projeto',
          onClick: () => navigate(paths.project(projectId)),
        }),
      onError: (error) => toast.show(error.message),
    });

  return (
    <div>
      <JourneySteps current={JOURNEY_STEP[proposal.status]} />
      <div className="mt-6 mb-12 flex flex-wrap items-center justify-between gap-x-5 gap-y-4 rounded-xl py-4">
        <div className="grid min-w-0 flex-1 grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-7 gap-y-5">
          <MetaItem label="Demanda de origem" value={proposal.partnerName} />
          <MetaItem label="Disciplina vinculada" value={proposal.disciplineName} />
          <MetaItem label="Gerado em" value={proposal.generatedAt} />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <p className={cn('text-xs font-semibold', STATUS_TEXT_CLASS[status])}>{STATUS_LABEL[status]}</p>
            {registered && proposal.registeredOn && (
              <p className="mt-1 text-xs text-n-600 tabular-nums">Registrada por você em {proposal.registeredOn}</p>
            )}
          </div>
          <Link to={paths.demand(proposal.demandId)} className={buttonClassName({ variant: 'secondary' })}>
            Ver demanda original
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-[760px] flex-col gap-12">
        {sections.map((section, index) => (
          <SectionEditor
            key={section.title}
            section={section}
            copied={copiedKey === index}
            onChange={(text) => updateSection(index, text)}
            onCopy={() => copySection(index)}
          />
        ))}

        <WorkloadTable rows={workload} onChangeHours={updateHours} />

        <SigaaHandoff
          sections={sections}
          copiedSections={copiedSections}
          registrationDate={registrationDate}
          registered={registered}
          canRegister={proposal.status === 'ready'}
          registering={register.isPending}
          onCopySection={copySection}
          onCopyAll={copyAll}
          onDownload={downloadText}
          onExportParticipants={() => toast.show('A lista de participantes sai depois que as equipes forem formadas no projeto.')}
          onRegistrationDateChange={setRegistrationDate}
          onRegister={confirmRegistration}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-n-200 pt-8">
          <Button variant="outline-muted" size="sm" disabled={save.isPending} onClick={saveDraft}>
            {registered ? 'Salvar alterações' : 'Salvar rascunho'}
          </Button>
          {/* Uma ação principal por etapa: marcar como pronta, depois registrar (na seção acima), depois acompanhar. */}
          {proposal.status === 'draft' && (
            <Button variant="primary" size="lg" disabled={markReady.isPending} onClick={markAsReady}>
              Marcar como pronta
            </Button>
          )}
          {registered && proposal.projectId && (
            <Link to={paths.project(proposal.projectId)} className={buttonClassName({ variant: 'primary', size: 'lg' })}>
              Ver projeto em execução
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProposalEditorPage = () => {
  const { proposalId = '' } = useParams();
  const proposalQuery = useProposal(proposalId);
  const proposal = proposalQuery.data;
  usePageHeader('Proposta', proposal ? `${proposal.partnerName} · ${proposal.disciplineName}` : '');

  return (
    <QueryView query={proposalQuery} loadingLabel="Carregando a proposta">
      {(loaded) => <ProposalEditor key={loaded.id} proposal={loaded} />}
    </QueryView>
  );
};
