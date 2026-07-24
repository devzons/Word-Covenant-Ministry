"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/layout/AuthProvider";
import { cn } from "@/lib/utils/cn";

type AuthStatusProps = {
  className?: string;
  locale: string;
};

const copy = {
  en: {
    loading: "Loading",
    login: "Log in",
    logout: "Log out",
  },
  ko: {
    loading: "불러오는 중",
    login: "로그인",
    logout: "로그아웃",
  },
} as const;

export function AuthStatus({ className, locale }: AuthStatusProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const { logout, status, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const logoutErrorCopy =
    activeLocale === "ko"
      ? "로그아웃을 완료할 수 없습니다. 다시 시도해 주세요."
      : "Sign-out could not be completed. Please try again.";

  if (status === "loading") {
    return (
      <span className={cn("text-sm text-zinc-400", className)}>
        {copy[activeLocale].loading}
      </span>
    );
  }

  if (user === null) {
    return (
      <Link
        className={cn(
          "text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950",
          className,
        )}
        href={`/${activeLocale}/login`}
      >
        {copy[activeLocale].login}
      </Link>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm font-medium text-zinc-700">{user.name}</span>
      <Button
        className="h-9 px-3"
        disabled={isSubmitting}
        onClick={async () => {
          setIsSubmitting(true);
          setErrorMessage("");

          try {
            await logout();
          } catch {
            setErrorMessage(logoutErrorCopy);
          } finally {
            setIsSubmitting(false);
          }
        }}
        variant="ghost"
      >
        {copy[activeLocale].logout}
      </Button>
      {errorMessage ? (
        <span className="text-sm text-red-700">{errorMessage}</span>
      ) : null}
    </div>
  );
}
