"use client";

import Link from "next/link";
import type { ReactNode, RefObject } from "react";
import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthApiError, registerUser } from "@/lib/api/auth";
import { buildAuthRouteWithRedirect, safeAuthRedirect } from "@/lib/authRedirect";
import { getLegalPath } from "@/content/legal/legalDocuments";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type RegisterFormProps = {
  locale: string;
};

type FormValues = {
  acceptPrivacy: boolean;
  acceptTerms: boolean;
  displayName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  username: string;
};

type FieldName =
  | "email"
  | "username"
  | "displayName"
  | "password"
  | "passwordConfirmation"
  | "acceptTerms"
  | "acceptPrivacy";

type FieldErrors = Partial<Record<FieldName, string>>;

const copy = {
  en: {
    acceptPrivacyPrefix: "[Required] I agree to the ",
    acceptTermsPrefix: "[Required] I agree to the ",
    alreadyHaveAccount: "Already have an account?",
    createAccount: "Create account",
    creatingAccount: "Creating account...",
    displayName: "Display name",
    email: "Email",
    emailExists: "This email address is already in use.",
    emailInvalid: "Enter a valid email address.",
    failure: "Registration could not be completed.",
    formTitle: "Create an account",
    hidePassword: "Hide password",
    invalidDisplayName: "Enter your display name.",
    login: "Sign in",
    password: "Password",
    passwordConfirmation: "Confirm password",
    passwordMismatch: "The password confirmation does not match.",
    passwordRule: "Use 12 to 256 characters.",
    passwordTooShort: "Password must be at least 12 characters.",
    privacy: "Privacy Policy",
    privacyRequired: "You must agree to the Privacy Policy.",
    rateLimited: "Too many attempts. Try again later.",
    hidePasswordAction: "Hide",
    showPassword: "Show password",
    showPasswordAction: "Show",
    terms: "Terms of Service",
    termsRequired: "You must agree to the Terms of Service.",
    unknownField: "Check the highlighted fields and try again.",
    username: "Username",
    usernameExists: "This username is already in use.",
    usernameInvalid:
      "Use at least 3 characters and only letters, numbers, hyphens, underscores, or periods.",
  },
  ko: {
    acceptPrivacyPrefix: "[필수] ",
    acceptTermsPrefix: "[필수] ",
    alreadyHaveAccount: "이미 계정이 있으신가요?",
    createAccount: "회원가입",
    creatingAccount: "가입 처리 중...",
    displayName: "표시 이름",
    email: "이메일",
    emailExists: "이미 사용 중인 이메일 주소입니다.",
    emailInvalid: "유효한 이메일 주소를 입력해 주세요.",
    failure: "회원가입을 완료할 수 없습니다.",
    formTitle: "회원가입",
    hidePassword: "비밀번호 숨기기",
    invalidDisplayName: "표시 이름을 입력해 주세요.",
    login: "로그인",
    password: "비밀번호",
    passwordConfirmation: "비밀번호 확인",
    passwordMismatch: "비밀번호 확인이 일치하지 않습니다.",
    passwordRule: "비밀번호는 12자 이상 256자 이하로 입력해 주세요.",
    passwordTooShort: "비밀번호는 12자 이상이어야 합니다.",
    privacy: "개인정보 처리방침",
    privacyRequired: "개인정보 처리방침 동의가 필요합니다.",
    rateLimited: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    hidePasswordAction: "숨김",
    showPassword: "비밀번호 표시",
    showPasswordAction: "표시",
    terms: "이용약관",
    termsRequired: "이용약관 동의가 필요합니다.",
    unknownField: "표시된 입력값을 확인한 뒤 다시 시도해 주세요.",
    username: "사용자 이름",
    usernameExists: "이미 사용 중인 사용자 이름입니다.",
    usernameInvalid: "사용자 이름은 3자 이상이며 영문, 숫자, 하이픈, 밑줄, 마침표만 사용할 수 있습니다.",
  },
} as const;

