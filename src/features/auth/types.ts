export interface LoginPayload {
  email: string;
  password: string;
}

/** Quem entra na plataforma. Só o perfil de docente tem portal por enquanto. */
export type UserRole = 'docente' | 'organizacao' | 'estudante';

export interface SignupPayload {
  name: string;
  email: string;
  department: string;
  password: string;
}
