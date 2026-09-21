import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/loginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Logo / Emblema */}
        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/25 mb-4 text-white font-black text-2xl">
          M
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Acesse sua conta
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Conectando discentes, docentes e organizações sociais
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl">
          <LoginForm />
        </div>

        {/* Links adicionais */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <p>
            Deseja navegar primeiro?{' '}
            <Link
              to="/projects"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Explorar projetos abertos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
