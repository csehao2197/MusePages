# Artist Portfolio Website Prompt
# websiteprompts.ai

---

Build a complete artist portfolio website for **Yuki Nakamura** — a contemporary painter. The paintings are the entire point. Every layout decision exists to show the work at maximum size and impact — not to decorate around it. Warm white foundation, fixed vertical black spine with the artist's name, DM Serif Display italic headlines, red accent. The UI is a quiet frame around loud artwork. Think how a gallery hangs paintings: generous space, no competition, full attention.

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## Design System

```css
:root {
  --background: 40 18% 98%;          /* #fdfcfa warm near-white */
  --surface: 40 14% 95%;             /* #f5f3ef warm surface */
  --border: 36 16% 87%;              /* #e4e0d8 warm border */
  --border-soft: 36 12% 92%;         /* #edeae4 subtle border */
  --foreground: 42 14% 7%;           /* #111008 warm near-black */
  --muted-foreground: 38 10% 52%;    /* #888070 warm grey */
  --subtle: 36 8% 70%;               /* #bbb8b0 very muted */
  --spine: 42 14% 7%;                /* #111008 spine background */
  --primary: 10 74% 47%;             /* #d4341a terracotta red */
  --primary-foreground: 0 0% 100%;
  --spine-width: 56px;
  --mono: 'JetBrains Mono', monospace;
}
```

---

## Typography

Import: `https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400&display=swap`

- **Display / H1–H3**: DM Serif Display italic 400, letter-spacing -0.02em, line-height 0.92–1.05
- **UI / Body / Nav**: DM Sans 300–500, neutral and invisible
- **Labels / Tags / Year / Medium**: JetBrains Mono 400, uppercase, letter-spacing 0.12–0.20em, color muted
- **Painting titles in work view**: DM Serif Display italic, large

---

## Visual Effects

### 1. Fixed vertical spine

A permanent left column, `width: var(--spine-width)`, `position: fixed`, `top: 0`, `bottom: 0`, `left: 0`, `z-index: 200`, `background: hsl(var(--spine))`. Contains the artist name written vertically:

```css
.spine-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: 'DM Serif Display', serif;
  font-style: italic;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(253, 252, 250, 0.28);
  user-select: none;
}
```

All page content is offset by `margin-left: var(--spine-width)`.

### 2. Painting fullscreen lightbox

Clicking any painting opens a fullscreen lightbox (fixed, z-index 500):
- `background: hsl(var(--foreground))` — deep near-black
- Painting centered, `max-height: 90vh`, `max-width: 90vw`, `object-fit: contain`
- Painting enters: `initial={{ opacity: 0, scale: 0.94 }}` → `animate={{ opacity: 1, scale: 1 }}`, duration 0.45s, ease `[0.16, 1, 0.3, 1]`
- Close button (top-right): "✕" in JetBrains Mono, `color: rgba(253,252,250,0.5)`, on hover foreground
- Painting title + medium + year below painting: DM Serif Display italic 18px warm white
- Background click closes lightbox
- Left/right keyboard arrows navigate between paintings

### 3. Painting hover reveal — title + year

On each painting card hover:
```
Overlay: position absolute, inset 0
Background: linear-gradient(to top, rgba(17,16,8,0.72) 0%, transparent 50%)
Title: DM Serif Display italic 17px — slides up from y:10 to y:0, opacity 0→1, duration 0.3s
Year + medium: JetBrains Mono 9px — same stagger
```

### 4. Scroll-triggered section entrance

All sections:
```
initial={{ opacity: 0, y: 28 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
Trigger: useInView, once: true, margin: '-60px'
Stagger children: delay: index * 0.08
```

### 5. Hero painting entrance

The hero painting scales in on load:
```
initial={{ opacity: 0, scale: 1.03 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
```

### 6. Red accent line

A 1px `hsl(var(--primary))` horizontal line animates in before section headings:
```
initial={{ scaleX: 0, transformOrigin: 'left' }}
animate={{ scaleX: 1 }}
transition={{ duration: 0.5, ease: 'easeOut' }}
Width: 36px
```

---

## Section Breakdown

### Section 1 — Spine + Navbar

**Spine**: Fixed left column, 56px wide, dark. "Yuki Nakamura" written vertically (see Visual Effects).

