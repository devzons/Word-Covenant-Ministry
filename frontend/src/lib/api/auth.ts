import { createApiUrl } from "@/lib/api/client";
import type { AuthEnvelope, AuthUser } from "@/types/auth";

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

type LoginResponse = {
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser | null;
};

export async function login(input: LoginInput): Promise<AuthUser> {
  const data = await authRequest<LoginResponse>("/wcm/v1/auth/login", {
    body: JSON.stringify(input),
    method: "POST",
  });

  return data.user;
}

export async function logout(): Promise<void> {
  await authRequest<MeResponse>("/wcm/v1/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const data = await authRequest<MeResponse>("/wcm/v1/auth/me", {
    method: "GET",
  });

  return data.user;
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
