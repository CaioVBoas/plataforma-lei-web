import { lazy, type ComponentType } from 'react';

/** Mesma restrição que o próprio React.lazy usa para aceitar qualquer componente. */
type AnyComponent = ComponentType<any>;

/** React.lazy espera export default; as páginas usam export nomeado, então o adaptamos aqui sem perder os tipos. */
export const lazyPage = <Module extends Record<Key, AnyComponent>, Key extends keyof Module>(load: () => Promise<Module>, exportName: Key) =>
  lazy(async () => ({ default: (await load())[exportName] }));
