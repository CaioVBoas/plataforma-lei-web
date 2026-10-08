/**
 * Card clicável: borda fina, fundo branco e sombra leve no hover. Serve para
 * o que o docente escolhe (demanda, organização, próximo passo); listas ficam
 * para índices longos, que o olho percorre em coluna.
 */
export const linkCardClassName =
  'group flex h-full min-w-0 flex-col rounded-lg border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-150 hover:border-line-strong hover:shadow-[0_2px_8px_rgba(10,50,50,0.08)]';

/**
 * Grade de cards: tantas colunas de pelo menos 26rem quantas couberem (uma no
 * celular, duas no desktop). Conta o espaço de verdade, então continua certa
 * com o texto grande ou o zoom do perfil de acessibilidade.
 */
export const cardGridClassName = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,26rem),1fr))] gap-5 sm:gap-6';

/** Grade dos cartões de ação do Início: até quatro lado a lado, quantos couberem com 14rem. */
export const tileGridClassName = 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-5';

