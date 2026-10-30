import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { ogLocales } from "@/lib/seo";
import { site } from "@/lib/site";
import "../globals.css";

// Huisletter van de huidige youcon.nu.
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: "%s | YouCon" },
    description: dict.meta.description,
    // Zonder titel en beschrijving: die neemt Next per pagina over. De
    // afbeelding komt uit `opengraph-image.tsx`; Twitter erft alles hiervan.
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${openSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
