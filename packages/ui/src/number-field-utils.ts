export interface NumberConstraints {
  min?: number;
  max?: number;
  step?: number;
  maximumFractionDigits?: number;
}
export type ParsedNumber = { status: "empty" } | { status: "incomplete" } | { status: "invalid"; message: string } | { status: "valid"; value: number };

const localeCache = new Map<string, ReturnType<typeof createLocaleParts>>();
function createLocaleParts(locale: string) {
  const formatter = new Intl.NumberFormat(locale);
  const parts = formatter.formatToParts(-1234567.89);
  const digits = Array.from({ length: 10 }, (_, index) => new Intl.NumberFormat(locale, { useGrouping: false }).format(index));
  return { formatter, digits, decimal: parts.find(part => part.type === "decimal")?.value ?? ".", group: parts.find(part => part.type === "group")?.value, minus: parts.find(part => part.type === "minusSign")?.value ?? "-" };
}

function localeParts(locale: string) {
  const cached = localeCache.get(locale);
  if (cached) return cached;
  const result = createLocaleParts(locale);
  if (localeCache.size >= 20) localeCache.clear();
  localeCache.set(locale, result);
  return result;
}

function decimalText(value: number): string {
  const raw = String(value);
  if (!/[eE]/.test(raw)) return raw;
  const [coefficient = "0", exponentText = "0"] = raw.toLowerCase().split("e");
  const sign = coefficient.startsWith("-") ? "-" : "";
  const unsigned = coefficient.replace("-", "");
  const [integer = "0", fraction = ""] = unsigned.split(".");
  const digits = integer + fraction;
  const point = integer.length + Number(exponentText);
  return sign + (point <= 0 ? `0.${"0".repeat(-point)}${digits}` : point >= digits.length ? digits + "0".repeat(point - digits.length) : `${digits.slice(0, point)}.${digits.slice(point)}`);
}
function decimalPlaces(value: number) { return decimalText(value).split(".")[1]?.length ?? 0; }
function scaled(value: number, precision: number): bigint {
  const text = decimalText(value);
  const [integer = "0", fraction = ""] = text.replace("-", "").split(".");
  return BigInt(integer + fraction.padEnd(precision, "0")) * (text.startsWith("-") ? -1n : 1n);
}

export function validateNumber(value: number, { min, max, step, maximumFractionDigits = 6 }: NumberConstraints = {}): string | undefined {
  assertNumberConstraints({ ...(min !== undefined ? { min } : {}), ...(max !== undefined ? { max } : {}), ...(step !== undefined ? { step } : {}), maximumFractionDigits });
  if (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) return "Enter a finite number within the safe numeric range.";
  if (min !== undefined && value < min) return `Enter ${min} or more.`;
  if (max !== undefined && value > max) return `Enter ${max} or less.`;
  if (decimalPlaces(value) > maximumFractionDigits) return `Use up to ${maximumFractionDigits} decimal places.`;
  if (step !== undefined) {
    const precision = Math.max(decimalPlaces(value), decimalPlaces(step), decimalPlaces(min ?? 0));
    if ((scaled(value, precision) - scaled(min ?? 0, precision)) % scaled(step, precision) !== 0n) return `Use increments of ${step} from ${min ?? 0}.`;
  }
  return undefined;
}

