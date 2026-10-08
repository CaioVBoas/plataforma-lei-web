import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import type { Plugin as PostcssPlugin } from 'postcss';

/**
 * Tamanho de texto em px vira rem no CSS final, para o ajuste "Tamanho do
 * texto" (que muda o font-size da raiz) valer também para os text-[13px].
 */
/** O font-size da raiz em index.css: 1rem vale 15px no tamanho normal. */
const ROOT_PX = 15;

const fontSizeToRem: PostcssPlugin = {
  postcssPlugin: 'font-size-px-to-rem',
  Declaration: {
    'font-size': (decl) => {
      decl.value = decl.value.replace(/(\d*\.?\d+)px/g, (_, px: string) => `${Number(px) / ROOT_PX}rem`);
    },
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: { postcss: { plugins: [fontSizeToRem] } },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
