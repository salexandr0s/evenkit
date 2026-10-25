/** MIME types rendered by FilePreview. Plain text is supplied by the application. */
export const mediaPreviewTypes = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif", "text/plain"] as const;

export function mediaPreviewKind(mimeType: string): "image" | "text" | "unsupported" {
  const type = mimeType.split(";", 1)[0]?.trim().toLowerCase();
  if (type === "text/plain") return "text";
  return mediaPreviewTypes.some(supported => supported !== "text/plain" && supported === type) ? "image" : "unsupported";
}

/** A URL policy for UI links, not authorization or server-side content validation. */
export function mediaHref(href: string | undefined): string | undefined {
  if (!href || href !== href.trim() || href.startsWith("//")) return undefined;
  if (Array.from(href).some(character => character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127 || character === "\\")) return undefined;
  try {
    const url = new URL(href, "https://evenkit.invalid/");
    if (url.protocol === "http:" || url.protocol === "https:") return href;
    if (url.protocol === "blob:" && /^blob:https?:\/\//u.test(href)) return href;
  } catch { /* Malformed URLs have no action. */ }
  return undefined;
}
