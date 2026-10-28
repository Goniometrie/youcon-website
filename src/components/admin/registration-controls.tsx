"use client";

import { useActionState } from "react";
import {
  addRegistration,
  removeRegistration,
  type AddRegistrationState,
} from "@/app/[lang]/admin/actions";
import { inputClass } from "@/components/admin/fields";
import { buttonClass } from "@/components/button";
import { ConfirmSubmit } from "@/components/confirm-submit";
import type { Dictionary } from "@/i18n/dictionaries";

type Texts = Dictionary["admin"]["registrations"];

/** Een bestaand account op de personenlijst zetten. */
export function AddRegistrationForm({
  activityId,
  people,
  t,
}: {
  activityId: string;
  /** Accounts that aren't on the list yet. */
  people: { id: string; label: string }[];
  t: Texts;
}) {
  const [state, action, pending] = useActionState<AddRegistrationState, FormData>(
    addRegistration.bind(null, activityId),
    {},
  );

  if (people.length === 0) return <p className="text-sm text-body">{t.noAccounts}</p>;

  return (
    <form action={action} className="flex flex-col gap-2">
      <label htmlFor="profile_id" className="text-sm font-bold">
        {t.addTitle}
      </label>
      <p id="profile_id-hint" className="text-sm text-muted-foreground">
        {t.addHint}
      </p>
      <div className="flex flex-wrap gap-3">
        <select
          id="profile_id"
          name="profile_id"
          defaultValue=""
          aria-describedby="profile_id-hint"
          className={`${inputClass} max-w-md flex-[1_1_260px]`}
        >
          <option value="" disabled>
            {t.choose}
          </option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className={`${buttonClass("primary")} cursor-pointer disabled:cursor-wait disabled:opacity-70`}
        >
          {pending ? t.adding : t.add}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm font-semibold text-danger">
          {t.errors[state.error]}
        </p>
      )}
    </form>
  );
}

/** Iemand van de lijst halen, na bevestiging. */
export function RemoveRegistrationButton({
  activityId,
  profileId,
  name,
  t,
}: {
  activityId: string;
  profileId: string;
  name: string;
  t: Texts;
}) {
  return (
    <form
      action={removeRegistration.bind(null, activityId, profileId)}
      className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1"
    >
      <ConfirmSubmit
        label={t.remove}
        pendingLabel={t.removing}
        question={t.confirmRemove.replace("{name}", name)}
        yes={t.confirmYes}
        no={t.confirmNo}
        className="inline-flex min-h-9 cursor-pointer items-center rounded-md px-3 text-sm font-bold text-danger transition-colors hover:bg-danger-muted disabled:opacity-60"
        questionClassName="basis-full text-right text-sm font-semibold whitespace-normal"
      />
    </form>
  );
}
