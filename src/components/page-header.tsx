import { Facets } from "@/components/facets";

export function PageHeader({
  title,
  intro,
  overlap = false,
}: {
  title: string;
  intro?: string;
  /** Extra ruimte onderaan voor een foto die half over de kop valt. */
  overlap?: boolean;
}) {
  return (
    <div className="edge-slant relative overflow-hidden bg-muted">
      <Facets
        cols={6}
        rows={3}
        greys
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-full opacity-20 fade-left md:w-1/2 md:opacity-80"
      />
      <div
        className={`relative mx-auto max-w-site px-4 pt-14 sm:px-6 ${overlap ? "pb-36 sm:pb-48" : "pb-20"}`}
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-teal-700 sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">{intro}</p>
        )}
      </div>
    </div>
  );
}

export function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-site px-4 py-12 sm:px-6">{children}</section>
  );
}

/** Sectietitel met een klein gevouwen driehoekje ervoor. */
export function SectionTitle({
  children,
  className = "text-2xl text-teal-700",
}: {
  children: React.ReactNode;
  /** Grootte en kleur van de kop. */
  className?: string;
}) {
  return (
    <h2 className={`flex items-center gap-3 font-extrabold tracking-tight ${className}`}>
      <svg viewBox="0 0 12 20" aria-hidden="true" className="h-5 w-3 shrink-0">
        <polygon points="0,0 12,0 12,20" fill="#87cfce" />
        <polygon points="0,0 12,20 0,20" fill="#447d8e" />
      </svg>
      {children}
    </h2>
  );
}
