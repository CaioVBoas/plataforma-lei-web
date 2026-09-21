import type { Project } from '../types/projectTypes';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            {project.title}
          </h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            project.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
            project.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
            project.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' :
            'bg-slate-50 text-slate-700 dark:bg-slate-950/30 dark:text-slate-400'
          }`}>
            {project.status}
          </span>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>
        
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Área de Atuação
          </span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {project.area}
          </span>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.requiredSkills.map((skill) => (
            <span 
              key={skill} 
              className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>{project.vacancies} {project.vacancies === 1 ? 'vaga disponível' : 'vagas disponíveis'}</span>
          <span>Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
};
