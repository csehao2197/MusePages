# Longitude — Travel Blog Website Prompt

## 1. Goal Statement
Build a warm, editorial travel blog for **Longitude**, written by one person who travels slowly — film-toned photography, a large elegant serif, generous white space, and coordinates printed beneath every photograph like a field notebook.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries, no CMS, no map library, no search. Posts are an array in the code.

## 3. Design System — Colors
```css
:root {
  --background: hsl(38, 26%, 95%);       /* warm paper */
  --foreground: hsl(24, 16%, 15%);
  --primary: hsl(14, 54%, 46%);          /* terracotta */
  --primary-foreground: hsl(38, 26%, 97%);
  --muted-foreground: hsl(24, 8%, 46%);
  --border: hsl(30, 14%, 86%);
  --card: hsl(36, 24%, 91%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **H1:** Newsreader 300, clamp(44px, 6vw, 96px), line-height 1.04, letter-spacing -0.02em
- **H2:** Newsreader 400, clamp(28px, 3.2vw, 44px)
- **Italic:** Newsreader 300 italic for one or two words per headline
- **Body:** Newsreader 300, 19px, line-height 1.75
- **Coordinates, dates, labels:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.1em

## 5. Visual Effects

**Effect 1 — Coordinates under every photo.** Each image caption is set like a field note: place name, then latitude and longitude in monospace, then the month. Left aligned, small, muted.

```jsx
<figure>
  {/* Image: misty mountain road at sunrise, film photography look, muted greens and warm haze */}
  <img src="" alt="Road above Lake Bohinj at sunrise" className="w-full object-cover object-center" />
  <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-widest text-[var(--muted-foreground)]">
    Lake Bohinj, Slovenia · 46.2806&deg; N, 13.8797&deg; E · June
  </figcaption>
