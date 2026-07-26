"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthApiError, forgotPassword } from "@/lib/api/auth";
import { LegalNoticeLinks } from "@/components/content/LegalNoticeLinks";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ForgotPasswordFormProps = {
  locale: string;
};

const copy = {
  en: {
    backToLogin: "Back to log in",
    failure: "Password reset instructions could not be requested.",
    identifier: "Email or username",
    submit: "Send reset instructions",
    submitting: "Sending...",
    success:
      "If an account matches the information provided, password reset instructions have been sent.",
    title: "Forgot your password?",
  },
  ko: {
    backToLogin: "로그인으로 돌아가기",
    failure: "비밀번호 재설정 요청을 처리할 수 없습니다.",
    identifier: "이메일 또는 사용자 이름",
    submit: "재설정 안내 보내기",
    submitting: "보내는 중...",
    success:
      "입력한 정보와 일치하는 계정이 있다면 비밀번호 재설정 안내를 보냈습니다.",
    title: "비밀번호를 잊으셨나요?",
  },
} as const;

export function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const [identifier, setIdentifier] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
          setSuccessMessage("");
          setIsSubmitting(true);

          try {
            const message = await forgotPassword({
              identifier: identifier.trim(),
              locale: activeLocale,
            });

            setSuccessMessage(message);
          } catch (error) {
            if (error instanceof AuthApiError) {
              setErrorMessage(error.message || labels.failure);
            } else {
              setErrorMessage(labels.failure);
            }
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-900"
            htmlFor="forgot-password-identifier"
          >
            {labels.identifier}
          </label>
          <input
            autoComplete="username"
            className="block h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
            id="forgot-password-identifier"
            onChange={(event) => setIdentifier(event.target.value)}
            required
            type="text"
            value={identifier}
          />
        </div>

        {successMessage ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? labels.submitting : labels.submit}
        </Button>

        <div className="pt-2 text-center">
          <Link
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            href={`/${activeLocale}/login`}
          >
            {labels.backToLogin}
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
