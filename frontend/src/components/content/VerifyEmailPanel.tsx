"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthApiError, verifyEmail } from "@/lib/api/auth";
import { LegalNoticeLinks } from "@/components/content/LegalNoticeLinks";
import { VerificationResendForm } from "@/components/content/VerificationResendForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type VerifyEmailPanelProps = {
  locale: string;
  token: string;
};

const copy = {
  en: {
    invalidBody:
      "The verification link is missing, invalid, or has expired. Request another verification email below if you still need access.",
    invalidTitle: "Verification link is invalid or expired",
    loading: "Verifying...",
    login: "Continue to log in",
    missingToken: "No verification token was provided.",
    resendNote:
      "If you still need a new verification email, enter the email address for the account below.",
    submit: "Verify email",
    successBody: "Your email address has been verified. You can now sign in.",
    successTitle: "Email verified",
    title: "Verify your email",
    unknownError: "Email verification could not be completed.",
  },
  ko: {
    invalidBody:
      "확인 링크가 없거나 유효하지 않거나 만료되었습니다. 계속 진행해야 한다면 아래에서 확인 이메일을 다시 요청해 주세요.",
    invalidTitle: "확인 링크가 유효하지 않거나 만료되었습니다",
    loading: "확인 중...",
    login: "로그인으로 이동",
    missingToken: "확인 토큰이 없습니다.",
    resendNote:
      "새 확인 이메일이 필요하면 아래에 계정 이메일 주소를 입력해 주세요.",
    submit: "이메일 확인",
    successBody: "이메일 확인이 완료되었습니다. 이제 로그인할 수 있습니다.",
    successTitle: "이메일 확인 완료",
    title: "이메일 확인",
    unknownError: "이메일 확인을 완료할 수 없습니다.",
  },
} as const;

export function VerifyEmailPanel({ locale, token }: VerifyEmailPanelProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const trimmedToken = token.trim();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "invalid">(
    trimmedToken ? "idle" : "invalid",
  );
  const [errorMessage, setErrorMessage] = useState(
    trimmedToken ? "" : labels.missingToken,
  );

  return (
    <Card className="mx-auto max-w-md">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-zinc-950">
          {status === "success"
            ? labels.successTitle
            : status === "invalid"
              ? labels.invalidTitle
              : labels.title}
        </h1>
        <p className="text-sm leading-6 text-zinc-700">
          {status === "success"
            ? labels.successBody
            : status === "invalid"
              ? labels.invalidBody
              : labels.resendNote}
        </p>
      </div>

      {status === "idle" || status === "loading" ? (
        <div className="mt-6 space-y-4">
          {errorMessage ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
          <Button
            className="w-full"
            disabled={status === "loading" || trimmedToken === ""}
            onClick={async () => {
              if (trimmedToken === "" || status === "loading") {
                return;
              }

              setStatus("loading");
              setErrorMessage("");

              try {
                const data = await verifyEmail({ token: trimmedToken });

                if (data.verified && data.loginAllowed) {
                  setStatus("success");
                } else {
                  setStatus("invalid");
                  setErrorMessage(labels.unknownError);
                }
              } catch (error) {
                if (
                  error instanceof AuthApiError &&
                  (error.code === "verification_invalid_or_expired" ||
                    error.code === "verification_rate_limited")
                ) {
                  setStatus("invalid");
                  setErrorMessage(error.message || labels.invalidBody);
                } else {
                  setStatus("invalid");
                  setErrorMessage(labels.unknownError);
                }
              }
            }}
            type="button"
          >
            {status === "loading" ? labels.loading : labels.submit}
          </Button>
        </div>
      ) : null}

      {status === "success" ? (
        <div className="mt-6 space-y-4">
          <Link
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            href={`/${activeLocale}/login`}
          >
            {labels.login}
          </Link>
        </div>
      ) : null}

      {status === "invalid" ? (
        <div className="mt-6 space-y-4">
          {errorMessage ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
          <VerificationResendForm locale={activeLocale} />
        </div>
      ) : null}

      <LegalNoticeLinks
        className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-zinc-200 pt-3 text-xs text-zinc-500"
        locale={activeLocale}
      />
    </Card>
  );
}
