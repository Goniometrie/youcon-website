"use client";

import Link from "next/link";
import { useActionState } from "react";
import { describedBy, Field, inputClass } from "@/components/admin/fields";
import { buttonClass } from "@/components/button";
import { Notice } from "@/components/notice";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { routes } from "@/lib/site";
import { type NewPasswordState, setNewPassword } from "../actions";

export function NewPasswordForm({
  locale,
  t,
  account,
  email,
}: {
  locale: Locale;
  t: Dictionary["password"];
  /** Labels shared with the password form on the account page. */
  account: Dictionary["account"];
  email: string;
}) {
  const [state, action, pending] = useActionState<NewPasswordState, FormData>(setNewPassword, {});
  const min = String(MIN_PASSWORD_LENGTH);
  const error = state.error && t.errors[state.error].replace("{min}", min);
  const hint = account.newPasswordHint.replace("{min}", min);

  if (state.saved) {
    return (
      <div className="flex flex-col gap-4">
        <Notice tone="success">{t.saved}</Notice>
        <Link href={`/${locale}${routes.account}`} className="self-start font-bold text-brand hover:underline">
          {t.toAccount}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {error && <Notice tone="error">{error}</Notice>}
      {/* Lets password managers tie the new password to this account. */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <Field id="new_password" label={account.newPassword} hint={hint}>
        <input
          {...describedBy("new_password", undefined, hint)}
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          className={inputClass}
        />
      </Field>
      <Field id="confirm_password" label={account.confirmPassword}>
        <input
          {...describedBy("confirm_password")}
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          className={inputClass}
        />
      </Field>
      <button type="submit" disabled={pending} className={`${buttonClass("primary")} disabled:opacity-70`}>
        {pending ? account.saving : t.save}
      </button>
    </form>
  );
}
