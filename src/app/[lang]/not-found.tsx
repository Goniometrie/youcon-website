import Link from "next/link";
import { Section } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function NotFound() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <Section>
      <h1 className="text-3xl font-bold">{dict.notFound.title}</h1>
      <p className="mt-2 text-muted-foreground">{dict.notFound.text}</p>
      <Link
        href={`/${locale}`}
        className="mt-6 inline-block font-semibold text-brand hover:underline"
      >
        {dict.notFound.back} →
      </Link>
    </Section>
  );
}
