export type Room = {
  name: string; size: number; bed: string; view: string; capacity: number; price: number;
};
export type Hotel = {
  id: string; name: string; neighborhood: string; stars: number; rating: number;
  reviews: number; type: string; amenities: string[]; badge: string; theme: string;
  price: number; oldPrice?: number; available: number; distance: number;
  cancellation: boolean; breakfast: boolean; address: string; rooms: Room[];
  position: [number, number]; description: string[];
};
const king = (name: string, size: number, price: number, capacity = 2, view = "City view"): Room =>
  ({ name, size, price, capacity, view, bed: capacity === 1 ? "Single bed" : "King bed" });

export const hotels: Hotel[] = [
  {
    id: "skyline", name: "Skyline House Tokyo", neighborhood: "Shinjuku", stars: 5, rating: 9.4,
    reviews: 1284, type: "Hotel", amenities: ["Free WiFi", "Pool", "Gym", "Spa", "Restaurant", "Free Cancellation"],
    badge: "City skyline retreat", theme: "skyline", price: 412, oldPrice: 580, available: 3,
    distance: 2.4, cancellation: true, breakfast: false, address: "3-7 West Shinjuku, Tokyo (fictional)",
    rooms: [king("Standard King", 30, 350), king("Deluxe King", 45, 412), king("Panorama Suite", 72, 680, 4, "Park view")],
    position: [24, 34],
    description: [
      "Leave the city’s busy streets behind and settle into a quiet, light-filled retreat above Shinjuku. Warm oak, soft linens and wide windows make room for a slower kind of stay.",
      "Start with a swim, take the train to a neighborhood café, then return for an evening above the skyline. Our fictional hotel is designed for travelers who want city connections without the bustle.",
      "This is an illustrated sample property, not a real hotel. Room availability, reviews, travel times and rates are fixed demo fixtures, not live offers."
    ]
  },
  {
    id: "paper", name: "Paper & Pine Ginza", neighborhood: "Ginza", stars: 4, rating: 9.1,
    reviews: 876, type: "Hotel", amenities: ["Free WiFi", "Restaurant", "Laundry", "Free Cancellation"],
    badge: "Minimalist design", theme: "pine", price: 198, available: 8, distance: 0.8,
    cancellation: true, breakfast: false, address: "5-2 Ginza, Tokyo (fictional)",
    rooms: [king("Type E — Double", 32, 198), king("Type F — Corner", 38, 245), king("Family Studio", 48, 310, 4)],
    position: [69, 67],
    description: ["Natural textures, thoughtful details and a little less noise. This fictional Ginza stay pairs simple rooms with a ground-floor restaurant.",
      "Spend the day browsing design shops and neighborhood galleries. Return to warm lighting, comfortable bedding and space to unwind.",
      "All property details and guest feedback are illustrative. No relationship with a real hotel is implied."]
  },
  {
    id: "sakura", name: "Sakura Ryokan Tokyo", neighborhood: "Otemachi", stars: 5, rating: 9.6,
    reviews: 542, type: "Ryokan", amenities: ["Free WiFi", "Onsen/Hot Spring", "Spa", "Restaurant", "Room Service", "Breakfast Included", "Free Cancellation"],
    badge: "Traditional ryokan", theme: "sakura", price: 549, oldPrice: 720, available: 4,
    distance: 0.5, cancellation: true, breakfast: true, address: "1-4 Otemachi, Tokyo (fictional)",
    rooms: [king("Sakura Suite", 56, 549, 3, "Garden view"), king("Tatami Twin", 42, 470, 2, "Courtyard view"), king("Garden Residence", 80, 750, 4, "Garden view")],
    position: [63, 40],
    description: ["A fictional ryokan in the heart of the city, with tatami-inspired interiors and a peaceful garden. Shoes off, kettle on, city life paused.",
      "The sample nightly rate includes breakfast and access to an illustrative hot spring. Seasonal meals and quiet corners bring a sense of ritual to your stay.",
      "This demo makes no claims about actual spring water, availability or facilities."]
  },
  {
    id: "capsule", name: "Nest Capsule Shinjuku", neighborhood: "Shinjuku", stars: 3, rating: 8.2,
    reviews: 2105, type: "Capsule Hotel", amenities: ["Free WiFi", "Sauna", "Laundry", "Lounge"],
    badge: "Budget pick", theme: "capsule", price: 38, available: 12, distance: 3.1,
    cancellation: false, breakfast: false, address: "2-8 East Shinjuku, Tokyo (fictional)",
    rooms: [king("Premium Capsule — Adult Floor", 4, 38, 1, "No window"), king("Quiet Capsule — Adult Floor", 5, 46, 1, "No window")],
    position: [30, 39],
    description: ["A compact, fictional base for an independent city adventure. Individual sleeping pods share a lounge, laundry and bathing facilities.",
      "Each capsule sleeps one adult. Children are not accommodated in this sample property; choose a hotel or apartment for a family stay.",
      "Pay-at-property is an illustrative rate policy only. This demo cannot collect payment or reserve a capsule."]
  },
  {
    id: "river", name: "River Lantern Asakusa", neighborhood: "Asakusa", stars: 3, rating: 8.7,
    reviews: 318, type: "Hotel", amenities: ["Free WiFi", "Breakfast Included", "Free Cancellation", "Airport Shuttle"],
    badge: "Riverside mornings", theme: "sakura", price: 124, available: 6, distance: 5.2,
    cancellation: true, breakfast: true, address: "2-3 Asakusa, Tokyo (fictional)",
    rooms: [king("River Double", 26, 124), king("Family River Room", 42, 190, 4)],
    position: [84, 23], description: ["A small fictional riverside hotel with bright rooms and a simple breakfast.",
      "Explore quiet lanes before the city wakes up, then return to a view of the water. All directions and facilities are simulated."]
  },
  {
    id: "studio", name: "Crossing Studios Shibuya", neighborhood: "Shibuya", stars: 4, rating: 8.9,
    reviews: 462, type: "Apartment", amenities: ["Free WiFi", "Kitchen", "Laundry", "Gym", "Free Cancellation"],
    badge: "Room for everyone", theme: "pine", price: 225, available: 5, distance: 4.3,
    cancellation: true, breakfast: false, address: "4-1 Shibuya, Tokyo (fictional)",
    rooms: [king("City Studio", 40, 225, 3), king("Two-bedroom Apartment", 70, 360, 6)],
    position: [25, 76], description: ["Make yourself at home in a fictional apartment with a kitchen and generous living space.",
      "A practical base for longer stays and family trips, with laundry facilities and room to spread out. All inventory is mocked."]
  },
  {
    id: "hostel", name: "Circuit Social Hostel", neighborhood: "Akihabara", stars: 2, rating: 7.8,
    reviews: 629, type: "Hostel", amenities: ["Free WiFi", "Laundry", "Lounge"],
    badge: "Meet the neighborhood", theme: "capsule", price: 55, available: 10, distance: 2.1,
    cancellation: false, breakfast: false, address: "1-9 Akihabara, Tokyo (fictional)",
    rooms: [king("Private Twin", 16, 55), king("Private Triple", 22, 80, 3)],
    position: [72, 29], description: ["A friendly fictional hostel with private rooms and a shared lounge.",
      "Travel light, meet fellow explorers and enjoy a simple city base. Reviews and policies are examples, not verified customer reports."]
  },
  {
    id: "garden", name: "Garden Terrace Roppongi", neighborhood: "Roppongi", stars: 5, rating: 9.0,
    reviews: 201, type: "Hotel", amenities: ["Free WiFi", "Pool", "Gym", "Restaurant", "Free Cancellation"],
    badge: "Garden hideaway", theme: "skyline", price: 320, available: 0, distance: 3.4,
    cancellation: true, breakfast: false, address: "6-2 Roppongi, Tokyo (fictional)",
    rooms: [king("Garden King", 38, 320), king("Terrace Suite", 62, 510, 4)],
    position: [45, 67], description: ["A fictional garden retreat beside the city’s art district.",
      "This property is intentionally sold out in the sample inventory to demonstrate unavailable results. No live dates are checked."]
  }
];

