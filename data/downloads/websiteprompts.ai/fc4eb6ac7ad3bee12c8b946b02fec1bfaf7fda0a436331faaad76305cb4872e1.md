# Interior Design Studio Website Prompt
# websiteprompts.ai

---

Build a complete interior design studio website for **Lumine Studio** — a high-end residential and commercial design practice. Near-black foundation, warm cream typography, sand accent. The design is moody, editorial, and deeply luxurious — spaces that whisper rather than shout. Think Axel Vervoordt meets a modern branding studio. Every detail considered, nothing superfluous.

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## Design System

```css
:root {
  --background: 30 10% 8%;           /* #100f0d near-black warm */
  --surface: 30 8% 10%;              /* #171613 surface */
  --surface-raised: 30 7% 12%;       /* #1f1d1a card bg */
  --surface-hover: 30 6% 16%;        /* #2a2825 hover state */
  --border: 30 6% 22%;               /* #38352f warm border */
  --border-soft: 30 5% 28%;          /* #484440 secondary */
  --foreground: 36 28% 92%;          /* #f2ede4 warm off-white */
  --foreground-muted: 36 12% 52%;    /* #8a8478 muted warm */
  --foreground-subtle: 36 8% 36%;    /* #5e5a54 subtle */
  --sand: 32 40% 64%;                /* #c4a882 warm sand accent */
  --sand-light: 32 28% 16%;          /* #2e261c sand tint bg */
  --sand-muted: 32 20% 40%;          /* #6e5e48 sand muted */
  --cream: 36 30% 94%;               /* #f0ebe2 near-white cream */
}
```

---

## Typography

Import: `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400;1,9..144,500&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400&display=swap`

- **Display / H1–H2**: Fraunces 300–400, optical-size 72–144, letter-spacing -0.01em, line-height 0.95. Italic variant for emphasis words.
- **Subheadings / H3**: Fraunces 300 italic, optical-size 9–36, smaller size
- **UI / Body / Nav**: DM Sans 300–500, clean and neutral
- **Labels / Tags / Prices**: JetBrains Mono 400, uppercase, letter-spacing 0.12–0.18em

---

## Visual Effects

### 1. Hero image parallax

Right panel photo scrolls at 0.6× scroll speed (parallax):
```jsx
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 800], [0, -120]);
// Apply to <motion.div> wrapping the hero photo
```

### 2. Staggered entrance — hero content

H1 lines reveal with clip-path on mount:
```
Each line: overflow hidden wrapper
Inner span: initial={{ y: '110%' }}
animate={{ y: '0%' }}
transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: index * 0.14 }
```

Sub and CTAs:
```
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7, ease: 'easeOut', delay: 0.55 }}
```

### 3. Scroll-triggered section reveals

Every section's content fades in on scroll:
```
initial={{ opacity: 0, y: 32 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
Trigger: useInView, once: true, margin: '-80px'
Stagger children: delay: index * 0.10
```

### 4. Project card cursor follower

On project grid hover: a small circular label (`width: 80px, height: 80px`) follows the cursor inside the card container, showing "View →" in JetBrains Mono 9px uppercase. Framer Motion `useMotionValue` for x/y, `useSpring` for smooth lag:
```
const springConfig = { stiffness: 350, damping: 30 }
const cursorX = useSpring(useMotionValue(0), springConfig)
const cursorY = useSpring(useMotionValue(0), springConfig)
// Cursor circle: white, border-radius 50%, mix-blend-mode: difference (or sand bg)
```

### 5. Sand line decorative reveal

A 1px horizontal sand-colored line animates in before each section heading:
```
initial={{ scaleX: 0, transformOrigin: 'left center' }}
animate={{ scaleX: 1 }}
transition={{ duration: 0.6, ease: 'easeOut' }}
Width: 40px, background: hsl(var(--sand)), margin-bottom 16px
```

### 6. Photo hover scale

All project photos:
```css
img { transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.card:hover img { transform: scale(1.04); }
overflow: hidden on parent
```

---

