import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/form-controls';
import { useCompetencyCatalog } from '@/features/matchmaking/hooks/use-demands';

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 4;

interface CompetencySearchProps {
  /** Competências que já estão em alguma lista e não devem aparecer de novo. */
  alreadyListed: string[];
  onPractice: (name: string) => void;
  onExclude: (name: string) => void;
}

export const CompetencySearch = ({ alreadyListed, onPractice, onExclude }: CompetencySearchProps) => {
  const { data: catalog = [] } = useCompetencyCatalog();
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const results =
    normalized.length >= MIN_QUERY_LENGTH
      ? catalog.filter((name) => !alreadyListed.includes(name) && name.toLowerCase().includes(normalized)).slice(0, MAX_RESULTS)
      : [];

  const choose = (action: (name: string) => void, name: string) => {
    action(name);
    setQuery('');
  };

  return (
    <div>
      <SearchInput
        aria-label="Buscar competência"
        placeholder="Buscar competência"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        containerClassName="max-w-[420px]"
        className="h-11 text-[15px]"
      />
      {results.length > 0 && (
        <ul className="mt-4 flex flex-col gap-3.5">
          {results.map((name) => (
            <li key={name} className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="min-w-0 flex-[1_1_200px] text-[15px] text-n-800">{name}</span>
              <Button variant="outline-accent" size="sm" onClick={() => choose(onPractice, name)}>
                Pratico
              </Button>
              <Button variant="outline-muted" size="sm" onClick={() => choose(onExclude, name)}>
                Não conduzo
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
