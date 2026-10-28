"use client";

import { useActionState } from "react";
import type { RegistrationState } from "@/app/[lang]/activiteiten/actions";
import { ConfirmSubmit } from "@/components/confirm-submit";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Knop voor inschrijven of uitschrijven, met een foutmelding eronder. Het
 * formulier is `display: contents`, zodat de knop meedoet in de flex-rij
 * eromheen. Met `confirm` vraagt de knop eerst om bevestiging.
 */
export function RegistrationButton({
  action,
  label,
  pendingLabel,
  confirm,
  errors,
  className,
}: {
  action: () => Promise<RegistrationState>;
  label: string;
  pendingLabel: string;
  confirm?: { question: string; yes: string; no: string };
  errors: Dictionary["activities"]["registration"]["errors"];
  className: string;
}) {
  const [state, formAction, pending] = useActionState<RegistrationState, FormData>(
    () => action(),
    {},
  );

  return (
    <form action={formAction} className="contents">
      {confirm ? (
        <ConfirmSubmit label={label} pendingLabel={pendingLabel} className={className} {...confirm} />
      ) : (
        <button type="submit" disabled={pending} className={className}>
          {pending ? pendingLabel : label}
        </button>
      )}
      {state.error && (
        <p role="alert" className="basis-full text-sm font-semibold text-danger">
          {errors[state.error]}
        </p>
      )}
    </form>
  );
}
