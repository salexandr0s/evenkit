function safeUrl(value: string | undefined, attachment: boolean): string | undefined {
  if (!value) return undefined;
  const url = value.trim();
  // Browsers strip some controls and normalize backslashes before navigation.
  const hasControl = [...url].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
  if (!url || hasControl || url.includes("\\") || url.startsWith("//")) return undefined;
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(url)?.[1]?.toLowerCase();
  if (scheme && !["http", "https", ...(attachment ? ["blob"] : ["mailto"])].includes(scheme)) return undefined;
  if ((scheme === "http" || scheme === "https") && !/^https?:\/\//i.test(url)) return undefined;
  if (scheme === "blob" && !/^blob:(?:https?:\/\/|null\/)/i.test(url)) return undefined;
  try {
    const parsed = new URL(url, "https://evenkit.invalid/");
    if (!["http:", "https:", ...(attachment ? ["blob:"] : ["mailto:"])].includes(parsed.protocol)) return undefined;
    return url;
  } catch { return undefined; }
}

/** Navigation URLs for Markdown and citations. Protocol-relative URLs are rejected. */
export function safeChatUrl(value: string | undefined): string | undefined {
  return safeUrl(value, false);
}

/** App-supplied attachment URLs may also reference local object URLs. */
export function safeChatAttachmentUrl(value: string | undefined): string | undefined {
  return safeUrl(value, true);
}
