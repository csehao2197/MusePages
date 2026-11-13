# Vessel Gallery — Contemporary Art Gallery Website Prompt

## 1. Goal Statement
Build an uncompromisingly minimal contemporary art gallery website for **Vessel Gallery**, defined by pure white, near-black text, and extreme negative space — where the interface disappears entirely and the work is the only thing with colour on the page.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(0, 0%, 100%);        /* pure white cube */
  --foreground: hsl(0, 0%, 8%);          /* #141414 */
  --primary: hsl(0, 0%, 8%);             /* no accent colour by design */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(0, 0%, 48%);
  --border: hsl(0, 0%, 90%);
  --card: hsl(0, 0%, 98%);
}
```
There is deliberately **no accent colour**. The only saturation on the page comes from the artworks themselves.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Inter 300, clamp(28px, 3vw, 46px), letter-spacing -0.02em — deliberately small for a hero
- **H2:** Inter 400, 22–30px
- **H3 / artist names:** Inter 500, 16–18px
- **Body:** Inter 300, 16px, line-height 1.8
- **Labels / captions:** Inter 400, 12px, letter-spacing 0.06em, muted — set like wall labels
- **Dates:** Inter 400, tabular-nums, 12px

Everything is small. The restraint is the design.

## 5. Visual Effects

**Effect 1 — Wall label captions.** Every image caption is set exactly like a gallery wall label: artist name, title in italic, year, medium, dimensions, each on its own line at 12px, left-aligned, with generous leading.

```jsx
<figure>
  {/* Image: contemporary abstract painting hanging on a white gallery wall, even diffuse lighting, plenty of surrounding white space */}
  <img src="" alt="Untitled work by represented artist" className="w-full object-cover object-center" />
  <figcaption className="mt-5 space-y-0.5 text-xs leading-relaxed text-[var(--muted-foreground)]">
    <div className="text-[var(--foreground)]">Ines Okafor</div>
    <div><em>Slow Water (iv)</em>, 2025</div>
    <div>Oil and pigment on linen</div>
    <div>180 × 140 cm</div>
  </figcaption>
