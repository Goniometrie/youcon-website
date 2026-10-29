import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { routes, site } from "@/lib/site";
import icon from "../../public/brand/yc-icon.jpg";

export async function SiteFooter() {
  const [{ footer: t }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <footer className="bg-teal-700 text-white">
      <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-6 px-4 py-10 text-sm sm:px-6">
        <div className="flex items-center gap-3.5">
          <Image src={icon} alt="" className="size-10 rounded-md" />
          <span className="text-base font-extrabold">YouCon</span>
        </div>
        <ul className="flex flex-wrap gap-6">
          <li>
            <a href={`mailto:${site.email}`} className="underline hover:text-teal-100">
              {site.email}
            </a>
          </li>
          <li>
            <a href={site.linkedin} className="underline hover:text-teal-100">
              LinkedIn
            </a>
          </li>
          <li>
            <Link href={`/${locale}${routes.privacy}`} className="underline hover:text-teal-100">
              {t.privacy}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
