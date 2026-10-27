export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="border-b border-border bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {intro && (
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{intro}</p>
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