## Section Breakdown

### Section 1 — Navbar (sticky)

Fixed top. `background: hsl(var(--background) / 0.92)`, `backdrop-filter: blur(16px)`, `border-bottom: 1px solid hsl(var(--border))`. Padding 22px 64px.

**Left**: "Lumine Studio" — Fraunces italic 300, font-size 19px, letter-spacing 0.04em, color foreground.

**Center links**: Projects · Services · Studio · Journal · Contact — DM Sans 12px weight 400, letter-spacing 0.04em, color `hsl(var(--foreground-muted))`. On hover: foreground. Active underline: 1px sand-colored underline.

**Right**: "Enquire" — `border: 1px solid hsl(var(--border))`, color foreground-muted, background none, padding 9px 22px, border-radius 2px, DM Sans 12px. On hover: border-color sand, color sand, transition 0.2s.

Mobile: Hamburger (2 thin white lines) → full-screen dark overlay, `background: hsl(var(--background))`, links stacked with large Fraunces italic headings, "Enquire" full-width at bottom.

---

### Section 2 — Hero (split panel)

`display: grid`, `grid-template-columns: 1fr 1fr`, `min-height: 100vh`, `padding-top: 68px` (nav height).

**Left panel — content** (`background: hsl(var(--background))`, padding 80px 64px, `display: flex`, `flex-direction: column`, `justify-content: space-between`, `border-right: 1px solid hsl(var(--border))`):

Top block:
- Location tag: JetBrains Mono 9px uppercase letter-spacing 0.18em color foreground-muted, margin-bottom 32px. Text: "Interior Design Studio · London & Milan"
- H1 with line-reveal animation: Fraunces 300, clamp(56px, 6.5vw, 96px), line-height 0.95, letter-spacing -0.01em. Three lines:
  - "Interiors" — color foreground
  - "that hold" — color foreground
  - "*quiet power.*" — Fraunces italic 300, color `hsl(var(--sand))`

Bottom block:
- Sub: "We create residential and commercial spaces that are refined without being cold, and liveable without compromise." — DM Sans 14px, color foreground-muted, line-height 1.85, max-width 380px, margin-bottom 40px.
- Two buttons, `display: flex`, gap 10px:
  - Primary: "Our projects" — `background: hsl(var(--foreground))`, color `hsl(var(--background))`, DM Sans 12px weight 500, letter-spacing 0.04em, padding 13px 28px, border-radius 1px. On hover: `background: hsl(var(--cream))`.
  - Ghost: "Get in touch" — `border: 1px solid hsl(var(--border))`, color foreground-muted, background none, same size. On hover: border-color foreground-muted color foreground.

**Right panel — photo** (position relative, overflow hidden):

Photo with parallax scroll (see Visual Effects):
```
{/* Image: dramatic dark-toned luxury living room, moody low pendant lighting, charcoal grey velvet sofa, marble side table, single warm circle of lamplight against dark walls, deep shadows, architectural interior photography, cinematic quality */}
<motion.div style={{ y }} className="absolute inset-0 scale-110">
  <img src="" alt="Luxury living room with moody lighting and marble surfaces" className="w-full h-full object-cover object-center" />
</motion.div>
```

Gradient overlay (composition-independent):
```css
background: linear-gradient(
  to bottom,
  rgba(16,15,13,0.2) 0%,
  rgba(16,15,13,0.35) 60%,
  rgba(16,15,13,0.85) 100%
);
```

Bottom overlay bar (absolute, padding 32px):
- `display: flex`, justify-between, align-items flex-end
- Left: project tag in JetBrains Mono 9px uppercase muted + project name "The Chelsea House, 2025" in Fraunces italic 300 18px foreground
- Right: "View case →" — DM Sans 11px uppercase letter-spacing 0.08em muted, `border-bottom: 1px solid hsl(var(--border))`, cursor pointer. On hover: color sand, border-color sand.

---

### Section 3 — Credentials strip

