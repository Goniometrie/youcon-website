import Link from "next/link";

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 font-bold transition-colors";

const VARIANTS = {
  primary: "bg-brand text-brand-foreground hover:bg-brand-hover",
  ghost: "border-2 border-input bg-white text-brand hover:border-brand",
  outline: "border-2 border-brand bg-white text-brand hover:bg-brand hover:text-brand-foreground",
};

/** Klassen voor een gewone knop of knop-link (48px hoog, licht afgerond). */
export function buttonClass(variant: keyof typeof VARIANTS = "primary") {
  return `${BASE} ${VARIANTS[variant]}`;
}

/**
 * Parallellogramknop met links en rechts twee gevouwen driehoeken die bij
 * hover en focus gestaffeld van kleur wisselen. Voor de hoofd-CTA "Word lid".
 */
export function FacetButton({
  href,
  children,
  className = "inline-flex",
}: {
  href: string;
  children: React.ReactNode;
  /** Ook de `display`, zodat de knop per breakpoint te verbergen is. */
  className?: string;
}) {
  const facet = "absolute top-0 h-full w-[26px] transition-colors duration-300";
  return (
    <Link
      href={href}
      className={`group clip-slant relative min-h-11 items-center bg-brand px-10 text-sm font-bold whitespace-nowrap text-white [--slant:13px] hover:text-white focus-visible:shadow-[inset_0_0_0_3px_var(--color-teal-100)] focus-visible:outline-none ${className}`}
    >
      <span
        aria-hidden="true"
        className={`${facet} clip-tri-up left-0 bg-teal-100 group-hover:bg-teal-400 group-focus-visible:bg-teal-400`}
      />
      <span
        aria-hidden="true"
        className={`${facet} left-0 bg-teal-500 [clip-path:polygon(50%_0,100%_0,100%_100%)] delay-70 group-hover:bg-teal-100 group-focus-visible:bg-teal-100`}
      />
      <span className="relative">{children}</span>
      <span
        aria-hidden="true"
        className={`${facet} right-0 bg-teal-500 [clip-path:polygon(0_0,50%_100%,0_100%)] delay-140 group-hover:bg-teal-100 group-focus-visible:bg-teal-100`}
      />
      <span
        aria-hidden="true"
        className={`${facet} clip-tri-down right-0 bg-teal-100 delay-210 group-hover:bg-white group-focus-visible:bg-white`}
      />
    </Link>
  );
}
