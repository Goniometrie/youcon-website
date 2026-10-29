export const site = {
  name: "YouCon",
  email: "info@youcon.nu",
  linkedin: "https://www.linkedin.com/company/66207220/",
};

/** Route segments, shared by both locales (prefixed with `/{lang}`). */
export const routes = {
  home: "",
  association: "/vereniging",
  mission: "/missie",
  history: "/geschiedenis",
  board: "/bestuur",
  activities: "/activiteiten",
  join: "/lid-worden",
  partners: "/verenigingen",
  contact: "/contact",
  login: "/inloggen",
  /** Under `/inloggen`, so the proxy refreshes the session there too. */
  forgotPassword: "/inloggen/wachtwoord-vergeten",
  newPassword: "/inloggen/nieuw-wachtwoord",
  account: "/account",
  privacy: "/privacy",
  admin: "/admin",
  /** Append `/nieuw`, `/{id}` or `/{id}/aanmeldingen`. */
  adminActivities: "/admin/activiteiten",
} as const;

/**
 * Creating an account with email and password on `/lid-worden`. Off until our
 * own SMTP (Resend) sends the confirmation emails; see `docs/email-login.md`.
 */
export const emailSignUpEnabled = process.env.NEXT_PUBLIC_EMAIL_SIGNUP_ENABLED === "true";