Full-width, `background: hsl(var(--surface))`, `border-top: 1px solid hsl(var(--border))`, `border-bottom: 1px solid hsl(var(--border))`, padding 32px 64px.

Five items in a `display: flex`, gap 64px, align-items center. Items separated by 1px × 40px vertical dividers (`background: hsl(var(--border))`):

1. **"140+"** / "Projects completed"
2. **"12"** / "Years of practice"
3. **"9"** / "Countries"
4. **"4.9★"** / "Client satisfaction"
5. **"London · Milan · Paris"** / "Studio locations"

Each: number in Fraunces 300 28px foreground, label in JetBrains Mono 9px uppercase letter-spacing 0.12em foreground-muted, gap 5px, flex-direction column.

---

### Section 4 — Philosophy

`background: hsl(var(--surface))`, `border-bottom: 1px solid hsl(var(--border))`, padding 100px 64px. `display: grid`, `grid-template-columns: 1fr 1fr`, gap 96px, align-items start.

**Left — heading:**

Sand line reveal (see Visual Effects).
H2: "Design is the art of knowing what to leave out." — Fraunces italic 300, clamp(42px, 4.5vw, 62px), line-height 1.05, color foreground.

Below h2 (margin-top 32px): "We work with clients who believe the best spaces are the ones you don't have to explain." — DM Sans 14px foreground-muted line-height 1.85, max-width 360px.

**Right — numbered list:**

DM Sans 15px color foreground-muted line-height 1.9, margin-bottom 24px:
"Lumine Studio works with private homeowners, developers, and hospitality brands. Our projects range from single-room transformations to multi-year architectural collaborations."

Numbered list of 3 items, `display: flex`, flex-direction column, gap 0, margin-top 32px. Each item: flex row, gap 20px, padding 22px 0, `border-bottom: 1px solid hsl(var(--border))`, align-items flex-start.

Structure per item:
- Index: JetBrains Mono 9px foreground-subtle, flex-shrink 0, padding-top 3px
- Content block: title in DM Sans 14px weight 500 foreground, margin-bottom 4px; desc in DM Sans 12px foreground-muted line-height 1.6

Three items:
1. **Full-service design** — "From initial concept through to final styling and handover. We handle architecture, interiors, furniture, and art."
2. **Architecture & structure** — "We work from the shell inward — planning permissions, structural changes, materials, finishes, and built-in joinery."
3. **Custom furniture & sourcing** — "Bespoke pieces made to our design, and curated works from the makers and galleries we've spent years building relationships with."

---

### Section 5 — Selected Projects

`background: hsl(var(--background))`, padding 100px 64px.

**Header**: `display: flex`, justify-between, align-items baseline, margin-bottom 56px.
- H2: Fraunces 300, clamp(38px, 4vw, 52px), line-height 1. Two lines: "Selected" / "*projects.*" (italic sand)
- "All projects →" — DM Sans 11px uppercase letter-spacing 0.10em foreground-muted, background none, border none, cursor pointer. On hover: color sand.

**Project grid**: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, gap 1px, `background: hsl(var(--border))`. Add cursor follower on grid container hover (see Visual Effects).

Six project cards. Each: `background: hsl(var(--background))`, overflow hidden, cursor pointer. Stagger fade-in on scroll.

Card structure:
- Photo (aspect-ratio 3/4, overflow hidden): `<img>` with object-cover object-center, scale hover animation
- Info block (padding 20px): location tag in JetBrains Mono 9px uppercase muted + project name in Fraunces italic 300 18px foreground, gap 8px between

Photography briefs:
```
[1] {/* Image: minimalist apartment living room, cream walls, custom oak joinery, large pivot door, afternoon light, empty and editorial, high-end residential interior photography */}
[2] {/* Image: dark moody dining room, round marble table, curved bouclé chairs, low pendant light, shadows and candlelight atmosphere, luxury residential */}
[3] {/* Image: master bedroom with floor-to-ceiling linen curtains, pale oak headboard wall, bedside marble lamp, serene and spa-like */}
[4] {/* Image: open-plan kitchen with dark stone island, brass fittings, warm task lighting, bespoke cabinetry, architectural detail */}
[5] {/* Image: luxury hotel lobby, dark stone floors, statement reception desk, tall tropical plant, dramatic ceiling height */}
[6] {/* Image: home office study with dark paneled walls, antique desk, library shelving, warm leather chair, lived-in intellectual atmosphere */}
```

