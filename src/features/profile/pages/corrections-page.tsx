import { QueryView } from '@/components/feedback/query-states';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { ProfileTabs } from '../components/profile-tabs';
import { usePractice } from '../hooks/use-profile';

/** Transparência do modelo: toda correção de prática fica registrada com data. */
export const CorrectionsPage = () => {
  usePageHeader('Meu perfil', 'Correções que você fez na sua prática');
  const practiceQuery = usePractice();

  return (
    <div className="max-w-[760px]">
      <ProfileTabs />
      <p className="mb-6 max-w-[68ch] text-[13px] leading-normal text-n-500">Toda correção que você faz na sua prática fica registrada aqui.</p>
      <QueryView query={practiceQuery}>
        {(practice) => (
          <ol>
            {practice.corrections.map((correction, index) => (
              <li key={`${correction.date}-${index}`} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-b border-n-200 py-4">
                <span className="min-w-0 flex-[1_1_380px] text-[15px] leading-normal text-n-800">{correction.text}</span>
                <span className="shrink-0 text-[13px] text-n-500 tabular-nums">{correction.date}</span>
              </li>
            ))}
          </ol>
        )}
      </QueryView>
    </div>
  );
};
