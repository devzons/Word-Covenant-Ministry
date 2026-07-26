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

export type RegisterUserInput = {
  acceptPrivacy: boolean;
  acceptTerms: boolean;
  displayName: string;
  email: string;
  locale: "en" | "ko";
  password: string;
  passwordConfirmation: string;
  username: string;
};

export type RegisterUserResponse = {
  emailSent: boolean;
  status: "verification_required";
};

export type VerifyEmailInput = {
  token: string;
};

export type VerifyEmailResponse = {
  loginAllowed: boolean;
  verified: boolean;
};

export type ResendVerificationInput = {
  email: string;
  locale: "en" | "ko";
};

export type ResendVerificationResponse = {
  status: "accepted";
};

export type AuthEnvelope<T> = {
  success?: boolean;
  data?: T;
  code?: string;
  message?: string;
};
