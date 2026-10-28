"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * Verzendknop die eerst in de pagina zelf om bevestiging vraagt. Geen
 * `window.confirm()`: sommige browsers (zoals ingebouwde webviews) blokkeren
 * dat en geven dan stilletjes "nee" terug. Moet binnen een `<form>` staan.
 */
export function ConfirmSubmit({
  label,
  pendingLabel,
  question,
  yes,
  no,
  className,
  questionClassName = "basis-full text-sm font-semibold",
  noClassName = "cursor-pointer text-sm font-semibold text-muted-foreground hover:text-brand hover:underline",
}: {
  label: string;
  pendingLabel: string;
  question: string;
  yes: string;
  no: string;
  /** For the first button and the "yes" button. */
  className: string;
  questionClassName?: string;
  noClassName?: string;
}) {
  const [asking, setAsking] = useState(false);
  const { pending } = useFormStatus();
  const yesRef = useRef<HTMLButtonElement>(null);

  // Keyboard users land on the question's answer, not back at the top.
  useEffect(() => {
    if (asking) yesRef.current?.focus();
  }, [asking]);

  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} className={className}>
        {label}
      </button>
    );
  }

  return (
    <>
      <span className={questionClassName}>{question}</span>
      <button ref={yesRef} type="submit" disabled={pending} className={className}>
        {pending ? pendingLabel : yes}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setAsking(false)}
        className={noClassName}
      >
        {no}
      </button>
    </>
  );
}
