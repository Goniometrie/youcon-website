"use client";

import Link from "next/link";
import { useActionState } from "react";
import { describedBy, Field, inputClass } from "@/components/admin/fields";
import { buttonClass } from "@/components/button";
import type { Dictionary } from "@/i18n/dictionaries";
import { type PasswordState, type ProfileState, updatePassword, updateProfile } from "./actions";
import { MIN_PASSWORD_LENGTH } from "./password";

type T = Dictionary["account"];

const submitClass = `${buttonClass("primary")} self-start disabled:opacity-70`;

function Notice({
  tone,
  children,
}: {
  tone: "success" | "error" | "info";
  children: React.ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-md px-4 py-3 text-sm font-semibold ${
        tone === "error"
          ? "bg-danger-muted text-danger"
          : tone === "info"
            ? "border border-teal-700/30 text-teal-700"
            : "bg-teal-100/25 text-teal-700"
      }`}
    >
      {children}
    </p>
  );
}

export function ProfileForm({
  t,
  firstName,
  lastName,
  company,
  birthDate,
  today,
  next,
}: {
  t: T;
  firstName: string;
  lastName: string;
  company: string;
  birthDate: string;
  /** YYYY-MM-DD, the latest date the birth date picker allows. */
  today: string;
  /** Page to continue to once the details are saved (after signing up). */
  next?: string;
}) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, {});
  const birthDateError = state.invalidBirthDate ? t.birthDateError : undefined;

  return (
    <form action={action} className="mt-6 flex flex-col gap-5">
      {!birthDate && !state.saved && <Notice tone="info">{t.profileIncomplete}</Notice>}
      {state.saved && (
        <Notice tone="success">
          {t.profileSaved}
          {next && (
            <>
              {" "}
              <Link href={next} className="underline hover:no-underline">
                {t.continue}
              </Link>
            </>
          )}
        </Notice>
      )}
      {state.failed && <Notice tone="error">{t.profileFailed}</Notice>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="first_name" label={t.firstName}>
          <input
            {...describedBy("first_name")}
            type="text"
            autoComplete="given-name"
            maxLength={60}
            defaultValue={state.values?.first_name ?? firstName}
            className={inputClass}
          />
        </Field>
        <Field id="last_name" label={t.lastName} hint={t.lastNameHint}>
          <input
            {...describedBy("last_name", undefined, t.lastNameHint)}
            type="text"
            autoComplete="family-name"
            maxLength={80}
            defaultValue={state.values?.last_name ?? lastName}
            className={inputClass}
          />
        </Field>
        <Field id="company" label={t.company} hint={t.companyHint}>
          <input
            {...describedBy("company", undefined, t.companyHint)}
            type="text"
            autoComplete="organization"
            maxLength={120}
            defaultValue={state.values?.company ?? company}
            className={inputClass}
          />
        </Field>
        <Field id="birth_date" label={t.birthDate} hint={t.birthDateHint} error={birthDateError}>
          <input
            {...describedBy("birth_date", birthDateError, t.birthDateHint)}
            type="date"
            autoComplete="bday"
            required
            min="1900-01-01"
            max={today}
            defaultValue={state.values?.birth_date ?? birthDate}
            className={inputClass}
          />
        </Field>
      </div>
      <button type="submit" disabled={pending} className={submitClass}>
        {pending ? t.saving : t.profileSave}
      </button>
    </form>
  );
}

export function PasswordForm({ t, email }: { t: T; email: string }) {
  const [state, action, pending] = useActionState<PasswordState, FormData>(updatePassword, {});
  const min = String(MIN_PASSWORD_LENGTH);
  const error = state.error && t.passwordErrors[state.error].replace("{min}", min);
  const hint = t.newPasswordHint.replace("{min}", min);

  return (
    <form action={action} className="mt-6 flex flex-col gap-5">
      {state.saved && <Notice tone="success">{t.passwordSaved}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}
      {/* Lets password managers tie the new password to this account. */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <Field id="current_password" label={t.currentPassword}>
        <input
          {...describedBy("current_password")}
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>
      <Field id="new_password" label={t.newPassword} hint={hint}>
        <input
          {...describedBy("new_password", undefined, hint)}
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          className={inputClass}
        />
      </Field>
      <Field id="confirm_password" label={t.confirmPassword}>
        <input
          {...describedBy("confirm_password")}
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          className={inputClass}
        />
      </Field>
      <button type="submit" disabled={pending} className={submitClass}>
        {pending ? t.saving : t.passwordSave}
      </button>
    </form>
  );
}
