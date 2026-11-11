export type PlanId = "oakmont" | "ashford" | "belmont" | "crestview";
export type Room = { name: string; width: number; depth: number };
export type Plan = {
  id: PlanId;
  name: string;
  style: string;
  beds: number;
  baths: number;
  sqft: number;
  stories: number;
  price: number;
  badge?: string;
  rooms: Room[][];
};
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export const plans: Plan[] = [
  { id: "oakmont", name: "The Oakmont", style: "Easygoing craftsman", beds: 3, baths: 2.5, sqft: 1842, stories: 1, price: 425000,
    rooms: [[{ name: "Great room", width: 18, depth: 17 }, { name: "Kitchen", width: 14, depth: 12 }, { name: "Primary suite", width: 16, depth: 14 }, { name: "Bedroom 2", width: 12, depth: 11 }, { name: "Bedroom 3", width: 12, depth: 11 }, { name: "Dining", width: 12, depth: 10 }]] },
  { id: "ashford", name: "The Ashford", style: "Modern farmhouse", beds: 4, baths: 3, sqft: 2456, stories: 2, price: 498000, badge: "Most popular · demo",
    rooms: [[{ name: "Great room", width: 19, depth: 18 }, { name: "Kitchen", width: 15, depth: 13 }, { name: "Guest suite", width: 13, depth: 12 }, { name: "Dining", width: 14, depth: 12 }], [{ name: "Primary suite", width: 17, depth: 16 }, { name: "Bedroom 3", width: 13, depth: 12 }, { name: "Bedroom 4", width: 13, depth: 12 }, { name: "Loft", width: 15, depth: 13 }]] },
  { id: "belmont", name: "The Belmont", style: "Refined transitional", beds: 4, baths: 3.5, sqft: 2890, stories: 2, price: 565000,
    rooms: [[{ name: "Great room", width: 20, depth: 19 }, { name: "Kitchen", width: 17, depth: 14 }, { name: "Primary suite", width: 18, depth: 16 }, { name: "Study", width: 12, depth: 12 }], [{ name: "Bedroom 2", width: 14, depth: 13 }, { name: "Bedroom 3", width: 14, depth: 12 }, { name: "Bedroom 4", width: 13, depth: 12 }, { name: "Bonus room", width: 18, depth: 15 }]] },
  { id: "crestview", name: "The Crestview", style: "Room to grow, beautifully", beds: 5, baths: 4, sqft: 3218, stories: 2, price: 639000, badge: "Model home · concept",
    rooms: [[{ name: "Great room", width: 22, depth: 20 }, { name: "Kitchen", width: 18, depth: 15 }, { name: "Guest suite", width: 14, depth: 13 }, { name: "Study", width: 13, depth: 12 }], [{ name: "Primary suite", width: 20, depth: 18 }, { name: "Bedroom 3", width: 14, depth: 13 }, { name: "Bedroom 4", width: 14, depth: 13 }, { name: "Bedroom 5", width: 13, depth: 12 }, { name: "Loft", width: 17, depth: 15 }]] },
];
export type LotStatus = "Available" | "Under contract" | "Sold" | "Model home";
export type Lot = { number: number; acres: number; facing: string; premium: string; premiumPrice: number; phase: 1 | 2 | 3; status: LotStatus; compatible: PlanId[] };
export const lots: Lot[] = Array.from({ length: 86 }, (_, index) => {
  const number = index + 1;
  const status: LotStatus = number <= 46 ? "Sold" : number <= 60 ? "Available" : number <= 83 ? "Under contract" : "Model home";
  const acres = Number((0.25 + (index % 6) * 0.03).toFixed(2));
  return { number, acres, facing: ["South", "West", "North", "East"][index % 4],
    premium: index % 3 === 0 ? "Backs to green space" : index % 3 === 1 ? "Corner homesite" : "Tree-lined street",
    premiumPrice: index % 3 === 0 ? 18000 : index % 3 === 1 ? 12000 : 0,
    phase: number <= 38 ? 1 : 2, status,
    compatible: acres >= 0.34 ? ["oakmont", "ashford", "belmont", "crestview"] : acres >= 0.28 ? ["oakmont", "ashford", "belmont"] : ["oakmont", "ashford"] };
});
export const gallery = ["Kitchen", "Primary bath", "Great room", "Backyard", "Front porch", "Home office"];
export const timeline = [
  { title: "Phase 1 · Roots established", date: "2024–2025 · fictional", detail: "38 schematic homesites in the first release. Sold-out status is illustrative, not a market claim. Builder, inspections and permits have not been verified." },
  { title: "Phase 2 · A new chapter", date: "2026 · fictional release", detail: "48 schematic homesites, including 14 available and 3 models in this fixture. No real inventory, construction progress or occupancy is represented." },
  { title: "Phase 3 · Looking ahead", date: "Q4 2026 · original concept target", detail: "A conceptual future extension beyond the 86 illustrated lots. No lots are released here. The original target is unverified, not a completion promise." },
  { title: "Your build · Step by step", date: "Illustrative process · no duration guarantee", detail: "Explore a plan → discuss options → design review → permitting → foundation → framing → finishes → inspections → walkthrough. No agreements, payments or actual builder portal are provided." },
];
