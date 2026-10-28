"use client";

import { useFormStatus } from "react-dom";
import { deleteActivity } from "@/app/[lang]/admin/actions";
import type { Locale } from "@/i18n/config";

/** Verwijderknop die eerst om bevestiging vraagt. */
export function DeleteActivityButton({
  id,
  locale,
  confirmMessage,
  label,
  pendingLabel,
}: {
  id: string;
  locale: Locale;
  confirmMessage: string;
  label: string;
  pendingLabel: string;
}) {
  return (
    <form
      action={deleteActivity.bind(null, locale, id)}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      <SubmitButton label={label} pendingLabel={pendingLabel} />
    </form>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-10 cursor-pointer items-center rounded-md px-4 text-sm font-bold text-danger transition-colors hover:bg-danger-muted disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
