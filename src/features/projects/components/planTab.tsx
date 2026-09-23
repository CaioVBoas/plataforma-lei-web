import { useState } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { AutoResizeTextarea } from '@/components/ui/formControls';
import { CopyIcon } from '@/components/ui/icons';
import { formatShortDate } from '@/domain/calendar';
import { emptyPlanSections, isPlanLocked, nextMilestone } from '@/domain/projectLifecycle';
import type { IsoDate, PlanSection, Project } from '@/domain/types';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { cn } from '@/utils/cn';
import { joinWithAnd } from '@/utils/format';
import { useCompleteMilestone, useUpdatePlanSection } from '../hooks/useProjects';
import { MILESTONE_COPY } from '../utils/projectPresentation';

interface SectionProps {
  projectId: string;
  index: number;
  section: PlanSection;
  locked: boolean;
}

const PlanSectionField = ({ projectId, index, section, locked }: SectionProps) => {
  const update = useUpdatePlanSection();
  const { copiedKey, copy } = useCopyToClipboard();
  const [text, setText] = useState(section.text);
  const fieldId = `secao-${index}`;
  const overLimit = text.length > section.limit;

  const save = () => {
    if (text !== section.text && !overLimit) update.mutate({ projectId, sectionIndex: index, text });
  };

  return (
    <div className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={fieldId} className="text-[15px] font-semibold text-ink">
          {section.title}
        </label>
        <button type="button" onClick={() => copy('section', text)} className="inline-flex items-center gap-1 text-[13px] text-accent hover:text-accent-hover">
          <CopyIcon size={14} />
          {copiedKey === 'section' ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      {locked ? (
        <p id={fieldId} className="text-[15px] leading-relaxed whitespace-pre-line text-ink-2">
          {section.text}
        </p>
      ) : (
        <>
          <AutoResizeTextarea id={fieldId} value={text} onChange={(event) => setText(event.target.value)} onBlur={save} aria-invalid={overLimit} />
          <p className={cn('mt-1.5 text-right text-xs tabular-nums', overLimit ? 'text-critical' : 'text-ink-3')}>
            {text.length} de {section.limit} caracteres
            {update.isPending && ' · salvando'}
          </p>
          {update.isError && (
            <p role="alert" className="mt-1 text-[13px] text-critical">
              {update.error.message}
            </p>
          )}
        </>
      )}
    </div>
  );
};

const WorkloadTable = ({ project }: { project: Project }) => {
  if (project.workload.length === 0) return null;
  const total = project.workload.reduce((sum, row) => sum + row.hours, 0);

  return (
    <div className="mt-10">
      <h3 className="text-[15px] font-semibold text-ink">Carga horária</h3>
      <p className="mt-1 text-[13px] text-ink-3">Distribuição sugerida entre as atividades. Vai para o campo de carga horária do SIGAA.</p>
      <table className="mt-3 w-full overflow-hidden rounded-lg border border-line text-sm">
        <thead className="bg-canvas text-left text-[13px] text-ink-2">
          <tr>
            <th className="px-4 py-2.5 font-medium">Atividade</th>
            <th className="px-4 py-2.5 font-medium">Quem</th>
            <th className="px-4 py-2.5 text-right font-medium">Horas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {project.workload.map((row) => (
            <tr key={row.activity}>
              <td className="px-4 py-2.5">{row.activity}</td>
              <td className="px-4 py-2.5 text-ink-2">{row.participants}</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{row.hours}</td>
            </tr>
          ))}
          <tr className="font-medium">
            <td className="px-4 py-2.5" colSpan={2}>
              Total
            </td>
            <td className="px-4 py-2.5 text-right tabular-nums">{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

/** O plano é o texto do SIGAA. Editável até o registro, travado depois (regra 8). */
export const PlanTab = ({ project, today }: { project: Project; today: IsoDate }) => {
  const toast = useToast();
  const complete = useCompleteMilestone();
  const locked = isPlanLocked(project);
  const awaitingConfirmation = nextMilestone(project.milestones)?.id === 'plan';
  const empty = emptyPlanSections(project);
  const registeredAt = project.milestones.find((milestone) => milestone.id === 'sigaa')?.doneAt;

  const confirm = () =>
    complete.mutate(
      { projectId: project.id, milestoneId: 'plan', doneAt: today },
      { onSuccess: () => toast.show(MILESTONE_COPY.plan.doneMessage) },
    );

  return (
    <div>
      <p className="mb-8 max-w-[68ch] text-sm leading-relaxed text-ink-2">
        {locked && registeredAt
          ? `Registrado no SIGAA em ${formatShortDate(registeredAt)}${project.sigaaCode ? ` com o código ${project.sigaaCode}` : ''}. Este é o texto oficial e não muda mais por aqui.`
          : 'Este é o texto que vai para o SIGAA, já com os limites de cada campo. As mudanças são salvas quando você sai do campo.'}
      </p>

      {project.plan.map((section, index) => (
        <PlanSectionField key={section.title} projectId={project.id} index={index} section={section} locked={locked} />
      ))}

      <WorkloadTable project={project} />

      {awaitingConfirmation && (
        <div className="sticky bottom-4 mt-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-surface/95 p-4 shadow-popover backdrop-blur-md">
          <p className="min-w-0 flex-[1_1_300px] text-sm text-ink-2">
            {empty.length > 0 ? `Falta preencher ${joinWithAnd(empty.map((section) => section.title))}.` : 'Tudo certo? Confirme para seguir para a reunião de abertura.'}
          </p>
          <Button variant="primary" disabled={empty.length > 0 || complete.isPending} onClick={confirm}>
            Confirmar plano
          </Button>
        </div>
      )}
    </div>
  );
};
