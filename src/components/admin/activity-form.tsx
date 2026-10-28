"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  saveActivity,
  type ActivityFormState,
  type ActivityValues,
} from "@/app/[lang]/admin/actions";
import { describedBy, Field, inputClass } from "@/components/admin/fields";
import { PhotoField } from "@/components/admin/photo-field";
import { buttonClass } from "@/components/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { routes } from "@/lib/site";
import { Constants, type Tables } from "@/lib/supabase/database.types";

/** Form values for an existing activity, or the defaults for a new one. */
function initialValues(row?: Tables<"activities">): ActivityValues {
  if (!row) return { type: "excursion", language: "nl", published: "on" };
  const text = (value: string | null) => value ?? "";
  return {
    type: row.type,
    language: row.language,
    date: row.date,
    time: text(row.time).slice(0, 5),
    location: row.location,
    partner: text(row.partner),
    title_nl: row.title_nl,
    title_en: text(row.title_en),
    summary_nl: row.summary_nl,
    summary_en: text(row.summary_en),
    registration_url: text(row.registration_url),
    capacity: row.capacity?.toString() ?? "",
    image_url: text(row.image_url),
    image_alt_nl: text(row.image_alt_nl),
    image_alt_en: text(row.image_alt_en),
    published: row.published ? "on" : "",
  };
}

export function ActivityForm({
  locale,
  dict,
  activity,
}: {
  locale: Locale;
  dict: Dictionary;
  activity?: Tables<"activities">;
}) {
  const [state, action, pending] = useActionState<ActivityFormState, FormData>(
    saveActivity.bind(null, locale, activity?.id ?? null),
    {},
  );
  const [uploading, setUploading] = useState(false);
  const t = dict.admin.form;
  const values = state.values ?? initialValues(activity);
  const errors = state.errors ?? {};
  const error = (field: keyof typeof errors) => {
    const key = errors[field];
    return key && t.errors[key];
  };
  const hasEnglish = Boolean(values.title_en || values.summary_en || values.image_alt_en);

  return (
    <form action={action} className="flex flex-col gap-6" noValidate>
      {(state.failed || Object.keys(errors).length > 0) && (
        <p role="alert" className="rounded-md bg-danger-muted px-4 py-3 font-semibold text-danger">
          {state.failed ? t.errors.generic : t.errors.summary}
        </p>
      )}

      <Card title={t.basics}>
        <Choice
          name="type"
          legend={t.type}
          options={Constants.public.Enums.activity_type}
          labels={dict.activities.types}
          value={values.type}
        />

        <Choice
          name="language"
          legend={t.language}
          hint={t.languageHint}
          options={Constants.public.Enums.activity_language}
          labels={dict.activities.languages}
          value={values.language}
        />

        <Field id="title_nl" label={t.titleNl} error={error("title_nl")}>
          <input
            {...describedBy("title_nl", error("title_nl"))}
            defaultValue={values.title_nl}
            required
            className={inputClass}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="date" label={t.date} error={error("date")}>
            <input
              {...describedBy("date", error("date"))}
              type="date"
              defaultValue={values.date}
              required
              className={inputClass}
            />
          </Field>
          <Field id="time" label={t.time} hint={t.timeHint} error={error("time")}>
            <input
              {...describedBy("time", error("time"), t.timeHint)}
              type="time"
              defaultValue={values.time}
              className={inputClass}
            />
          </Field>
        </div>

        <Field id="location" label={t.location} error={error("location")}>
          <input
            {...describedBy("location", error("location"))}
            defaultValue={values.location}
            placeholder={t.locationPlaceholder}
            required
            className={inputClass}
          />
        </Field>

        <Field id="partner" label={t.partner} hint={t.partnerHint}>
          <input
            {...describedBy("partner", undefined, t.partnerHint)}
            defaultValue={values.partner}
            className={inputClass}
          />
        </Field>
      </Card>

      <Card title={t.text}>
        <Field
          id="summary_nl"
          label={t.summaryNl}
          hint={t.summaryHint}
          error={error("summary_nl")}
        >
          <textarea
            {...describedBy("summary_nl", error("summary_nl"), t.summaryHint)}
            defaultValue={values.summary_nl}
            rows={5}
            required
            className={inputClass}
          />
        </Field>

        <details open={hasEnglish} className="group rounded-md border border-divider">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-bold [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="text-brand transition-transform group-open:rotate-90">
              ▸
            </span>
            {t.english}
          </summary>
          <div className="flex flex-col gap-5 border-t border-divider p-4">
            <p className="text-sm text-muted-foreground">{t.englishHint}</p>
            <Field id="title_en" label={t.titleEn}>
              <input {...describedBy("title_en")} defaultValue={values.title_en} className={inputClass} />
            </Field>
            <Field id="summary_en" label={t.summaryEn}>
              <textarea
                {...describedBy("summary_en")}
                defaultValue={values.summary_en}
                rows={5}
                className={inputClass}
              />
            </Field>
            <Field id="image_alt_en" label={t.altEn}>
              <input
                {...describedBy("image_alt_en")}
                defaultValue={values.image_alt_en}
                className={inputClass}
              />
            </Field>
          </div>
        </details>
      </Card>

      <Card title={t.photo}>
        <PhotoField
          t={t}
          initialUrl={values.image_url ?? ""}
          altNl={values.image_alt_nl}
          error={error("image_url")}
          onUploadingChange={setUploading}
        />
      </Card>

      <Card title={t.publication}>
        <Field
          id="registration_url"
          label={t.registrationUrl}
          hint={t.registrationHint}
          error={error("registration_url")}
        >
          <input
            {...describedBy("registration_url", error("registration_url"), t.registrationHint)}
            type="url"
            inputMode="url"
            placeholder="https://"
            defaultValue={values.registration_url}
            className={inputClass}
          />
        </Field>
        <Field id="capacity" label={t.capacity} hint={t.capacityHint} error={error("capacity")}>
          <input
            {...describedBy("capacity", error("capacity"), t.capacityHint)}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            defaultValue={values.capacity}
            className={`${inputClass} max-w-40`}
          />
        </Field>
        <Checkbox
          name="published"
          label={t.published}
          hint={t.publishedHint}
          checked={values.published}
        />
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className={`${buttonClass("primary")} cursor-pointer disabled:cursor-wait disabled:opacity-70`}
        >
          {pending ? t.saving : t.save}
        </button>
        <Link href={`/${locale}${routes.admin}`} className={buttonClass("ghost")}>
          {t.cancel}
        </Link>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[10px] bg-white p-5 shadow-[0_1px_2px_rgba(23,50,61,0.06)] sm:p-7">
      <h2 className="text-lg font-extrabold">{title}</h2>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

/** A row of radio buttons styled as chips. */
function Choice<T extends string>({
  name,
  legend,
  hint,
  options,
  labels,
  value,
}: {
  name: string;
  legend: string;
  hint?: string;
  options: readonly T[];
  labels: Record<T, string>;
  value?: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-bold">{legend}</legend>
      {hint && <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="cursor-pointer rounded-md border-2 border-input bg-white px-4 py-2 font-semibold transition-colors has-checked:border-brand has-checked:bg-brand has-checked:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-100"
          >
            <input
              type="radio"
              name={name}
              value={option}
              defaultChecked={value === option}
              className="sr-only"
            />
            {labels[option]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Checkbox({
  name,
  label,
  hint,
  checked,
}: {
  name: string;
  label: string;
  hint?: string;
  checked?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked === "on"}
        className="mt-0.5 size-5 flex-none accent-brand"
      />
      <span>
        <span className="font-semibold">{label}</span>
        {hint && <span className="block text-sm text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}
