"use client";

import Link from "next/link";
import { useActionState } from "react";
import { describedBy, Field, inputClass } from "@/components/admin/fields";
import { buttonClass } from "@/components/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { routes } from "@/lib/site";
import { signIn, type SignInState } from "./actions";

export function LoginForm({
  locale,
  t,
  next,
}: {
  locale: Locale;
  t: Dictionary["login"];
  /** Page to return to after logging in. */
  next?: string;
}) {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    signIn.bind(null, locale),
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && (
        <p role="alert" className="rounded-md bg-danger-muted px-4 py-3 text-sm font-semibold text-danger">
          {state.error === "unconfirmed" ? t.unconfirmed : t.invalid}
        </p>
      )}
      <Field id="email" label={t.email}>
        <input
          {...describedBy("email")}
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          className={inputClass}
        />
      </Field>
      <Field id="password" label={t.password}>
        <input
          {...describedBy("password")}
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>
      <Link
        href={`/${locale}${routes.forgotPassword}`}
        className="-mt-2 self-start text-sm font-bold text-brand hover:underline"
      >
        {t.forgot}
      </Link>
      <button type="submit" disabled={pending} className={`${buttonClass("primary")} disabled:opacity-70`}>
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
