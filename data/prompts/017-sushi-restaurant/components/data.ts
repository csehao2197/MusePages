export type Category = "All" | "Nigiri" | "Small plates" | "Plant-based";
export type Dish = { id: string; name: string; japanese: string; category: Exclude<Category, "All">; price: number; origin: string; description: string; badge: string; color: string; allergens: string; raw: boolean; takeaway: boolean };
export const dishes: Dish[] = [
  { id: "otoro", name: "Otoro", japanese: "大トロ", category: "Nigiri", price: 24, origin: "Oma, Aomori · illustrative origin", description: "Bluefin tuna belly. Silky, marbled, and rich — finished with aged soy and fresh wasabi. Two pieces.", badge: "Peak Season", color: "#dd8d85", allergens: "Fish, soy, wheat", raw: true, takeaway: true },
  { id: "uni", name: "Uni", japanese: "雲丹", category: "Nigiri", price: 28, origin: "Hokkaido · illustrative origin", description: "Golden sea urchin on warm, seasoned rice. Creamy and briny with a softly sweet finish. Two pieces.", badge: "Chef’s Choice", color: "#ecad3e", allergens: "Sea urchin, soy, wheat", raw: true, takeaway: true },
  { id: "masu", name: "Sakura Masu", japanese: "桜鱒", category: "Nigiri", price: 18, origin: "Nagano · illustrative origin", description: "Cherry trout, lightly cured with yuzu zest and a delicate petal garnish. Two pieces.", badge: "Limited", color: "#efb0a0", allergens: "Fish, soy, wheat", raw: true, takeaway: true },
  { id: "miso", name: "White miso aubergine", japanese: "茄子", category: "Plant-based", price: 14, origin: "Seasonal garden · fictional selection", description: "Roasted aubergine, white miso glaze, toasted sesame and shiso. A warm plate for a quiet beginning.", badge: "From the Garden", color: "#88557e", allergens: "Soy, sesame; shared preparation area", raw: false, takeaway: true },
  { id: "chawan", name: "Chawanmushi", japanese: "茶碗蒸し", category: "Small plates", price: 16, origin: "House kitchen · fictional selection", description: "Silken steamed egg custard with dashi, shiitake and a tender prawn. Served at the counter only.", badge: "Counter Only", color: "#dab96a", allergens: "Egg, shellfish, fish, soy, wheat", raw: false, takeaway: false }
];
export const venue = { seats: 14, courses: 18, minutes: 90, omakase: 185, sake: 65, tea: 25 };
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
export const categories: Category[] = ["All", "Nigiri", "Small plates", "Plant-based"];
export const gallery = [
  { title: "The hinoki counter", kind: "room" },
  { title: "A moment of precision", kind: "chef" },
  { title: "The spring palette", kind: "platter" },
  { title: "Sake & stillness", kind: "sake" },
  { title: "Beyond the noren", kind: "entrance" },
  { title: "Eighteen small stories", kind: "platter" }
] as const;
export function dateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function reservationError(date: string, time: string, guests: number, dining: string, now = new Date()): string {
  const when = new Date(`${date}T${time}:00`);
  if (!Number.isFinite(when.getTime())) return "Choose a valid date and time.";
  if (when <= now) return "Please choose a future seating.";
  if ([0, 1].includes(when.getDay())) return "Our illustrative dining calendar is closed Sunday and Monday. Choose Tuesday–Saturday.";
  if (dining === "counter" && when.getTime() - now.getTime() < 48 * 60 * 60 * 1000) return "Omakase requires at least 48 hours’ notice. Choose a later date.";
  if (dining === "counter" && !["18:00", "20:30"].includes(time)) return "Omakase seatings are at 6:00 PM or 8:30 PM.";
  if (!Number.isInteger(guests) || guests < 1 || guests > 8) return "Choose between 1 and 8 guests.";
  if (dining === "counter" && time === "18:00" && guests > 6) return "Only 6 of 14 demo seats remain at 6:00 PM. Choose 8:30 PM or a smaller party.";
  return "";
}
export function pickupError(date: string, time: string, now = new Date()): string {
  const when = new Date(`${date}T${time}:00`);
  if (!Number.isFinite(when.getTime()) || when.getTime() < now.getTime() + 60 * 60 * 1000) return "Choose a pickup at least one hour from now.";
  if ([0, 1].includes(when.getDay())) return "Demo pickup is available Tuesday–Saturday. Choose another day.";
  return "";
}
