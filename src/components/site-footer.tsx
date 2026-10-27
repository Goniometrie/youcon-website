import Image from "next/image";
import { Facets } from "@/components/facets";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import icon from "../../public/brand/yc-icon.jpg";

export async function SiteFooter() {
  const dict = await getDictionary();

  return (
    <footer className="relative overflow-hidden bg-teal-700 text-white">
      <Facets
        cols={6}
        rows={3}
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 opacity-15"
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="flex items-start gap-4">
          <Image src={icon} alt="" className="size-12 rounded-md" />
          <div>
            <p className="text-lg font-bold">YouCon</p>
            <p className="mt-1 text-sm text-teal-100">{dict.footer.tagline}</p>
          </div>
        </div>
        <div className="text-sm">
          <p className="font-bold uppercase tracking-wider text-teal-100">
            {dict.nav.contact}
          </p>
          <ul className="mt-3 space-y-1.5">
            <li>
              <a href={`mailto:${site.email}`} className="hover:underline">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.linkedin} className="hover:underline">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-bold uppercase tracking-wider text-teal-100">
            {dict.footer.newsletterTitle}
          </p>
          <p className="mt-3 text-white/80">{dict.footer.newsletterText}</p>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/60 sm:px-6">
          © YouCon
        </p>
      </div>
    </footer>
  );
}