export type Search = { destination: string; checkIn: string; checkOut: string; adults: number; children: number; rooms: number };
export const initialSearch: Search = { destination: "Tokyo, Japan", checkIn: "2026-04-14", checkOut: "2026-04-21", adults: 2, children: 0, rooms: 1 };
export const nightsFor = (search: Search) =>
  Math.round((Date.parse(search.checkOut) - Date.parse(search.checkIn)) / 86400000);
export function searchError(search: Search): string {
  const nights = nightsFor(search);
  if (!search.destination.trim()) return "Enter a destination.";
  if (!Number.isFinite(nights) || nights < 1) return "Check-out must be after check-in.";
  if (nights > 30) return "Choose a stay of 30 nights or fewer for this demo.";
  if (search.rooms > search.adults) return "Each room needs at least one adult.";
  if (search.adults + search.children > search.rooms * 6) return "Choose more rooms: the largest room sleeps 6 guests.";
  return "";
}
export const roomFits = (hotel: Hotel, room: Room, search: Search) =>
  room.capacity * search.rooms >= search.adults + search.children &&
  (hotel.type !== "Capsule Hotel" || search.children === 0);
export const defaultRoom = (hotel: Hotel) => hotel.rooms.find(room => room.price === hotel.price) ?? hotel.rooms[0];
export const ratingLabel = (rating: number) => rating >= 9.3 ? "Exceptional" : rating >= 9 ? "Excellent" : "Very good";
