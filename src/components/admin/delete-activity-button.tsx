"use client";

import { deleteActivity } from "@/app/[lang]/admin/actions";
import { ConfirmSubmit } from "@/components/confirm-submit";
import type { Locale } from "@/i18n/config";

/** Verwijderknop die eerst om bevestiging vraagt. */
export function DeleteActivityButton({
  id,
  locale,
  confirmMessage,
  label,
  pendingLabel,
  yes,
  no,
}: {
  id: string;
  locale: Locale;
  confirmMessage: string;
  label: string;
  pendingLabel: string;
  yes: string;
  no: string;
}) {
  return (
    <form
      action={deleteActivity.bind(null, locale, id)}
      className="flex flex-wrap items-center gap-x-3 gap-y-1"
    >
      <ConfirmSubmit
        label={label}
        pendingLabel={pendingLabel}
        question={confirmMessage}
        yes={yes}
        no={no}
        className="inline-flex min-h-10 cursor-pointer items-center rounded-md px-4 text-sm font-bold text-danger transition-colors hover:bg-danger-muted disabled:opacity-60"
      />
    </form>
  );
}
