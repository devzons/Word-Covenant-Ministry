"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthApiError, resetPassword } from "@/lib/api/auth";
import { LegalNoticeLinks } from "@/components/content/LegalNoticeLinks";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ResetPasswordFormProps = {
  locale: string;
  login: string;
  resetKey: string;
};

const copy = {
  en: {
    backToLogin: "Back to log in",
    confirmPassword: "Confirm new password",
    invalidLink: "The password reset link is invalid or has expired.",
    mismatch: "The password confirmation does not match.",
    password: "New password",
    passwordRule: "Password must be between 8 and 256 characters and cannot be blank.",
    submit: "Save new password",
    submitting: "Saving...",
    success: "Your password has been reset. Please log in with your new password.",
    successAction: "Go to log in",
    title: "Reset password",
    unknownError: "Password reset could not be completed.",
  },
  ko: {
    backToLogin: "로그인으로 돌아가기",
    confirmPassword: "새 비밀번호 확인",
    invalidLink: "비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.",
    mismatch: "비밀번호 확인이 일치하지 않습니다.",
    password: "새 비밀번호",
    passwordRule: "비밀번호는 8자 이상 256자 이하이며 공백만으로 구성될 수 없습니다.",
    submit: "새 비밀번호 저장",
    submitting: "저장 중...",
    success: "비밀번호가 재설정되었습니다. 새 비밀번호로 로그인해 주세요.",
    successAction: "로그인으로 이동",
    title: "비밀번호 재설정",
    unknownError: "비밀번호 재설정을 완료할 수 없습니다.",
  },
} as const;

export function ResetPasswordForm({
  locale,
  login,
  resetKey,
}: ResetPasswordFormProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const router = useRouter();
  const hasValidLink = login.trim() !== "" && resetKey.trim() !== "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!hasValidLink) {
    return (
      <Card className="mx-auto max-w-md">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-zinc-950">{labels.title}</h1>
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {labels.invalidLink}
          </p>
          <Link
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            href={`/${activeLocale}/login`}
          >
            {labels.backToLogin}
          </Link>
          <LegalNoticeLinks
            className="flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-3 text-xs text-zinc-500"
            locale={activeLocale}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">{labels.title}</h1>
      </div>

      {successMessage ? (
        <div className="mt-6 space-y-4">
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
          <Button
            className="w-full"
            onClick={() => router.replace(`/${activeLocale}/login`)}
            type="button"
          >
            {labels.successAction}
          </Button>
        </div>
      ) : (
        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setErrorMessage("");
            setIsSubmitting(true);

            if (password !== confirmPassword) {
              setErrorMessage(labels.mismatch);
              setIsSubmitting(false);
              return;
            }

            try {
              const message = await resetPassword({
                key: resetKey,
                locale: activeLocale,
                login,
                password,
              });

              setSuccessMessage(message);
            } catch (error) {
              if (
                error instanceof AuthApiError &&
                error.code === "invalid_reset_link"
              ) {
                setErrorMessage(labels.invalidLink);
              } else if (
                error instanceof AuthApiError &&
                error.code === "password_invalid"
              ) {
                setErrorMessage(error.message || labels.passwordRule);
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
              htmlFor="reset-password"
            >
              {labels.password}
            </label>
            <input
              autoComplete="new-password"
              className="block h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
              id="reset-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-zinc-900"
              htmlFor="reset-password-confirm"
            >
              {labels.confirmPassword}
            </label>
            <input
              autoComplete="new-password"
              className="block h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
              id="reset-password-confirm"
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
          </div>

          <p className="text-xs text-zinc-500">{labels.passwordRule}</p>

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
      )}
    </Card>
  );
}
