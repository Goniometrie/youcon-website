"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navigatielink die zichzelf markeert (`aria-current`) op de huidige pagina of
 * een subpagina. In het mobiele menu klapt een klik het menu weer dicht.
 */
export function NavLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const current = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
      className={className}
    >
      {children}
    </Link>
  );
}