**Navbar**: Fixed top, `left: var(--spine-width)`, `right: 0`, `background: hsl(var(--background) / 0.96)`, `backdrop-filter: blur(12px)`, `border-bottom: 1px solid hsl(var(--border))`. Height 60px. Padding 0 56px. `display: flex`, justify-between, align-items center.

- Left: "Yuki Nakamura" — DM Serif Display italic 16px, letter-spacing -0.01em, color foreground
- Center links: Work · Series · Exhibitions · About — DM Sans 12px weight 400, color muted-foreground, letter-spacing 0.02em. On hover: color foreground.
- Right: "Contact →" — DM Sans 12px, color foreground, background none, border none, `border-bottom: 1px solid hsl(var(--foreground))`, cursor pointer. On hover: color primary, border-color primary.

---

### Section 2 — Hero (single featured painting, maximum size)

Full viewport height, `padding-top: 60px` (nav height). Background: `hsl(var(--surface))`. The painting is the entire hero — no competing text.

**Layout**: `display: grid`, `grid-template-rows: 1fr auto`, `height: calc(100vh - 60px)`.

**Top block — painting (takes ~80% of viewport height)**:

A single large featured painting fills the space. `padding: 40px 56px 0`. The painting itself: `height: 100%`, `width: 100%`, `object-fit: contain`, `object-position: center`.

```
{/* Image: large-scale contemporary oil painting, expressive gestural marks, rich earthy pigments — ochre, burnt sienna, raw umber, pale grey — on linen canvas, professional gallery documentation photography, neutral grey gallery wall background */}
<motion.img
  src=""
  alt="Dissolution I — oil on linen, 200×160cm, 2025"
  className="h-full w-full object-contain object-center"
  style={{ entering animation: scale 1.03→1 }}
/>
```

**Bottom caption bar**: `padding: 20px 56px`, `border-top: 1px solid hsl(var(--border))`, `display: flex`, justify-between, align-items center.

- Left: Painting title in DM Serif Display italic 20px foreground + medium + dimensions in JetBrains Mono 10px muted below, gap 4px
- Center: Navigation dots — 6 dots, active dot filled `hsl(var(--foreground))`, inactive `hsl(var(--border))`, width 6px height 6px border-radius 50%. Clicking navigates to that painting. Gap 8px.
- Right: "1 / 6" in JetBrains Mono 10px muted + `<` `>` arrow buttons, 28px × 28px, `border: 1px solid hsl(var(--border))`, color muted, hover: border-color foreground. Gap 8px between arrows.

Hero cycles through 6 featured paintings. Auto-advance every 6 seconds (pause on hover).

---

### Section 3 — Selected Works (painting-first grid)

`background: hsl(var(--background))`, padding 80px 56px. This is the main gallery section.

**Header row**: `display: flex`, justify-between, align-items flex-end, margin-bottom 48px.
- H2: DM Serif Display italic, clamp(38px, 4vw, 54px), "Selected *paintings.*"
- Right: filter chips — All · Oil · Acrylic · Mixed media — DM Sans 12px, `border: 1px solid hsl(var(--border))`, padding 6px 14px, border-radius 100px. Active: `background: hsl(var(--foreground))`, color white, border-color transparent. Inactive: hover border-color foreground.

**Gallery grid**: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, gap 12px. Trigger stagger fade-in on scroll.

12 paintings in total, displayed 3 per row. Each card: overflow hidden, cursor pointer, `border: 1px solid hsl(var(--border-soft))`. On click: open lightbox.

**Painting card structure:**
- Painting image: `aspect-ratio: var(--painting-ratio)` (use 4/5 as default, override per painting with inline style), `object-fit: cover`, `object-position: center`, `width: 100%`. Scale hover animation.
- Hover overlay (see Visual Effects)
- Info strip below painting (padding 12px 0 20px, `border-bottom: 1px solid hsl(var(--border))`):
  - Title: DM Serif Display italic 15px foreground
  - Medium + year: JetBrains Mono 9px uppercase muted, margin-top 4px

Painting content (photography briefs + metadata):

