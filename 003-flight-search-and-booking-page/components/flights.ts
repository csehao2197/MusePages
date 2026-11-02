export const airlines = [
  { name: "ANA", full: "All Nippon Airways", code: "NH", alliance: "Star Alliance", color: "#1648a0" },
  { name: "Japan Airlines", full: "Japan Airlines", code: "JL", alliance: "Oneworld", color: "#b6253d" },
  { name: "Delta", full: "Delta Air Lines", code: "DL", alliance: "SkyTeam", color: "#20324f" },
  { name: "United", full: "United Airlines", code: "UA", alliance: "Star Alliance", color: "#236ba2" },
  { name: "American", full: "American Airlines", code: "AA", alliance: "Oneworld", color: "#637793" },
  { name: "Korean Air", full: "Korean Air", code: "KE", alliance: "SkyTeam", color: "#438ca1" },
  { name: "EVA Air", full: "EVA Air", code: "BR", alliance: "Star Alliance", color: "#267751" },
  { name: "Cathay Pacific", full: "Cathay Pacific", code: "CX", alliance: "Oneworld", color: "#216a68" },
] as const;
export const airports = { JFK: "New York · JFK", NRT: "Tokyo Narita · NRT", HND: "Tokyo Haneda · HND", EWR: "Newark · EWR", KIX: "Osaka Kansai · KIX" };
export type Airport = keyof typeof airports;
export type Trip = "Round Trip" | "One Way" | "Multi-City";
export type Search = { from: Airport; to: Airport; depart: string; returnDate: string; adults: number; cabin: string; trip: Trip; onward: Airport };
export const initialSearch: Search = { from: "JFK", to: "NRT", depart: "2026-04-15", returnDate: "2026-04-29", adults: 2, cabin: "Economy", trip: "Round Trip", onward: "KIX" };
export type Flight = { id: number; airline: number; price: number; duration: number; returnDuration: number; stops: number; via: string; departure: number; arrival: number; seats: number };
const base: Flight[] = [
  { id: 1, airline: 0, price: 892, duration: 850, returnDuration: 765, stops: 0, via: "", departure: 655, arrival: 845, seats: 6 },
  { id: 2, airline: 1, price: 1046, duration: 825, returnDuration: 750, stops: 0, via: "", departure: 800, arrival: 975, seats: 4 },
  { id: 3, airline: 5, price: 876, duration: 1155, returnDuration: 1110, stops: 1, via: "ICN", departure: 75, arrival: 715, seats: 3 },
  { id: 4, airline: 2, price: 938, duration: 1045, returnDuration: 1010, stops: 1, via: "LAX", departure: 480, arrival: 965, seats: 8 },
  { id: 5, airline: 3, price: 982, duration: 1090, returnDuration: 1050, stops: 1, via: "SFO", departure: 550, arrival: 1090, seats: 6 },
  { id: 6, airline: 0, price: 1189, duration: 870, returnDuration: 780, stops: 0, via: "", departure: 1120, arrival: 1320, seats: 5 },
];
// Deterministic fictional inventory; airline totals mirror the brief without fabricated live availability.
const totals = [42, 38, 35, 31, 28, 22, 26, 25];
export const flights: Flight[] = [...base];
totals.forEach((total, airline) => {
  const existing = base.filter(f => f.airline === airline).length;
  for (let n = existing; n < total; n++) {
    const id = flights.length + 1;
    const stops = flights.length < 92 ? 1 : 2;
    flights.push({ id, airline, price: 910 + ((id * 79) % 3250), duration: 980 + ((id * 37) % 1180), returnDuration: 990 + ((id * 29) % 1100), stops, via: ["LAX", "SFO", "ORD", "ICN"][id % 4], departure: (id * 83) % 1440, arrival: (id * 107) % 1440, seats: 2 + id % 7 });
  }
});
export type Filters = { min: number; max: number; stops: number[]; airlines: number[]; departure: number[]; arrival: number[]; duration: number; layovers: string[]; alliances: string[] };
export const priceBounds = (search: Search) => {
  const factor = (search.trip === "One Way" ? .62 : 1) * (search.cabin === "Business" ? 2.4 : search.cabin === "Premium Economy" ? 1.5 : 1);
  return { min: Math.floor(650 * factor), max: Math.ceil(4200 * factor) };
};
export const freshFilters = (search: Search = initialSearch): Filters => ({ ...priceBounds(search), stops: [], airlines: [], departure: [], arrival: [], duration: 36, layovers: [], alliances: [] });
export const slots = ["Morning", "Afternoon", "Evening", "Red-Eye"];
export const slotRanges = ["6AM–12PM", "12PM–6PM", "6PM–12AM", "12AM–6AM"];
export const timeSlot = (minutes: number) => minutes >= 360 && minutes < 720 ? 0 : minutes >= 720 && minutes < 1080 ? 1 : minutes >= 1080 ? 2 : 3;
export const durationText = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
export const timeText = (minutes: number) => `${Math.floor(minutes / 60) % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${minutes < 720 ? "AM" : "PM"}`;
export const addDays = (date: string, amount: number) => { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + amount); return d.toISOString().slice(0, 10); };
export const dateText = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
export const dateAdjustment = (date: string) => {
  const exact: Record<string, number> = { "2026-04-12": 53, "2026-04-13": 0, "2026-04-14": 210, "2026-04-15": 0, "2026-04-16": 42, "2026-04-17": 353, "2026-04-18": -16 };
  return exact[date] ?? (Number(date.slice(-2)) % 5) * 36;
};
export const farePrice = (f: Flight, s: Search) => Math.round((f.price + dateAdjustment(s.depart) + (s.from !== "JFK" || s.to !== "NRT" ? 48 : 0) + (s.trip === "Multi-City" ? 180 : 0)) * (s.trip === "One Way" ? .62 : 1) * (s.cabin === "Business" ? 2.4 : s.cabin === "Premium Economy" ? 1.5 : 1));
export const fareTypes = [
  { name: "Basic Economy", extra: 0, baggage: "1 personal item · 7 kg", changes: "No changes or refunds", seat: "Seat assigned at check-in" },
  { name: "Economy", extra: 66, baggage: "1 carry-on · 10 kg + 1 checked bag · 23 kg", changes: "$200 simulated change fee", seat: "Standard seat selection included" },
  { name: "Premium Economy", extra: 448, baggage: "1 carry-on · 10 kg + 2 checked bags · 23 kg each", changes: "Free simulated changes", seat: "Extra legroom + priority boarding" },
];
export function matches(f: Flight, filters: Filters, s: Search) {
  const price = farePrice(f, s);
  return price >= filters.min && price <= filters.max && f.duration <= filters.duration * 60 &&
    (!filters.stops.length || filters.stops.includes(f.stops)) &&
    (!filters.airlines.length || filters.airlines.includes(f.airline)) &&
    (!filters.departure.length || filters.departure.includes(timeSlot(f.departure))) &&
    (!filters.arrival.length || filters.arrival.includes(timeSlot(f.arrival))) &&
    (!filters.layovers.length || filters.layovers.includes(f.via) || (f.stops > 1 && filters.layovers.includes("SFO"))) &&
    (!filters.alliances.length || filters.alliances.includes(airlines[f.airline].alliance)) && f.seats >= s.adults;
}
