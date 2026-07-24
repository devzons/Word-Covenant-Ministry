"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthApiError } from "@/lib/api/auth";
import { useAuth } from "@/components/layout/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type LoginFormProps = {
  locale: string;
};

const copy = {
  en: {
    description: "Use your WordPress account to continue.",
    identifier: "Email or username",
    invalidCredentials: "Check your email or username and password.",
    password: "Password",
    submit: "Log in",
    submitting: "Signing in...",
    title: "Log in",
    unknownError: "Sign-in could not be completed.",
  },
  ko: {
    description: "기존 WordPress 계정으로 로그인합니다.",
    identifier: "이메일 또는 사용자 이름",
    invalidCredentials: "이메일 또는 사용자 이름과 비밀번호를 확인해 주세요.",
    password: "비밀번호",
    submit: "로그인",
    submitting: "로그인 중...",
    title: "로그인",
    unknownError: "로그인 요청을 처리할 수 없습니다.",
  },
} as const;

export function LoginForm({ locale }: LoginFormProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const { login, status } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = useMemo(
    () => safeRedirect(searchParams.get("redirect"), activeLocale),
    [activeLocale, searchParams],
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(redirectTarget);
      router.refresh();
    }
  }, [redirectTarget, router, status]);

  return (
    <Card className="mx-auto max-w-md">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-950">{labels.title}</h1>
        <p className="text-sm leading-6 text-zinc-600">{labels.description}</p>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setErrorMessage("");
          setIsSubmitting(true);

          try {
            await login({
              identifier: identifier.trim(),
              password,
            });
            router.replace(redirectTarget);
            router.refresh();
          } catch (error) {
            if (
              error instanceof AuthApiError &&
              (error.status === 401 || error.code === "invalid_credentials")
            ) {
              setErrorMessage(labels.invalidCredentials);
            } else {
              setErrorMessage(labels.unknownError);
            }
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-900"
            htmlFor="login-identifier"
          >
            {labels.identifier}
          </label>
          <input
            autoComplete="username"
            className="block h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
            id="login-identifier"
            onChange={(event) => setIdentifier(event.target.value)}
            required
            type="text"
            value={identifier}
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-900"
            htmlFor="login-password"
          >
            {labels.password}
          </label>
          <input
            autoComplete="current-password"
            className="block h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
            id="login-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? labels.submitting : labels.submit}
        </Button>
      </form>
    </Card>
  );
}

function safeRedirect(rawRedirect: string | null, locale: "en" | "ko"): string {
  const fallback = `/${locale}`;

  if (typeof rawRedirect !== "string" || rawRedirect.trim() === "") {
    return fallback;
  }

  const value = rawRedirect.trim();

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  try {
    const url = new URL(value, "http://wordcovenantministry.local");

    if (url.origin !== "http://wordcovenantministry.local") {
      return fallback;
    }

    if (!isLocalePath(url.pathname, locale)) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

function isLocalePath(pathname: string, locale: "en" | "ko"): boolean {
  return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`);
}
