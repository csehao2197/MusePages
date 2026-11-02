export type Rental = {
  id: number; title: string; area: string; kind: string; beds: number;
  baths: number; rent: number; units: number; available: boolean; color: string;
};
export const rentals: Rental[] = [
  { id: 1, title: "The Mueller House", area: "Mueller", kind: "Single Family", beds: 3, baths: 2, rent: 2150, units: 1, available: false, color: "#bc9a73" },
  { id: 2, title: "Juniper Duplex", area: "East Austin", kind: "Duplex", beds: 2, baths: 1, rent: 1450, units: 1, available: true, color: "#668779" },
  { id: 3, title: "Oak Bend Residence", area: "Round Rock", kind: "Single Family", beds: 4, baths: 3, rent: 2800, units: 1, available: false, color: "#b79b87" },
  { id: 4, title: "Skyline at Congress", area: "Downtown", kind: "Condo", beds: 1, baths: 1, rent: 1650, units: 1, available: true, color: "#71879a" },
  { id: 5, title: "Southwood Eight", area: "South Austin", kind: "Multi-Family", beds: 2, baths: 1, rent: 12400, units: 8, available: false, color: "#ac8068" },
  { id: 6, title: "Cedar Grove Townhome", area: "Cedar Park", kind: "Townhome", beds: 3, baths: 2, rent: 2350, units: 1, available: true, color: "#879286" },
];
export const services = [
  { title: "Tenant screening", icon: "search", text: "Thoughtful placement. A stronger foundation.", detail: "A fictional placement workflow with consistent, fair review of applications and references. No applications, credit checks, background checks, or sensitive information are collected here.", note: "Illustrative leasing fee: 50% of one month’s rent on Single Property; 40% on Portfolio." },
  { title: "Rent collection", icon: "wallet", text: "Less chasing payments. More peace of mind.", detail: "Preview a monthly collection ledger and owner statement in the owner portal. Actual payment processing, bank connections, and deposits are not available.", note: "Management fees apply to collected rent only. No payment credentials accepted." },
  { title: "Maintenance & repairs", icon: "wrench", text: "Small fixes now. Fewer surprises later.", detail: "Try a local maintenance request and choose your preferred contact window. In a real service, owners would set approval thresholds before repair coordination.", note: "Coordination included in example plans; repair costs would be additional. No dispatch or emergency monitoring." },
  { title: "Property inspections", icon: "clipboard", text: "A closer look at your biggest investment.", detail: "Example move-in, move-out, and semi-annual inspection reporting with documented condition updates. This demo does not schedule an inspection.", note: "Semi-annual reporting included in both published example plans." },
  { title: "Financial reporting", icon: "chart", text: "Your numbers, without the guesswork.", detail: "Explore a sample income and expense statement in the owner portal. Monthly statements and year-end summaries illustrate a possible reporting service.", note: "Included in both example plans. Not tax or investment advice." },
  { title: "Compliance coordination", icon: "shield", text: "Careful processes. Clear communication.", detail: "An example service for coordinating lease documents and referring questions to qualified local professionals. This website provides no legal or housing eligibility advice.", note: "Legal services and enterprise terms would require a separate written agreement." },
] as const;
export const faqs = [
  ["What types of properties do you manage?", "The fictional Keystone portfolio covers single-family homes, duplexes, condos, townhomes, and multi-family properties up to 50 units. Austin, Round Rock, Cedar Park, Pflugerville, and Georgetown are illustrative service areas, not verified coverage."],
  ["How do you screen tenants?", "A real provider would publish consistent, legally reviewed screening criteria and privacy practices. This demo does not evaluate eligibility, collect applications, run reports, or recommend housing based on personal characteristics."],
  ["How quickly can you fill a vacancy?", "The source concept references a 21-day average, but that is not verified. Marketing, pricing, condition, and local demand affect timing. No occupancy, returns, or placement date is promised."],
  ["When do I get paid?", "The concept proposes owner disbursements by the 10th each month after collection. The owner portal is a read-only fictional ledger; it cannot receive rent or send a deposit."],
  ["What if a tenant damages my property?", "A real agreement would explain documentation, deposits, insurance, and applicable law. This demo offers no coverage, insurance recommendation, legal protection, or damage guarantee."],
  ["Can I still be involved in decisions?", "Yes, the example service includes an owner-defined approval threshold, such as $300, with regular reporting. No work is approved or dispatched through this local demo."],
];
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export function estimate(units: number, rent: number, vacancy: number, rate: number) {
  const gross = units * rent * 12;
  const baseline = gross * (1 - vacancy / 100);
  const managed = gross * (1 - Math.min(vacancy, 5) / 100);
  const fee = managed * rate;
  return { gross, baseline, managed, fee, net: managed - fee, benefit: managed - fee - baseline };
}
