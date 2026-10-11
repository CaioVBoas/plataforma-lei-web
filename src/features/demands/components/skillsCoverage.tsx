import { CoverageMeter } from '@/components/ui/coverageMeter';
import { CheckIcon } from '@/components/ui/icons';
import { Tag } from '@/components/ui/tag';
import type { DisciplineMatch } from '@/domain/matching';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { LEVEL_COPY } from '@/features/disciplines/utils/disciplinePresentation';
import { cn } from '@/utils/cn';

interface SkillsCoverageProps {
  skills: string[];
  matches: DisciplineMatch<DisciplineWithUsage>[];
}

/**
 * Uma coluna por disciplina: quantas competências a turma já trabalha, quais
 * são e quais faltam. Sem disciplina cadastrada, só a lista do que a demanda pede.
 */
export const SkillsCoverage = ({ skills, matches }: SkillsCoverageProps) => {
  if (matches.length === 0) {
    return (
      <>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </div>
        <p className="mt-4 text-small text-ink-3">Cadastre uma disciplina deste semestre para ver quanto a turma já cobre.</p>
      </>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {matches.map((match, index) => {
        const covered = new Set(match.covered);
        return (
          <li key={match.discipline.id} className={cn('rounded-lg border p-4', match.fits ? 'border-fact-line bg-fact' : 'border-line')}>
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-body font-semibold text-ink">{match.discipline.name}</p>
              {index === 0 && match.fits && <Tag tone="positive">Combina mais</Tag>}
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <CoverageMeter covered={match.covered.length} total={skills.length} fits={match.fits} />
              <span className="text-small text-ink-2 tabular-nums">
                {match.covered.length} de {skills.length}
              </span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {skills.map((skill) => (
                <li key={skill} className={cn('flex items-center gap-2 text-small', covered.has(skill) ? 'text-ink' : 'text-ink-3')}>
                  <span
                    aria-hidden="true"
                    className={cn('flex size-4 shrink-0 items-center justify-center rounded-full', covered.has(skill) ? 'bg-positive text-white' : 'border border-line-strong')}
                  >
                    {covered.has(skill) && <CheckIcon size={11} strokeWidth={2.8} />}
                  </span>
                  <span className="min-w-0 truncate">{skill}</span>
                  <span className="sr-only">{covered.has(skill) ? ', a turma trabalha' : ', falta'}</span>
                </li>
              ))}
            </ul>
            {match.aboveLevel && (
              <p className="mt-3 text-small text-caution">
                Pede mais do que a turma, que está no {LEVEL_COPY[match.discipline.level].label.toLowerCase()}.
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
};
