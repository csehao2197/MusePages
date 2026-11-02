export type Kind = "Flights" | "Hotels" | "Packages" | "Cruises" | "Cars" | "Tours";
export type Region = "Europe" | "Asia" | "Caribbean" | "Americas" | "Africa";
export type Deal = {
  id: string; title: string; country: string; type: Kind; region: Region;
  label: string; nights: number; price: number; original: number;
  month: "This Month" | "Next Month"; day: number; origin: string;
  style: "coast" | "city" | "island" | "desert" | "snow";
  color: string; rating: string; reviews: number; inclusion: string;
  flash?: number; urgency?: string;
};
const make = (id: string, title: string, country: string, type: Kind, region: Region, label: string, nights: number, price: number, original: number, style: Deal["style"], color: string, extra: Partial<Deal> = {}): Deal => ({
  id, title, country, type, region, label, nights, price, original, style, color,
  month: "This Month", day: 12, origin: "New York", rating: "4.7", reviews: 1203,
  inclusion: "Breakfast included", ...extra
});
export const deals: Deal[] = [
  make("santorini","Santorini, Greece","Greece","Packages","Europe","Flight + Hotel",5,899,1840,"coast","#73bdcf",{urgency:"Only 3 left at this price"}),
  make("cancun","Cancún, Mexico","Mexico","Hotels","Americas","All-Inclusive Resort",7,1149,2100,"island","#43baad",{inclusion:"All-inclusive",month:"Next Month",day:4}),
  make("kyoto","Kyoto, Japan","Japan","Packages","Asia","Flight + Ryokan Stay",6,1299,2450,"city","#caa59e",{origin:"London",month:"Next Month",day:8,inclusion:"Traditional breakfast"}),
  make("amalfi","Amalfi Coast, Italy","Italy","Hotels","Europe","Boutique Hotel",4,679,1200,"coast","#64a5c3",{day:7}),
  make("maldives","Maldives","Maldives","Hotels","Asia","Overwater Villa",5,2199,4500,"island","#50c5c7",{inclusion:"Breakfast + transfers",day:21}),
  make("reykjavik","Reykjavik, Iceland","Iceland","Packages","Europe","Flight + Northern Lights Tour",4,799,1500,"snow","#748bab",{origin:"London",inclusion:"Guided evening tour",day:18}),
  make("marrakech","Marrakech, Morocco","Morocco","Packages","Africa","Riad + Desert Tour",5,549,980,"desert","#cf9473",{inclusion:"Breakfast + desert tour",day:6}),
  make("phuket","Phuket, Thailand","Thailand","Hotels","Asia","Beachfront Resort",7,699,1350,"island","#6aaf90",{month:"Next Month",day:16}),
  make("barcelona","New York → Barcelona","Spain","Flights","Europe","Round-trip flight",0,289,649,"city","#ddad84",{flash:15791,inclusion:"Round-trip economy • cabin bag",day:3}),
  make("bali","5 Nights in Bali — All-Inclusive","Indonesia","Packages","Asia","Flight + Hotel",5,599,1299,"island","#8eb98c",{flash:29133,inclusion:"All-inclusive",day:9}),
  make("tokyo","London → Tokyo","Japan","Flights","Asia","Round-trip flight",0,412,890,"city","#c6a5c6",{flash:10029,urgency:"Almost gone!",origin:"London",day:2,inclusion:"Round-trip economy • cabin bag"}),
  make("cruise","Caribbean Cruise — 7 Nights","Caribbean","Cruises","Caribbean","Cruise",7,749,1599,"island","#65b8c8",{flash:41422,inclusion:"Cabin + meals",month:"Next Month",day:10}),
  make("lisbon","Lisbon City Break","Portugal","Packages","Europe","Flight + Hotel",4,449,724,"city","#d8a47a",{day:11}),
  make("algarve","Algarve Beach Escape","Portugal","Hotels","Europe","Beach Hotel",6,599,1033,"coast","#7bbeca",{day:20}),
  make("porto","Porto Wine Country","Portugal","Packages","Europe","Hotel + Wine Tour",3,379,583,"city","#bc9990",{inclusion:"Breakfast + guided tasting",day:14}),
  make("athens","Athens Weekend Getaway","Greece","Packages","Europe","Flight + Hotel",2,329,520,"city","#d9bb95",{day:15}),
  make("srilanka","Sri Lanka Beach & Culture","Sri Lanka","Packages","Asia","Hotel + Culture Tour",5,649,1020,"island","#9bb28a",{inclusion:"Breakfast + guided tour",month:"Next Month"}),
  make("paris","Direct to Paris","France","Flights","Europe","One-way flight",0,199,340,"city","#adb7c9",{inclusion:"One-way economy • cabin bag",day:5}),
  make("car","Portugal Coastal Drive","Portugal","Cars","Europe","Car Rental",4,159,240,"coast","#b2c5ba",{inclusion:"4-day rental • mileage included",reviews:86}),
  make("tour","Marrakech Desert Experience","Morocco","Tours","Africa","Experience & Tour",1,129,195,"desert","#daa179",{inclusion:"1-night guided desert experience",reviews:112})
];
export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
export const percent = (d: Deal) => Math.round((d.original-d.price)/d.original*100);
