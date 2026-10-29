/** `?next=` only when it points at a page on this site, else undefined. */
export function safeNext(next: unknown) {
  return typeof next === "string" && /^\/(nl|en)([/?#]|$)/.test(next) ? next : undefined;
}