```
[1] {/* Image: large oil painting on linen, warm earthy palette, loose gestural marks suggesting landscape or figure, rich impasto texture, gallery installation shot on white wall */}
Title: "Dissolution I" · Oil on linen, 200×160cm · 2025

[2] {/* Image: contemporary abstract painting, cool blue-grey tones with warm ochre interruptions, smooth blended passages alternating with heavy palette-knife marks */}
Title: "Meridian Blue" · Oil and wax on canvas, 180×140cm · 2024

[3] {/* Image: figurative painting, loosely rendered solitary figure in interior space, muted tonality, soft edges dissolving into ground, contemplative mood */}
Title: "The Threshold" · Oil on linen, 160×120cm · 2024

[4] {/* Image: large vertical painting, deep burgundy and charcoal ground with pale luminous shapes emerging, heavily worked surface, traces of previous layers visible */}
Title: "Night Archive" · Oil on canvas, 240×180cm · 2024

[5] {/* Image: horizontal landscape-format painting, pale silvery light, horizon implied not stated, minimal marks on large expanse of toned ground */}
Title: "Hakodate (Winter)" · Oil on linen, 200×140cm · 2023

[6] {/* Image: intimate small-scale painting, warm amber and sienna tones, circular or oval form floating on neutral ground, meditative quality */}
Title: "Evidence I" · Oil on panel, 60×50cm · 2023

[7] {/* Image: gestural abstract painting in vivid unexpected color — electric teal against warm red-orange ground, expressive urgent marks */}
Title: "Interruption" · Acrylic on canvas, 160×120cm · 2023

[8] {/* Image: diptych painting, two related panels with similar marks in different keys, cool left panel warm right panel, shown as pair */}
Title: "Correspondence (I & II)" · Oil on linen, 2 × 100×80cm · 2022

[9] {/* Image: large abstract painting with dense layered surface, map-like quality, subtle shifts in tone suggesting depth and time, quiet and complex */}
Title: "Stratum" · Oil and cold wax, 180×180cm · 2022

[10] {/* Image: painting with strong geometric armature softened by gestural painting, grid or window-like structure emerging from heavily worked ground */}
Title: "Interior Grid" · Mixed media on canvas, 140×110cm · 2022

[11] {/* Image: figurative painting fragment, close-cropped hands or face, tender observation, warm skin tones against cool grey */}
Title: "Study (Hands)" · Oil on panel, 40×30cm · 2021

[12] {/* Image: large dark painting, almost monochrome, subtle texture and tone variations across the surface, a sense of compressed space and pressure */}
Title: "Weight" · Oil on linen, 220×170cm · 2021
```

**"Load more" button** below grid (margin-top 40px, centered): DM Sans 12px, `border: 1px solid hsl(var(--border))`, padding 11px 28px, color muted-foreground, hover: border-color foreground color foreground.

---

### Section 4 — Featured Series

`background: hsl(var(--surface))`, `border-top: 1px solid hsl(var(--border))`, padding 80px 56px.

**Header**: Red accent line reveal. H2: DM Serif Display italic, clamp(36px, 3.5vw, 50px): "*Series* in focus."

**Three series, each in a row**:

`display: flex`, flex-direction column, gap 0. Each series row: `display: grid`, `grid-template-columns: 1fr 2fr`, gap 0, `border-top: 1px solid hsl(var(--border))`, padding 40px 0.

Row structure:
- Left: series info column (padding-right 48px, `border-right: 1px solid hsl(var(--border))`)
  - Series title in DM Serif Display italic 28px foreground
  - Year range in JetBrains Mono 10px muted, margin-top 6px
  - Description in DM Sans 300 14px muted line-height 1.85, margin-top 16px, max-width 320px
  - "View series →" text link, DM Sans 12px foreground, border-bottom 1px, margin-top 24px
- Right: horizontal scrollable row of painting thumbnails, `padding-left: 40px`, `display: flex`, gap 10px, `overflow-x: auto`, `scrollbar-width: none`. Each thumb: `height: 200px`, `width: auto`, `flex-shrink: 0`, `border: 1px solid hsl(var(--border-soft))`, object-fit cover.

Three series:

**1. Dissolution** (2024–2025) — 8 paintings
"An ongoing inquiry into the point at which a form stops being recognisable. Where does the figure end and the field begin?"

