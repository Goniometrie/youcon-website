// Formuliervelden voor inloggen en beheer: label, hint en foutmelding bij
// elkaar, met de foutmelding gekoppeld via aria-describedby.

export const inputClass =
  "block w-full rounded-md border border-input bg-white px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-brand focus:ring-2 focus:ring-teal-100 focus:outline-none aria-invalid:border-danger";

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Props die een input aan zijn hint of foutmelding koppelen. */
export function describedBy(id: string, error?: string, hint?: string) {
  return {
    id,
    name: id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}
