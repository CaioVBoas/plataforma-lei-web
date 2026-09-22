import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-controls';
import { CheckIcon, PlusIcon, WarningIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import type { ProposalSection } from '../types';

/** O que a plataforma já garantiu e o que ainda depende do docente antes do registro. */
const CHECKLIST = [
  { label: 'Demanda triada pela equipe do PLEI', done: true },
  { label: 'Disciplina vinculada e turma confirmada', done: true },
  { label: 'Parceiro ciente do escopo de um semestre', done: true },
  { label: 'Definir período de execução', done: false },
];

const MARK_CLASSES = 'mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full';

const ChecklistMark = ({ done }: { done: boolean }) => (
  <span aria-hidden="true" className={cn(MARK_CLASSES, 'text-n-700', done ? 'bg-sucesso-bg' : 'bg-alerta-bg')}>
    {done ? <CheckIcon size={10} /> : <WarningIcon size={10} strokeWidth={3} />}
  </span>
);

const CopyMark = ({ copied }: { copied: boolean }) => (
  <span aria-hidden="true" className={cn(MARK_CLASSES, copied ? 'text-n-800' : 'text-n-300')}>
    {copied ? <CheckIcon size={10} /> : <PlusIcon size={10} strokeWidth={3} />}
  </span>
);

interface SigaaHandoffProps {
  sections: ProposalSection[];
  copiedSections: number[];
  registrationDate: string;
  registered: boolean;
  registering: boolean;
  onCopySection: (index: number) => void;
  onCopyAll: () => void;
  onDownload: () => void;
  onExportParticipants: () => void;
  onRegistrationDateChange: (isoDate: string) => void;
  onRegister: () => void;
}

/** A plataforma prepara o texto; o registro acontece no SIGAA e é declarado pelo docente. */
export const SigaaHandoff = ({
  sections,
  copiedSections,
  registrationDate,
  registered,
  registering,
  onCopySection,
  onCopyAll,
  onDownload,
  onExportParticipants,
  onRegistrationDateChange,
  onRegister,
}: SigaaHandoffProps) => (
  <section>
    <h3 className="heading-section">Levar para o SIGAA</h3>
    <p className="mt-1 max-w-[62ch] text-[15px] leading-relaxed text-n-600">
      A plataforma prepara o texto. O registro você faz no SIGAA, copiando seção por seção.
    </p>

    <ul className="mt-6">
      {sections.map((section, index) => {
        const copied = copiedSections.includes(index);
        return (
          <li key={section.title} className="flex items-center gap-4 border-b border-n-200 py-3.5">
            <CopyMark copied={copied} />
            <span className="min-w-0 flex-1 text-[15px] text-n-700">{section.title}</span>
            <button type="button" onClick={() => onCopySection(index)} className={cn('text-sm font-medium', copied ? 'text-n-600' : 'text-azul-500 hover:text-azul-600')}>
              {copied ? 'Copiada' : 'Copiar'}
            </button>
          </li>
        );
      })}
    </ul>

    <div className="mt-5 flex flex-wrap items-center gap-2.5">
      <Button variant="outline-accent" size="sm" onClick={onCopyAll}>
        Copiar tudo
      </Button>
      <Button variant="outline-muted" size="sm" onClick={onDownload}>
        Baixar em texto
      </Button>
      <Button variant="outline-muted" size="sm" onClick={onExportParticipants}>
        Exportar lista de participantes
      </Button>
    </div>
    <p className="mt-2 max-w-[62ch] text-[13px] leading-normal text-n-500">
      A lista de participantes sai em CSV pronta para você anexar no cadastro, em vez de digitar pessoa por pessoa.
    </p>

    <div className="mt-8">
      <h4 className="mb-3.5 text-[15px] font-medium text-n-800">Antes de registrar</h4>
      <ul className="mb-8 flex flex-col gap-[11px]">
        {CHECKLIST.map((item) => (
          <li key={item.label} className="flex items-start gap-[9px]">
            <ChecklistMark done={item.done} />
            <span className={cn('text-[13px] leading-[1.45]', item.done ? 'text-n-600' : 'font-medium text-n-700')}>{item.label}</span>
          </li>
        ))}
      </ul>

      <label htmlFor="data-registro" className="mb-2 block text-sm font-medium text-n-800">
        Registrei no SIGAA em
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          id="data-registro"
          type="date"
          value={registrationDate}
          onChange={(event) => onRegistrationDateChange(event.target.value)}
          className="w-[200px] text-sm tabular-nums"
        />
        <Button
          variant={registered ? 'secondary' : 'primary'}
          disabled={registered || registering}
          onClick={onRegister}
          className={cn('rounded-lg font-semibold', registered && 'border-sucesso-borda bg-sucesso-bg disabled:text-n-700')}
        >
          {registered ? 'Registro confirmado' : 'Confirmar registro'}
        </Button>
      </div>
      <p className="mt-2.5 max-w-[62ch] text-[13px] leading-normal text-n-500">A plataforma não consegue verificar o registro. Esta confirmação é sua.</p>
    </div>
  </section>
);
