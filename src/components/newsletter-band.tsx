import { buttonClass } from "@/components/button";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Nieuwsbriefband. Er is nog geen backend, dus het formulier staat uit en
 * zegt dat aanmelden binnenkort komt.
 */
export function NewsletterBand({ dict }: { dict: Dictionary["home"]["newsletter"] }) {
  return (
    <section className="bg-muted">
      <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-8 px-4 py-16 sm:px-6">
        <div className="flex-[1_1_380px]">
          <h2 className="text-[28px] font-extrabold">{dict.title}</h2>
          <p className="mt-2 text-[17px] leading-[1.6] text-body">{dict.text}</p>
        </div>
        {/* TODO: koppelen aan de nieuwsbrief zodra die er is. */}
        <form className="flex-[1_1_420px]" aria-describedby="newsletter-soon">
          <fieldset disabled className="flex flex-wrap items-end gap-2.5">
            <label className="flex flex-[1_1_240px] flex-col gap-1.5 text-sm font-bold">
              {dict.email}
              <input
                type="email"
                name="email"
                placeholder={dict.placeholder}
                className="min-h-12 rounded-md border border-input bg-white px-3.5 text-base font-normal disabled:cursor-not-allowed disabled:bg-white/60"
              />
            </label>
            <button
              type="submit"
              className={`${buttonClass("primary")} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand`}
            >
              {dict.submit}
            </button>
          </fieldset>
          <p id="newsletter-soon" className="mt-2.5 text-sm text-muted-foreground">
            {dict.comingSoon}
          </p>
        </form>
      </div>
    </section>
  );
}
