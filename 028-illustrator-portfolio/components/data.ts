export const categories = ["All", "Editorial", "Book Covers", "Branding", "Personal", "Motion"] as const;
export type Category = typeof categories[number];
export type Artwork = { id: number; title: string; category: Exclude<Category, "All">; client: string; description: string; shape: "tall" | "wide" | "square"; art: number; palette: number };
export const works: Artwork[] = [
  { id: 1, title: "The Midnight Garden", category: "Book Covers", client: "Independent publishing concept", description: "A secret garden that only blooms after everyone has gone to sleep. An imagined cover about memory, belonging, and the worlds we keep inside.", shape: "tall", art: 0, palette: 0 },
  { id: 2, title: "Bloomberg Businessweek: AI Issue", category: "Editorial", client: "Bloomberg · hypothetical brief", description: "A series of four concept illustrations exploring the visual language of artificial intelligence. Organic hands meet mechanical thinking in an imagined special issue.", shape: "wide", art: 1, palette: 1 },
  { id: 3, title: "Fauna Coffee Branding", category: "Branding", client: "Fauna · fictional brand", description: "A joyful identity for an imaginary neighborhood coffee roaster. Birds, beans, and an optimistic start to the morning.", shape: "square", art: 2, palette: 2 },
  { id: 4, title: "Migration Patterns", category: "Personal", client: "Self-initiated", description: "Following the invisible routes that connect distant homes. A study of flight, seasonal change, and the courage to leave.", shape: "tall", art: 3, palette: 3 },
  { id: 5, title: "New Yorker: Urban Solitude", category: "Editorial", client: "The New Yorker · hypothetical brief", description: "A quiet window in a noisy city. An uncommissioned editorial concept about finding a little wilderness in everyday urban life.", shape: "tall", art: 4, palette: 4 },
  { id: 6, title: "Dreamscape", category: "Motion", client: "Self-initiated", description: "An illustrated moving daydream. Floating worlds and drifting celestial shapes in a gentle CSS motion study.", shape: "wide", art: 5, palette: 5 },
  { id: 7, title: "Wildflower Herbarium", category: "Personal", client: "Self-initiated", description: "An imaginary field guide to the stubborn little flowers growing along the edge of the city.", shape: "square", art: 6, palette: 2 },
  { id: 8, title: "HarperCollins: The Lost City", category: "Book Covers", client: "HarperCollins · hypothetical brief", description: "Architecture reclaimed by a forest; a speculative jacket for an unwritten adventure.", shape: "tall", art: 7, palette: 3 },
  { id: 9, title: "Oatly Campaign Illustrations", category: "Branding", client: "Oatly · hypothetical brief", description: "A playful uncommissioned exploration of farms, oat fields, and everyday rituals.", shape: "wide", art: 8, palette: 2 },
  { id: 10, title: "Creatures of the Deep", category: "Personal", client: "Self-initiated", description: "A curious diver meets luminous life in an ocean without a map.", shape: "tall", art: 9, palette: 0 },
  { id: 11, title: "Wired Magazine: Quantum Computing", category: "Editorial", client: "Wired · hypothetical brief", description: "An imagined editorial illustration: entangled orbits make an abstract idea feel tangible.", shape: "wide", art: 10, palette: 1 },
  { id: 12, title: "Luna Tea Packaging", category: "Branding", client: "Luna · fictional brand", description: "Botanical packaging for an imaginary slow-evening tea ritual.", shape: "square", art: 11, palette: 5 },
  { id: 13, title: "Tidal Almanac", category: "Book Covers", client: "Independent publishing concept", description: "An illustrated journal of moonlit tides and imagined coastlines.", shape: "tall", art: 5, palette: 0 },
  { id: 14, title: "The Listening Forest", category: "Personal", client: "Self-initiated", description: "Leaves become ears, trees become witnesses. A meditation on paying attention.", shape: "square", art: 0, palette: 3 },
  { id: 15, title: "Small Hours", category: "Motion", client: "Self-initiated", description: "A softly shifting city at the hour when the streets belong to dreamers.", shape: "wide", art: 4, palette: 5 },
  { id: 16, title: "Good Earth Market", category: "Branding", client: "Good Earth · fictional brand", description: "An imaginary farmers market identity built around bright seasonal produce.", shape: "square", art: 6, palette: 1 },
  { id: 17, title: "A Place to Land", category: "Editorial", client: "Independent editorial concept", description: "The feeling of finding a new home, told through birds and open skies.", shape: "wide", art: 3, palette: 2 },
  { id: 18, title: "Under the Same Moon", category: "Book Covers", client: "Independent publishing concept", description: "Two distant windows share one moon in this imaginary literary cover.", shape: "tall", art: 7, palette: 4 }
];
export const services = [
  { name: "Editorial Illustration", type: "Editorial", price: 800, unit: "piece", timing: "1–2 weeks", description: "Magazine covers, article illustrations, op-ed visuals" },
  { name: "Book & Cover Art", type: "Book", price: 2000, unit: "project", timing: "3–6 weeks", description: "Cover design, interior illustrations, chapter headers" },
  { name: "Brand Illustration", type: "Brand", price: 1500, unit: "project", timing: "2–4 weeks", description: "Packaging, campaigns, brand identity illustration systems" }
] as const;
export const prints = [{ work: 0, price: 120, stock: 12 }, { work: 3, price: 85, stock: 24 }, { work: 6, price: 65, stock: 18 }, { work: 9, price: 110, stock: 8 }];
