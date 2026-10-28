import type { Dictionary } from "@/i18n/dictionaries";
import type { ActivityLanguage } from "@/lib/activities";

/** Label met de voertaal van een activiteit, zodat iedereen weet wat ze kunnen verwachten. */
export function LanguageBadge({
  language,
  dict,
  className = "",
}: {
  language: ActivityLanguage;
  dict: Dictionary["activities"];
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded bg-teal-100/25 px-1.5 py-0.5 font-bold ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-[1.1em] flex-none"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
      </svg>
      <span className="sr-only">{dict.language}: </span>
      {dict.languages[language]}
    </span>
  );
}