export function parseLocaleNumber(text: string, locale = "en-US", constraints: NumberConstraints = {}): ParsedNumber {
  assertNumberConstraints(constraints);
  const symbols = localeParts(locale);
  let input = text.trim().replace(/[\u061c\u200e\u200f]/g, "");
  if (!input) return { status: "empty" };
  symbols.digits.forEach((digit, index) => { input = input.split(digit).join(String(index)); });
  input = input.split(symbols.minus).join("-").replace(/−/g, "-");
  if (["-", "+", symbols.decimal, `-${symbols.decimal}`, `+${symbols.decimal}`].includes(input)) return { status: "incomplete" };
  const [integer = "", fraction, ...extra] = input.split(symbols.decimal);
  if (extra.length) return { status: "invalid", message: "Enter one decimal separator." };
  const group = symbols.group;
  let integerDigits = integer;
  if (group && integer.includes(group)) {
    integerDigits = integer.split(group).join("");
    if (!/^[+-]?\d+$/.test(integerDigits)) return { status: "invalid", message: "Enter a number using this locale's separators." };
    const expected = symbols.formatter.formatToParts(Number(integerDigits)).filter(part => part.type === "integer" || part.type === "group").map(part => part.value).join("");
    let normalizedExpected = expected;
    symbols.digits.forEach((digit, index) => { normalizedExpected = normalizedExpected.split(digit).join(String(index)); });
    if (integer.replace(/^[+-]/, "") !== normalizedExpected) return { status: "invalid", message: "Check the grouping separators." };
  }
  if (!/^[+-]?\d*$/.test(integerDigits) || (fraction !== undefined && !/^\d*$/.test(fraction))) return { status: "invalid", message: "Enter a number using this locale's separators." };
  if (fraction === "") return { status: "incomplete" };
  const value = Number(integerDigits + (fraction !== undefined ? `.${fraction}` : ""));
  const normalizedInteger = integerDigits.replace(/^[+-]/, "").replace(/^0+/, "") || "0";
  const normalizedFraction = fraction?.replace(/0+$/, "") ?? "";
  const normalized = (integerDigits.startsWith("-") && value !== 0 ? "-" : "") + normalizedInteger + (normalizedFraction ? `.${normalizedFraction}` : "");
  if (Number.isFinite(value) && normalized !== decimalText(value)) return { status: "invalid", message: "Enter a value that can be represented without losing digits." };
  const error = validateNumber(value, constraints);
  return error ? { status: "invalid", message: error } : { status: "valid", value: Object.is(value, -0) ? 0 : value };
}

/** Decimal integer arithmetic avoids accumulated binary error such as 0.1 + 0.2. */
export function stepNumber(value: number | null, direction: -1 | 1, constraints: NumberConstraints = {}): number {
  assertNumberConstraints(constraints);
  const { min, max, step = 1 } = constraints;
  const base = min ?? 0;
  if (value === null) return Math.max(min ?? -Number.MAX_SAFE_INTEGER, Math.min(max ?? Number.MAX_SAFE_INTEGER, base));
  if (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) throw new RangeError("Value must be a finite safe number.");
  const precision = Math.max(decimalPlaces(value ?? base), decimalPlaces(base), decimalPlaces(step));
  const unit = scaled(step, precision);
  const origin = scaled(base, precision);
  const current = scaled(value ?? base, precision);
  const offset = current - origin;
  let index = offset / unit;
  if (offset % unit !== 0n) {
    if (direction > 0 && offset < 0n) index -= 1n;
    if (direction < 0 && offset > 0n) index += 1n;
  }
  const nextScaled = origin + (index + BigInt(direction)) * unit;
  const sign = nextScaled < 0n ? "-" : "";
  const digits = (nextScaled < 0n ? -nextScaled : nextScaled).toString().padStart(precision + 1, "0");
  const next = Number(sign + (precision ? `${digits.slice(0, -precision)}.${digits.slice(-precision)}` : digits));
  if (max !== undefined && next > max) return validateNumber(max, constraints) === undefined ? max : stepNumber(max, -1, constraints);
  return Math.max(min ?? -Number.MAX_SAFE_INTEGER, Math.min(Number.MAX_SAFE_INTEGER, next));
}

export function assertNumberConstraints({ min, max, step, maximumFractionDigits = 6 }: NumberConstraints) {
  if (!Number.isInteger(maximumFractionDigits) || maximumFractionDigits < 0 || maximumFractionDigits > 15) throw new RangeError("maximumFractionDigits must be an integer from 0 to 15.");
  if ([min, max, step].some(value => value !== undefined && (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER))) throw new RangeError("Numeric constraints must be finite safe numbers.");
  if (min !== undefined && max !== undefined && min > max) throw new RangeError("min must not exceed max.");
  if (step !== undefined && min !== undefined && decimalPlaces(min) > maximumFractionDigits) throw new RangeError("The step origin must fit maximumFractionDigits.");
  if (step !== undefined && (step <= 0 || decimalPlaces(step) > maximumFractionDigits)) throw new RangeError("step must be positive and fit maximumFractionDigits.");
}
