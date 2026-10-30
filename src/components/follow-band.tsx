import Link from "next/link";
import { buttonClass } from "@/components/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { routes, site } from "@/lib/site";

/**
 * Oproep om lid te worden en YouCon op LinkedIn te volgen. Staat op de plek
 * van de nieuwsbrief tot die er is (roadmap punt 4).
 */
export function FollowBand({
  dict,
  locale,
}: {
  dict: Dictionary["home"]["follow"];
  locale: Locale;
}) {
  return (
    <section className="bg-muted">
      <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-8 px-4 py-16 sm:px-6">
        <div className="flex-[1_1_380px]">
          <h2 className="text-[28px] font-extrabold">{dict.title}</h2>
          <p className="mt-2 text-[17px] leading-[1.6] text-body">{dict.text}</p>
        </div>
        <div className="flex flex-wrap gap-3.5">
          <Link href={`/${locale}${routes.join}`} className={buttonClass("primary")}>
            {dict.join}
          </Link>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("outline")}
          >
            {dict.linkedin}
          </a>
        </div>
      </div>
    </section>
  );
}