Six projects:
1. **The Chelsea House** — "London · Residential"
2. **Palazzo Bianco** — "Milan · Residential"
3. **Rue du Temple** — "Paris · Residential"
4. **The Carlow Kitchen** — "Dublin · Residential"
5. **Hotel Solaire** — "Lisbon · Hospitality"
6. **The Dover Gallery** — "London · Commercial"

---

### Section 6 — Process

`background: hsl(var(--surface-raised))`, `border-top: 1px solid hsl(var(--border))`, padding 100px 64px.

**Header** (center, max-width 640px, margin 0 auto, text-align center, margin-bottom 72px):
Sand line (centered, `transformOrigin: center`).
H2: Fraunces 300 italic, clamp(40px, 4vw, 56px): "How a *Lumine* project comes together."
Sub: DM Sans 14px foreground-muted line-height 1.85 margin-top 16px: "Every project is different. The process below is our constant."

**Four steps**: `display: grid`, `grid-template-columns: repeat(4, 1fr)`, gap 0, `border: 1px solid hsl(var(--border))`. Stagger fade-up.

Each step (padding 36px 28px, `border-right: 1px solid hsl(var(--border))`, last child no border-right):
- Step number: Fraunces italic 300, 52px, line-height 1, color `hsl(var(--sand) / 0.3)`, margin-bottom 20px
- Step name: DM Sans 500 15px foreground, margin-bottom 10px
- Description: DM Sans 300 13px foreground-muted line-height 1.7

Four steps:
1. **Discovery** — "We meet in person or remotely to understand how you use your space, what you love, and what isn't working. No briefs — just conversation."
2. **Concept** — "We develop two to three spatial concepts: mood boards, material palettes, and rough floor plans. You choose a direction and we refine."
3. **Design** — "Detailed drawings, material specifications, furniture selections, and bespoke joinery briefs. Everything documented before anything is ordered."
4. **Delivery** — "We manage procurement, contractors, and installation. You hand over the key and pick it up when it's finished."

---

### Section 7 — Testimonials

`background: hsl(var(--background))`, `border-top: 1px solid hsl(var(--border))`, padding 100px 64px.

**Header** (margin-bottom 64px):
Sand line reveal.
H2: Fraunces italic 300, clamp(38px, 4vw, 54px): "*What clients* say."

Three testimonial cards in `grid-template-columns: repeat(3, 1fr)`, gap 20px. Stagger fade-up on scroll.

Each card (`background: hsl(var(--surface-raised))`, `border: 1px solid hsl(var(--border))`, border-radius 2px, padding 36px):
- Opening quote mark: Fraunces italic 300 64px, color `hsl(var(--sand) / 0.25)`, line-height 1, margin-bottom -8px
- Quote: Fraunces italic 300 16px, color foreground, line-height 1.75, margin-bottom 28px
- Divider: 1px sand-colored line, width 32px, margin-bottom 20px
- Client: DM Sans 500 13px foreground + location/project in JetBrains Mono 9px uppercase foreground-muted, margin-top 6px

Three testimonials:
1. **Helena M., London** — "We handed Lumine a shell of an apartment and got back a home we didn't know we were capable of living in. Every decision they made was right."
2. **Francesco & Giulia T., Milan** — "Three studios pitched us. Lumine was the only one that listened before they talked. The result is something we couldn't have imagined ourselves."
3. **James K., Dublin** — "I've renovated twice before, both times with other designers. This was the first project that finished on time, on budget, and exactly as specified. I was genuinely shocked."

---

### Section 8 — Studio (About)

`background: hsl(var(--surface))`, `border-top: 1px solid hsl(var(--border))`, padding 100px 64px. `display: grid`, `grid-template-columns: 1fr 1fr`, gap 80px, align-items center.