Photo briefs for 4 visible thumbs:
```
[T1] {/* oil painting warm earthy tones, gestural marks on linen */}
[T2] {/* related painting same series, cooler palette, similar gesture */}
[T3] {/* vertical format, pale ground with dark dissolved form */}
[T4] {/* heavily worked surface, multiple layers visible at edges */}
```

**2. Night Archive** (2023–2024) — 6 paintings
"Works made after midnight. The studio at night has a different quality of silence. These paintings know something the daytime ones don't."

```
[T1] {/* dark ground painting, luminous shape emerging from darkness */}
[T2] {/* deep burgundy and charcoal, oil on canvas, large format */}
[T3] {/* near-black painting with warm undertones glowing through */}
[T4] {/* small study, candlelit quality, intimate scale */}
```

**3. Evidence** (2021–2023) — 9 paintings
"Small-format works made as a kind of note-taking. Each painting records something seen, half-seen, or remembered differently each time."

```
[T1] {/* small panel, warm amber tone, single soft form */}
[T2] {/* intimate study, muted grey with single warm note */}
[T3] {/* oil on panel, pale ground, delicate mark-making */}
[T4] {/* small square format, earthy ground, spare marks */}
```

---

### Section 5 — Single Work Feature (editorial pull-out)

Full-width, `background: hsl(var(--foreground))`, padding 0. Dark inversion — the painting sits in a near-black field as it would in a darkened gallery.

`display: grid`, `grid-template-columns: 1fr 380px`, `min-height: 80vh`.

**Left — painting** (padding 60px, display flex, align-items center, justify-content center):
```
{/* Image: commanding large-scale oil painting, rich pigment, compelling presence, centered on dark background as if lit in a gallery, atmospheric lighting */}
<img src="" alt="Dissolution IV — oil on linen, 240×180cm" className="max-h-[80vh] max-w-full object-contain" />
```

**Right — details** (padding 60px 48px, `border-left: 1px solid rgba(253,252,250,0.1)`, display flex, flex-direction column, justify-content center, gap 28px):

- "In focus" — JetBrains Mono 9px uppercase letter-spacing 0.18em, `color: hsl(var(--primary))`, margin-bottom 8px
- Title: DM Serif Display italic 32px `color: hsl(var(--background))`
- Metadata list (gap 14px):
  - Year: JetBrains Mono 9px muted label + value in DM Sans 300 14px warm white
  - Medium: same pattern
  - Dimensions: same
  - Series: same
  - Available: "Private collection" — DM Sans 13px `rgba(253,252,250,0.5)`
- Horizontal rule: 1px `rgba(253,252,250,0.1)`, margin 8px 0
- Statement (2 short paragraphs): DM Sans 300 14px `rgba(253,252,250,0.55)` line-height 1.9
- "View full painting →" — DM Sans 12px `hsl(var(--background))`, `background: hsl(var(--primary))`, padding 11px 20px, border-radius 1px, margin-top 8px, display inline-block, width fit-content

Content:
- **Title**: "Dissolution IV"
- **Year**: 2025
- **Medium**: Oil on linen
- **Dimensions**: 240 × 180 cm
- **Series**: Dissolution (2024–2025)
- **Available**: Private collection
- **Statement**: "Made over four months and entirely reworked twice. What remains is the third attempt to find what the painting was trying to be. The ground is still visible in places — I wanted it to be." / "Dissolution IV has been shown at Sprüth Magers (Berlin, 2025) and Sadie Coles HQ (London, 2024)."

---

### Section 6 — Exhibitions

`background: hsl(var(--background))`, `border-top: 1px solid hsl(var(--border))`, padding 80px 56px.

**Header**: Red line reveal. H2: DM Serif Display italic, clamp(36px, 3.5vw, 50px): "*Exhibition* history."

Tabs: "Solo" / "Group" / "All" — DM Sans 12px, same filter chip style as work section.

Exhibition list, flex-column, gap 0. Each row:
`display: grid`, `grid-template-columns: 72px 1fr 200px 80px 60px`, gap 24px, padding 18px 0, `border-bottom: 1px solid hsl(var(--border))`, align-items baseline.

Columns: Year · Exhibition title · Venue · City · Type badge

