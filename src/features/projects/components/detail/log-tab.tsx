import { useState } from 'react';
import { useToast } from '@/components/feedback/toast-context';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/form-controls';
import { FileIcon } from '@/components/ui/icons';
import { SectionCard } from '@/components/ui/section-card';
import { ToggleChip } from '@/components/ui/toggle-chip';
import { cn } from '@/utils/cn';
import { onlyDigits } from '@/utils/format';
import { useAddLogEntry } from '../../hooks/use-projects';
import type { LogEntry, LogEntryKind } from '../../types';

const KIND_LABEL: Record<LogEntryKind, string> = { 'one-off': 'Atividade pontual', ongoing: 'Atividade perene' };
const KIND_BADGE: Record<LogEntryKind, string> = { 'one-off': 'Pontual', ongoing: 'Perene' };

const NewEntryForm = ({ projectId }: { projectId: string }) => {
  const toast = useToast();
  const addEntry = useAddLogEntry();
  const [kind, setKind] = useState<LogEntryKind>('one-off');
  const [text, setText] = useState('');
  const [hours, setHours] = useState('');

  const submit = () =>
    addEntry.mutate(
      { projectId, kind, text, hours },
      {
        onSuccess: () => {
          setText('');
          setHours('');
          toast.show('Andamento registrado. O parceiro é notificado.');
        },
        onError: (error) => toast.show(error.message),
      },
    );

  return (
    <SectionCard title="Novo registro">
      <div role="radiogroup" aria-label="Tipo de atividade" className="mb-3.5 flex flex-wrap gap-2">
        {(Object.keys(KIND_LABEL) as LogEntryKind[]).map((option) => (
          <ToggleChip key={option} role="radio" aria-checked={kind === option} selected={kind === option} showCheck={false} size="sm" onClick={() => setKind(option)}>
            {KIND_LABEL[option]}
          </ToggleChip>
        ))}
      </div>
      <Textarea
        aria-label="O que a equipe fez"
        placeholder="O que a equipe fez nesta semana e o que ficou pendente"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="min-h-[88px]"
      />
      <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
        <Field label="Horas registradas" htmlFor="horas-registro">
          <Input id="horas-registro" inputMode="numeric" placeholder="0" value={hours} onChange={(event) => setHours(onlyDigits(event.target.value))} className="text-sm tabular-nums" />
        </Field>
        <Field label="Participantes envolvidos">
          <p className="flex h-11 items-center rounded-lg border border-n-300 bg-n-0 px-3 text-sm text-n-700">Todas as equipes</p>
        </Field>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" disabled={addEntry.isPending} onClick={submit}>
          Registrar
        </Button>
      </div>
    </SectionCard>
  );
};

const LogEntryItem = ({ entry }: { entry: LogEntry }) => (
  <li className="px-6 py-5">
    <div className="flex flex-wrap items-center gap-2.5">
      <Avatar name={entry.author} size="sm" />
      <span className="text-sm font-medium text-n-800">{entry.author}</span>
      <span
        className={cn(
          'flex h-6 items-center rounded-full px-2 text-[11px] font-semibold',
          entry.kind === 'ongoing' ? 'bg-azul-50 text-azul-800' : 'bg-n-75 text-n-600',
        )}
      >
        {KIND_BADGE[entry.kind]}
      </span>
      <span className="ml-auto text-xs text-n-500 tabular-nums">{entry.date}</span>
    </div>
    <p className="mt-2.5 max-w-[76ch] text-sm leading-relaxed text-n-700">{entry.text}</p>
    {entry.attachments.length > 0 && (
      <ul aria-label="Anexos" className="mt-3 flex flex-wrap gap-2">
        {entry.attachments.map((attachment) => (
          <li key={attachment} className="flex h-10 items-center gap-1.5 rounded-lg border border-n-200 px-2.5 text-xs text-n-600">
            <FileIcon size={11} className="text-n-500" />
            {attachment}
          </li>
        ))}
      </ul>
    )}
  </li>
);

export const LogTab = ({ projectId, entries }: { projectId: string; entries: LogEntry[] }) => (
  <div className="flex flex-col gap-12">
    <NewEntryForm projectId={projectId} />
    <ul className="flex flex-col gap-8">
      {entries.map((entry) => (
        <LogEntryItem key={`${entry.date}-${entry.author}-${entry.text.slice(0, 20)}`} entry={entry} />
      ))}
    </ul>
  </div>
);