</figure>
```

**Effect 2 — Cursor-only hover state.** Works have no visible hover chrome. Instead the cursor becomes a small circle containing the word `View`, following the pointer with a spring. On touch devices this is disabled and a plain caption link appears.

## 6. Component Breakdown

1. **Navbar** — 88px, static (not sticky), white, no border. Small wordmark left, five links right at 12px letterspaced. Nothing else.
2. **Hero** — no image, no fullscreen. Just the current exhibition set as a text block in the top third: artist name, exhibition title in italic, dates, and one line of curatorial text. Enormous white space below.
3. **Current exhibition** — a single full-width installation image with a wall label beneath. *Image: gallery interior with large artworks on white walls, polished concrete floor, even diffuse daylight, no people.*
4. **Works** — a deliberately sparse grid: two columns on desktop with very large gutters, each work with a wall label (Effect 1). No lightbox chrome.
5. **Artists** — a plain list of represented artists, name and one-line practice description, each linking to a page. No portraits, no cards.
6. **Exhibition archive** — a reverse-chronological table: year, artist, exhibition title, dates. Nothing more.
7. **Viewing room** — a short section describing the private online viewing room with an enquiry link, positioned as a service for collectors rather than a shop.
8. **Art fairs** — three upcoming fairs with booth numbers and dates.
9. **Enquiries** — a single text block with an email address, a phone number, and a note about availability lists. No form.
10. **Visit** — address, hours, a line about admission being free, and step-free access information.
11. **Footer** — white, one thin top border, three short columns, mailing list link at 12px.

## 7. Animations

Motion is minimal by design. A gallery site that animates is a gallery site that looks like a startup.

- Images fade in only — `opacity 0 → 1`, 0.9s, no movement, no scale
- Wall labels fade in 0.2s after their image
- The custom cursor follows with a spring (stiffness 220, damping 26)
- Section transitions: none. Sections simply exist.
- No parallax, no counters, no sliders, no scroll-jacking anywhere

## 8. Responsive
- **Mobile (<768px):** navigation collapses to a plain text `Menu` toggle that reveals a stacked list, no overlay animation; works go to 1-col with the same generous vertical spacing; custom cursor disabled and captions become tappable; archive table becomes stacked rows.
- **Tablet:** works stay 2-col with reduced gutters.
- **Desktop:** max width 1280px but content deliberately confined to about 60% of it, `px-16`, section spacing `py-32` — twice what a normal site uses.

## 9. Full Copy

**Brand:** VESSEL GALLERY · Copenhagen

**Navbar:** Current · Works · Artists · Archive · Visit

**Hero**
- Label: `CURRENT EXHIBITION`
- H1: `Ines Okafor — *Slow Water*`
- Dates: `6 September – 18 October 2026`
- Curatorial line: `Nine new paintings made over two winters in Jutland, in which the horizon is never quite where you expect it.`

**Current exhibition** — `Okafor works in thin layers of oil and raw pigment, building surfaces that read as weather before they read as landscape. Slow Water is her third exhibition with the gallery and the first to include work on unstretched linen.`

**Works**
1. **Ines Okafor** — *Slow Water (iv)*, 2025 — Oil and pigment on linen — 180 × 140 cm
2. **Ines Okafor** — *Slow Water (vii)*, 2026 — Oil and pigment on linen — 210 × 165 cm
3. **Ines Okafor** — *Holdfast*, 2025 — Oil on canvas — 90 × 90 cm
4. **Ines Okafor** — *Untitled (Jutland)*, 2026 — Pigment and wax on unstretched linen — 240 × 190 cm
5. **Ines Okafor** — *Slow Water (i)*, 2024 — Oil on canvas — 120 × 100 cm
6. **Ines Okafor** — *Low Tide, Repeated*, 2026 — Oil and pigment on linen — 165 × 165 cm

Note: `Availability list on request.`

**Artists** — Eyebrow `REPRESENTED`
- **Ines Okafor** — Painting. Weather, water, and the failure of horizons.
- **Tobias Lind** — Sculpture in cast aluminium and salvaged timber.
- **Mariam Haddad** — Photography and archival print, working with family document.
- **Petra Solberg** — Installation and sound, often site-responsive.
- **Kenji Aoyama** — Ceramics and glaze research, exhibited annually.
- **Rune Dahl** — Drawing at very large scale, graphite and gesso.

**Archive** — Eyebrow `PAST EXHIBITIONS`
- `2026` Tobias Lind — *Ballast* — 12 June – 26 July
- `2026` Group — *Four Rooms* — 8 March – 19 April
- `2025` Mariam Haddad — *The Second Archive* — 14 November – 21 December
- `2025` Kenji Aoyama — *Ash Glaze* — 5 September – 25 October
- `2025` Petra Solberg — *Low Frequency* — 30 May – 12 July
- `2025` Rune Dahl — *Two Metres of Graphite* — 21 February – 5 April

**Viewing room** — `A private online viewing room is available to collectors and institutions, with full documentation, condition reports, and installation views at scale. Access is arranged individually rather than by password.`

**Art fairs**
- `Enter Art Fair, Copenhagen` — Booth B14 — 27–30 August 2026
- `Paris Internationale` — Booth 22 — 15–19 October 2026
- `Art Basel Miami Beach` — Nova, Booth N08 — 4–7 December 2026

**Enquiries** — `For availability, pricing, and condition reports: enquiries@vesselgallery.dk · +45 33 55 0142. We reply to everything, usually within a working day.`

**Visit** — `Vesterbrogade 74, 1620 Copenhagen V` · Tue–Fri 12:00–18:00 · Sat 11:00–16:00 · Admission free · `Step-free entrance from the courtyard.`

**Footer** — VESSEL GALLERY · Copenhagen · Mailing list · Instagram · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
