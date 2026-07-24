"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "@/lib/api/auth";
import type { AuthUser } from "@/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type LoginInput = {
  identifier: string;
  password: string;
};

type AuthContextValue = {
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthUser | null>;
  restNonce: string | null;
  status: AuthStatus;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [restNonce, setRestNonce] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const session = await getCurrentUser();
      setRestNonce(session.restNonce);
      setUser(session.user);
      setStatus(session.user ? "authenticated" : "unauthenticated");

      return session.user;
    } catch {
      setRestNonce(null);
      setUser(null);
      setStatus("unauthenticated");

      return null;
    }
  }, []);

  const login = useCallback(
    async (input: LoginInput): Promise<AuthUser> => {
      const session = await loginRequest(input);

      if (session.user === null) {
        throw new Error("Authenticated session is missing user data.");
      }

      setRestNonce(session.restNonce);
      setUser(session.user);
      setStatus("authenticated");

      return session.user;
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    const session = await logoutRequest();
    setRestNonce(session.restNonce);
    setUser(session.user);
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    let isActive = true;

    void getCurrentUser()
      .then((session) => {
        if (!isActive) {
          return;
        }

        setRestNonce(session.restNonce);
        setUser(session.user);
        setStatus(session.user ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setRestNonce(null);
        setUser(null);
        setStatus("unauthenticated");
      });

    return () => {
      isActive = false;
    };
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      login,
      logout,
      refresh,
      restNonce,
      status,
      user,
    }),
    [login, logout, refresh, restNonce, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
