import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

export const LoadingState = ({ label = 'Carregando' }: { label?: string }) => (
  <div role="status" className="flex flex-col items-center justify-center gap-3 py-20 text-sm text-n-500">
    <span aria-hidden="true" className="size-8 animate-spin rounded-full border-[3px] border-azul-100 border-t-azul-500" />
    {label}
  </div>
);

interface ErrorStateProps {
  error: Error | null;
  onRetry?: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div role="alert" className="mx-auto my-10 max-w-xl rounded-2xl border border-erro-borda bg-erro-bg p-6 text-center">
    <h2 className="text-base font-bold text-erro-texto">Não deu para carregar agora</h2>
    <p className="mt-2 text-sm text-n-600">{error?.message ?? 'Tente de novo em instantes.'}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
        Tentar de novo
      </Button>
    )}
  </div>
);

interface QueryViewProps<Data> {
  query: UseQueryResult<Data>;
  loadingLabel?: string;
  children: (data: Data) => ReactNode;
}

/** Resolve carregamento e erro de uma query para que a página só trate o caso feliz. */
export const QueryView = <Data,>({ query, loadingLabel, children }: QueryViewProps<Data>) => {
  if (query.isPending) return <LoadingState label={loadingLabel} />;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  return <>{children(query.data)}</>;
};