Year: JetBrains Mono 10px muted.
Title: DM Serif Display italic 15px foreground, hover: color primary.
Venue: DM Sans 300 13px muted.
City: JetBrains Mono 9px uppercase muted.
Type badge: "Solo" in `color: hsl(var(--primary))` / "Group" in muted, JetBrains Mono 9px uppercase.

12 exhibitions:
1. 2025 · "Dissolution" · Sprüth Magers · Berlin · Solo
2. 2025 · "The Body Electric" (group) · Tate Modern · London · Group
3. 2024 · "The Edge of Documents" · Foam Museum · Amsterdam · Solo
4. 2024 · "New Painting Now" · ICA · London · Group
5. 2024 · "Night Archive" · Sadie Coles HQ · London · Solo
6. 2023 · "Deutsche Börse Prize Exhibition" · The Photographers' Gallery · London · Group
7. 2023 · "Evidence" · STANDARD (OSLO) · Oslo · Solo
8. 2022 · "Stratum" · Galerie Chantal Crousel · Paris · Solo
9. 2022 · "Young Artists Now" · Serpentine · London · Group
10. 2021 · "Weight" · Fondazione Prada · Milan · Group
11. 2020 · "Weight" · Oslo Kunsthall · Oslo · Solo
12. 2019 · "Early Works" · Studio Voltaire · London · Group

---

### Section 7 — About

`background: hsl(var(--surface))`, `border-top: 1px solid hsl(var(--border))`, padding 80px 56px. `display: grid`, `grid-template-columns: 1fr 1fr`, gap 80px, align-items start.

**Left — portrait:**

`border: 1px solid hsl(var(--border))`, overflow hidden, border-radius 1px.
```
{/* Image: artist portrait, painter in studio, surrounded by large canvases, natural light from north-facing windows, paint on hands or apron, candid and genuine, not posed */}
<img src="" alt="Yuki Nakamura in studio" className="w-full aspect-[3/4] object-cover object-center" />
```

Caption below portrait: "Studio, Tokyo — 2025" in JetBrains Mono 9px uppercase muted, margin-top 10px.

**Right — bio (flex column, gap 28px):**

Red line reveal.
H2: DM Serif Display italic, clamp(32px, 3.2vw, 44px): "About *the work.*"

Three bio paragraphs (DM Sans 300 14px muted line-height 1.9):
1. "Yuki Nakamura (b. 1986, Tokyo) is a painter working between Tokyo and Berlin. Her work explores the resistance of material — the way oil paint holds and refuses and surprises — and what happens when representation is taken to the point of its own dissolution."
2. "She holds an MFA from the Städelschule, Frankfurt (2014) and has exhibited internationally since 2016. Her work is held in collections including the Tate Modern, London; Museum Ludwig, Cologne; and the National Museum of Art, Osaka."
3. "She is represented by Sprüth Magers (Berlin/London) and STANDARD (OSLO)."

CV + links row (margin-top 8px):
- "Download CV (PDF)" — DM Sans 12px, `border: 1px solid hsl(var(--border))`, padding 10px 20px, color muted. On hover: border-color foreground, color foreground.
- "Press & publications →" — same style

Press mentions (margin-top 32px, padding-top 24px, `border-top: 1px solid hsl(var(--border))`):

Label: "Press" — JetBrains Mono 9px uppercase muted, margin-bottom 14px.
List of 4 quotes (DM Sans 300 13px foreground-muted line-height 1.7, gap 16px):
- "One of the most compelling painters working today." — Frieze
- "Nakamura's surfaces hold a rare quality of attention." — Artforum
- "Quiet, devastating, completely necessary." — The Guardian
- "Winner, Deutsche Börse Photography Foundation Prize 2023." — Deutsche Börse

---

### Section 8 — Contact / Representation

`background: hsl(var(--background))`, `border-top: 1px solid hsl(var(--border))`, padding 80px 56px. `display: grid`, `grid-template-columns: 1fr 1fr`, gap 80px.

**Left:**

Red line reveal.
H2: DM Serif Display italic, clamp(36px, 3.5vw, 50px): "Get in *touch.*"

DM Sans 300 14px muted line-height 1.85, margin 20px 0 32px: "For studio visits, acquisition enquiries, exhibition proposals, press requests, and everything else — please reach out directly or through her gallery representatives below."

