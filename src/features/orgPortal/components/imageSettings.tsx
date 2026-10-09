import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { ImageIcon, TrashIcon } from '@/components/ui/icons';
import { ConfirmDialog } from '@/components/ui/confirmDialog';
import { Monogram } from '@/components/ui/monogram';
import type { Organization } from '@/domain/types';
import { organizationCover } from '@/lib/covers';
import { resizeToCover, resizeToFit } from '@/utils/resizeImage';
import { useUpdateOrgImages } from '../useOrgPortal';

/** Capa do perfil: larga e baixa, como aparece no topo da página da organização. */
const COVER_SIZE = { width: 1600, height: 480 };

interface ImageRowProps {
  label: string;
  hint: string;
  preview: ReactNode;
  hasImage: boolean;
  pending: boolean;
  onChoose: (file: File) => void;
  onRemove: () => void;
}

const ImageRow = ({ label, hint, preview, hasImage, pending, onChoose, onRemove }: ImageRowProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onChoose(file);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 py-4 first:pt-0 last:pb-0">
      {preview}
      <div className="min-w-0 flex-[1_1_220px]">
        <p className="text-body font-semibold text-ink">{label}</p>
        <p className="mt-0.5 text-small text-ink-2">{hint}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={choose} />
        <Button variant="secondary" disabled={pending} onClick={() => inputRef.current?.click()}>
          <ImageIcon size={20} />
          {hasImage ? `Trocar ${label.toLowerCase()}` : `Enviar ${label.toLowerCase()}`}
        </Button>
        {hasImage && (
          <Button variant="destructive" size="sm" disabled={pending} onClick={onRemove}>
            <TrashIcon size={16} />
            Remover
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Logo e capa da organização. Mudam na hora, sem o Salvar do formulário,
 * e já aparecem para os docentes na lista e na página da organização.
 */
export const ImageSettings = ({ organization }: { organization: Organization }) => {
  const toast = useToast();
  const update = useUpdateOrgImages();
  const cover = organizationCover(organization.id, organization.cover);

  const send = async (key: 'logo' | 'cover', file: File) => {
    try {
      const image = key === 'logo' ? await resizeToFit(file) : await resizeToCover(file, COVER_SIZE.width, COVER_SIZE.height);
      update.mutate({ [key]: image }, { onSuccess: () => toast.show(key === 'logo' ? 'Logo atualizada.' : 'Capa atualizada.') });
    } catch (error) {
      toast.show(error instanceof Error ? error.message : 'Não deu para usar esta imagem.');
    }
  };
  const [removing, setRemoving] = useState<'logo' | 'cover' | null>(null);
  const remove = (key: 'logo' | 'cover') =>
    update.mutate({ [key]: '' }, { onSuccess: () => toast.show(key === 'logo' ? 'Logo removida.' : 'Capa removida.'), onSettled: () => setRemoving(null) });

  return (
    <div className="mb-5 divide-y divide-line rounded-lg border border-line bg-surface p-6 sm:p-6">
      <ImageRow
        label="Logo"
        hint="Aparece no lugar da inicial, nos cartões do cardápio e no perfil."
        preview={<Monogram name={organization.name} logo={organization.logo} size="lg" />}
        hasImage={Boolean(organization.logo)}
        pending={update.isPending}
        onChoose={(file) => send('logo', file)}
        onRemove={() => setRemoving('logo')}
      />
      <ImageRow
        label="Capa"
        hint="A foto do topo do perfil. Vale uma foto de vocês ou do lugar onde atuam."
        preview={
          cover ? (
            <img src={cover.src} alt="" aria-hidden="true" className="h-14 w-[120px] shrink-0 rounded-md object-cover" />
          ) : (
            <span aria-hidden="true" className="h-14 w-[120px] shrink-0 rounded-md bg-brand" />
          )
        }
        hasImage={Boolean(organization.cover)}
        pending={update.isPending}
        onChoose={(file) => send('cover', file)}
        onRemove={() => setRemoving('cover')}
      />
      {removing && (
        <ConfirmDialog
          icon={<TrashIcon size={26} />}
          title={removing === 'logo' ? 'Remover a logo?' : 'Remover a capa?'}
          description={removing === 'logo' ? 'No lugar dela volta a inicial da organização. Dá para enviar outra depois.' : 'No lugar dela volta o fundo petróleo. Dá para enviar outra depois.'}
          confirmLabel="Sim, remover"
          confirmIcon={<TrashIcon size={20} />}
          cancelLabel="Não, manter"
          pending={update.isPending}
          pendingLabel="Removendo"
          onConfirm={() => remove(removing)}
          onClose={() => setRemoving(null)}
        />
      )}
    </div>
  );
};
