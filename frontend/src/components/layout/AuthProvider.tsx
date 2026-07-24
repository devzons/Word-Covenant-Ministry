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
  status: AuthStatus;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const nextUser = await getCurrentUser();
      setUser(nextUser);
      setStatus(nextUser ? "authenticated" : "unauthenticated");

      return nextUser;
    } catch {
      setUser(null);
      setStatus("unauthenticated");

      return null;
    }
  }, []);

  const login = useCallback(
    async (input: LoginInput): Promise<AuthUser> => {
      const nextUser = await loginRequest(input);
      setUser(nextUser);
      setStatus("authenticated");

      return nextUser;
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    await logoutRequest();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    let isActive = true;

    void getCurrentUser()
      .then((nextUser) => {
        if (!isActive) {
          return;
        }

        setUser(nextUser);
        setStatus(nextUser ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

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
      status,
      user,
    }),
    [login, logout, refresh, status, user],
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
