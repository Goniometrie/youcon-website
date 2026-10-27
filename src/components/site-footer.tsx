import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

export async function SiteFooter() {
  const dict = await getDictionary();

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-brand">YouCon</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {dict.footer.tagline}
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">{dict.nav.contact}</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-foreground">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.linkedin} className="hover:text-foreground">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">{dict.footer.newsletterTitle}</p>
          <p className="mt-2 text-muted-foreground">
            {dict.footer.newsletterText}
          </p>
        </div>
      </div>
    </footer>
  );
}
