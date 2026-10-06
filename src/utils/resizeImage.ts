/** Maior lado da foto de perfil depois de reduzida. */
const PROFILE_SIDE = 320;

const READ_ERROR = 'Não deu para ler a imagem.';

/** Abre o arquivo escolhido como imagem, já recusando o que não é imagem. */
const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Escolha um arquivo de imagem.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(READ_ERROR));
    };
    image.src = url;
  });

const canvasOf = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error(READ_ERROR);
  return { canvas, context };
};

/** Corta o centro da imagem na proporção pedida e reduz para esse tamanho. Sai em JPEG, leve para guardar. */
export const resizeToCover = async (file: File, width: number, height: number): Promise<string> => {
  const image = await loadImage(file);
  const scale = Math.max(width / image.width, height / image.height);
  const cropWidth = width / scale;
  const cropHeight = height / scale;
  const { canvas, context } = canvasOf(width, height);
  context.drawImage(image, (image.width - cropWidth) / 2, (image.height - cropHeight) / 2, cropWidth, cropHeight, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.85);
};

/**
 * Lê a imagem escolhida, corta um quadrado central e reduz para caber no
 * perfil, devolvendo um data URL JPEG. Assim a foto fica leve para guardar.
 */
export const resizeToSquare = (file: File, side = PROFILE_SIDE) => resizeToCover(file, side, side);

/**
 * Encaixa a imagem inteira num quadrado, sem cortar, com o fundo
 * transparente. É o jeito certo para logo, que costuma ser comprida.
 */
export const resizeToFit = async (file: File, side = 256): Promise<string> => {
  const image = await loadImage(file);
  const scale = Math.min(side / image.width, side / image.height, 1);
  const width = image.width * scale;
  const height = image.height * scale;
  const { canvas, context } = canvasOf(side, side);
  context.drawImage(image, (side - width) / 2, (side - height) / 2, width, height);
  return canvas.toDataURL('image/png');
};
