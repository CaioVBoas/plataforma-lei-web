import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import { SectionEditor } from '../components/section-editor';
import { SigaaHandoff } from '../components/sigaa-handoff';
import { WorkloadTable } from '../components/workload-table';
import { useProposal, useRegisterProposal, useSaveProposal } from '../hooks/use-proposals';
import type { Proposal } from '../types';
import { STATUS_LABEL, STATUS_TEXT_CLASS, listStatusOf, sectionsAsText } from '../utils/proposal-presentation';

const MetaItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <Overline className="mb-[3px] text-n-600">{label}</Overline>
    <p className="text-sm text-azul-800 tabular-nums">{value}</p>
  </div>
);

const ProposalEditor = ({ proposal }: { proposal: Proposal }) => {
  const toast = useToast();
  const save = useSaveProposal();
  const register = useRegisterProposal(proposal.id);
  const { copiedKey, copy } = useCopyToClipboard<number | 'all'>();

  // Edição local: o texto só vai ao servidor em "Salvar rascunho", como num editor de documento.
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
    save.mutate({ id: proposal.id, sections, workload }, { onSuccess: () => toast.show('Rascunho salvo em Propostas.') });

  const confirmRegistration = () =>
    register.mutate(registrationDate, {
      onSuccess: () => toast.show('Situação alterada para Registrada. A Coordenação vê a data que você informou.'),
      onError: (error) => toast.show(error.message),
    });

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-center justify-between gap-x-5 gap-y-4 rounded-xl px-5 py-4">
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
            Salvar rascunho
          </Button>
          <Button variant="primary" size="lg" disabled={registered || register.isPending} onClick={confirmRegistration}>
            Marcar como registrada no SIGAA
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ProposalEditorPage = () => {
  const { proposalId = '' } = useParams();
  const proposalQuery = useProposal(proposalId);
  const proposal = proposalQuery.data;
  usePageHeader(
    'Rascunho da proposta',
    proposal ? `Gerado a partir da demanda do ${proposal.partnerName} e da disciplina ${proposal.disciplineName}` : '',
  );

  return (
    <QueryView query={proposalQuery} loadingLabel="Carregando o rascunho">
      {(loaded) => <ProposalEditor key={loaded.id} proposal={loaded} />}
    </QueryView>
  );
};
