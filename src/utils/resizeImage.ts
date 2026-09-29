/** Maior lado da foto de perfil depois de reduzida. */
const PROFILE_SIDE = 320;

/**
 * Lê a imagem escolhida, corta um quadrado central e reduz para caber no
 * perfil, devolvendo um data URL JPEG. Assim a foto fica leve para guardar.
 */
export const resizeToSquare = (file: File, side = PROFILE_SIDE): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Escolha um arquivo de imagem.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const crop = Math.min(image.width, image.height);
      const canvas = document.createElement('canvas');
      canvas.width = side;
      canvas.height = side;
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error('Não deu para ler a imagem.'));
        return;
      }
      context.drawImage(image, (image.width - crop) / 2, (image.height - crop) / 2, crop, crop, 0, 0, side, side);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não deu para ler a imagem.'));
    };
    image.src = url;
  });
