export type PropertyType = "house" | "condo" | "townhome";
export type Property = {
  id: string; address: string; type: PropertyType;
  bedrooms: number; bathrooms: number; sqft: number; lot: number; year: number; garage: number;
};
export type Details = Omit<Property, "id" | "address"> & { condition: "standard" | "updated" | "needs-work" };
export const properties: Property[] = [
  { id: "evergreen", address: "742 Evergreen Terrace, Demo Springfield", type: "house", bedrooms: 4, bathrooms: 2.5, sqft: 2100, lot: .28, year: 1998, garage: 2 },
  { id: "oak", address: "801 Oak Avenue, Demo Springfield", type: "townhome", bedrooms: 3, bathrooms: 2, sqft: 1650, lot: .08, year: 2008, garage: 1 },
  { id: "maple", address: "655 Maple Drive #2, Demo Riverside", type: "condo", bedrooms: 2, bathrooms: 1.5, sqft: 1050, lot: 0, year: 2015, garage: 1 },
];
export type Comparable = { address: string; price: number; date: string };
export const comparables: Comparable[] = [
  { address: "738 Evergreen Terrace", price: 498000, date: "Jan 2026" },
  { address: "801 Oak Avenue", price: 512000, date: "Feb 2026" },
  { address: "655 Maple Drive", price: 475000, date: "Dec 2025" },
];
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export function validateDetails(d: Details): string | null {
  if (!["house", "condo", "townhome"].includes(d.type)) return "Choose a supported property type. Land and commercial properties are not supported.";
  if (!["standard", "updated", "needs-work"].includes(d.condition)) return "Choose a supported condition.";
  const bounds: [keyof Details, number, number, number][] = [
    ["bedrooms", 1, 6, 1], ["bathrooms", 1, 5, .5], ["sqft", 500, 5000, 1],
    ["lot", 0, 2, .01], ["year", 1900, 2026, 1], ["garage", 0, 3, 1],
  ];
  for (const [key, min, max, step] of bounds) {
    const value = Number(d[key]);
    if (!Number.isFinite(value) || value < min || value > max || Math.abs(value / step - Math.round(value / step)) > .000001) {
      return `${key}: enter ${min}–${max}, in increments of ${step}.`;
    }
  }
  return null;
}
export function estimate(d: Details) {
  const error = validateDetails(d);
  if (error) throw new Error(error);
  const typeFactor = { house: 1, condo: .86, townhome: .94 }[d.type];
  const conditionFactor = { standard: 1, updated: 1.04, "needs-work": .92 }[d.condition];
  const base = d.sqft * 228 * typeFactor + (d.bedrooms - 3) * 6000 + (d.bathrooms - 2) * 8000 + d.garage * 4000 + d.lot * 10000 - Math.min(126, 2026 - d.year) * 150;
  const center = Math.max(80000, Math.min(1300000, Math.round(base * conditionFactor / 1000) * 1000));
  return { center, low: Math.floor(center * .93 / 1000) * 1000, high: Math.ceil(center * 1.07 / 1000) * 1000 };
}
