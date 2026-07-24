export type AuthUser = {
  id: number;
  email: string;
  name: string;
  roles: string[];
};

export type AuthEnvelope<T> = {
  success?: boolean;
  data?: T;
  code?: string;
  message?: string;
};
