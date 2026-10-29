import type { Metadata } from "next";
import Link from "next/link";
import { BoardGroupPhoto, BoardMemberRow } from "@/components/board";
import { buttonClass } from "@/components/button";
import { PageHeader, SectionTitle } from "@/components/page-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { boardMembers, groupPhoto } from "@/lib/board";
import { alternates } from "@/lib/seo";
import { routes, site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).board.title, alternates: await alternates(routes.board) };
}

export default async function BoardPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.board;

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} overlap />
      <BoardGroupPhoto photo={groupPhoto} dict={t} />

      <section className="mx-auto max-w-site px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-24">
        <SectionTitle className="text-[28px] text-foreground">{t.membersTitle}</SectionTitle>
        <ol className="mt-10 divide-y divide-divider sm:mt-14">
          {boardMembers.map((member, index) => (
            <BoardMemberRow key={member.id} member={member} index={index} dict={t} />
          ))}
        </ol>
      </section>

      <section className="bg-muted">
        <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-8 px-4 py-14 sm:px-6">
          <div className="min-w-0 flex-[1_1_420px]">
            <h2 className="text-[28px] leading-tight font-extrabold tracking-tight text-teal-700">
              {t.contactTitle}
            </h2>
            <p className="mt-2 max-w-[560px] text-lg leading-[1.65] text-body">
              {t.contactText}
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <a href={`mailto:${site.email}`} className={buttonClass("primary")}>
              {site.email}
            </a>
            <Link href={`/${locale}${routes.join}`} className={buttonClass("outline")}>
              {dict.nav.join}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
