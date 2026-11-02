export type Family = "Light & lager" | "IPA" | "Amber & brown" | "Stout" | "Sour & wild";
export type Beer = { name: string; style: string; abv: number; ibu: number; note: string; family: Family; badge?: string };
export const beers: Beer[] = [
  { name: "Summit Haze", style: "New England IPA", abv: 6.8, ibu: 55, note: "Juicy, tropical, pillowy soft. Citra & Mosaic hops.", family: "IPA", badge: "NEW" },
  { name: "Blue Ridge Pils", style: "Czech Pilsner", abv: 4.9, ibu: 35, note: "Crisp, clean, noble hops. Our fictional flagship since day one.", family: "Light & lager" },
  { name: "Copper Line", style: "American Amber", abv: 5.4, ibu: 30, note: "Toasty malt, caramel, balanced bitterness.", family: "Amber & brown" },
  { name: "Dark Hollow", style: "Oatmeal Stout", abv: 5.8, ibu: 25, note: "Chocolate, coffee, velvet mouthfeel. Nitro pour.", family: "Stout" },
  { name: "Trail Dust", style: "West Coast IPA", abv: 7.2, ibu: 65, note: "Piney, resinous, old-school dank. A hop-forward classic.", family: "IPA" },
  { name: "Fog Valley", style: "Witbier", abv: 4.6, ibu: 15, note: "Orange peel, coriander, refreshing.", family: "Light & lager" },
  { name: "Firebreak", style: "Double IPA", abv: 8.5, ibu: 70, note: "Bold tropical hops with a warming finish. Enjoy mindfully.", family: "IPA", badge: "LIMITED" },
  { name: "Harvest Table", style: "Farmhouse Saison", abv: 6.2, ibu: 22, note: "Peppery, dry, complex. A wildflower-honey recipe.", family: "Sour & wild" },
  { name: "Stone Bridge", style: "Brown Ale", abv: 5.1, ibu: 20, note: "Nutty, toasty, easy-drinking. An autumn classic.", family: "Amber & brown" },
  { name: "River Sour", style: "Berliner Weisse", abv: 3.8, ibu: 5, note: "Tart, bright, kettle-soured with a peach finish.", family: "Sour & wild", badge: "SEASONAL" },
  { name: "Basecamp", style: "Golden Ale", abv: 4.4, ibu: 18, note: "Light, approachable, gently malty.", family: "Light & lager" },
  { name: "Night Shift", style: "Imperial Stout", abv: 10.2, ibu: 50, note: "Six-month barrel recipe. Dark chocolate, vanilla, oak.", family: "Stout", badge: "BREWERY ONLY" }
];
export const families: Family[] = ["Light & lager", "IPA", "Amber & brown", "Stout", "Sour & wild"];
export const events = [
  { name: "Trivia Night", date: "Every Wednesday · 7PM", detail: "Free to play. Small merch prizes, good company.", icon: "?", price: 0, capacity: 12 },
  { name: "The Appalachian Drifters", date: "Friday, November 6, 2026 · 7:30PM", detail: "Fictional bluegrass set on the patio. No cover.", icon: "♫", price: 0, capacity: 12 },
  { name: "Brewer’s Dinner", date: "March 22, 2027 · 6:30PM", detail: "Five courses, thoughtfully paired. 30-seat concept; 4 demo seats left.", icon: "✦", price: 85, capacity: 4 },
  { name: "Anniversary Party — Year 4", date: "April 5, 2027 · 12PM–10PM", detail: "Rare keg stories, live music and food trucks. Free entry.", icon: "↟", price: 0, capacity: 12 }
];
export const products = [
  { name: "Mixed 12-Pack", price: 36, detail: "Summit Haze, Blue Ridge Pils, Copper Line & Basecamp. Display only; alcohol cannot be ordered.", art: "pack" },
  { name: "Flagship Hoodie", price: 55, detail: "Charcoal heavyweight concept. Mountain-logo embroidery.", art: "hoodie" },
  { name: "Tasting Flight Board", price: 28, detail: "Reclaimed-oak design concept. Four tasting glass wells.", art: "flight" },
  { name: "Gift Card", price: 25, detail: "Choose $25, $50 or $100. Non-redeemable demo preview.", art: "gift" }
];
export const locations = [
  { name: "Riverside Social", kind: "Bar / Restaurant", city: "Asheville", zip: "28801", stock: "Summit Haze, Blue Ridge Pils", x: 42, y: 56 },
  { name: "Mountain Bottle Collective", kind: "Bottle shop", city: "Asheville", zip: "28801", stock: "Full lineup + can concepts", x: 49, y: 42 },
  { name: "Estate Table", kind: "Restaurant", city: "Asheville", zip: "28803", stock: "Copper Line, Basecamp", x: 45, y: 70 },
  { name: "Hilltop Guest Taps", kind: "Cross-tap", city: "Asheville", zip: "28805", stock: "Trail Dust", x: 58, y: 39 },
  { name: "Foothill Provisions", kind: "Bottle shop", city: "Morganton", zip: "28655", stock: "Seasonal releases", x: 83, y: 32 },
  { name: "Warehouse Guest Taps", kind: "Cross-tap", city: "Asheville", zip: "28801", stock: "Dark Hollow", x: 34, y: 48 },
  { name: "Forest Street Tavern", kind: "Cross-tap", city: "Asheville", zip: "28806", stock: "Fog Valley", x: 29, y: 63 },
  { name: "WNC Pantry", kind: "Grocery", city: "WNC concept", zip: "28715", stock: "6-pack & variety-pack concepts", x: 18, y: 75 }
];
