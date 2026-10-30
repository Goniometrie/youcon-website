"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { buttonClass } from "@/components/button";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  activeCategories,
  allChoices,
  deleteCookies,
  gaMeasurementId,
  getConsentSnapshot,
  getServerConsentSnapshot,
  noChoices,
  onOpenCookieSettings,
  openCookieSettings,
  parseConsent,
  saveConsent,
  subscribeConsent,
  type ConsentChoices,
} from "@/lib/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

/**
 * Cookiebanner met toestemming vooraf, plus de diensten die erop wachten
 * (nu alleen GA4). Verschijnt pas na hydratie, want de keuze staat in een
 * cookie die we alleen in de browser lezen. Zonder optionele diensten is er
 * niets om toestemming voor te vragen en blijft de banner weg.
 */
export function CookieConsent({
  t,
  privacyHref,
}: {
  t: Dictionary["cookies"];
  privacyHref: string;
}) {
  const raw = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsentSnapshot);
  // `undefined`: nog onbekend (server, hydratie); `null`: nog geen keuze.
  const consent = raw === null ? undefined : parseConsent(raw);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(noChoices);
  const returnFocus = useRef<HTMLElement | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const id = useId();

  useEffect(
    () =>
      onOpenCookieSettings(() => {
        returnFocus.current = document.activeElement as HTMLElement | null;
        setDraft(parseConsent(getConsentSnapshot())?.choices ?? noChoices);
        setEditing(true);
      }),
    [],
  );

  // Vanuit de footer geopend: focus naar de banner.
  useEffect(() => {
    if (editing && returnFocus.current) heading.current?.focus();
  }, [editing]);

  function close() {
    setEditing(false);
    returnFocus.current?.focus();
    returnFocus.current = null;
  }

  function choose(choices: ConsentChoices) {
    saveConsent(choices);
    close();
  }

  const visible = activeCategories.length > 0 && consent !== undefined && (consent === null || editing);

  return (
    <>
      {gaMeasurementId && (
        <GoogleAnalytics
          id={gaMeasurementId}
          granted={consent === undefined ? undefined : consent?.choices.analytics === true}
        />
      )}
      {visible && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6">
          <div
            role="dialog"
            aria-modal="false"
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-text`}
            onKeyDown={(event) => {
              if (event.key === "Escape" && consent) close();
            }}
            className="pointer-events-auto relative mx-auto max-h-[calc(100dvh-2rem)] max-w-site overflow-y-auto rounded-lg border border-border bg-white p-5 shadow-[0_8px_40px_rgb(23_50_61/0.18)] sm:p-7"
          >
            {/* Gevouwen hoekje rechtsboven */}
            <svg viewBox="0 0 40 40" aria-hidden="true" className="absolute top-0 right-0 size-10">
              <polygon points="0,0 40,0 40,40" fill="#87cfce" />
              <polygon points="20,0 40,0 40,20" fill="#56929d" />
            </svg>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <div className="max-w-2xl flex-1 pr-8">
                <h2
                  id={`${id}-title`}
                  ref={heading}
                  tabIndex={-1}
                  className="flex items-center gap-3 text-lg font-extrabold tracking-tight text-teal-700 focus:outline-none"
                >
                  <svg viewBox="0 0 12 20" aria-hidden="true" className="h-5 w-3 shrink-0">
                    <polygon points="0,0 12,0 12,20" fill="#87cfce" />
                    <polygon points="0,0 12,20 0,20" fill="#447d8e" />
                  </svg>
                  {t.title}
                </h2>
                <p id={`${id}-text`} className="mt-2 text-sm text-body">
                  {t.text}{" "}
                  <Link href={privacyHref} className="font-semibold text-brand underline hover:text-brand-hover">
                    {t.privacyLink}
                  </Link>
                </p>
              </div>

              {!editing && (
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => choose(allChoices)} className={buttonClass()}>
                    {t.acceptAll}
                  </button>
                  <button type="button" onClick={() => choose(noChoices)} className={buttonClass()}>
                    {t.rejectAll}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(noChoices);
                      setEditing(true);
                    }}
                    className={buttonClass("ghost")}
                  >
                    {t.customize}
                  </button>
                </div>
              )}
            </div>

            {editing && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  choose(draft);
                }}
              >
                <fieldset className="mt-5 divide-y divide-divider border-y border-divider">
                  <legend className="sr-only">{t.categoriesLabel}</legend>
                  <Category title={t.necessary.title} text={t.necessary.text} note={t.alwaysOn} checked disabled />
                  {activeCategories.map((category) => (
                    <Category
                      key={category}
                      title={t[category].title}
                      text={t[category].text}
                      checked={draft[category]}
                      onChange={(checked) => setDraft({ ...draft, [category]: checked })}
                    />
                  ))}
                </fieldset>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button type="button" onClick={() => choose(allChoices)} className={buttonClass()}>
                    {t.acceptAll}
                  </button>
                  <button type="button" onClick={() => choose(noChoices)} className={buttonClass()}>
                    {t.rejectAll}
                  </button>
                  <button type="submit" className={buttonClass("outline")}>
                    {t.save}
                  </button>
                  {consent && (
                    <button type="button" onClick={close} className={buttonClass("ghost")}>
                      {t.close}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/** Eén categorie met uitleg en rechts een vinkje (met eventueel "Altijd aan"). */
function Category({
  title,
  text,
  note,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  text: string;
  note?: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <label className={`flex items-start justify-between gap-6 py-4 ${disabled ? "" : "cursor-pointer"}`}>
      <span>
        <span id={`${id}-title`} className="block font-bold text-teal-700">
          {title}
        </span>
        <span id={`${id}-text`} className="mt-1 block text-sm text-body">
          {text}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-center gap-1 pt-0.5">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-text`}
          className="size-5 accent-brand enabled:cursor-pointer"
        />
        {note && <span className="text-xs font-semibold text-muted-foreground">{note}</span>}
      </span>
    </label>
  );
}

/**
 * GA4 met Consent Mode v2, alleen geladen na toestemming. Na intrekken zetten
 * we GA uit (`ga-disable-…`) en verwijderen we de `_ga`-cookies; een script
 * dat al geladen is, blijft tot de volgende paginalading in het geheugen.
 */
function GoogleAnalytics({ id, granted }: { id: string; granted: boolean | undefined }) {
  useEffect(() => {
    if (granted === undefined) return;
    window[`ga-disable-${id}`] = !granted;
    window.gtag?.("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
    if (!granted) deleteCookies((name) => name === "_ga" || name.startsWith("_ga_"));
  }, [id, granted]);

  if (!granted) return null;
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
gtag('consent','update',{analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${id}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
    </>
  );
}

/** Link in de footer om de keuze te wijzigen of in te trekken. */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className="cursor-pointer underline hover:text-teal-100">
      {label}
    </button>
  );
}
