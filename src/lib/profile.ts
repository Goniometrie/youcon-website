import { today } from "@/lib/activities";

/** A real calendar date (YYYY-MM-DD) from 1900 up to today. */
export function isValidBirthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  const roundTrips = !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
  return roundTrips && value >= "1900-01-01" && value <= today();
}
