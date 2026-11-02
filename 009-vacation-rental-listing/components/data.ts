export type Currency = "USD" | "EUR" | "GBP";
export type Guests = { adults: number; children: number; infants: number; pets: number };
export type Review = { name: string; city: string; date: string; rating: number; text: string };
export const DEMO_TODAY = "2026-10-31";
export const blockedDates = new Set([
  "2026-11-05", "2026-11-06", "2026-11-07", "2026-11-08",
  "2026-11-18", "2026-11-19", "2026-11-20", "2026-11-21",
  "2026-12-12", "2026-12-13", "2026-12-14",
]);
export const scenes = [
  { src: "/villa.svg", title: "The infinity pool, at golden hour", detail: "Oceanfront exterior · illustrated architectural study" },
  { src: "/living.svg", title: "Slow mornings in the open-air lounge", detail: "White linen, warm limestone, and jungle green" },
  { src: "/bedroom.svg", title: "Wake up with the Caribbean", detail: "Master suite · king bed and ocean-facing balcony" },
  { src: "/terrace.svg", title: "A little closer to the sky", detail: "Rooftop daybed · panoramic ocean views" },
  { src: "/beach.svg", title: "Your own path to the sea", detail: "Private palm-lined beach walkway" },
  { src: "/living.svg", title: "A place to gather", detail: "Open-plan living and dining · alternate illustrated view" },
  { src: "/bedroom.svg", title: "Quiet corners, natural textures", detail: "Linen canopy and handcrafted details · alternate illustrated view" },
  { src: "/terrace.svg", title: "One last sunset", detail: "Ocean terrace · alternate illustrated view" },
] as const;
export const amenities: Record<string, string[]> = {
  Bathroom: ["Rainfall shower", "Soaking tub", "Luxury toiletries", "Hair dryer"],
  Kitchen: ["Full chef’s kitchen", "Gas stove", "Oven", "Espresso machine", "Blender", "Dishwasher", "Filtered water"],
  Outdoor: ["Private infinity pool", "Direct beach access", "Yoga deck", "2 complimentary bicycles", "BBQ grill", "Hammocks", "Beach palapa", "Outdoor dining for 8", "Fire pit"],
  Entertainment: ["High-speed WiFi (150 Mbps)", '65" smart TV', "Sonos speakers", "Board games", "Snorkel gear"],
  Comfort: ["Air conditioning (all rooms)", "Private chef available (extra)"],
  "Access & safety": ["Free parking (2 vehicles)", "Smart lock entry", "Smoke detectors", "Fire extinguisher", "First aid kit", "Security cameras (exterior only)", "Carbon monoxide detector"],
};
export const reviews: Review[] = [
  { name: "Sarah K.", city: "Austin, TX", date: "December 2025", rating: 5, text: "Absolutely magical. The villa exceeded every expectation — the photos don’t do it justice. Waking up to that ocean view every morning was surreal." },
  { name: "Tom & Linda R.", city: "Toronto", date: "November 2025", rating: 5, text: "Best-equipped kitchen we’ve ever had in a rental. We hired the private chef for one dinner and cooked ourselves the rest — both were amazing." },
  { name: "Yuki M.", city: "Tokyo", date: "November 2025", rating: 5, text: "Gabriela was incredibly responsive and left a personalized welcome basket with local mezcal and chocolates. The self check-in was seamless." },
  { name: "Anna & Chris B.", city: "Brooklyn", date: "January 2026", rating: 5, text: "Third time staying here. We come back every winter. The private beach path and yoga deck make it impossible to leave." },
  { name: "James W.", city: "London", date: "October 2025", rating: 4, text: "Pool is stunning, beach is gorgeous, but be aware there’s some seaweed on the beach (common in Tulum). Villa itself is perfection." },
  { name: "Maria G.", city: "Madrid", date: "September 2025", rating: 5, text: "Perfect for our family of 5. Kids loved the pool. The bikes were perfect for exploring. Only wish we’d booked a longer stay." },
];
export const similar = [
  { name: "Oceanview Treehouse Loft", specs: "2 guests · 1 bed", price: 189, rating: "4.88 (89)", scene: "/beach.svg", tag: "Among the palms" },
  { name: "Bohemian Beach Cabana", specs: "4 guests · 2 beds", price: 249, rating: "4.95 (203)", scene: "/living.svg", tag: "Guest Favorite · fictional" },
  { name: "Modern Jungle Villa with Cenote", specs: "8 guests · 4 beds", price: 529, rating: "4.91 (64)", scene: "/villa.svg", tag: "A jungle hideaway" },
  { name: "Seaside Studio with Rooftop Plunge Pool", specs: "2 guests · 1 bed", price: 159, rating: "4.87 (156)", scene: "/terrace.svg", tag: "Made for two" },
] as const;
export const rates: Record<Currency, number> = { USD: 1, EUR: 0.92, GBP: 0.79 };
export function money(value: number, currency: Currency) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: Number.isInteger(value * rates[currency]) ? 0 : 2 }).format(value * rates[currency]);
}
export function dateToUTC(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NaN;
  const time = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === date ? time : NaN;
}
export function quote(checkIn: string, checkOut: string, guests: Guests) {
  const start = dateToUTC(checkIn);
  const end = dateToUTC(checkOut);
  const nights = (end - start) / 86400000;
  let error = "";
  if (!checkIn || !checkOut) error = "Choose both check-in and check-out dates.";
  else if (!Number.isFinite(nights)) error = "Enter valid calendar dates.";
  else if (checkIn < DEMO_TODAY) error = "Choose a date on or after October 31, 2026 (the demo clock).";
  else if (nights <= 0) error = "Check-out must be after check-in.";
  else if (nights < 3) error = "Casa Azul has a 3-night minimum.";
  else if (nights > 28) error = "For stays longer than 28 nights, preview a message to Gabriela.";
  else if (checkOut > "2027-04-30") error = "Illustrative availability ends April 30, 2027.";
  else if (Object.values(guests).some(value => !Number.isInteger(value) || value < 0) || guests.adults < 1 || guests.adults + guests.children + guests.infants > 6 || guests.pets > 1) error = "At least 1 adult; maximum 6 guests including infants and 1 pet.";
  else {
    for (let time = start; time < end; time += 86400000) {
      if (blockedDates.has(new Date(time).toISOString().slice(0, 10))) { error = "This range includes unavailable nights. Please choose another stay."; break; }
    }
  }
  const lodging = Number.isFinite(nights) && nights > 0 ? nights * 389 : 0;
  const pets = Number.isFinite(nights) && nights > 0 ? nights * guests.pets * 50 : 0;
  const cleaning = 150;
  const tax = Math.round((lodging + cleaning + pets) * 16) / 100;
  return { error, nights, lodging, cleaning, pets, tax, total: lodging + cleaning + pets + tax };
}
