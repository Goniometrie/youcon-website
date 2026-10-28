"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LOGO_VIEWBOX, logoFacets, type LogoFacet } from "@/lib/logo-facets";

const FOLD_CLASS: Record<LogoFacet["fold"], string> = {
  bottom: "fold-b",
  left: "fold-l",
  right: "fold-r",
};

/**
 * Het YouCon-logo als losse driehoeken die zich bij het laden één voor één
 * opvouwen. Bij hover vouwt het opnieuw, maar niet zolang het nog loopt.
 */
export function OrigamiLogo({ href, label }: { href: string; label: string }) {
  const [playing, setPlaying] = useState(true);
  const svg = useRef<SVGSVGElement>(null);
  const timer = useRef<number>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function replay() {
    const running = svg.current
      ?.getAnimations({ subtree: true })
      .some((animation) => animation.playState === "running");
    if (!playing || running) return;
    // Kort zonder `play`, zodat de animatie daarna opnieuw begint.
    setPlaying(false);
    timer.current = window.setTimeout(() => setPlaying(true), 60);
  }

  return (
    <Link href={href} aria-label={label} onMouseEnter={replay} className="flex shrink-0">
      <svg
        ref={svg}
        viewBox={LOGO_VIEWBOX}
        aria-hidden="true"
        className={`${playing ? "fold play" : "fold"} block aspect-[328/83] h-9 w-auto overflow-visible drop-shadow-[0_6px_8px_rgba(23,50,61,0.12)] sm:h-14`}
      >
        {logoFacets.map((facet) => (
          <polygon
            key={facet.points}
            points={facet.points}
            fill={facet.fill}
            className={FOLD_CLASS[facet.fold]}
            style={{ animationDelay: `${facet.delay}s` }}
          />
        ))}
      </svg>
    </Link>
  );
}