export function RegisterForm({ locale }: RegisterFormProps) {
  const activeLocale = locale === "en" ? "en" : "ko";
  const labels = copy[activeLocale];
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = useMemo(
    () => safeAuthRedirect(searchParams.get("redirect"), activeLocale),
    [activeLocale, searchParams],
  );
  const loginHref = buildAuthRouteWithRedirect(
    `/${activeLocale}/login`,
    redirectTarget,
    activeLocale,
  );
  const [values, setValues] = useState<FormValues>({
    acceptPrivacy: false,
    acceptTerms: false,
    displayName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    username: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const submitLockRef = useRef(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement>(null);
  const acceptTermsRef = useRef<HTMLInputElement>(null);
  const acceptPrivacyRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="mx-auto max-w-md">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">{labels.formTitle}</h1>
      </div>

      <form
        className="mt-6 space-y-4"
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();

          if (submitLockRef.current) {
            return;
          }

          setFormError("");
          setFieldErrors({});

          const trimmedEmail = values.email.trim().toLowerCase();
          const trimmedUsername = values.username.trim();
          const trimmedDisplayName = values.displayName.trim();
          const nextFieldErrors: FieldErrors = {};

          if (!isValidEmail(trimmedEmail)) {
            nextFieldErrors.email = labels.emailInvalid;
          }

          if (!isValidUsername(trimmedUsername)) {
            nextFieldErrors.username = labels.usernameInvalid;
          }

          if (trimmedDisplayName === "") {
            nextFieldErrors.displayName = labels.invalidDisplayName;
          }

          if (values.password.length < 12 || values.password.length > 256) {
            nextFieldErrors.password = labels.passwordTooShort;
          }

          if (values.password !== values.passwordConfirmation) {
            nextFieldErrors.passwordConfirmation = labels.passwordMismatch;
          }

          if (!values.acceptTerms) {
            nextFieldErrors.acceptTerms = labels.termsRequired;
          }

          if (!values.acceptPrivacy) {
            nextFieldErrors.acceptPrivacy = labels.privacyRequired;
          }

          setFieldErrors(nextFieldErrors);

          if (Object.keys(nextFieldErrors).length > 0) {
            focusFirstInvalidField(nextFieldErrors, {
              acceptPrivacy: acceptPrivacyRef,
              acceptTerms: acceptTermsRef,
              displayName: displayNameRef,
              email: emailRef,
              password: passwordRef,
              passwordConfirmation: passwordConfirmationRef,
              username: usernameRef,
            });
            return;
          }

          submitLockRef.current = true;
          setIsSubmitting(true);

          try {
            const result = await registerUser({
              acceptPrivacy: true,
              acceptTerms: true,
              displayName: trimmedDisplayName,
              email: trimmedEmail,
              locale: activeLocale,
              password: values.password,
              passwordConfirmation: values.passwordConfirmation,
              username: trimmedUsername,
            });

            setValues((current) => ({
              ...current,
              password: "",
              passwordConfirmation: "",
            }));

            const checkEmailBase = buildAuthRouteWithRedirect(
              `/${activeLocale}/register/check-email`,
              redirectTarget,
              activeLocale,
            );
            const nextHref =
              result.emailSent === false
                ? `${checkEmailBase}${checkEmailBase.includes("?") ? "&" : "?"}delivery=failed`
                : checkEmailBase;

            router.replace(nextHref);
          } catch (error) {
            const nextErrors = mapRegistrationError(error, labels);

            if (nextErrors.fieldErrors) {
              setFieldErrors(nextErrors.fieldErrors);
              focusFirstInvalidField(nextErrors.fieldErrors, {
                acceptPrivacy: acceptPrivacyRef,
                acceptTerms: acceptTermsRef,
                displayName: displayNameRef,
                email: emailRef,
                password: passwordRef,
                passwordConfirmation: passwordConfirmationRef,
                username: usernameRef,
              });
            }

            setValues((current) => ({
              ...current,
              password: "",
              passwordConfirmation: "",
            }));
            setFormError(nextErrors.formError);
          } finally {
            setIsSubmitting(false);
            submitLockRef.current = false;
          }
        }}
      >
        <TextField
          autoComplete="email"
          error={fieldErrors.email}
          id="register-email"
          label={labels.email}
          onChange={(value) => setValues((current) => ({ ...current, email: value }))}
          inputRef={emailRef}
          type="email"
          value={values.email}
        />

        <TextField
          autoComplete="username"
          error={fieldErrors.username}
          id="register-username"
          label={labels.username}
          onChange={(value) => setValues((current) => ({ ...current, username: value }))}
          inputRef={usernameRef}
          type="text"
          value={values.username}
        />

        <TextField
          autoComplete="name"
          error={fieldErrors.displayName}
          id="register-display-name"
          label={labels.displayName}
          onChange={(value) => setValues((current) => ({ ...current, displayName: value }))}
          inputRef={displayNameRef}
          type="text"
          value={values.displayName}
        />

        <PasswordField
          autoComplete="new-password"
          error={fieldErrors.password}
          id="register-password"
          label={labels.password}
          onChange={(value) => setValues((current) => ({ ...current, password: value }))}
          onToggle={() => setShowPassword((current) => !current)}
          inputRef={passwordRef}
          hideActionLabel={labels.hidePasswordAction}
          hideLabel={labels.hidePassword}
          showLabel={labels.showPassword}
          showActionLabel={labels.showPasswordAction}
          showValue={showPassword}
          value={values.password}
        />
        <p className="text-xs text-zinc-500">{labels.passwordRule}</p>

        <PasswordField
          autoComplete="new-password"
          error={fieldErrors.passwordConfirmation}
          id="register-password-confirmation"
          label={labels.passwordConfirmation}
          onChange={(value) =>
            setValues((current) => ({ ...current, passwordConfirmation: value }))
          }
          onToggle={() => setShowPasswordConfirmation((current) => !current)}
          inputRef={passwordConfirmationRef}
          hideActionLabel={labels.hidePasswordAction}
          hideLabel={labels.hidePassword}
          showLabel={labels.showPassword}
          showActionLabel={labels.showPasswordAction}
          showValue={showPasswordConfirmation}
          value={values.passwordConfirmation}
        />

        <CheckboxField
          checked={values.acceptTerms}
          error={fieldErrors.acceptTerms}
          id="register-accept-terms"
          labelAriaText={
            activeLocale === "en"
              ? "Required: I agree to the Terms of Service"
              : "필수 이용약관에 동의합니다"
          }
          label={
            <>
              {labels.acceptTermsPrefix}
              <Link
                className="underline underline-offset-2 transition-colors hover:text-zinc-950"
                href={getLegalPath(activeLocale, "terms")}
                rel="noreferrer"
                target="_blank"
              >
                {labels.terms}
              </Link>
              {activeLocale === "en" ? "" : "에 동의합니다"}
            </>
          }
          onChange={(checked) => setValues((current) => ({ ...current, acceptTerms: checked }))}
          inputRef={acceptTermsRef}
        />

        <CheckboxField
          checked={values.acceptPrivacy}
          error={fieldErrors.acceptPrivacy}
          id="register-accept-privacy"
          labelAriaText={
            activeLocale === "en"
              ? "Required: I agree to the Privacy Policy"
              : "필수 개인정보 처리방침에 동의합니다"
          }
          label={
            <>
              {labels.acceptPrivacyPrefix}
              <Link
                className="underline underline-offset-2 transition-colors hover:text-zinc-950"
                href={getLegalPath(activeLocale, "privacy")}
                rel="noreferrer"
                target="_blank"
              >
                {labels.privacy}
              </Link>
              {activeLocale === "en" ? "" : "에 동의합니다"}
            </>
          }
          onChange={(checked) =>
            setValues((current) => ({ ...current, acceptPrivacy: checked }))
          }
          inputRef={acceptPrivacyRef}
        />

        {formError ? (
          <p
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {formError}
          </p>
        ) : null}

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? labels.creatingAccount : labels.createAccount}
        </Button>

        <div className="pt-2 text-center text-sm text-zinc-600">
          <span>{labels.alreadyHaveAccount} </span>
          <Link
            className="font-medium text-zinc-950 underline underline-offset-2"
            href={loginHref}
          >
            {labels.login}
          </Link>
        </div>
      </form>
    </Card>
  );
}

