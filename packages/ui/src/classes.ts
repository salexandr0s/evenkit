export function classes(...values: (string | undefined | false)[]): string {
  return values.filter(Boolean).join(" ");
}
