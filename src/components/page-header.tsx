import { Facets } from "@/components/facets";

export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="edge-slant relative overflow-hidden bg-muted">
      <Facets
        cols={6}
        rows={3}
        greys
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-full opacity-20 fade-left md:w-1/2 md:opacity-80"
      />
      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6">
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
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">{children}</section>
  );
}

/** Sectietitel met een klein gevouwen driehoekje ervoor. */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-teal-700">
      <svg viewBox="0 0 12 20" aria-hidden="true" className="h-5 w-3 shrink-0">
        <polygon points="0,0 12,0 12,20" fill="#87cfce" />
        <polygon points="0,0 12,20 0,20" fill="#447d8e" />
      </svg>
      {children}
    </h2>
  );
}
