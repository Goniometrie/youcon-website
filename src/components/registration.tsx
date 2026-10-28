import Link from "next/link";
import { Suspense } from "react";
import { cancelRegistration, register } from "@/app/[lang]/activiteiten/actions";
import { buttonClass } from "@/components/button";
import { RegistrationButton } from "@/components/registration-button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { today, type Activity } from "@/lib/activities";
import { getCurrentProfile } from "@/lib/auth";
import { getMyRegistrations, getRegistrationCounts } from "@/lib/registrations";
import { routes } from "@/lib/site";

const STYLES = {
  /** Grote knoppen, zoals bij de uitgelichte activiteit. */
  button: {
    primary: `${buttonClass("primary")} cursor-pointer disabled:cursor-wait disabled:opacity-70`,
    secondary: `${buttonClass("ghost")} cursor-pointer disabled:cursor-wait disabled:opacity-70`,
    status: "inline-flex min-h-12 items-center gap-2 rounded-md bg-teal-100/25 px-5 font-bold text-brand",
    full: `${buttonClass("ghost")} cursor-not-allowed text-muted-foreground`,
    hint: "self-center text-sm font-semibold text-muted-foreground",
    placeholder: null,
  },
  /** Tekstlinks, zoals onderaan een activiteitkaart. */
  link: {
    primary: "cursor-pointer text-sm font-bold text-brand hover:underline disabled:cursor-wait disabled:opacity-60",
    secondary:
      "cursor-pointer text-sm font-semibold text-muted-foreground hover:text-brand hover:underline disabled:cursor-wait",
    status: "text-sm font-bold text-teal-600",
    full: "text-sm font-bold text-muted-foreground",
    hint: "text-sm text-muted-foreground",
    placeholder: <span className="block h-5" />,
  },
};

type Props = {
  activity: Activity;
  locale: Locale;
  dict: Dictionary["activities"];
  /** Page to come back to after logging in. */
  returnTo: string;
  variant: keyof typeof STYLES;
};

/**
 * Inschrijven voor een activiteit: de externe link als die er is, anders via
 * de site. Of de activiteit al geweest is en wie er ingeschreven is, hangt af
 * van het verzoek en streamt in.
 */
export function Registration(props: Props) {
  const fallback =
    props.variant === "link" ? (
      STYLES.link.placeholder
    ) : props.activity.registrationUrl ? (
      <ExternalLink {...props} />
    ) : (
      <LoginLink {...props} />
    );

  return (
    <Suspense fallback={fallback}>
      <RegistrationStatus {...props} />
    </Suspense>
  );
}

async function RegistrationStatus(props: Props) {
  const { activity, locale, dict, returnTo, variant } = props;
  const [profile, mine, counts] = await Promise.all([
    getCurrentProfile(),
    getMyRegistrations(),
    getRegistrationCounts(),
  ]);
  const styles = STYLES[variant];
  const t = dict.registration;

  // After the session read, so reading the clock is allowed here.
  if (activity.date < today()) return styles.placeholder;
  if (activity.registrationUrl) return <ExternalLink {...props} />;

  if (mine.has(activity.id)) {
    return (
      <>
        <span className={styles.status}>
          <span aria-hidden="true">✓</span> {t.registered}
        </span>
        <RegistrationButton
          action={cancelRegistration.bind(null, activity.id)}
          label={t.cancel}
          pendingLabel={t.cancelling}
          confirm={{
            question: t.confirmCancel.replace("{title}", activity.title[locale]),
            yes: t.confirmYes,
            no: t.confirmNo,
          }}
          errors={t.errors}
          className={styles.secondary}
        />
      </>
    );
  }

  const spotsLeft =
    activity.capacity === undefined
      ? undefined
      : Math.max(0, activity.capacity - (counts[activity.id] ?? 0));
  if (spotsLeft === 0) {
    return (
      <span aria-disabled="true" className={styles.full}>
        {t.full}
      </span>
    );
  }

  return (
    <>
      {profile ? (
        <RegistrationButton
          action={register.bind(null, locale, activity.id, returnTo)}
          label={label(dict.register, variant)}
          pendingLabel={t.registering}
          errors={t.errors}
          className={styles.primary}
        />
      ) : (
        <LoginLink {...props} />
      )}
      {spotsLeft !== undefined && (
        <span className={styles.hint}>
          {spotsLeft === 1 ? t.spotLeft : t.spotsLeft.replace("{count}", String(spotsLeft))}
        </span>
      )}
    </>
  );
}

function ExternalLink({ activity, dict, variant }: Props) {
  return (
    <a href={activity.registrationUrl} className={STYLES[variant].primary}>
      {label(dict.register, variant)}
    </a>
  );
}

/** Not signed in: "Inschrijven" goes to the login page and back. */
function LoginLink({ locale, dict, returnTo, variant }: Props) {
  return (
    <Link
      href={`/${locale}${routes.login}?next=${encodeURIComponent(returnTo)}`}
      className={STYLES[variant].primary}
    >
      {label(dict.register, variant)}
    </Link>
  );
}

const label = (text: string, variant: Props["variant"]) =>
  variant === "link" ? `${text} →` : text;
