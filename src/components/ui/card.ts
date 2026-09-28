/**
 * Card clicável: borda fina, fundo branco e sombra leve no hover. Serve para
 * o que o docente escolhe (demanda, organização, próximo passo); listas ficam
 * para índices longos, que o olho percorre em coluna.
 */
export const linkCardClassName =
  'group flex h-full min-w-0 flex-col rounded-lg border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-150 hover:border-line-strong hover:shadow-[0_2px_8px_rgba(10,50,50,0.08)]';

/** Grade de cards: uma coluna no celular, duas a partir do tablet. */
export const cardGridClassName = 'grid grid-cols-1 gap-4 md:grid-cols-2';

/** Foto no topo de um card com p-5: encosta nas bordas e só arredonda os cantos de cima. */
export const cardCoverClassName = '-mx-5 -mt-5 mb-4 block aspect-[16/7] w-[calc(100%+2.5rem)] max-w-none rounded-t-[inherit] object-cover';
