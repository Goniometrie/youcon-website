import type { Metadata } from "next";
import { buttonClass } from "@/components/button";
import { PageHeader, SectionTitle } from "@/components/page-header";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { partnerCategories, partnerDomain, partners, type Partner } from "@/lib/partners";
import { alternates } from "@/lib/seo";
import { routes, site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = (await getDictionary()).partners;
  return { title: t.title, description: t.intro, alternates: await alternates(routes.partners) };
}

/** Kaart van één vereniging; de hele kaart linkt naar hun site. */
function PartnerCard({ partner, t }: { partner: Partner; t: Dictionary["partners"] }) {
  return (
    <li className="h-full">
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white p-6 shadow-sm transition-colors hover:border-teal-300 focus-visible:border-teal-300 sm:p-7"
      >
        {/* Gevouwen hoekje rechtsboven */}
        <svg viewBox="0 0 40 40" aria-hidden="true" className="absolute top-0 right-0 size-8">
          <polygon points="0,0 40,0 40,40" fill="#87cfce" />
          <polygon points="20,0 40,0 40,20" fill="#56929d" />
        </svg>
        <h3 className="pr-8 text-xl leading-snug font-bold text-teal-700">{partner.name}</h3>
        {partner.fullName && (
          <p className="mt-1 text-sm text-muted-foreground">{partner.fullName}</p>
        )}
        <p className="mt-3 leading-[1.7] text-body">{t.descriptions[partner.id]}</p>
        {partner.id === "stufib" && (
          <div className="mt-4 rounded-md border-l-4 border-teal-400 bg-muted px-4 py-3">
            <p className="text-[12px] font-bold tracking-[0.14em] text-teal-500 uppercase">
              {t.stufibOfferLabel}
            </p>
            <p className="mt-1 text-[15px] leading-[1.6] text-body">{t.stufibOffer}</p>
          </div>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-bold text-brand group-hover:text-brand-hover">
          <span className="min-w-0 wrap-anywhere">{partnerDomain(partner.url)}</span>
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
          >
            →
          </span>
          <span className="sr-only"> ({t.newTab})</span>
        </span>
      </a>
    </li>
  );
}

export default async function PartnersPage() {
  const { partners: t } = await getDictionary();

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />

      <section className="mx-auto max-w-site px-4 pt-14 pb-20 sm:px-6 md:pt-20 sm:pb-24">
        <p className="max-w-[680px] text-lg leading-[1.75] text-body">{t.lead}</p>

        <div className="mt-12 divide-y divide-divider md:mt-16">
          {partnerCategories.map((category) => (
            <section
              key={category}
              aria-labelledby={`categorie-${category}`}
              className="grid gap-6 py-10 first:pt-0 last:pb-0 md:grid-cols-[1fr_2fr] md:gap-12 md:py-14"
            >
              <SectionTitle className="self-start text-[26px] text-foreground">
                <span id={`categorie-${category}`}>{t.categories[category]}</span>
              </SectionTitle>
              <ul className="grid gap-5 sm:grid-cols-2">
                {partners
                  .filter((partner) => partner.category === category)
                  .map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} t={t} />
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-8 px-4 py-14 sm:px-6">
          <div className="min-w-0 flex-[1_1_420px]">
            <h2 className="text-[28px] leading-tight font-extrabold tracking-tight text-teal-700">
              {t.missingTitle}
            </h2>
            <p className="mt-2 max-w-[560px] text-lg leading-[1.65] text-body">{t.missingText}</p>
          </div>
          <a href={`mailto:${site.email}`} className={buttonClass("primary")}>
            {site.email}
          </a>
        </div>
      </section>
    </>
  );
}
