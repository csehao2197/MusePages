export const types = ["Office", "Retail", "Industrial", "Flex", "Land", "Mixed-Use"] as const;
export type PropertyType = typeof types[number];
export type Transaction = "Lease" | "Sale" | "Sublease";
export const amenities = ["Parking Included", "On-Site Management", "Fiber Internet", "Loading Docks", "Conference Rooms", "Rooftop Access", "EV Charging"];
export const certifications = ["LEED", "ENERGY STAR", "WELL Building"];
export const quickFilters = ["Coworking Ready", "Move-in Ready", "New Construction", "Sublease Available", "Green Certified"];
export type Property = {
  id: number; name: string; address: string; neighborhood: string; zip: string;
  type: PropertyType; transaction: Transaction; sf: number; price: number; year: number;
  class: "A" | "B" | "C"; specs: string; tags: string[]; broker: string;
  amenities: string[]; certifications: string[]; quick: string[]; available: number;
  image: string; x: number; y: number; date: string; nnn?: boolean;
};
const shared = { amenities: ["Parking Included", "Fiber Internet"], certifications: [] as string[], quick: ["Move-in Ready"], available: 0, image: "office", class: "B" as const };
export const properties: Property[] = [
  { ...shared, id: 1, name: "Frost Tower — Suite 2400", address: "401 Congress Ave", neighborhood: "Downtown", zip: "78701", type: "Office", transaction: "Lease", sf: 12500, price: 52, year: 2003, class: "A", specs: "24th Floor · Renovated 2022", tags: ["Full-Floor", "City Views", "Spec Suite"], broker: "Sarah Chen", amenities: [...shared.amenities, "Conference Rooms", "On-Site Management"], certifications: ["ENERGY STAR"], quick: ["Move-in Ready", "Coworking Ready", "Green Certified"], x: 45, y: 60, date: "2026-10-28" },
  { ...shared, id: 2, name: "Domain NORTHSIDE — Retail Pad 8", address: "11600 Domain Dr", neighborhood: "North Austin", zip: "78758", type: "Retail", transaction: "Lease", sf: 3200, price: 42, year: 2019, class: "A", specs: "Ground Floor · Endcap", tags: ["High Traffic", "Patio Available", "Restaurant Ready"], broker: "Marcus Rivera", image: "retail", nnn: true, x: 35, y: 20, date: "2026-10-27" },
  { ...shared, id: 3, name: "East Austin Distribution Center", address: "4800 E 7th St", neighborhood: "East Austin", zip: "78702", type: "Industrial", transaction: "Sale", sf: 45000, price: 6750000, year: 2015, specs: "24′ Clear Height · 4 Loading Docks", tags: ["Fenced Yard", "Sprinklered", "Rail Adjacent"], broker: "Tom Bradley", amenities: ["Loading Docks", "Parking Included"], image: "industrial", x: 79, y: 65, date: "2026-10-26" },
  { ...shared, id: 4, name: "The Austin Tech Center — Full Building", address: "2100 Innovation Way", neighborhood: "East Austin", zip: "78702", type: "Office", transaction: "Lease", sf: 185000, price: 58, year: 2021, class: "A", specs: "Divisible to 15,000 SF", tags: ["Campus Fiber", "Rooftop Deck", "500 Parking Spaces"], broker: "Sarah Chen", amenities: [...shared.amenities, "Rooftop Access", "EV Charging", "Conference Rooms"], certifications: ["LEED"], quick: ["New Construction", "Green Certified"], available: 30, x: 72, y: 40, date: "2026-10-25" },
  { ...shared, id: 5, name: "South Congress Creative Studios", address: "1800 S Congress Ave", neighborhood: "South Austin", zip: "78704", type: "Flex", transaction: "Sublease", sf: 4800, price: 28, year: 1998, specs: "Ground Floor · Creative Space", tags: ["Open Plan", "Flexible Layout"], broker: "Sarah Chen", quick: ["Coworking Ready", "Sublease Available"], image: "retail", x: 42, y: 85, date: "2026-10-24" },
  { ...shared, id: 6, name: "Cedar Park Logistics", address: "820 Commerce Loop", neighborhood: "North Austin", zip: "78758", type: "Industrial", transaction: "Lease", sf: 28000, price: 18, year: 2010, specs: "28′ Clear Height · 3 Docks", tags: ["Truck Court", "Grade-Level Door"], broker: "Tom Bradley", amenities: ["Loading Docks", "Parking Included"], image: "industrial", available: 90, x: 17, y: 13, date: "2026-10-23" },
  { ...shared, id: 7, name: "Barton Creek Professional Center", address: "3400 Westlake Dr", neighborhood: "West Austin", zip: "78746", type: "Office", transaction: "Lease", sf: 2500, price: 36, year: 2008, specs: "2nd Floor · Corner Suite", tags: ["Natural Light", "Quiet Setting"], broker: "Sarah Chen", x: 15, y: 60, date: "2026-10-22" },
  { ...shared, id: 8, name: "Mueller Market Corner", address: "1900 Aldrich St", neighborhood: "East Austin", zip: "78723", type: "Retail", transaction: "Sale", sf: 6000, price: 2400000, year: 2018, class: "A", specs: "Ground Floor · Two Units", tags: ["Corner Frontage", "Outdoor Seating"], broker: "Marcus Rivera", image: "retail", x: 65, y: 24, date: "2026-10-21" },
  { ...shared, id: 9, name: "Airport Commerce Land", address: "7000 Logistics Rd", neighborhood: "East Austin", zip: "78719", type: "Land", transaction: "Sale", sf: 87120, price: 1850000, year: 1990, class: "C", specs: "2 Acres · Unimproved", tags: ["Concept Site", "Due Diligence Required"], broker: "Tom Bradley", image: "land", amenities: [], quick: [], available: 30, x: 86, y: 86, date: "2026-10-20" },
  { ...shared, id: 10, name: "Congress Commons", address: "900 Congress Ave", neighborhood: "Downtown", zip: "78701", type: "Mixed-Use", transaction: "Sale", sf: 18000, price: 8900000, year: 2006, specs: "Retail + Office · 3 Floors", tags: ["Central Location", "Multiple Suites"], broker: "Marcus Rivera", image: "retail", x: 47, y: 48, date: "2026-10-19" },
  { ...shared, id: 11, name: "North Loop Workspaces", address: "5200 North Loop", neighborhood: "North Austin", zip: "78751", type: "Office", transaction: "Sublease", sf: 1500, price: 24, year: 1995, class: "C", specs: "1st Floor · Furnished", tags: ["Plug & Play", "Small Team"], broker: "Sarah Chen", quick: ["Coworking Ready", "Sublease Available", "Move-in Ready"], x: 40, y: 32, date: "2026-10-18" },
  { ...shared, id: 12, name: "Riverside Flex Park", address: "2300 Riverside Dr", neighborhood: "South Austin", zip: "78741", type: "Flex", transaction: "Lease", sf: 10000, price: 22, year: 2023, class: "A", specs: "Office + Workshop · New Build", tags: ["Flexible Space", "EV Ready"], broker: "Tom Bradley", amenities: [...shared.amenities, "EV Charging", "Loading Docks"], certifications: ["WELL Building"], quick: ["New Construction", "Green Certified"], image: "industrial", x: 60, y: 78, date: "2026-10-17" },
];
export type Bounds = { left: number; top: number; right: number; bottom: number };
export type Filters = { query: string; type: string; transaction: string; selectedTypes: string[]; classes: string[]; years: string[]; amenities: string[]; certifications: string[]; quick: string[]; availability: string; minPrice: string; maxPrice: string; minSize: string; maxSize: string; savedOnly: boolean; area: Bounds | null };
export const initialFilters: Filters = { query: "", type: "", transaction: "", selectedTypes: [], classes: [], years: [], amenities: [], certifications: [], quick: [], availability: "", minPrice: "", maxPrice: "", minSize: "", maxSize: "", savedOnly: false, area: null };
export const currency = (value: number, decimals = 0) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(value);
export const number = (value: number) => value.toLocaleString("en-US");
export function monthlyRent(sf: number, rate: number) { return sf * rate / 12; }
export function salePerFoot(p: Property) { return p.price / p.sf; }
export function yearBand(year: number) { return year < 2000 ? "Before 2000" : year < 2010 ? "2000–2009" : year < 2020 ? "2010–2019" : "2020+"; }
export function validateRanges(f: Filters): string {
  if ((f.minPrice || f.maxPrice) && !f.transaction) return "Choose a transaction before filtering price; lease and sale units differ.";
  for (const [min, max, label] of [[f.minPrice, f.maxPrice, "Price"], [f.minSize, f.maxSize, "Size"]]) {
    if ([min, max].some(v => v !== "" && (!Number.isFinite(Number(v)) || Number(v) < 0))) return `${label} must be a non-negative number.`;
    if (min && max && Number(min) > Number(max)) return `${label} minimum cannot exceed maximum.`;
  }
  return "";
}
export function filterProperties(f: Filters, saved: number[], sort: string): Property[] {
  const q = f.query.toLowerCase().replace(/,/g, "").trim().replace(/\s+/g, " ");
  const result = properties.filter(p =>
    (!q || `${p.name} ${p.address} ${p.zip} ${p.neighborhood} Austin TX`.toLowerCase().includes(q)) &&
    (!f.type || p.type === f.type) && (!f.transaction || p.transaction === f.transaction) &&
    (!f.selectedTypes.length || f.selectedTypes.includes(p.type)) && (!f.classes.length || f.classes.includes(p.class)) &&
    (!f.years.length || f.years.includes(yearBand(p.year))) &&
    f.amenities.every(a => p.amenities.includes(a)) && f.certifications.every(a => p.certifications.includes(a)) &&
    f.quick.every(a => p.quick.includes(a)) && (!f.availability || p.available <= Number(f.availability)) &&
    (!f.minPrice || p.price >= Number(f.minPrice)) && (!f.maxPrice || p.price <= Number(f.maxPrice)) &&
    (!f.minSize || p.sf >= Number(f.minSize)) && (!f.maxSize || p.sf <= Number(f.maxSize)) &&
    (!f.savedOnly || saved.includes(p.id)) && (!f.area || (p.x >= f.area.left && p.x <= f.area.right && p.y >= f.area.top && p.y <= f.area.bottom))
  );
  return result.sort((a, b) => {
    if (sort === "size-asc") return a.sf - b.sf;
    if (sort === "size-desc") return b.sf - a.sf;
    // Mixed transactions use comparable asking totals, never a sale price versus a per-SF rate.
    const value = (p: Property) => p.transaction === "Sale" ? p.price : p.price * p.sf;
    if (sort === "price-asc") return value(a) - value(b);
    if (sort === "price-desc") return value(b) - value(a);
    return b.date.localeCompare(a.date);
  });
}
export function localDate(offset = 0): string {
  const date = new Date(); date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
