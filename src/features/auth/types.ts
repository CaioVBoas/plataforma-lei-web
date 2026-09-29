export interface LoginPayload {
  email: string;
  password: string;
}

/** Quem entra na plataforma. Docente e organização têm portal; o do estudante ainda não existe. */
export type UserRole = 'docente' | 'organizacao' | 'estudante';

export interface SignupPayload {
  name: string;
  email: string;
  department: string;
  password: string;
}