type TextFieldProps = {
  autoComplete: string;
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  type: string;
  value: string;
};

function TextField({
  autoComplete,
  error,
  id,
  label,
  onChange,
  inputRef,
  type,
  value,
}: TextFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-900" htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? "true" : "false"}
        autoComplete={autoComplete}
        className="block h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        ref={inputRef}
        required
        type={type}
        value={value}
      />
      {error ? (
        <p className="text-sm text-red-700" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type PasswordFieldProps = {
  autoComplete: string;
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  onToggle: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  hideActionLabel: string;
  hideLabel: string;
  showActionLabel: string;
  showLabel: string;
  showValue: boolean;
  value: string;
};

function PasswordField({
  autoComplete,
  error,
  id,
  label,
  onChange,
  onToggle,
  inputRef,
  hideActionLabel,
  hideLabel,
  showActionLabel,
  showLabel,
  showValue,
  value,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-900" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? "true" : "false"}
          autoComplete={autoComplete}
          className="block h-11 w-full rounded-md border border-zinc-300 px-3 pr-16 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
          id={id}
          onChange={(event) => onChange(event.target.value)}
          ref={inputRef}
          required
          type={showValue ? "text" : "password"}
          value={value}
        />
        <button
          aria-label={showValue ? hideLabel : showLabel}
          className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-950"
          onClick={onToggle}
          type="button"
        >
          {showValue ? hideActionLabel : showActionLabel}
        </button>
      </div>
      {error ? (
        <p className="text-sm text-red-700" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type CheckboxFieldProps = {
  checked: boolean;
  error?: string;
  id: string;
  label: ReactNode;
  labelAriaText: string;
  onChange: (checked: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

function CheckboxField({
  checked,
  error,
  id,
  label,
  labelAriaText,
  onChange,
  inputRef,
}: CheckboxFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <input
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? "true" : "false"}
          aria-label={labelAriaText}
          checked={checked}
          className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
          id={id}
          onChange={(event) => onChange(event.target.checked)}
          ref={inputRef}
          type="checkbox"
        />
        <div className="text-sm leading-6 text-zinc-700">
          {label}
        </div>
      </div>
      {error ? (
        <p className="text-sm text-red-700" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUsername(value: string): boolean {
  return /^[A-Za-z0-9._-]{3,}$/.test(value) && value.length <= 60;
}

function focusFirstInvalidField(
  errors: FieldErrors,
  refs: Record<FieldName, RefObject<HTMLInputElement | null>>,
) {
  const firstField = (
    [
      "email",
      "username",
      "displayName",
      "password",
      "passwordConfirmation",
      "acceptTerms",
      "acceptPrivacy",
    ] as const
  ).find((field) => Boolean(errors[field]));

  if (firstField) {
    refs[firstField].current?.focus();
  }
}

function mapRegistrationError(
  error: unknown,
  labels: (typeof copy)["en"] | (typeof copy)["ko"],
): {
  fieldErrors?: FieldErrors;
  formError: string;
} {
  if (!(error instanceof AuthApiError)) {
    return { formError: labels.failure };
  }

  const fieldErrors: FieldErrors = {};

  switch (error.code) {
    case "registration_invalid_email":
      fieldErrors.email = labels.emailInvalid;
      break;
    case "registration_email_exists":
      fieldErrors.email = labels.emailExists;
      break;
    case "registration_invalid_username":
      fieldErrors.username = labels.usernameInvalid;
      break;
    case "registration_username_exists":
      fieldErrors.username = labels.usernameExists;
      break;
    case "registration_invalid_display_name":
      fieldErrors.displayName = labels.invalidDisplayName;
      break;
    case "registration_password_too_short":
      fieldErrors.password = labels.passwordTooShort;
      break;
    case "registration_password_mismatch":
      fieldErrors.passwordConfirmation = labels.passwordMismatch;
      break;
    case "registration_terms_required":
      fieldErrors.acceptTerms = labels.termsRequired;
      break;
    case "registration_privacy_required":
      fieldErrors.acceptPrivacy = labels.privacyRequired;
      break;
    case "registration_rate_limited":
      return { formError: labels.rateLimited };
    case "registration_invalid_locale":
      return { formError: labels.failure };
    case "registration_failed":
      return { formError: labels.failure };
    default:
      return { formError: error.message || labels.failure };
  }

  return {
    fieldErrors,
    formError: labels.unknownField,
  };
}
