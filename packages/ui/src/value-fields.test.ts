import { describe, expect, it } from "vitest";
import { appendTokens } from "./multi-value-utils.js";
import { parseLocaleNumber, stepNumber, validateNumber } from "./number-field-utils.js";

describe("token admission", () => {
  it("preserves accepted spelling and rejects duplicates, invalid values and overflow without losing valid pasted tokens", () => {
    const result = appendTokens(["Planning"], [" planning ", "Review", "bad!", "Release", "Overflow"], { maxTokens: 3, validate: text => text.includes("!") ? "No punctuation." : undefined });
    expect(result.values).toEqual(["Planning", "Review", "Release"]);
    expect(result.issues.map(issue => issue.reason)).toEqual(["duplicate", "invalid", "limit"]);
    expect(appendTokens(["Tag"], ["tag"], { caseSensitive: true }).values).toEqual(["Tag", "tag"]);
  });
});
describe("locale number contract", () => {
  it("parses locale separators and localized digits without guessing ambiguous foreign formats", () => {
    expect(parseLocaleNumber("1.234,50", "de-DE")).toEqual({ status: "valid", value: 1234.5 });
    expect(parseLocaleNumber(new Intl.NumberFormat("de-AT").format(1234.5), "de-AT")).toEqual({ status: "valid", value: 1234.5 });
    expect(parseLocaleNumber("1,234.50", "en-US")).toEqual({ status: "valid", value: 1234.5 });
    expect(parseLocaleNumber("١٬٢٣٤٫٥", "ar-EG")).toEqual({ status: "valid", value: 1234.5 });
    expect(parseLocaleNumber("12,34,567.5", "en-IN")).toEqual({ status: "valid", value: 1234567.5 });
    expect(parseLocaleNumber("1,2", "en-US").status).toBe("invalid");
    expect(parseLocaleNumber("1.234,50", "en-US").status).toBe("invalid");
    expect(parseLocaleNumber("1e3", "en-US").status).toBe("invalid");
  });
  it("distinguishes empty and incomplete drafts and enforces bounds, precision and decimal step alignment", () => {
    expect(parseLocaleNumber(" ").status).toBe("empty");
    expect(parseLocaleNumber("-").status).toBe("incomplete");
    expect(parseLocaleNumber("12,", "de-AT").status).toBe("incomplete");
    expect(parseLocaleNumber("1.25", "en-US", { step: 0.1 }).status).toBe("invalid");
    expect(parseLocaleNumber("1.25", "en-US", { maximumFractionDigits: 1 }).status).toBe("invalid");
    expect(parseLocaleNumber("11", "en-US", { max: 10 }).status).toBe("invalid");
    expect(validateNumber(0.3, { step: 0.1 })).toBeUndefined();
    expect(validateNumber(0.3, { min: 0.05, step: 0.1 })).toBeDefined();
    expect(validateNumber(Infinity)).toBeDefined();
    expect(parseLocaleNumber("9007199254740991.1").status).toBe("invalid");
    expect(parseLocaleNumber("0001.2300")).toEqual({ status: "valid", value: 1.23 });
    expect(() => parseLocaleNumber("1", "en-US", { step: 0 })).toThrow(RangeError);
  });
  it("steps decimal values without accumulating float error and snaps drafts to the requested grid", () => {
    let value = 0;
    for (let index = 0; index < 10; index++) value = stepNumber(value, 1, { step: 0.1 });
    expect(value).toBe(1);
    expect(stepNumber(0.25, 1, { step: 0.1 })).toBe(0.3);
    expect(stepNumber(-0.25, -1, { step: 0.1 })).toBe(-0.3);
    expect(stepNumber(0.3, 1, { step: 0.1, max: 0.35 })).toBe(0.3);
    expect(stepNumber(null, 1, { min: 5 })).toBe(5);
    expect(stepNumber(125, -1, { min: 0, max: 100 })).toBe(100);
    expect(stepNumber(0.0000001, 1, { step: 0.0000001, maximumFractionDigits: 7 })).toBe(0.0000002);
  });
});