**Representation block** (two gallery entries, gap 24px):
Each: `background: hsl(var(--surface))`, `border: 1px solid hsl(var(--border))`, padding 20px 24px, border-radius 1px.
- Gallery name: DM Serif Display italic 17px foreground
- Location: JetBrains Mono 9px uppercase muted, margin-top 4px
- Contact: DM Sans 12px muted, margin-top 8px, border-bottom 1px border on hover

Galleries:
- **Sprüth Magers** · Berlin & London · info@spruethmagers.com
- **STANDARD (OSLO)** · Oslo · mail@standardoslo.no

Direct contact:
- studio@yukinakamura.com — DM Sans 13px foreground, `border-bottom: 1px solid hsl(var(--border))`

**Right — contact form:**

DM Serif Display italic 20px foreground "Send a *message.*", margin-bottom 24px.

Form fields (DM Sans 13px, gap 12px, flex-column):
- Name (full width)
- Email (full width)
- Enquiry type select: Studio visit · Acquisition · Exhibition proposal · Press · Other
- Message textarea, 5 rows

All inputs: `background: hsl(var(--surface))`, `border: 1px solid hsl(var(--border))`, padding 12px 16px, border-radius 1px, color foreground. Focus: `border-color: hsl(var(--primary))`, outline none.

Submit: `background: hsl(var(--foreground))`, color `hsl(var(--background))`, DM Sans 12px weight 500 uppercase letter-spacing 0.06em, padding 13px, full width, border-radius 1px. Hover: `background: hsl(var(--primary))`.

---

### Section 9 — Footer

`background: hsl(var(--foreground))` (near-black). Padding 40px 56px.

`display: flex`, justify-between, align-items center.

- Left: "Yuki Nakamura" — DM Serif Display italic 15px, `color: rgba(253,252,250,0.4)`
- Center: Nav links (Work · Series · Exhibitions · About) — JetBrains Mono 9px uppercase `rgba(253,252,250,0.25)`, gap 24px
- Right: "© 2026" + Instagram icon — JetBrains Mono 9px `rgba(253,252,250,0.25)`

---

## Animations Summary

| Element | Animation | Trigger |
|---|---|---|
| Hero painting | scale 1.03→1, opacity 0→1 | On mount, 0.2s delay |
| Hero caption bar | fade-up y:16 | On mount, 0.6s delay |
| Hero auto-advance | Cross-fade, 6s interval | Timer, pause on hover |
| Work grid paintings | Stagger fade-in | Scroll inView |
| Painting hover overlay | Title/year slide-up y:10 | Hover |
| Lightbox open/close | Scale + fade | Click |
| Series thumbnails | Stagger fade-in | Scroll inView |
| Red line dividers | scaleX 0→1 | Scroll inView |
| Exhibition rows | Stagger fade-up | Scroll inView |
| All sections | Fade-up y:28 | Scroll inView |

---

## Responsive

**Mobile (< 768px):**
- Spine: hidden on mobile (too narrow). Artist name moved to nav.
- Nav: hamburger → full-screen dark overlay with all links
- Hero: painting full-width, `aspect-ratio: 3/4`, caption below
- Work grid: single column, paintings full-width
- Series section: single column, thumbnails horizontal scroll
- Dark feature section: single column, painting above info
- Exhibitions: hide venue/city columns, show only year + title + type
- About: single column
- Contact: single column
- Footer: stacked, centered

**Tablet (768px–1024px):**
- Spine: 40px wide
- Work grid: 2 columns
- Series rows: keep 2-col but reduce gap

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.400.x",
  "@radix-ui/react-select": "^2.x",
  "@radix-ui/react-tabs": "^1.x"
}
```

---

## Quick notes

- All 12 work images + 4 series thumbnails + 1 portrait are described as photography briefs — any contemporary oil painting photography in the described mood will work. The lighter the AI tool, the simpler the image generation — descriptions are written to be flexible.
- The lightbox is the most technically complex element — if the AI tool renders it partially, it still works as a hover-reveal grid.
- Artist name "Yuki Nakamura" and all gallery/exhibition details are placeholder — replace with real information before publishing.
