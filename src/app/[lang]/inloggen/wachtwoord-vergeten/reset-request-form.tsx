"use client";

import { useActionState } from "react";
import { describedBy, Field, inputClass } from "@/components/admin/fields";
import { buttonClass } from "@/components/button";
import { Notice } from "@/components/notice";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { requestPasswordReset, type ResetRequestState } from "../actions";

export function ResetRequestForm({
  locale,
  t,
  emailLabel,
}: {
  locale: Locale;
  t: Dictionary["password"];
  emailLabel: string;
}) {
  const [state, action, pending] = useActionState<ResetRequestState, FormData>(
    requestPasswordReset.bind(null, locale),
    {},
  );

  if (state.sentTo) return <Notice tone="success">{t.sent.replace("{email}", state.sentTo)}</Notice>;

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Notice tone="error">{t[state.error]}</Notice>}
      <Field id="email" label={emailLabel}>
        <input
          {...describedBy("email")}
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          className={inputClass}
        />
      </Field>
      <button type="submit" disabled={pending} className={`${buttonClass("primary")} disabled:opacity-70`}>
        {pending ? t.sending : t.send}
      </button>
    </form>
  );
}
