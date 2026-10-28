"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { ACTIVITIES_TAG } from "@/lib/activities";
import { requireStaff } from "@/lib/auth";
import {
  REGISTRATIONS_TAG,
  registrationError,
  type RegistrationError,
} from "@/lib/registrations";
import { routes } from "@/lib/site";
import { Constants, type TablesInsert } from "@/lib/supabase/database.types";
import { createSessionClient } from "@/lib/supabase/server";

const TEXT_FIELDS = [
  "type",
  "language",
  "date",
  "time",
  "location",
  "partner",
  "title_nl",
  "title_en",
  "summary_nl",
  "summary_en",
  "registration_url",
  "capacity",
  "image_url",
  "image_alt_nl",
  "image_alt_en",
] as const;
const CHECKBOXES = ["published"] as const;

export type ActivityField = (typeof TEXT_FIELDS)[number] | (typeof CHECKBOXES)[number];
export type ActivityValues = Partial<Record<ActivityField, string>>;
export type FieldError = "required" | "url" | "time" | "number";

export type ActivityFormState = {
  values?: ActivityValues;
  errors?: Partial<Record<ActivityField, FieldError>>;
  /** Saving failed for a reason other than the input. */
  failed?: boolean;
};

const STORAGE_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/activity-images/`;

function validate(values: ActivityValues) {
  const errors: ActivityFormState["errors"] = {};
  for (const field of ["date", "location", "title_nl", "summary_nl"] as const) {
    if (!values[field]) errors[field] = "required";
  }
  if (!Constants.public.Enums.activity_type.includes(values.type as never)) {
    errors.type = "required";
  }
  if (!Constants.public.Enums.activity_language.includes(values.language as never)) {
    errors.language = "required";
  }
  if (values.date && !/^\d{4}-\d{2}-\d{2}$/.test(values.date)) errors.date = "required";
  if (values.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time)) errors.time = "time";
  if (values.registration_url && !/^https?:\/\/\S+\.\S+$/.test(values.registration_url)) {
    errors.registration_url = "url";
  }
  if (values.capacity && !/^[1-9]\d{0,4}$/.test(values.capacity)) errors.capacity = "number";
  // Only our own photos: seed images in public/ or uploads to our bucket.
  if (
    values.image_url &&
    !values.image_url.startsWith("/images/") &&
    !values.image_url.startsWith(STORAGE_PREFIX)
  ) {
    errors.image_url = "url";
  }
  return errors;
}

/** URL-friendly slug from the Dutch title, unique among existing activities. */
async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createSessionClient>>,
  title: string,
  date: string,
) {
  const base =
    title
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "activiteit";

  const { data } = await supabase.from("activities").select("slug").like("slug", `${base}%`);
  const taken = new Set(data?.map((row) => row.slug));
  const year = date.slice(0, 4);
  const candidates = [base, `${base}-${year}`];
  for (let n = 2; ; n++) {
    const slug = candidates.shift() ?? `${base}-${year}-${n}`;
    if (!taken.has(slug)) return slug;
  }
}

/** Create (`id` null) or update an activity, then back to the overview. */
export async function saveActivity(
  locale: Locale,
  id: string | null,
  _state: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> {
  await requireStaff();

  const values: ActivityValues = {};
  for (const field of TEXT_FIELDS) values[field] = String(formData.get(field) ?? "").trim();
  for (const field of CHECKBOXES) values[field] = formData.get(field) ? "on" : "";

  const errors = validate(values);
  if (Object.keys(errors).length > 0) return { values, errors };

  const orNull = (value?: string) => value || null;
  const fields = {
    type: values.type as TablesInsert<"activities">["type"],
    language: values.language as TablesInsert<"activities">["language"],
    date: values.date!,
    time: orNull(values.time),
    location: values.location!,
    partner: orNull(values.partner),
    title_nl: values.title_nl!,
    title_en: orNull(values.title_en),
    summary_nl: values.summary_nl!,
    summary_en: orNull(values.summary_en),
    registration_url: orNull(values.registration_url),
    capacity: values.capacity ? Number(values.capacity) : null,
    image_url: orNull(values.image_url),
    image_alt_nl: values.image_url ? orNull(values.image_alt_nl) : null,
    image_alt_en: values.image_url ? orNull(values.image_alt_en) : null,
    published: values.published === "on",
  };

  const supabase = await createSessionClient();
  const { error } = id
    ? await supabase.from("activities").update(fields).eq("id", id)
    : await supabase
        .from("activities")
        .insert({ ...fields, slug: await uniqueSlug(supabase, fields.title_nl, fields.date) });
  if (error) {
    console.error("saveActivity", error);
    return { values, failed: true };
  }

  updateTag(ACTIVITIES_TAG);
  redirect(`/${locale}${routes.admin}?status=saved`);
}

export async function deleteActivity(locale: Locale, id: string) {
  await requireStaff();

  const supabase = await createSessionClient();
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw error;

  updateTag(ACTIVITIES_TAG);
  redirect(`/${locale}${routes.admin}?status=deleted`);
}

export type AddRegistrationState = { error?: RegistrationError | "choose" };

/** Put an existing account on an activity's list. The usual limits apply. */
export async function addRegistration(
  activityId: string,
  _state: AddRegistrationState,
  formData: FormData,
): Promise<AddRegistrationState> {
  await requireStaff();

  const profileId = String(formData.get("profile_id") ?? "");
  if (!profileId) return { error: "choose" };

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("registrations")
    .insert({ activity_id: activityId, profile_id: profileId });
  const problem = registrationError(error);
  if (problem) return { error: problem };

  updateTag(REGISTRATIONS_TAG);
  return {};
}

/** Take someone off an activity's list, e.g. after they cancelled by email. */
export async function removeRegistration(activityId: string, profileId: string) {
  await requireStaff();

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("registrations")
    .delete()
    .eq("activity_id", activityId)
    .eq("profile_id", profileId);
  if (error) throw error;

  updateTag(REGISTRATIONS_TAG);
}
