import Image from "next/image";
import { site } from "@/lib/site";
import icon from "../../public/brand/yc-icon.jpg";

export function SiteFooter() {
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
        </ul>
      </div>
    </footer>
  );
}
