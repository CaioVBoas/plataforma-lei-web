export type PortalId = 'professor' | 'coordination' | 'organization';

export interface CurrentUser {
  name: string;
  email: string;
  affiliation: string;
  roleLabel: string;
}

export interface LoginPayload {
  portal: PortalId;
  email: string;
  password: string;
}

/** Quem acumula papéis escolhe a área de trabalho depois de autenticar. */
export type LoginResult = { outcome: 'signed-in' } | { outcome: 'choose-area' } | { outcome: 'notice'; message: string };
