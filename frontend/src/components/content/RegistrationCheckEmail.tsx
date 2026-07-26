"use client";

import Link from "next/link";

import { buildAuthRouteWithRedirect, safeAuthRedirect } from "@/lib/authRedirect";
import { LegalNoticeLinks } from "@/components/content/LegalNoticeLinks";
import { VerificationResendForm } from "@/components/content/VerificationResendForm";
import { Card } from "@/components/ui/Card";

type RegistrationCheckEmailProps = {
  deliveryStatus: "sent" | "failed";
  locale: string;
  redirect: string | null | undefined;
};

const copy = {
  en: {
    bodyFailure:
      "Your account was created, but the verification email could not be delivered. You can request another verification email below.",
    bodySuccess:
      "Check your inbox and follow the verification link before signing in. If you do not see the message, check your spam or junk folder.",
    login: "Back to log in",
    resendNote:
      "Verification links can expire. If you still need a new message, enter your email address below.",
    titleFailure: "Account created, but email delivery needs another try",
    titleSuccess: "Check your email",
  },
  ko: {
    bodyFailure:
      "계정은 생성되었지만 확인 이메일을 보내지 못했습니다. 아래에서 확인 이메일을 다시 요청할 수 있습니다.",
    bodySuccess:
      "이메일 받은편지함에서 확인 링크를 선택한 후 로그인해 주세요. 보이지 않으면 스팸 또는 정크 메일함도 확인해 주세요.",
    login: "로그인으로 돌아가기",
    resendNote:
      "확인 링크는 만료될 수 있습니다. 새 메일이 필요하면 아래에 이메일 주소를 입력해 주세요.",
    titleFailure: "계정은 생성되었지만 이메일 재전송이 필요합니다",
    titleSuccess: "이메일을 확인해 주세요",
  },
} as const;

export function RegistrationCheckEmail({
  deliveryStatus,
  locale,
  redirect,
}: RegistrationCheckEmailProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const redirectTarget = safeAuthRedirect(redirect, activeLocale);
  const loginHref = buildAuthRouteWithRedirect(
    `/${activeLocale}/login`,
    redirectTarget,
    activeLocale,
  );

  return (
    <Card className="mx-auto max-w-md">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-zinc-950">
          {deliveryStatus === "failed" ? labels.titleFailure : labels.titleSuccess}
        </h1>
        <p className="text-sm leading-6 text-zinc-700">
          {deliveryStatus === "failed" ? labels.bodyFailure : labels.bodySuccess}
        </p>
        <p className="text-sm leading-6 text-zinc-600">{labels.resendNote}</p>
      </div>

      <div className="mt-6">
        <VerificationResendForm locale={activeLocale} />
      </div>

      <div className="pt-4 text-center">
        <Link
          className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
          href={loginHref}
        >
          {labels.login}
        </Link>
      </div>

      <LegalNoticeLinks
        className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-zinc-200 pt-3 text-xs text-zinc-500"
        locale={activeLocale}
      />
    </Card>
  );
}
