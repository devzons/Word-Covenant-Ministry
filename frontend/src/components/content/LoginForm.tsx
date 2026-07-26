"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthApiError } from "@/lib/api/auth";
import { buildAuthRouteWithRedirect, safeAuthRedirect } from "@/lib/authRedirect";
import { useAuth } from "@/components/layout/AuthProvider";
import { LegalNoticeLinks } from "@/components/content/LegalNoticeLinks";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type LoginFormProps = {
  locale: string;
};

const copy = {
  en: {
    checkEmail: "Request another verification email",
    createAccount: "Create one",
    createAccountPrompt: "Don’t have an account?",
    forgotPassword: "Forgot your password?",
    identifier: "Email or username",
    invalidCredentials: "Check your email or username and password.",
    password: "Password",
    submit: "Log in",
    submitting: "Signing in...",
    title: "Log in",
    unverified:
      "Verify your email address before signing in. You can request another verification email if needed.",
    unknownError: "Sign-in could not be completed.",
  },
  ko: {
    checkEmail: "확인 이메일 다시 요청하기",
    createAccount: "회원가입",
    createAccountPrompt: "계정이 없으신가요?",
    forgotPassword: "비밀번호를 잊으셨나요?",
    identifier: "이메일 또는 사용자 이름",
    invalidCredentials: "이메일 또는 사용자 이름과 비밀번호를 확인해 주세요.",
    password: "비밀번호",
    submit: "로그인",
    submitting: "로그인 중...",
    title: "로그인",
    unverified:
      "이메일 확인을 완료한 후 로그인해 주세요. 필요하면 확인 이메일을 다시 요청할 수 있습니다.",
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
    () => safeAuthRedirect(searchParams.get("redirect"), activeLocale),
    [activeLocale, searchParams],
  );
  const registerHref = useMemo(
    () =>
      buildAuthRouteWithRedirect(
        `/${activeLocale}/register`,
        redirectTarget,
        activeLocale,
      ),
    [activeLocale, redirectTarget],
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(redirectTarget);
    }
  }, [redirectTarget, router, status]);

  if (status === "authenticated" || isRedirecting) {
    return null;
  }

  return (
    <Card className="mx-auto max-w-md">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">{labels.title}</h1>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setErrorMessage("");
          setErrorCode(null);
          setIsSubmitting(true);

          try {
            await login({
              identifier: identifier.trim(),
              password,
            });
            setIsRedirecting(true);
          } catch (error) {
            if (
              error instanceof AuthApiError &&
              (error.status === 401 || error.code === "invalid_credentials")
            ) {
              setErrorMessage(labels.invalidCredentials);
              setErrorCode("invalid_credentials");
            } else if (
              error instanceof AuthApiError &&
              error.code === "email_verification_required"
            ) {
              setErrorMessage(labels.unverified);
              setErrorCode("email_verification_required");
            } else {
              setErrorMessage(labels.unknownError);
              setErrorCode("unknown");
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
          <div
            className="space-y-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {errorMessage}
            {errorCode === "email_verification_required" ? (
              <Link
                className="block font-medium underline underline-offset-2"
                href={buildAuthRouteWithRedirect(
                  `/${activeLocale}/register/check-email`,
                  redirectTarget,
                  activeLocale,
                )}
              >
                {labels.checkEmail}
              </Link>
            ) : null}
          </div>
        ) : null}

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? labels.submitting : labels.submit}
        </Button>

        <div className="pt-2 text-center">
          <Link
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            href={`/${activeLocale}/forgot-password`}
          >
            {labels.forgotPassword}
          </Link>
        </div>

        <div className="text-center text-sm text-zinc-600">
          <span>{labels.createAccountPrompt} </span>
          <Link
            className="font-medium text-zinc-950 underline underline-offset-2"
            href={registerHref}
          >
            {labels.createAccount}
          </Link>
        </div>

        <LegalNoticeLinks
          className="flex flex-wrap items-center justify-center gap-2 border-t border-zinc-200 pt-3 text-xs text-zinc-500"
          locale={activeLocale}
        />
      </form>
    </Card>
  );
}
