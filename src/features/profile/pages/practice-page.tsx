import { Link } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { ConfirmedPracticeList, ExcludedPracticeList, InferredPracticeList } from '@/components/practice/practice-lists';
import { SectionBlock } from '@/components/ui/section-card';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import type { PracticeChange } from '@/types/practice';
import { CompetencySearch } from '../components/practice/competency-search';
import { PastProjects } from '../components/practice/past-projects';
import { ThemesEditor } from '../components/practice/themes-editor';
import { ProfileTabs } from '../components/profile-tabs';
import { useChangePractice, usePractice, useSetThemeStance } from '../hooks/use-profile';
import type { PracticeProfile } from '../types';

const PracticeEditor = ({ practice }: { practice: PracticeProfile }) => {
  const changePractice = useChangePractice();
  const setThemeStance = useSetThemeStance();
  const onChange = (change: PracticeChange) => changePractice.mutate(change);
  const listed = [...practice.confirmed, ...practice.excluded, ...practice.inferred.map((item) => item.name)];

  return (
    <div className="flex flex-col gap-12">
      <p className="flex flex-wrap items-baseline gap-x-2 text-[13px] text-n-500">
        Prefere responder em etapas guiadas?
        <Link to={paths.onboarding} className="font-medium text-azul-500 hover:text-azul-600">
          Refazer o onboarding de prática
        </Link>
      </p>

      <SectionBlock title="Confirmadas por você" description="Estas entram no cálculo de compatibilidade com peso cheio.">
        <ConfirmedPracticeList practice={practice} onChange={onChange} />
      </SectionBlock>

      <SectionBlock title="Sugeridas, ainda não confirmadas" description="Leitura automática do que você cadastrou. Confirme ou descarte.">
        <InferredPracticeList practice={practice} onChange={onChange} />
      </SectionBlock>

      <SectionBlock title="Não conduzo" description="Demandas destes temas não aparecem no seu cardápio.">
        <ExcludedPracticeList practice={practice} onChange={onChange} />
      </SectionBlock>

      <SectionBlock title="Adicionar competência" description="Busque e escolha em qual grupo ela entra.">
        <CompetencySearch
          alreadyListed={listed}
          onPractice={(name) => onChange({ action: 'add-confirmed', name })}
          onExclude={(name) => onChange({ action: 'add-excluded', name })}
        />
      </SectionBlock>

      <SectionBlock title="Temas">
        <ThemesEditor themes={practice.themes} onChange={(theme, stance) => setThemeStance.mutate({ theme, stance })} />
      </SectionBlock>

      <PastProjects projects={practice.pastProjects} />

      <p className="max-w-[68ch] border-t border-n-200 pt-6 text-[15px] leading-relaxed text-n-600">
        A plataforma não acessa o SIGAA nem o Lattes. Tudo aqui foi cadastrado por você.
      </p>
    </div>
  );
};

export const PracticePage = () => {
  usePageHeader('Meu perfil', 'O que a plataforma sabe sobre o seu trabalho e de onde tirou isso');
  const practiceQuery = usePractice();
  return (
    <div className="max-w-[760px]">
      <ProfileTabs />
      <QueryView query={practiceQuery}>{(practice) => <PracticeEditor practice={practice} />}</QueryView>
    </div>
  );
};