**Left — content:**

Sand line reveal.
H2: Fraunces italic 300, clamp(38px, 4vw, 52px): "A small studio. *An outsized* standard."

Two paragraphs (DM Sans 300 14px foreground-muted line-height 1.9, gap 20px):
- "Lumine Studio was founded in 2013 by creative director Isabelle Fontaine. What started as a one-person practice in East London has grown into a team of seven — still small enough that Isabelle works on every project."
- "We believe in restraint, in materials that age beautifully, and in spaces that feel generous even when they're compact. Every project we take on receives our full attention — which is why we take on fewer than most."

Team preview (margin-top 40px): four team member chips in flex wrap, gap 10px. Each: `background: hsl(var(--surface-raised))`, `border: 1px solid hsl(var(--border))`, border-radius 2px, padding 10px 14px. Name in DM Sans 12px weight 500 foreground, role in JetBrains Mono 9px uppercase muted, margin-top 3px.

Team:
- Isabelle Fontaine · Creative Director
- Marco Riva · Senior Designer
- Clara Hennessy · Project Manager
- Yuki Tanaka · Sourcing & Materials

"Meet the full team →" text link below chips, DM Sans 12px foreground-muted, border-bottom 1px border.

**Right — photo:**

`border-radius: 2px`, overflow hidden, aspect-ratio 4/5, photo with scale hover animation.
```
{/* Image: interior design studio workspace, drawing table with architectural sketches, material samples fanned out, warm desk lighting, creative professional environment, editorial photography */}
<img src="" alt="Lumine Studio design workspace with material samples and sketches" className="w-full h-full object-cover object-center" />
```

---

### Section 9 — Press & Recognition

Full-width, `background: hsl(var(--surface-raised))`, `border-top: 1px solid hsl(var(--border))`, padding 40px 64px.

Left label: "As seen in" — JetBrains Mono 9px uppercase letter-spacing 0.14em foreground-muted, flex-shrink 0.

Right: flex row, gap 48px, align-items center, `color: hsl(var(--foreground-muted))`, opacity 0.4. Publications in DM Sans 700 16px letter-spacing -0.02em. On hover: opacity 1, transition 0.2s.

Publications: Architectural Digest · Wallpaper* · Dezeen · Elle Decor · The World of Interiors · Frame

---

### Section 10 — Contact / Enquiry

`background: hsl(var(--background))`, `border-top: 1px solid hsl(var(--border))`, padding 100px 64px. `display: grid`, `grid-template-columns: 1fr 1fr`, gap 80px.

**Left — heading & info:**

Sand line reveal.
H2: Fraunces italic 300, clamp(44px, 5vw, 68px), line-height 0.95: "Start a *conversation.*"

Sub (DM Sans 14px foreground-muted line-height 1.85, margin: 24px 0 40px): "We take on a limited number of projects each year. If you're considering a renovation, refurbishment, or new build, we'd love to hear about it — even if it's early days."

Contact details (flex column, gap 16px):
- ✉ hello@luminestudio.co.uk
- 📞 +44 20 7946 0201
- 📍 8 Boundary Street, Shoreditch, London E2 7JE
- 📍 Via Tortona 14, Milano, 20144

Each line: DM Sans 13px foreground. Label in JetBrains Mono 9px uppercase muted, margin-bottom 2px.

**Right — enquiry form:**

Form fields (DM Sans 13px), stacked, gap 14px:
- Name (full width)
- Email (full width)
- Project type: select dropdown with options — Residential / Commercial / Hospitality / Not sure yet
- Approximate budget: select — Under £50k / £50–150k / £150–500k / £500k+
- Tell us about your project: textarea, 5 rows

All inputs: `background: hsl(var(--surface-raised))`, `border: 1px solid hsl(var(--border))`, padding 12px 16px, border-radius 2px, color foreground, font-family DM Sans. On focus: `border-color: hsl(var(--sand))`, outline none.

