export type EventType = "Corporate" | "Wedding" | "Private Party" | "Other";
export type Tier = "Classic" | "Premium" | "Luxury";
export const services: { type: EventType; title: string; price: number; detail: string }[] = [
  { type: "Corporate", title: "Corporate Events", price: 35, detail: "Board meetings, product launches, company picnics. A thoughtful table for big ideas." },
  { type: "Wedding", title: "Weddings & Receptions", price: 75, detail: "Rehearsal dinners, ceremony receptions, brunch send-offs. Every chapter, beautifully served." },
  { type: "Private Party", title: "Private Parties", price: 45, detail: "Birthdays, anniversaries, holiday gatherings. Your favorite people, around one table." }
];
export const menus: Record<Tier, { price: number; subtitle: string; courses: string[]; mains: string[]; desserts: string[] }> = {
  Classic: { price: 35, subtitle: "Familiar favorites, thoughtfully elevated.", courses: ["Caesar salad", "Roasted seasonal vegetables", "Garlic bread"], mains: ["Grilled chicken breast"], desserts: ["Lemon tart", "Chocolate cake"] },
  Premium: { price: 55, subtitle: "A little indulgence. A lasting impression.", courses: ["Burrata & heirloom tomato", "Truffle mashed potatoes", "Artisan bread basket"], mains: ["Pan-seared salmon", "Filet mignon"], desserts: ["Tiramisu", "Crème brûlée"] },
  Luxury: { price: 85, subtitle: "An extraordinary table for an extraordinary day.", courses: ["Oyster bar & charcuterie spread", "Risotto with wild mushrooms", "Imported cheese course"], mains: ["Lobster tail", "Wagyu strip steak"], desserts: ["Custom dessert station"] }
};
export const gallery: { title: string; category: Exclude<EventType, "Other">; guests: number; venue: string; color: string }[] = [
  { title: "An evening of new ideas", category: "Corporate", guests: 120, venue: "The Foundry Hall", color: "#738578" },
  { title: "Under the olive branches", category: "Wedding", guests: 200, venue: "Willow Estate", color: "#a78c77" },
  { title: "Fifty, and fabulous", category: "Private Party", guests: 50, venue: "The Garden Room", color: "#9c6d60" },
  { title: "The annual gathering", category: "Corporate", guests: 300, venue: "Metro Atrium", color: "#637784" },
  { title: "A golden-hour reception", category: "Wedding", guests: 85, venue: "Orchard House", color: "#ad985e" },
  { title: "A toast to togetherness", category: "Private Party", guests: 40, venue: "Rosewood Terrace", color: "#77745d" }
];
export const reviews = [
  { quote: "Savory Affairs made our wedding reception absolutely magical. Every guest raved about the food.", name: "Sarah & James", event: "200-guest wedding" },
  { quote: "We've used them for 3 corporate events now. Always professional, always delicious.", name: "Michael R.", event: "VP of Operations at fictional TechCorp" },
  { quote: "The custom vegan menu they created blew everyone away.", name: "Priya K.", event: "50th birthday celebration" }
];
export const faqs = [
  ["How far in advance should I book?", "Our illustrative planning guide recommends 4–6 weeks for private events and 3–6 months for weddings. No dates or availability are reserved in this demo."],
  ["Do you provide staff and equipment?", "The fictional full-service package includes setup, service, cleanup, servers, bartenders, linens, and tableware. The estimator uses an illustrative service allowance; a real provider would confirm staffing and equipment in writing."],
  ["Can you accommodate dietary restrictions?", "Sample menus can be discussed for vegan, vegetarian, gluten-free, kosher, and halal preferences. No allergen-free handling or religious certification is asserted. Confirm ingredients, cross-contact procedures, and certifications with a qualified provider before booking."],
  ["What is your cancellation policy?", "Illustrative policy only: full refund 30+ days out, 50% refund 14–29 days, no refund under 14 days. No contract, payment, or refund is created here."],
  ["Do you offer tastings?", "The fictional offering includes a complimentary tasting for events over 75 guests. Smaller events have an illustrative $100 tasting fee. Request a local planning summary below; no appointment is booked."]
];
export function estimate(type: EventType, tier: Tier, guests: number) {
  const minimum = services.find(s => s.type === type)?.price ?? 35;
  const perGuest = Math.max(minimum, menus[tier].price);
  const food = perGuest * guests;
  const service = Math.round(food * 0.18);
  return { perGuest, food, service, total: food + service };
}