</figure>
```

**Effect 2 — Film grain and warm wash.** A fixed noise overlay at 5% opacity over the whole page, and every photograph carries a subtle warm filter: `filter: sepia(0.12) saturate(0.92) contrast(1.04)`.

**Effect 3 — Slow reveal.** Photographs reveal with a clip-path wipe from the bottom and a very slight scale from 1.03 to 1, over 1.1 seconds.

## 6. Component Breakdown

1. **Navbar** — 80px, paper, no border. Wordmark centred in Newsreader, links split left and right, all at 12px mono. Not sticky.
2. **Hero** — a full-width photograph at 76vh with the coordinates caption beneath, then the H1 and one paragraph of introduction in a narrow centred column.
3. **Latest dispatch** — one featured post: large image left, text right with mono date, title, three-line excerpt and a `Read` link.
4. **Recent posts** — a three-column grid of six posts, each with an image at 4:5, mono country label, title, and reading time.
5. **Where I've been** — a plain two-column list of countries with the year beside each, no map.
6. **The slow travel note** — a short manifesto in a narrow column with a pull quote in italic, set larger.
7. **Photo strip** — five images in a row at varied widths, edge to edge, each with its coordinates caption.
8. **Gear I actually carry** — a simple list of eight items with a one-line reason for each.
9. **Newsletter** — paper card on `--card` with a short line and a single email input.
10. **About** — a small portrait, three sentences, and links to Instagram and email.
11. **Footer** — thin top border, three columns, mono links.

## 7. Animations
- All images: Effect 3
- Text blocks: fade up 14px, 0.8s, stagger 0.08s
- Post cards: image scales to 1.04 over 0.9s on hover, title underline sweeps in
- Photo strip: images reveal left to right with 0.12s stagger
- No parallax, no carousels, no counters

## 8. Responsive
- **Mobile (<768px):** hero image drops to 56vh; H1 at 44px; recent posts become a single column; photo strip becomes a horizontal snap-scroll row; countries list becomes one column; navbar collapses to a centred wordmark with a mono `Menu` toggle.
- **Tablet:** posts 2 columns.
- **Desktop:** max-width 1200px for text, photo strip full-bleed, `px-8`, section spacing `py-28`.

## 9. Full Copy

**Brand:** LONGITUDE · A slow travel journal by Ines Marchetti

**Navbar:** Dispatches · Places · Gear · About — Subscribe

**Hero**
- Image caption: `Lake Bohinj, Slovenia · 46.2806° N, 13.8797° E · June`
- H1: `Fewer places, *longer* stays.`
- Introduction: `I spend a month in each place, learn where the bread is good, and write it down. No itineraries, no top ten lists, and nothing sponsored. Just what it is actually like to be somewhere for a while.`

**Latest dispatch** — Label `LATEST DISPATCH`
- Date: `12 SEPTEMBER 2026`
- Title: `Four weeks in the *Julian Alps*`
- Excerpt: `I went for the lake and stayed for the valley behind it. Here is what a month in Bohinj costs, which buses actually run in shoulder season, and why I would go back in October instead of July.`
- Link: `Read the dispatch`

**Recent posts** — H2 `Recent *dispatches*.`
1. `PORTUGAL` — **The Alentejo has no crowds and no shade** — 9 min
2. `JAPAN` — **A month of trains in Tohoku, off the tourist line** — 12 min
3. `MOROCCO` — **Living in Taghazout for the winter, honestly** — 8 min
4. `SCOTLAND` — **Walking the Fife Coastal Path in bad weather** — 7 min
5. `ITALY` — **Puglia in November, when it is all still open** — 10 min
6. `GEORGIA` — **Tbilisi on twenty euros a day** — 11 min
*Image briefs: film-toned travel photography — a sun-bleached Portuguese plain, a rural Japanese train platform, a Moroccan surf village, a grey Scottish coastline, an empty Italian piazza, a Tbilisi balcony.*

**Where I've been** — Label `PLACES`
Slovenia `2026` · Portugal `2026` · Japan `2025` · Morocco `2025` · Scotland `2025` · Italy `2024` · Georgia `2024` · Albania `2024` · Mexico `2023` · Norway `2023`

**The slow travel note** — H2 `A month is the *shortest* useful trip.`
`A week tells you what a place looks like. A month tells you what it is like to live there badly, which is more interesting. You find out which shop is open on Sunday, how the buses actually behave, and what everyone complains about.`
Pull quote: `*The good part is always the second week, when you stop taking photographs of everything.*`

**Photo strip** — captions:
- `Taghazout, Morocco · 30.5450° N, 9.7100° W · February`
- `Aomori, Japan · 40.8244° N, 140.7400° E · April`
- `Monsaraz, Portugal · 38.4436° N, 7.3797° W · May`
- `Elie, Scotland · 56.1880° N, 2.8170° W · August`
- `Tbilisi, Georgia · 41.7151° N, 44.8271° E · October`

**Gear I actually carry** — H2 `Eight things, *nothing else*.`
- **A 38-litre backpack** — `If it doesn't fit, it doesn't come. Carry-on only, every time.`
- **One film camera** — `Thirty-six frames a week makes you think before you press it.`
- **Merino everything** — `Three shirts, worn in rotation, washed in sinks.`
- **A paper notebook** — `Phones die and notes apps are for lists, not sentences.`
- **An e-reader** — `Loaded before I leave, because rural wifi is a rumour.`
- **A plug adapter with two USB-C ports** — `The single most useful object I own.`
- **Trail runners** — `They handle a mountain and a dinner. Boots handle one.`
- **A packable rain shell** — `Bought in Scotland, for obvious reasons.`

**Newsletter** — H2 `One letter a *month*.` `Where I am, what it costs, and one photograph. No affiliate links, ever.` Input `Your email` · Button `Subscribe`

**About** — `I'm Ines. I left a design job in Milan in 2023 and have been moving every month or two since. I pay for my own trips. If something was bad I'll say so.` Links: `Instagram` · `ines@longitude.blog`

**Footer** — LONGITUDE · Dispatches · Places · Gear · About · Newsletter · Instagram · `Written and photographed by Ines Marchetti` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