Submit button: full-width, `background: hsl(var(--foreground))`, color `hsl(var(--background))`, DM Sans 12px weight 500 uppercase letter-spacing 0.06em, padding 14px, border-radius 1px. On hover: `background: hsl(var(--cream))`.

---

### Section 11 — Footer

`background: hsl(0 0% 4%)` (deepest black). Padding 56px 64px 32px.

**Top grid**: `grid-template-columns: 2fr 1fr 1fr 1fr`, gap 48px.

Column 1 (Brand):
- "Lumine Studio" — Fraunces italic 300, 19px, color `hsl(var(--foreground))`
- "Interior design and architecture. London · Milan · Paris." — DM Sans 300 12px `hsl(var(--foreground-muted))`, margin-top 10px, max-width 200px, line-height 1.7
- "© 2026 Lumine Studio Ltd. All rights reserved." — JetBrains Mono 9px `hsl(var(--foreground-subtle))`, margin-top 20px

Column 2 (Work):
- Header: "Work" — JetBrains Mono 9px uppercase letter-spacing 0.12em `hsl(var(--foreground-subtle))`
- Links (DM Sans 12px `hsl(var(--foreground-muted))`, gap 10px, hover: foreground): Projects · Residential · Commercial · Hospitality · Archive

Column 3 (Studio):
- Header: "Studio"
- Links: About · Team · Process · Journal · Press

Column 4 (Connect):
- Header: "Connect"
- Links: Instagram · Pinterest · LinkedIn · hello@luminestudio.co.uk

**Bottom bar** (margin-top 40px, padding-top 20px, `border-top: 1px solid rgba(242,237,228,0.06)`):
- Left: "Privacy Policy · Terms"
- Right: "Designed by Lumine Studio"
Both: JetBrains Mono 9px `hsl(var(--foreground-subtle))`.

---

## Animations Summary

| Element | Animation | Trigger |
|---|---|---|
| Hero H1 lines | Slide up from y:110% (clip reveal) | On mount, stagger 0.14s |
| Hero sub + CTAs | Fade-up y:20, opacity 0→1 | On mount, 0.55s delay |
| Hero photo | Parallax y:0→-120px | Scroll |
| Sand line dividers | scaleX 0→1 from left | IntersectionObserver |
| Credentials strip | Stagger fade-up | Scroll inView |
| Philosophy list items | Stagger fade-up | Scroll inView |
| Project cards | Stagger fade-in + scale hover on photo | Scroll + hover |
| Project cursor follower | Smooth spring tracking | Mouse move |
| Process steps | Stagger fade-up | Scroll inView |
| Testimonial cards | Stagger fade-up | Scroll inView |
| Enquiry form fields | Stagger fade-up | Scroll inView |

---

## Responsive

**Mobile (< 768px):**
- Nav: hamburger → full-screen `hsl(var(--background))` overlay, Fraunces italic links stacked large, "Enquire" full-width sand-bordered button at bottom
- Hero: single column, photo first (aspect-ratio 4/3), content below with reduced padding
- Credentials: 2×3 grid (2 columns, 3 rows)
- Philosophy: single column
- Project grid: single column, aspect-ratio 4/3 per photo
- Process: single column vertical steps
- Testimonials: horizontal scroll snap, one card visible
- About: single column, photo above content
- Contact: single column, form below heading

**Tablet (768px–1024px):**
- Hero: keep split, reduce padding to 40px
- Project grid: 2 columns
- Process: 2×2 grid
- Testimonials: 2 columns, third stacked

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.400.x",
  "@radix-ui/react-select": "^2.x"
}
```

---

## Quick notes

- Brand name is **Lumine Studio** — swap to any studio name. All copy (team names, addresses, testimonials) is ready to replace with real information.
- The project cursor follower (Section 5) is an optional enhancement — safe to remove if the AI tool doesn't implement it cleanly. The grid works without it.
- All 6 project photos and 2 editorial photos are described as photography briefs — dark, moody, luxury residential photography. Any high-end interior photo in that mood will work.
