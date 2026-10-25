const localOrigin = "https://evenkit.invalid";

/** Return an absolute local path. Reject ambiguous encoding before URL normalization. */
export function safeReturnPath(value: unknown, fallback = "/dashboard"): string {
  const safeFallback = isLocalPath(fallback) ? normalize(fallback) : "/dashboard";
  return typeof value === "string" && isLocalPath(value) ? normalize(value) : safeFallback;
}

function isLocalPath(value: string): boolean {
  if (!value.startsWith("/") || value.startsWith("//") || (value.includes("\\") || [...value].some(character => character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127))) return false;
  const pathname = value.split(/[?#]/, 1)[0] ?? "";
  if (/%(?:2f|5c|25|0[0-9a-f]|1[0-9a-f]|7f)/i.test(pathname)) return false;
  try {
    decodeURIComponent(value);
    const parsed = new URL(value, localOrigin);
    return parsed.origin === localOrigin && !parsed.pathname.startsWith("//") && !parsed.username && !parsed.password;
  } catch { return false; }
}

function normalize(value: string): string {
  const url = new URL(value, localOrigin);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function authReturnUrl(route: string, returnTo: unknown): string {
  return `${safeReturnPath(route, "/login")}?returnTo=${encodeURIComponent(safeReturnPath(returnTo))}`;
}
