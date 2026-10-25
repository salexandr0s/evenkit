import { describe, expect, it } from "vitest";
import { addDateDays, addDateMonths, dateRangeValidationMessage, dateValidationMessage, parseDateOnly, parseLocalTime, timeValidationMessage } from "./date-utils.js";
import { formatDateOnly, formatFileSize, formatNumber, formatTimestamp } from "./formatting.js";

describe("calendar dates and local times", () => {
  it("rejects impossible dates and keeps arithmetic independent of DST and the 1900 year shortcut", () => {
    expect(parseDateOnly("2024-02-29")).toBe("2024-02-29");
    expect(parseDateOnly("2026-02-29")).toBeNull();
    expect(parseDateOnly("2026-02-30")).toBeNull();
    expect(parseDateOnly("2026-2-01")).toBeNull();
    expect(parseDateOnly("0000-01-01")).toBeNull();
    expect(addDateDays("0099-12-31", 1)).toBe("0100-01-01");
    expect(addDateDays("2026-03-29", 1)).toBe("2026-03-30");
    expect(addDateDays("2026-10-25", -1)).toBe("2026-10-24");
    expect(addDateMonths("2024-01-31", 1)).toBe("2024-02-29");
    expect(addDateDays("9999-12-31", 1)).toBe("9999-12-31");
    expect(addDateDays("0001-01-01", -1)).toBe("0001-01-01");
  });
  it("checks inclusive ranges, bounds, incomplete choices and unavailable interior days", () => {
    expect(dateValidationMessage("2026-10-25", { min: "2026-10-25", max: "2026-10-25" })).toBeNull();
    expect(dateValidationMessage("2026-10-24", { min: "2026-10-25" })).toContain("later");
    expect(dateRangeValidationMessage({ start: "2026-10-25", end: null })).toContain("start and end");
    expect(dateRangeValidationMessage({ start: "2026-10-25", end: "2026-10-24" })).toContain("on or after");
    expect(dateRangeValidationMessage({ start: "2026-10-25", end: "2026-10-28" }, { isDateUnavailable: date => date === "2026-10-27" })).toContain("unavailable");
    expect(dateRangeValidationMessage({ start: "2026-10-25", end: "2026-10-25" })).toBeNull();
    expect(() => dateValidationMessage("2026-10-25", { min: "2026-10-26", max: "2026-10-24" })).toThrow("minimum date");
  });
  it("normalizes noon/midnight and checks steps relative to the minimum", () => {
    expect(parseLocalTime("12:00 AM", 12)).toBe("00:00");
    expect(parseLocalTime("12:00 PM", 12)).toBe("12:00");
    expect(parseLocalTime("9:30 pm", 12)).toBe("21:30");
    expect(parseLocalTime("00:30 AM", 12)).toBeNull();
    expect(parseLocalTime("24:00")).toBeNull();
    expect(timeValidationMessage("09:20", { min: "09:05", minuteStep: 15 })).toBeNull();
    expect(timeValidationMessage("09:15", { min: "09:05", minuteStep: 15 })).toContain("15-minute");
    expect(timeValidationMessage("18:00", { max: "17:00" })).toContain("earlier");
  });
});
describe("display formatting", () => {
  it("preserves calendar dates and requires an offset and display timezone for instants", () => {
    expect(formatDateOnly("2026-10-25", { locale: "en-GB", dateStyle: "long" })).toBe("25 October 2026");
    expect(formatTimestamp("2026-10-25T00:30:00Z", { locale: "en-GB", timeZone: "Europe/Vienna", timeStyle: "short" })).toBe("02:30");
    expect(formatTimestamp("2026-10-25T01:30:00Z", { locale: "en-GB", timeZone: "Europe/Vienna", timeStyle: "short" })).toBe("02:30");
    expect(formatTimestamp("2026-10-25T01:30:00Z", { locale: "en-GB", timeZone: "America/New_York", dateStyle: "long" })).toBe("24 October 2026");
    expect(() => formatTimestamp("2026-10-25T02:30:00", { timeZone: "Europe/Vienna" })).toThrow("offset");
    expect(() => formatTimestamp("2026-10-25T01:30:00Z", { timeZone: "" })).toThrow("timezone");
    expect(() => formatTimestamp("2026-02-30T12:00:00Z", { timeZone: "UTC" })).toThrow("Invalid timestamp");
  });
  it("formats numeric locales and labels decimal and binary file sizes accurately", () => {
    expect(formatNumber(1234.5, { locale: "de-DE" })).toBe("1.234,5");
    expect(formatFileSize(1000)).toBe("1 kB");
    expect(formatFileSize(1024, { base: 1024 })).toBe("1 KiB");
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(0.5)).toBe("1 B");
    expect(() => formatFileSize(-1)).toThrow(RangeError);
    expect(() => formatNumber(Infinity)).toThrow(RangeError);
  });
});
