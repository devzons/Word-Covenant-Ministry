export type AuthUser = {
  id: number;
  email: string;
  name: string;
  roles: string[];
};

export type AuthSession = {
  restNonce: string | null;
  user: AuthUser | null;
};

export type AuthEnvelope<T> = {
  success?: boolean;
  data?: T;
  code?: string;
  message?: string;
};
