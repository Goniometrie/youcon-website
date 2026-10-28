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
  board: "/bestuur",
  activities: "/activiteiten",
  join: "/lid-worden",
  partners: "/verenigingen",
  contact: "/contact",
  login: "/inloggen",
  account: "/account",
  admin: "/admin",
  /** Append `/nieuw`, `/{id}` or `/{id}/aanmeldingen`. */
  adminActivities: "/admin/activiteiten",
} as const;
