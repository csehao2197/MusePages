export type RoomId = "living" | "kitchen" | "bedroom" | "terrace";
export type Hotspot = {
  id: string;
  type: "info" | "navigation" | "video" | "link";
  x: number;
  y: number;
  title: string;
  description: string;
  destination?: RoomId;
};
export type Room = {
  id: RoomId;
  name: string;
  subtitle: string;
  dimensions: string;
  width: number;
  depth: number;
  area: string;
  features: string[];
  note: string;
  narration: string;
  hotspots: Hotspot[];
};
export const rooms: Room[] = [
  {
    id: "living", name: "Living Room", subtitle: "Space to slow down.",
    dimensions: "22′ × 18′", width: 22, depth: 18, area: "396 sq ft",
    features: ["White oak flooring", "Custom built-in shelving", "Garden-facing glazing"],
    note: "A sunlit gathering space, imagined with natural materials and a little room to breathe.",
    narration: "Welcome to the living room. White oak floors lead toward garden-facing windows. Custom shelving frames a quiet reading corner. Continue through to the kitchen when you are ready.",
    hotspots: [
      { id: "oak", type: "info", x: 45, y: 76, title: "Grounded in natural materials", description: "Illustrated white oak flooring continues through the main living areas. Materials are fictional design specifications." },
      { id: "shelves", type: "info", x: 78, y: 40, title: "A place for your stories", description: "Custom built-in shelving with warm wood finishes. Explore the empty/staged comparison to see the room without loose furniture." },
      { id: "to-kitchen", type: "navigation", x: 22, y: 48, title: "Explore the kitchen", description: "Move to the next room.", destination: "kitchen" },
      { id: "living-film", type: "video", x: 60, y: 38, title: "Living room walkthrough", description: "An illustrated sequence replaces filmed footage in this demo. No real video or panoramic photography is supplied." },
    ],
  },
  {
    id: "kitchen", name: "Kitchen", subtitle: "The heart of the everyday.",
    dimensions: "18′ × 16′", width: 18, depth: 16, area: "288 sq ft",
    features: ["Sculpted stone island", "Oak-front cabinetry", "Induction cooking concept"],
    note: "Morning coffee. Long conversations. A generous island brings it all together.",
    narration: "The kitchen pairs oak cabinetry with an oversized stone island. Pendant lights define a space for shared meals. All finishes and appliances are illustrative, not an offer of sale.",
    hotspots: [
      { id: "island", type: "info", x: 52, y: 66, title: "Made for gathering", description: "A fictional 9-foot stone island with seating for three. Dimensions shown are conceptual; verify all clearances professionally." },
      { id: "hvac", type: "info", x: 70, y: 27, title: "Comfort, considered", description: "New HVAC system (2023) is a fictional listing detail, not a verified installation or energy certification." },
      { id: "to-bedroom", type: "navigation", x: 86, y: 50, title: "Explore the primary bedroom", description: "Continue upstairs in the illustrated sequence.", destination: "bedroom" },
    ],
  },
  {
    id: "bedroom", name: "Primary Bedroom", subtitle: "Your own quiet corner.",
    dimensions: "20′ × 17′", width: 20, depth: 17, area: "340 sq ft",
    features: ["Garden outlook", "Linen-inspired finishes", "En-suite concept"],
    note: "Soft light and a restrained palette make space for a slower start.",
    narration: "Upstairs, the primary bedroom is a quiet retreat with a garden outlook. The illustrated bed and finishes suggest one possible furniture arrangement. Next, step out onto the garden terrace.",
    hotspots: [
      { id: "bed", type: "info", x: 50, y: 64, title: "Room to retreat", description: "Shown with a king-size bed concept. The layout is schematic, not surveyed or suitable for construction." },
      { id: "to-terrace", type: "navigation", x: 20, y: 45, title: "Explore the garden terrace", description: "Step outside in the illustrated tour.", destination: "terrace" },
    ],
  },
  {
    id: "terrace", name: "Garden Terrace", subtitle: "A little closer to nature.",
    dimensions: "24′ × 14′", width: 24, depth: 14, area: "336 sq ft",
    features: ["Sheltered outdoor seating", "Native-inspired planting", "Timber pergola concept"],
    note: "An outdoor room for unhurried afternoons, with greenery in every direction.",
    narration: "The garden terrace completes our tour. A timber pergola shelters outdoor seating, surrounded by imagined planting. This is an original illustration, not a map or depiction of a real site.",
    hotspots: [
      { id: "garden", type: "info", x: 73, y: 54, title: "An outdoor living room", description: "A planted terrace concept with sheltered seating. Plant types and climate suitability have not been assessed." },
      { id: "local-guide", type: "link", x: 28, y: 37, title: "Explore the neighborhood", description: "Open the fictional neighborhood guide. No live map or external provider is used." },
      { id: "to-living", type: "navigation", x: 48, y: 78, title: "Return to the living room", description: "Return to the beginning.", destination: "living" },
    ],
  },
];
export const property = {
  address: "18 Juniper Lane",
  location: "Mosswood, California · fictional location",
  price: "$1,250,000",
  beds: 4, baths: 3.5, area: "3,200",
  amenities: ["Indoor–outdoor living", "Two-car garage concept", "Dedicated study", "Garden terrace", "Oak flooring", "4 bedrooms / 3.5 bathrooms"],
};
