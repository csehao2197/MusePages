import { test, expect } from "@playwright/test";
import { quote, dateToUTC } from "../components/data";

const guests = { adults: 2, children: 0, infants: 0, pets: 0 };
test("seven-night direct price uses exact IVA rather than the rounded brief", () => {
  expect(quote("2026-11-10", "2026-11-17", guests)).toEqual({
    error: "", nights: 7, lodging: 2723, cleaning: 150, pets: 0, tax: 459.68, total: 3332.68,
  });
});
test("pet surcharge is per night and taxable", () => {
  expect(quote("2026-11-10", "2026-11-17", { ...guests, pets: 1 })).toEqual({
    error: "", nights: 7, lodging: 2723, cleaning: 150, pets: 350, tax: 515.68, total: 3738.68,
  });
});
test("minimum, reversed, same-day and extended stays are rejected", () => {
  expect(quote("2026-11-10", "2026-11-12", guests).error).toContain("3-night");
  expect(quote("2026-11-10", "2026-11-09", guests).error).toContain("after");
  expect(quote("2026-11-10", "2026-11-10", guests).error).toContain("after");
  expect(quote("2027-01-01", "2027-01-30", guests).error).toContain("longer than 28");
});
test("every occupied night is checked; a blocked checkout night is not occupied", () => {
  expect(quote("2026-11-03", "2026-11-10", guests).error).toContain("unavailable");
  expect(quote("2026-11-01", "2026-11-05", guests).error).toBe("");
});
test("missing, malformed, past and beyond-horizon dates are rejected", () => {
  expect(quote("", "", guests).error).toContain("both");
  expect(quote("2026-02-30", "2026-11-10", guests).error).toContain("valid");
  expect(quote("2026-10-30", "2026-11-03", guests).error).toContain("on or after");
  expect(quote("2027-04-28", "2027-05-01", guests).error).toContain("ends April");
  expect(dateToUTC("not-a-date")).toBeNaN();
});
test("infants count toward capacity; adults, pets and numeric counts are validated", () => {
  expect(quote("2026-11-10", "2026-11-17", { adults: 2, children: 3, infants: 1, pets: 1 }).error).toBe("");
  for (const invalid of [
    { adults: 2, children: 4, infants: 1, pets: 0 },
    { adults: 0, children: 1, infants: 0, pets: 0 },
    { adults: 1, children: 0, infants: 0, pets: 2 },
    { adults: 1.5, children: 0, infants: 0, pets: 0 },
    { adults: 2, children: -1, infants: 0, pets: 0 },
  ]) expect(quote("2026-11-10", "2026-11-17", invalid).error).toContain("maximum 6");
});
test("UTC night math remains correct across month and daylight-saving boundaries", () => {
  const result = quote("2026-10-31", "2026-11-04", guests);
  expect(result.error).toBe("");
  expect(result.nights).toBe(4);
  expect(result.total).toBe(1978.96);
});
