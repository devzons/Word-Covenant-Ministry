"use client";

import { useRef, useState } from "react";

import { AuthApiError, resendEmailVerification } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";

type VerificationResendFormProps = {
  locale: string;
};

const copy = {
  en: {
    email: "Email",
    invalidEmail: "Enter a valid email address.",
    resend: "Resend verification email",
    resending: "Sending...",
    success: "If the address is eligible, a verification email has been sent.",
    unknownError: "The verification email could not be requested.",
  },
  ko: {
    email: "이메일",
    invalidEmail: "유효한 이메일 주소를 입력해 주세요.",
    resend: "확인 이메일 다시 보내기",
    resending: "보내는 중...",
    success: "해당 주소로 처리할 수 있는 경우 확인 이메일을 보냈습니다.",
    unknownError: "확인 이메일 재전송을 요청할 수 없습니다.",
  },
} as const;

export function VerificationResendForm({
  locale,
}: VerificationResendFormProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();

        if (submitLockRef.current) {
          return;
        }

        setEmailError("");
        setFormError("");
        setSuccessMessage("");

        const normalizedEmail = email.trim().toLowerCase();

        if (!isValidEmail(normalizedEmail)) {
          setEmailError(labels.invalidEmail);
          return;
        }

        submitLockRef.current = true;
        setIsSubmitting(true);

        try {
          const data = await resendEmailVerification({
            email: normalizedEmail,
            locale: activeLocale,
          });

          if (data.status === "accepted") {
            setSuccessMessage(labels.success);
          } else {
            setFormError(labels.unknownError);
          }
        } catch (error) {
          if (error instanceof AuthApiError) {
            setFormError(error.message || labels.unknownError);
          } else {
            setFormError(labels.unknownError);
          }
        } finally {
          setIsSubmitting(false);
          submitLockRef.current = false;
        }
      }}
    >
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-zinc-900"
          htmlFor={`verification-resend-email-${activeLocale}`}
        >
          {labels.email}
        </label>
        <input
          aria-describedby={
            emailError ? `verification-resend-email-error-${activeLocale}` : undefined
          }
          aria-invalid={emailError ? "true" : "false"}
          autoComplete="email"
          className="block h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
          id={`verification-resend-email-${activeLocale}`}
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        {emailError ? (
          <p
            className="text-sm text-red-700"
            id={`verification-resend-email-error-${activeLocale}`}
          >
            {emailError}
          </p>
        ) : null}
      </div>

      {successMessage ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      {formError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? labels.resending : labels.resend}
      </Button>
    </form>
  );
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
