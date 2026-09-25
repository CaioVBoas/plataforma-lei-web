import { useId, useState, type FormEvent } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/formControls';
import { Item, ItemList } from '@/components/ui/itemList';
import { ActionMenu } from '@/components/ui/actionMenu';
import { Monogram } from '@/components/ui/monogram';
import { Tag } from '@/components/ui/tag';
import { useAccount } from '@/features/account/useAccount';
import { useInviteCoTeacher, useRemoveCoTeacher } from '../useDisciplines';
import type { DisciplineWithUsage } from '../types';

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
      <ItemList>
        {account && (
          <Item anchor={<Monogram name={account.name} />}>
            <p className="truncate text-[15px] font-semibold text-ink">{account.name}</p>
            <p className="mt-1 truncate text-[13px] text-ink-2">{account.email} · você</p>
          </Item>
        )}
        {discipline.coTeachers.map((teacher) => (
          <Item
            key={teacher.email}
            anchor={<Monogram name={teacher.name ?? teacher.email} />}
            menu={
              discipline.isCurrent && (
                <ActionMenu
                  label={`Ações de ${teacher.name ?? teacher.email}`}
                  items={[
                    {
                      label: 'Tirar da disciplina',
                      destructive: true,
                      onSelect: () => remove.mutate({ id: discipline.id, email: teacher.email }, { onSuccess: () => toast.show('Colega retirado da disciplina.') }),
                    },
                  ]}
                />
              )
            }
          >
            <p className="truncate text-[15px] font-semibold text-ink">{teacher.name ?? teacher.email}</p>
            {teacher.name ? (
              <p className="mt-1 truncate text-[13px] text-ink-2">{teacher.email}</p>
            ) : (
              <Tag className="mt-2">Convite enviado</Tag>
            )}
          </Item>
        ))}
      </ItemList>

      {discipline.isCurrent && (
        <form onSubmit={submit} className="mt-5">
          <label htmlFor={fieldId} className="mb-1.5 block text-[13px] font-medium text-ink-2">
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
              Convidar
            </Button>
          </div>
          {invite.isError ? (
            <p role="alert" className="mt-2 text-[13px] text-critical">
              {invite.error.message}
            </p>
          ) : (
            <p className="mt-2 text-[13px] text-ink-3">O colega vê e edita os projetos desta disciplina.</p>
          )}
        </form>
      )}
    </div>
  );
};
