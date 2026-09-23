import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

export const LoadingState = ({ label = 'Carregando' }: { label?: string }) => (
  <div role="status" className="flex items-center justify-center gap-2.5 py-24 text-sm text-ink-3">
    <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-fill-strong border-t-ink-3" />
    {label}
  </div>
);

interface ErrorStateProps {
  error: Error | null;
  onRetry?: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div role="alert" className="mx-auto my-16 max-w-md text-center">
    <p className="text-headline">Não deu para carregar</p>
    <p className="mt-1.5 text-sm text-ink-2">{error?.message ?? 'Tente de novo em instantes.'}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
        Tentar de novo
      </Button>
    )}
  </div>
);

interface QueryViewProps<Data> {
  query: Pick<UseQueryResult<Data>, 'isPending' | 'isError' | 'error' | 'data' | 'refetch'>;
  loadingLabel?: string;
  children: (data: Data) => ReactNode;
}

/** Resolve carregamento e erro de uma query para que a página só trate o caso feliz. */
export const QueryView = <Data,>({ query, loadingLabel, children }: QueryViewProps<Data>) => {
  if (query.isPending) return <LoadingState label={loadingLabel} />;
  if (query.isError || query.data === undefined) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  return <>{children(query.data)}</>;
};
