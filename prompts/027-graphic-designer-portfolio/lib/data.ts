export const categories = ["All work", "Brand Identity", "Campaign", "Packaging", "Editorial", "Digital"] as const;
export type Category = typeof categories[number];
export type Project = {
  slug: string; name: string; client: string; category: Exclude<Category, "All work">;
  year: string; summary: string; color: string; ink: string; industry: string;
  challenge: string; audience: string; direction: string; system: string;
  process: string; delivery: string; applications: string[]; captions: string[];
};
export const projects: Project[] = [
  {
    slug: "common-ground", name: "Common Ground", client: "Fictional neighborhood arts space", category: "Brand Identity", year: "2026",
    summary: "A gathering place with an identity that makes room for everyone.", color: "#e95a31", ink: "#271e18", industry: "Arts & culture",
    challenge: "An imagined neighborhood arts space needs to make workshops, exhibitions, and casual drop-ins feel like parts of one welcoming place—not three separate organizations.",
    audience: "Local makers and first-time visitors. The brief assumes a small volunteer team, a two-color print budget, and signs that must remain readable from across the street.",
    direction: "Two interlocking arches represent a shared threshold. We rejected a literal house symbol because it made the space feel private; the open arch invites entry without prescribing who belongs.",
    system: "A compact serif wordmark brings warmth; a plain sans-serif carries schedules. Persimmon and paper make economical two-color posters. The arch can expand into a frame, but never substitutes for essential wayfinding text.",
    process: "Three pencil territories explored a house, a woven knot, and an open doorway. The doorway survived a one-color reduction exercise. A six-column grid lets volunteers replace a photograph with a workshop title without rebuilding the poster.",
    delivery: "Concept handoff includes SVG marks, a two-ink poster specification, a sample event calendar, and minimum-size guidance. This is self-initiated work; no venue opened and no attendance results exist.",
    applications: ["Identity / primary mark", "Identity / system board", "Process / doorway studies"],
    captions: ["An open threshold formed by two interlocking arches on persimmon.", "Common Ground application copy, persimmon palette, type specimen, and a six-column grid.", "Three original vector sketches compare a house, woven loops, and an open doorway."]
  },
  {
    slug: "offbeat", name: "Offbeat", client: "Fictional independent music series", category: "Campaign", year: "2026",
    summary: "A visual rhythm for music that refuses to sit still.", color: "#d9ed70", ink: "#242923", industry: "Music & live events",
    challenge: "Create a recognisable campaign for a hypothetical experimental music series whose line-up changes weekly, without relying on artist portraits.",
    audience: "Curious listeners rather than genre insiders. A monochrome fallback and phone-readable dates are mandatory; all performers and dates are deliberately omitted from this concept.",
    direction: "Repeated circles slip out of alignment like a syncopated beat. An early soundwave route was rejected for feeling like a streaming service rather than a live encounter.",
    system: "Acid yellow and near-black provide a high-contrast frame. Condensed-looking system typography, circular forms, and a strict left edge make the series identifiable even as artwork changes.",
    process: "Paper circles were shifted one grid unit at a time. A contact sheet of twelve arrangements tested whether the rhythm survived square social crops and narrow street-poster formats.",
    delivery: "Concept deliverables include a poster family, square announcement tiles, and motion storyboards. No concert, ticket sales, artist endorsement, or campaign performance is claimed.",
    applications: ["Campaign / key visual", "Campaign / system board", "Process / rhythm studies"],
    captions: ["Offset black circles create a syncopated pattern on acid yellow.", "An Offbeat campaign-copy study, acid palette, type specimen, and modular grid.", "Vector sketches compare a soundwave, regular circles, and a syncopated rhythm."]
  },
  {
    slug: "fieldwork", name: "Fieldwork", client: "Fictional botanical soap maker", category: "Packaging", year: "2025",
    summary: "Everyday rituals, wrapped in a little wilderness.", color: "#ced3bd", ink: "#304738", industry: "Personal care",
    challenge: "Make a small imagined soap range easy to navigate while avoiding the anonymous visual language common to botanical products.",
    audience: "Design-conscious gift buyers and repeat purchasers. The concept assumes uncoated stock, a single green ink, and a shared wrap size to reduce print complexity.",
    direction: "Botanical contour lines become a landscape rather than a scientific illustration. A decorative monogram was set aside because it competed with scent names at shelf scale.",
    system: "A generous serif name sits above a small, consistent ingredient panel. A numbered band identifies variants without using color alone. Green ink and warm paper keep the range cohesive.",
    process: "Folded paper dummies tested where the band crosses the seam. The final wrap leaves a quiet rear panel for ingredient, batch, and regulatory information, which is not supplied in this concept.",
    delivery: "Three packaging studies, a wrap dieline concept, and a small retail card. These are not manufacturing-ready labels; ingredient, sustainability, and regulatory claims require verification.",
    applications: ["Packaging / range concept", "Packaging / system board", "Process / contour studies"],
    captions: ["A botanical soap wrap with a green contour motif and numbered variant.", "A Fieldwork label and copy study alongside green palette, serif specimen, and grid.", "Vector sketches compare a monogram, concentric contours, and tilted botanical contours."]
  },
  {
    slug: "margin-notes", name: "Margin Notes", client: "Self-initiated publication", category: "Editorial", year: "2025",
    summary: "An independent journal for the things between the lines.", color: "#e8d8e6", ink: "#513557", industry: "Publishing",
    challenge: "Design a speculative journal where essays and visual fragments can coexist without making long-form reading exhausting.",
    audience: "Readers interested in the built environment. The brief assumes a 64-page issue, no commissioned photography, and a repeatable production grid.",
    direction: "Oversized marginal numbers become navigational landmarks. A dense newspaper route was rejected because it gave short fragments too little space to breathe.",
    system: "A six-column grid supports two text measures. Plum on lilac marks essays; warm white interiors would carry longer reading. Serif display and sans-serif annotations make separate reading layers.",
    process: "Blank pagination dummies mapped pauses between essays. Spread studies tested the gutter and a consistent baseline. All visible fragments are original display text, not reproduced articles.",
    delivery: "Cover, contents, and spread studies only. No journal was published and no circulation or editorial partnership is implied.",
    applications: ["Editorial / issue cover", "Editorial / system board", "Process / pagination studies"],
    captions: ["A lilac journal cover with large plum typography and marginal numbering.", "A Margin Notes cover and display-copy study with lilac palette, serif specimen, and grid.", "Three vector layout sketches compare staggered columns and aligned reading grids."]
  },
  {
    slug: "open-index", name: "Open Index", client: "Fictional design archive", category: "Digital", year: "2026",
    summary: "A calm, useful home for a growing collection of ideas.", color: "#c5d9ef", ink: "#253d65", industry: "Digital culture",
    challenge: "Give a hypothetical independent archive a legible digital identity without treating every item as a competing featured story.",
    audience: "Students and researchers browsing on phones as well as desktops. The concept prioritises text labels, visible categories, and low-bandwidth artwork.",
    direction: "An index-card metaphor provides a familiar mental model without ornamental skeuomorphism. A free-floating canvas was rejected because it obscured reading order.",
    system: "Blue rules, numbered entries, and a quiet grotesk hierarchy separate collection metadata from narrative. A single grid translates from three columns to one without rearranging the content.",
    process: "Low-fidelity paper screens tested category labels and item density. Focus states were specified alongside hover states. This portfolio presents visual studies, not a working archive product.",
    delivery: "Responsive art-direction boards and component specifications. No archive accounts, records, analytics, or live search service exist.",
    applications: ["Digital / art-direction board", "Digital / system board", "Process / index studies"],
    captions: ["A blue digital index study with numbered cards and horizontal rules.", "An Open Index interface and copy study with blue palette, sans-serif specimen, and grid.", "Vector wireframes compare scattered index cards with ordered, aligned modules."]
  },
  {
    slug: "slow-days", name: "Slow Days", client: "Self-initiated reading club", category: "Brand Identity", year: "2025",
    summary: "A gentle reminder to put the world on pause.", color: "#f0d48d", ink: "#78462f", industry: "Community & reading",
    challenge: "Build a concept identity for a reading club without the familiar pile-of-books icon, and make quiet participation feel as valued as discussion.",
    audience: "Readers who want an unhurried social space. The fictional brief requires inexpensive home-printable invitations and no membership app.",
    direction: "A low, wide sun becomes a visual pause. A handwritten approach was rejected for reducing legibility and suggesting a single host rather than a shared community.",
    system: "A warm ochre field, generous letter spacing, and a horizon rule keep the identity intentionally sparse. The sun may crop at the edges but event instructions stay inside a fixed safe area.",
    process: "Circular and elliptical forms were compared in black and white. Folded invitation studies established a clear front message and a practical reverse side for details.",
    delivery: "Concept mark, invitation, bookmark, and reading-card artwork. This club has no real members, meetings, endorsements, or participation results.",
    applications: ["Identity / quiet mark", "Identity / system board", "Process / horizon studies"],
    captions: ["An ochre reading-club identity with a wide sun and a horizon line.", "A Slow Days identity and invitation-copy study with ochre palette, serif specimen, and grid.", "Vector sketches compare an open-book icon, a circle, and a wide sun over a horizon."]
  }
];
export const services = [
  { name: "Brand identity", fit: "For organizations finding their voice or turning a new page.", deliverables: "Strategy workshop, identity system, typography, color, and practical guidelines.", shape: "Typically 4–6 weeks; two concept directions and two consolidated refinement rounds." },
  { name: "Campaign art direction", fit: "For cultural projects with something worth gathering around.", deliverables: "A central creative idea, poster family, social toolkit, and rollout guidance.", shape: "Typically 3–5 weeks; agreed formats and two feedback rounds." },
  { name: "Packaging & editorial", fit: "For thoughtful objects and stories that deserve a physical life.", deliverables: "Packaging or publication design, print specifications, and production-ready files after approval.", shape: "Typically 4–8 weeks; scope depends on variants, pagination, and printer requirements." },
  { name: "Digital design", fit: "For small teams translating an identity to the screen.", deliverables: "Responsive page designs, accessible component states, and a developer handoff.", shape: "Typically 3–6 weeks; design only, with development scoped separately." }
];
export const testimonials = [
  { title: "A place for a real client perspective", text: "Testimonial placeholder. A verified client quote, name, role, company, and permission to publish belong here. No fictional praise is presented as an endorsement." },
  { title: "Evidence, not decoration", text: "Results placeholder. Add approved launch photographs, an attributable review, or a measured outcome with its source and timeframe before publishing." }
];
export const siteUrl = "https://mara-vale.example";
