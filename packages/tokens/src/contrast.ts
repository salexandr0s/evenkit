function linearChannel(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(color: string): number {
  if (!/^#[0-9a-f]{6}$/i.test(color)) {
    throw new Error("Contrast colors must use six-digit hexadecimal notation.");
  }
  return (
    0.2126 * linearChannel(Number.parseInt(color.slice(1, 3), 16)) +
    0.7152 * linearChannel(Number.parseInt(color.slice(3, 5), 16)) +
    0.0722 * linearChannel(Number.parseInt(color.slice(5, 7), 16))
  );
}

export function contrastRatio(foreground: string, background: string): number {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
