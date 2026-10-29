/** Melding boven een formulier: gelukt, mislukt of ter info. */
export function Notice({
  tone,
  children,
}: {
  tone: "success" | "error" | "info";
  children: React.ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-md px-4 py-3 text-sm font-semibold ${
        tone === "error"
          ? "bg-danger-muted text-danger"
          : tone === "info"
            ? "border border-teal-700/30 text-teal-700"
            : "bg-teal-100/25 text-teal-700"
      }`}
    >
      {children}
    </p>
  );
}
