import { createApiUrl } from "@/lib/api/client";
import type {
  AuthEnvelope,
  AuthSession,
  RegisterUserInput,
  RegisterUserResponse,
  ResendVerificationInput,
  ResendVerificationResponse,
  VerifyEmailInput,
  VerifyEmailResponse,
} from "@/types/auth";

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null = null,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

type LoginInput = {
  identifier: string;
  password: string;
};

type ForgotPasswordInput = {
  identifier: string;
  locale: "en" | "ko";
};

type ResetPasswordInput = {
  key: string;
  locale: "en" | "ko";
  login: string;
  password: string;
};

type MessageResponse = {
  message: string;
};

export async function login(input: LoginInput): Promise<AuthSession> {
  return authRequest<AuthSession>("/wcm/v1/auth/login", {
    body: JSON.stringify(input),
    method: "POST",
  });
}

export async function logout(): Promise<AuthSession> {
  return authRequest<AuthSession>("/wcm/v1/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser(): Promise<AuthSession> {
  return authRequest<AuthSession>("/wcm/v1/auth/me", {
    method: "GET",
  });
}

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<string> {
  const data = await authRequest<MessageResponse>("/wcm/v1/auth/forgot-password", {
    body: JSON.stringify(input),
    method: "POST",
  });

  return data.message;
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<string> {
  const data = await authRequest<MessageResponse>("/wcm/v1/auth/reset-password", {
    body: JSON.stringify(input),
    method: "POST",
  });

  return data.message;
}

export async function registerUser(
  input: RegisterUserInput,
): Promise<RegisterUserResponse> {
  return authRequest<RegisterUserResponse>("/wcm/v1/auth/register", {
    body: JSON.stringify(input),
    method: "POST",
  });
}

export async function verifyEmail(
  input: VerifyEmailInput,
): Promise<VerifyEmailResponse> {
  return authRequest<VerifyEmailResponse>("/wcm/v1/auth/verify-email", {
    body: JSON.stringify(input),
    method: "POST",
  });
}

export async function resendEmailVerification(
  input: ResendVerificationInput,
): Promise<ResendVerificationResponse> {
  return authRequest<ResendVerificationResponse>("/wcm/v1/auth/resend-verification", {
    body: JSON.stringify(input),
    method: "POST",
  });
}

async function authRequest<T>(
  path: string,
  init: RequestInit,
): Promise<T> {
  const response = await fetch(createApiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  const payload = (await response
    .json()
    .catch(() => null)) as AuthEnvelope<T> | null;

  if (!response.ok || payload?.success !== true || payload.data === undefined) {
    throw new AuthApiError(
      payload?.message ?? `API request failed: ${response.status}`,
      response.status,
      payload?.code ?? null,
    );
  }

  return payload.data;
}
