import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { MailIcon, TrashIcon } from '@/components/ui/icons';
import { ConfirmDialog } from '@/components/ui/confirmDialog';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/formControls';
import { ActionMenu } from '@/components/ui/actionMenu';
import { Monogram } from '@/components/ui/monogram';
import { useAccount } from '@/features/account/useAccount';
import { useInviteCoTeacher, useRemoveCoTeacher } from '../useDisciplines';
import type { DisciplineWithUsage } from '../types';

/** Pessoa, não link: card cinza claro sem borda, com o kebab quando há o que fazer. */
const TeacherCard = ({ name, detail, menu }: { name: string; detail: string; menu?: ReactNode }) => (
  <div className="flex items-center gap-3 rounded-lg bg-canvas px-4 py-3.5">
    <Monogram name={name} />
    <div className="min-w-0 flex-1">
      <p className="truncate text-body font-semibold text-ink">{name}</p>
      <p className="mt-0.5 truncate text-small text-ink-2">{detail}</p>
    </div>
    {menu}
  </div>
);

/**
 * Disciplina dada em dupla: o colega entra pelo e-mail institucional e passa a
 * ver e editar os projetos dela, sem cadastro em separado.
 */
export const CoTeachers = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const toast = useToast();
  const fieldId = useId();
  const { data: account } = useAccount();
  const invite = useInviteCoTeacher();
  const remove = useRemoveCoTeacher();
  const [email, setEmail] = useState('');
  const [removing, setRemoving] = useState<{ email: string; name: string } | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    invite.mutate(
      { id: discipline.id, email },
      {
        onSuccess: () => {
          toast.show(`Convite enviado para ${email.trim()}.`);
          setEmail('');
        },
      },
    );
  };

  return (
    <div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {account && (
          <li>
            <TeacherCard name={account.name} detail={`${account.email} · você`} />
          </li>
        )}
        {discipline.coTeachers.map((teacher) => (
          <li key={teacher.email}>
            <TeacherCard
              name={teacher.name ?? teacher.email}
              detail={teacher.name ? teacher.email : 'Convite enviado'}
              menu={
                discipline.isCurrent && (
                  <ActionMenu
                    label={`Ações de ${teacher.name ?? teacher.email}`}
                    items={[
                      {
                        label: 'Tirar da disciplina',
                        destructive: true,
                        onSelect: () => setRemoving({ email: teacher.email, name: teacher.name ?? teacher.email }),
                      },
                    ]}
                  />
                )
              }
            />
          </li>
        ))}
      </ul>

      {removing && (
        <ConfirmDialog
          icon={<TrashIcon size={26} />}
          title={`Tirar ${removing.name} da disciplina?`}
          description="A pessoa deixa de ver os projetos desta disciplina. Dá para convidar de novo depois."
          confirmLabel="Sim, tirar"
          confirmIcon={<TrashIcon size={20} />}
          cancelLabel="Manter"
          pending={remove.isPending}
          pendingLabel="Tirando"
          onConfirm={() =>
            remove.mutate(
              { id: discipline.id, email: removing.email },
              {
                onSuccess: () => toast.show('Colega retirado da disciplina.'),
                onSettled: () => setRemoving(null),
              },
            )
          }
          onClose={() => setRemoving(null)}
        />
      )}

      {discipline.isCurrent && (
        <form onSubmit={submit} noValidate className="mt-6">
          <label htmlFor={fieldId} className="mb-1.5 block text-small font-medium text-ink-2">
            Divide a disciplina com alguém?
          </label>
          <div className="flex flex-wrap gap-2">
            <Input
              id={fieldId}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome@cin.ufpe.br"
              className="h-9 max-w-[320px] flex-1"
            />
            <Button type="submit" disabled={!email.trim() || invite.isPending}>
              <MailIcon size={16} />
              Convidar
            </Button>
          </div>
          {invite.isError ? (
            <p role="alert" className="mt-2 text-small text-critical">
              {invite.error.message}
            </p>
          ) : (
            <p className="mt-2 text-small text-ink-3">O colega vê e edita os projetos desta disciplina.</p>
          )}
        </form>
      )}
    </div>
  );
};
