export const site = {
  name: "YouCon",
  email: "info@youcon.nu",
  linkedin: "https://www.linkedin.com/company/66207220/",
};

/** Route segments, shared by both locales (prefixed with `/{lang}`). */
export const routes = {
  home: "",
  association: "/vereniging",
  activities: "/activiteiten",
  join: "/lid-worden",
  partners: "/verenigingen",
  contact: "/contact",
  login: "/inloggen",
  admin: "/admin",
  /** Append `/nieuw` or `/{id}`. */
  adminActivities: "/admin/activiteiten",
} as const;
