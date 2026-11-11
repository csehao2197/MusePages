export type Genre = "Trap" | "R&B" | "Cinematic";
export type Track = {
  id: string;
  title: string;
  genre: Genre;
  mood: string;
  bpm: number;
  key: string;
  art: string;
  description: string;
};

export const tracks: Track[] = [
  { id: "midnight-drive", title: "Midnight Drive", genre: "R&B", mood: "Trap / R&B", bpm: 142, key: "F# Minor", art: "midnight", description: "Late-night chords, glassy melodies, and a low end that leaves room for your story." },
  { id: "no-signal", title: "No Signal", genre: "Trap", mood: "Dark Trap", bpm: 148, key: "C Minor", art: "signal", description: "A fractured pulse and heavy sub, built for a confident, close-mic delivery." },
  { id: "violet-hour", title: "Violet Hour", genre: "R&B", mood: "Alternative R&B", bpm: 92, key: "A Minor", art: "violet", description: "Soft harmonics and a patient pocket. A little warmth for the hours after midnight." },
  { id: "after-image", title: "After Image", genre: "Cinematic", mood: "Cinematic Soul", bpm: 110, key: "D Minor", art: "after", description: "Wide, suspended textures with a heartbeat underneath. Made to paint a scene." },
  { id: "southbound", title: "Southbound", genre: "Trap", mood: "Melodic Trap", bpm: 136, key: "E Minor", art: "south", description: "An Atlanta-inspired bounce, original bell motif, and a rolling low-end rhythm." },
  { id: "blue-room", title: "Blue Room", genre: "R&B", mood: "Smooth R&B", bpm: 86, key: "B Minor", art: "blue", description: "Muted chords, airy synths, and an unhurried groove for intimate vocals." },
];

export type Service = "Beat License" | "Custom Production" | "Studio Session" | "Mixing & Mastering" | "Sync Licensing" | "Other";
export const services: { title: string; type: Service; label: string; description: string }[] = [
  { title: "Beat Production", type: "Custom Production", label: "01 / FROM THE FIRST NOTE", description: "Your vision, an original sound. Share a reference and a feeling; explore 3–5 directions in a fictional 48-hour turnaround." },
  { title: "Recording Sessions", type: "Studio Session", label: "02 / FIND YOUR POCKET", description: "A private Midtown Atlanta studio concept. An imagined U87, HDX, and Avalon signal chain, with space to experiment." },
  { title: "Mixing & Mastering", type: "Mixing & Mastering", label: "03 / EVERY DETAIL COUNTS", description: "From rough bounce to release-ready. Vocal clarity, weight, and streaming-focused dynamics that serve the song." },
  { title: "Sync Licensing", type: "Sync Licensing", label: "04 / SOUND MEETS PICTURE", description: "Original sonic worlds for film, games, and campaigns. Explore a fictional brief with stems and clearance planning." },
];
export const tiers = [
  { name: "Basic", price: "$29.99", note: "Get your idea out.", features: ["Tagged MP3", "5,000 streams · non-exclusive", "1 music video", "Credit: Prod. KVOLT"] },
  { name: "Premium", price: "$79.99", note: "Made for your next release.", features: ["Untagged WAV + MP3", "100,000 streams · non-exclusive", "2 music videos + radio rights", "Production credit required"] },
  { name: "Exclusive", price: "$499+", note: "Make the sound yours.", features: ["WAV + stems + MP3", "Unlimited streams + videos", "Exclusive rights · radio / TV / film", "Beat removed from demo store concept"] },
];
export const credits = [
  { artist: "NOVA REIGN", title: "Night Shift", streams: "24M", year: "2025", art: "signal", role: "Production & arrangement" },
  { artist: "ELI SOL", title: "Soft Landing", streams: "8.2M", year: "2025", art: "violet", role: "Co-production & mix" },
  { artist: "SAINT EAST", title: "No Looking Back", streams: "12M", year: "2024", art: "south", role: "Production" },
  { artist: "MIRA V", title: "In Between", streams: "6.4M", year: "2024", art: "blue", role: "Production & engineering" },
  { artist: "KAI MERIDIAN", title: "First Light", streams: "3.1M", year: "2024", art: "after", role: "Arrangement & mix" },
  { artist: "LUNE 6", title: "Parallel", streams: "2.8M", year: "2023", art: "midnight", role: "Production" },
];
