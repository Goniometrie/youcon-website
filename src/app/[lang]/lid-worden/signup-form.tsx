"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { describedBy, Field, inputClass } from "@/components/admin/fields";
import { buttonClass } from "@/components/button";
import { providerButtonClass } from "@/components/google-sign-in";
import { Notice } from "@/components/notice";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { routes } from "@/lib/site";
import { type SignUpError, signUp, type SignUpState } from "./actions";

/**
 * "Continue with email", styled like the Google button. Unfolds the sign-up
 * form; folding it again keeps what was typed.
 */
export function EmailSignUp(props: React.ComponentProps<typeof SignUpForm>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.getElementById("first_name")?.focus();
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="signup-form"
        onClick={() => setOpen((o) => !o)}
        className={providerButtonClass}
      >
        <MailIcon />
        {props.t.withEmail}
      </button>
      <div id="signup-form" hidden={!open} className="pt-3">
        <SignUpForm {...props} />
      </div>
    </>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 shrink-0 text-brand"
    >
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3 6.5 9 6.5 9-6.5" />
    </svg>
  );
}

function SignUpForm({
  locale,
  t,
  account,
  next,
}: {
  locale: Locale;
  t: Dictionary["join"];
  /** Labels and hints shared with the profile form on the account page. */
  account: Dictionary["account"];
  /** Page to return to once the account is confirmed. */
  next?: string;
}) {
  const [state, action, pending] = useActionState<SignUpState, FormData>(
    signUp.bind(null, locale),
    {},
  );
  const min = String(MIN_PASSWORD_LENGTH);
  const v = state.values;

  if (state.sentTo) {
    return (
      <div className="flex flex-col gap-4">
        <Notice tone="success">{t.sent.replace("{email}", state.sentTo)}</Notice>
        <p className="text-sm text-muted-foreground">
          {t.sentHint}{" "}
          <Link href={`/${locale}${routes.login}`} className="font-bold text-brand hover:underline">
            {t.login}
          </Link>
        </p>
      </div>
    );
  }

  // Errors that belong to one field show there; the rest above the form.
  const fieldError = (error: SignUpError) =>
    state.error === error ? t.errors[error].replace("{min}", min) : undefined;
  const birthDateError = fieldError("birthDate");
  const emailError = fieldError("email");
  const passwordError = fieldError("short") ?? fieldError("weak");
  const confirmError = fieldError("mismatch");
  const formError = fieldError("exists") ?? fieldError("rateLimit") ?? fieldError("failed");
  const passwordHint = account.newPasswordHint.replace("{min}", min);

  return (
    <form action={action} className="flex flex-col gap-5">
      {next && <input type="hidden" name="next" value={next} />}
      {formError && <Notice tone="error">{formError}</Notice>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="first_name" label={account.firstName}>
          <input
            {...describedBy("first_name")}
            type="text"
            autoComplete="given-name"
            required
            maxLength={60}
            defaultValue={v?.first_name}
            className={inputClass}
          />
        </Field>
        <Field id="last_name" label={account.lastName} hint={account.lastNameHint}>
          <input
            {...describedBy("last_name", undefined, account.lastNameHint)}
            type="text"
            autoComplete="family-name"
            required
            maxLength={80}
            defaultValue={v?.last_name}
            className={inputClass}
          />
        </Field>
        <Field id="company" label={account.company} hint={account.companyHint}>
          <input
            {...describedBy("company", undefined, account.companyHint)}
            type="text"
            autoComplete="organization"
            maxLength={120}
            defaultValue={v?.company}
            className={inputClass}
          />
        </Field>
        <Field
          id="birth_date"
          label={account.birthDate}
          hint={account.birthDateHint}
          error={birthDateError}
        >
          <input
            {...describedBy("birth_date", birthDateError, account.birthDateHint)}
            type="date"
            autoComplete="bday"
            required
            min="1900-01-01"
            defaultValue={v?.birth_date}
            className={inputClass}
          />
        </Field>
      </div>
      <Field id="email" label={t.email} error={emailError}>
        <input
          {...describedBy("email", emailError)}
          type="email"
          autoComplete="email"
          required
          defaultValue={v?.email}
          className={inputClass}
        />
      </Field>
      <Field id="password" label={t.password} hint={passwordHint} error={passwordError}>
        <input
          {...describedBy("password", passwordError, passwordHint)}
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          className={inputClass}
        />
      </Field>
      <Field id="confirm_password" label={t.confirmPassword} error={confirmError}>
        <input
          {...describedBy("confirm_password", confirmError)}
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          className={inputClass}
        />
      </Field>
      <button type="submit" disabled={pending} className={`${buttonClass("primary")} disabled:opacity-70`}>
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
