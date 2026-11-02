import { test, expect } from "@playwright/test";
import { properties, initialFilters, monthlyRent, salePerFoot, filterProperties, validateRanges, localDate } from "../components/listings";
test("source rent and sale arithmetic preserve annual and SF units", () => {
  expect(monthlyRent(12500, 52)).toBeCloseTo(54166.6667, 3);
  expect(monthlyRent(3200, 42)).toBe(11200);
  expect(salePerFoot(properties[2])).toBe(150);
  expect(monthlyRent(15000, 58)).toBe(72500);
});
test("combined filtering, range validation, and transaction-safe sorting", () => {
  const f = { ...initialFilters, transaction: "Lease", type: "Office", minSize: "10000", maxPrice: "55" };
  expect(filterProperties(f, [], "newest").map(p => p.id)).toEqual([1]);
  expect(filterProperties({ ...initialFilters, query: " Austin,  TX " }, [], "newest")).toHaveLength(12);
  expect(validateRanges({ ...initialFilters, minPrice: "15" })).toContain("Choose a transaction");
  expect(validateRanges({ ...f, minSize: "50000", maxSize: "100" })).toContain("minimum cannot exceed");
  expect(validateRanges({ ...initialFilters, minSize: "-1" })).toContain("non-negative");
  expect(validateRanges({ ...initialFilters, maxSize: "Infinity" })).toContain("non-negative");
  const sorted = filterProperties({ ...initialFilters, transaction: "Lease" }, [], "price-asc");
  expect(sorted[0].id).toBe(7);
  expect(sorted.at(-1)?.id).toBe(4);
});
test("custom map bounds, saved matches, and local future dates", () => {
  expect(filterProperties({ ...initialFilters, area: { left: 55, right: 100, top: 0, bottom: 75 } }, [], "newest").map(p => p.id)).toEqual([3, 4, 8]);
  expect(filterProperties({ ...initialFilters, savedOnly: true }, [2], "newest").map(p => p.id)).toEqual([2]);
  expect(localDate(1)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(localDate(90) > localDate(1)).toBe(true);
});
