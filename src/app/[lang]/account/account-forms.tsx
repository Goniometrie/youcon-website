"use client";

import { useActionState } from "react";
import { describedBy, Field, inputClass } from "@/components/admin/fields";
import { buttonClass } from "@/components/button";
import type { Dictionary } from "@/i18n/dictionaries";
import { type NameState, type PasswordState, updateName, updatePassword } from "./actions";
import { MIN_PASSWORD_LENGTH } from "./password";

type T = Dictionary["account"];

const submitClass = `${buttonClass("primary")} self-start disabled:opacity-70`;

function Notice({ tone, children }: { tone: "success" | "error"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-md px-4 py-3 text-sm font-semibold ${
        tone === "error" ? "bg-danger-muted text-danger" : "bg-teal-100/25 text-teal-700"
      }`}
    >
      {children}
    </p>
  );
}

export function NameForm({
  t,
  firstName,
  lastName,
}: {
  t: T;
  firstName: string;
  lastName: string;
}) {
  const [state, action, pending] = useActionState<NameState, FormData>(updateName, {});

  return (
    <form action={action} className="mt-6 flex flex-col gap-5">
      {state.saved && <Notice tone="success">{t.nameSaved}</Notice>}
      {state.failed && <Notice tone="error">{t.nameFailed}</Notice>}
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
      </div>
      <button type="submit" disabled={pending} className={submitClass}>
        {pending ? t.saving : t.nameSave}
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
