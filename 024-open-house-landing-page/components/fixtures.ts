export const property = {
  address: "4821 Ridgewood Terrace",
  city: "Scottsdale, AZ 85262",
  price: 2450000,
  beds: 5, baths: 4.5, area: 4820, acres: 0.75, year: 2021,
  mls: "AZ-2026-48210",
} as const;
export const event = {
  date: "2026-11-14",
  label: "Saturday, November 14, 2026",
  time: "11:00 AM – 3:00 PM",
  zone: "Arizona time (MST, UTC−7)",
  original: "Saturday, April 4, 2026",
  slots: [
    { time: "11:00", label: "11:00 AM", capacity: 6 },
    { time: "11:30", label: "11:30 AM", capacity: 4 },
    { time: "12:00", label: "12:00 PM", capacity: 2 },
    { time: "12:30", label: "12:30 PM", capacity: 0 },
    { time: "13:00", label: "1:00 PM", capacity: 6 },
    { time: "13:30", label: "1:30 PM", capacity: 3 },
    { time: "14:00", label: "2:00 PM", capacity: 6 },
    { time: "14:30", label: "2:30 PM", capacity: 0 },
  ],
} as const;
export const highlights = [
  { icon: "bed", title: "5 Bedrooms", detail: "Primary suite with private balcony and mountain views" },
  { icon: "bath", title: "4.5 Bathrooms", detail: "Soaking tub, rain shower and a spa-inspired primary bath" },
  { icon: "kitchen", title: "Chef’s Kitchen", detail: "Wolf & Sub-Zero concept, quartz island and butler’s pantry" },
  { icon: "pool", title: "Infinity Pool", detail: "Heated saltwater pool, spa and desert-facing fire bowls" },
  { icon: "car", title: "3-Car Garage", detail: "Oversized bays, EV charging and epoxy floors" },
  { icon: "wifi", title: "Smart Home", detail: "Control4 concept: lighting, climate, audio and shades" },
  { icon: "office", title: "Home Office", detail: "Built-in cabinetry behind glass French doors" },
  { icon: "house", title: "Guest Casita", detail: "Detached 450 sq ft studio with a private entrance" },
] as const;
export const gallery = [
  { title: "Twilight arrival", subtitle: "Exterior front · stone, stucco & desert silhouettes", kind: "exterior" },
  { title: "Room to breathe", subtitle: "Great room · double-height glass & linear fireplace", kind: "living" },
  { title: "The heart of the home", subtitle: "Kitchen · waterfall island & open dining", kind: "kitchen" },
  { title: "Considered details", subtitle: "Kitchen detail · quartz, brass & wine storage", kind: "detail" },
  { title: "A quiet retreat", subtitle: "Primary bedroom · private desert views", kind: "bedroom" },
  { title: "Everyday sanctuary", subtitle: "Primary bathroom · soaking tub & marble concept", kind: "bathroom" },
  { title: "The golden hour", subtitle: "Backyard · infinity pool & fire bowls", kind: "pool" },
  { title: "Dinner under the stars", subtitle: "Outdoor kitchen · grill, pergola & bar seating", kind: "outdoor" },
  { title: "Space to focus", subtitle: "Office · built-in desk & glass doors", kind: "office" },
  { title: "A welcome of their own", subtitle: "Guest casita · private patio & entrance", kind: "casita" },
  { title: "Gather beautifully", subtitle: "Dining room · statement chandelier & ten seats", kind: "dining" },
  { title: "Ready for the road", subtitle: "Garage · three bays & EV charging concept", kind: "garage" },
] as const;
export type SceneKind = typeof gallery[number]["kind"];
export const specs = [
  ["Living area", "4,820 sq ft"], ["Lot size", "0.75 acres · 32,670 sq ft"],
  ["Year built", "2021"], ["Style", "Contemporary Desert Modern"],
  ["Construction", "Stucco & natural stone"], ["Roof", "Flat parapet · TPO membrane"],
  ["Flooring", "Porcelain tile & white oak"], ["Cooling", "3-zone HVAC · 16 SEER"],
  ["Heating", "Forced air + radiant kitchen / primary bath"],
  ["Water heater", "Tankless · 2 units"], ["HOA (fictional)", "$285/month · gated community maintenance"],
  ["2025 property tax (fictional)", "$14,280/year"],
  ["School district (unverified)", "Scottsdale Unified · Saguaro High School"],
  ["Illustrative MLS identifier", "AZ-2026-48210"],
] as const;
export const places = [
  { name: "Pinnacle Peak Trail", miles: "2.1", x: 70, y: 18, detail: "A desert hiking destination. Check official trail rules independently." },
  { name: "Scottsdale Quarter", miles: "4.3", x: 23, y: 71, detail: "Shopping and dining. This schematic does not provide a route." },
  { name: "Grayhawk Golf Club", miles: "3.8", x: 75, y: 48, detail: "Golf destination; access, memberships and opening hours are not verified." },
  { name: "Whole Foods Market", miles: "5.1", x: 37, y: 86, detail: "Grocery destination. Names are context only, not endorsements." },
  { name: "HonorHealth Scottsdale", miles: "6.2", x: 16, y: 42, detail: "Healthcare point of interest, not emergency directions." },
  { name: "Scottsdale Airport", miles: "8.7", x: 79, y: 83, detail: "Airport context only. No live travel information is used." },
] as const;
export const listings = [
  { address: "7930 E Raintree Dr", price: 1895000, stats: "4 bed · 3.5 bath · 3,640 sq ft", kind: "casita" },
  { address: "22614 N Pinnacle Peak Rd", price: 2780000, stats: "5 bed · 5 bath · 5,210 sq ft", kind: "exterior" },
  { address: "10585 E Crescent Moon Dr", price: 3150000, stats: "6 bed · 6 bath · 6,800 sq ft", kind: "pool" },
] as const;
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
