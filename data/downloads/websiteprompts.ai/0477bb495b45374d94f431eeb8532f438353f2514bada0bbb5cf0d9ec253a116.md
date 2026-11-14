## Goal
Build a full luxury catering website called **Maison Larder** — a quiet, editorial, ingredient-led catering house. Warm cream paper tones, Instrument Serif headlines, monospace utility labels, terracotta accent. The aesthetic is luxury without noise: think Kinfolk magazine meets Michelin-starred prep kitchen.

---

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

---

## Design System — Colors

```css
:root {
  --paper:      #f4efe6;
  --paper-2:    #ebe4d6;
  --ink:        #1a1613;
  --ink-2:      #2a241f;
  --ink-soft:   #5c534a;
  --rule:       #d8cfbe;
  --accent:     #b84a28; /* terracotta */
  --accent-ink: #ffffff;
}
```

Background: `--paper`. All text: `--ink`. Accent usage: headlines italic spans, CTA buttons, hover states, stat numbers. Borders/dividers: `--rule` (1px solid, no shadow). Border-radius: 2px everywhere — almost square.

---

## Typography

```
Google Fonts:
https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap
```

- **Headings / display**: `Instrument Serif`, weight 400, letter-spacing -0.01em. Italic spans for accent words.
- **Body / UI**: `Inter Tight`, weight 300–500
- **Labels / badges / nav / prices / captions**: `JetBrains Mono`, 11px, letter-spacing 0.12em, uppercase. Used as a visual system — not for code.

```css
.mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.eyebrow::before {
  content: '';
  width: 24px;
  height: 1px;
  background: currentColor;
}
```

Section numbers follow a consistent system: `§ 01 / About`, `§ 02 / Services`, etc., rendered in `.mono` with a secondary tag label on the right.

---

## Visual Effects

### 1. Custom cursor
Replace the system cursor entirely with a two-layer custom cursor:
```css
.cursor-dot {
  position: fixed; top: 0; left: 0;
  width: 8px; height: 8px;
  background: var(--ink);
  border-radius: 999px;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
  transition: width .2s, height .2s;
}
.cursor-ring {
  width: 36px; height: 36px;
  background: transparent;
  border: 1px solid var(--ink);
  transition: width .25s ease, height .25s ease, transform .08s linear;
}
.cursor-ring.hover { width: 64px; height: 64px; border-color: var(--accent); }
.cursor-dot.hover { opacity: 0; }
```
Track `mousemove` for dot (immediate), requestAnimationFrame lerp for ring (lag 0.12 factor). Set `cursor: none` on body. Hide on touch devices (`@media (hover: none)`).

### 2. Line-reveal headline animation
Headlines animate in by unmasking text upward:
```css
.line-reveal span {
  display: block;
  clip-path: inset(0 0 100% 0);
  transition: clip-path 0.75s cubic-bezier(0.16, 1, 0.3, 1);
}
.line-reveal.in-view span {
  clip-path: inset(0 0 0% 0);
}
```
Stagger multiple lines by 0.1s delay each. Triggered by IntersectionObserver (threshold 0.1).

### 3. Clip-reveal for images
Images unmask from bottom to top on scroll:
```css
.clip-reveal {
  clip-path: inset(100% 0 0 0);
  transition: clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
.clip-reveal.in-view {
  clip-path: inset(0% 0 0 0);
}
```

### 4. Fade-up for general sections
```js
// initial
{ opacity: 0, y: 30 }
// animate
{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
```

### 5. Sticky nav with mix-blend-mode switch
Nav starts with `mix-blend-mode: difference; color: white` so it inverts over any background. On scroll past 60px, switch to: `mix-blend-mode: normal; color: var(--ink); background: color-mix(in oklab, var(--paper) 80%, transparent); backdrop-filter: blur(14px); border-bottom: 1px solid var(--rule)`.

### 6. Marquee ticker
Continuous horizontal scroll of service categories. Two identical spans inside a flex container, CSS animation `translateX(-50%)` infinite linear. Speed: ~35s per cycle.

### 7. Magnetic buttons
On `[data-magnetic]` elements, offset the element toward cursor on `mousemove` by up to 12px using `transform: translate()`. Reset on `mouseleave` with spring transition.

---

## Component Breakdown

### 1. Navbar (fixed, z-100)
- Grid: `1fr auto 1fr` — brand left, nav links center, CTA right
- Brand: `Maison Larder®` in Instrument Serif 22px. `®` in JetBrains Mono 9px superscript
- Nav links: About · Services · Menu · Gallery · Pricing · FAQ — mono 11px uppercase
- CTA right: `Est. 2014` in mono opacity 0.7 + "Request a Quote →" filled button in `--ink` background
- Mobile: hamburger, full-screen overlay menu

### 2. Hero (Section § 01)
**Variant A — Editorial Split (default):**
- Top bar: `N°.01 — Bespoke Catering House` left, `London · Copenhagen · New York` right. Both mono. 1px `--rule` border below.
- Two-column grid below (55/45 split):
  - Left: Large heading "Quiet luxury," line break, "*plated.*" (italic). Below: two `.meta-item` blocks with mono label `— Craft` and `— Notes` and body text. Below: two buttons "Request a Quote →" (filled) + "View Menus →" (outline).
  - Right: tall image (aspect ~3/4), caption bar below: `Fig. 01 / Spring Menu '26` left, `↗ 02:34 film` right, both mono.
- Full section height: 100svh. Paper background.

```
{/* Image: elegant plated dish, smoked lamb with charred leek, terracotta ceramic, white tablecloth, soft natural light from the side, editorial food photography */}
```

### 3. Marquee (between hero and about)
Continuous scroll, cream background, 1px rule top and bottom:
```
Weddings ✦ Private Dining • Corporate ✦ Film & Press • Chef's Table ✦ Supper Clubs •
```
Font: Instrument Serif italic 20px. Star `✦` in `--accent` color.

### 4. About (§ 02)
Section label row: `§ 02 / About` left + `A catering house, quietly` right. Both mono. 1px rule below.

Two-column grid (50/50):
- Left: tall image with clip-reveal animation
- Right: eyebrow "Our philosophy" + lead text in Instrument Serif 24px + body paragraph + stats row

Stats (3 items inline):
- `12y` (accent color) / Years cooking
- `842` / Events & weddings  
- `30+` (accent color) / Team members

Stat numbers: Instrument Serif, ~64px, ink color. Labels: mono 11px, ink-soft.

```
{/* Image: professional kitchen prep — hands carefully plating a dish, clean stainless surface, warm ambient kitchen light, documentary feel */}
```

### 5. Services (§ 03)
Section label + large heading: `"What we do, when you *need a room fed.*"` (~120px clamp, italic accent span).

Below: stacked list rows. Each row:
- `01` / `02` / etc. in mono, dim
- Service name in Instrument Serif 28px (some italicised)
- Description text in Inter Tight 15px ink-soft
- Tags in mono (e.g. `Full-service · Multi-day`)
- `→` arrow box right-aligned, appears on hover
- Full-width 1px `--rule` divider between rows
- `[data-magnetic]` attribute for magnetic hover effect

Four services:
1. **Weddings** — Full-service catering for 40–400. Tastings, menu design, bar, service staff and styling — handled end to end. `Full-service · Multi-day`
2. ***Private* Dining** — Chef's tables, birthdays, anniversaries. Intimate dinners at your home, from eight guests to sixty. `Chef at home`
3. **Corporate** — Boards, offsites, product launches and long-table lunches. We cook for brands that care about the details. `Offsites · Launches`
4. ***Film* & Press** — Food styling, on-set catering and editorial plates for shoots, campaigns and magazine features. `Styling · On-set`

### 6. Menu (§ 04)
Section label + tabbed interface.

**Tab bar** (5 tabs): Canapés · First Courses · Mains · Desserts · Wine Pairing
Active tab: `--ink` background, paper text. Inactive: transparent. Tab bar has bottom 1px rule.

**Menu panel** (shown per active tab):
- Header row: course name in Instrument Serif 28px + mono label right (`— 6 bites / guest`)
- Item rows (1px rule between each):
  - Name in Inter Tight 500 16px
  - Description in Inter Tight 300 14px ink-soft  
  - Diet badges: small pill `V` (vegetarian), `GF` (gluten-free) — mono 10px
  - Price right-aligned in mono

**Tab panel content:**

*Canapés — 6 bites / guest:*
- Hokkaido scallop, yuzu kosho, rye · Hand-dived scallop cured in kombu, set over charcoal rye and finished with fermented chilli. [GF] · £14/pc
- Whipped cep, sourdough, truffle · Dorset cep mushrooms, whipped with brown butter and hay-smoked cream. [V] · £9/pc
- Cornish crab, green apple, dill oil · Picked white crab bound in crème fraîche on a malted cracker. · £12/pc
- Confit heritage tomato, burrata, basil · Slow-roasted Isle of Wight tomato, Puglian burrata, three-basil oil. [V][GF] · £8/pc

*First Courses — Plated:*
- Smoked trout, buttermilk, sea herbs · Cured over juniper embers, pickled cucumber, salted gooseberry.
- Hand-rolled tagliolini, Exmoor caviar · Egg-yolk pasta, beurre blanc, chive flower.
- Charred leek, hazelnut, vadouvan · Ember-cooked leeks, brown butter hazelnut praline, curry leaf. [V]

*Mains — Choose one:*
- Salt-marsh lamb, burnt onion, wild garlic · Herdwick lamb rump & slow-braised shoulder, alliums three ways.
- Line-caught turbot, brown shrimp, kale · Fillet of turbot, nut-brown butter, hispi cabbage, seaweed butter.
- Glazed celeriac, Tunworth, toasted oats · Whole roasted celeriac, barrel-aged Tunworth, brown butter oats. [V]

*Desserts — Finish:*
- Brown butter tart, Sicilian almond · Caramelised pastry, salted caramel, bitter almond ice cream.
- Roasted rhubarb, vanilla, shortbread · Yorkshire forced rhubarb, vanilla cream, buttery shortbread crumb.
- Aged Comté, quince, walnut · 24-month Comté, homemade quince membrillo, candied walnut. [V]

*Wine Pairing — Four-glass flight:*
- Glass I · Kabinett Riesling, Mosel '22 · Low-alcohol, saline, off-dry. Paired with canapés. +£48
- Glass II · Chenin Blanc, Loire '23 · Natural, textural. Paired with first courses. +£48
- Glass III · Gamay, Beaujolais '22 · Light, bright, serve cool. Paired with mains. +£48
- Glass IV · Moscato d'Asti '24 · Gently sparkling. Paired with desserts. +£48

### 7. Gallery (§ 05)
Section label + heading: `"Rooms we've *fed.*"` italic accent.

CSS Grid masonry — 12 columns, 7 images with different span values creating an asymmetric editorial layout:
```css
.gallery {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 120px;
  gap: 8px;
}
.g1 { grid-column: span 7; grid-row: span 3; }
.g2 { grid-column: span 5; grid-row: span 2; }
.g3 { grid-column: span 5; grid-row: span 2; }
.g4 { grid-column: span 4; grid-row: span 3; }
.g5 { grid-column: span 8; grid-row: span 3; }
.g6 { grid-column: span 6; grid-row: span 2; }
.g7 { grid-column: span 6; grid-row: span 2; }
```
Each figure: `overflow: hidden`. On hover, `img` scales to 1.04, caption fades in at bottom via absolute overlay, mono 11px.

Captions: Somerset Barn Wedding · 180 guests / Private Dinner · Mayfair · 14 / Vogue Italia Shoot / Aesop Tokyo Launch / Cotswolds Harvest Supper / Tate Modern Gala · 240 / Studio Lunch · LNC Architects

```
{/* Image 1: long candlelit wedding banquet table, flower arrangements, champagne, warm evening light, 180 guests, barn setting */}
{/* Image 2: intimate private chef's table, dark wood, single candle, 14 guests, Mayfair apartment */}
{/* Image 3: editorial food styling, heritage tomato plate, Vogue aesthetic, top-down, white marble */}
{/* Image 4: corporate brand launch, clean minimal table, branding elements, modern venue */}
{/* Image 5: outdoor harvest supper, long table in field, golden hour, wildflowers, autumn */}
{/* Image 6: gala dining, plated courses being served, dramatic ceiling light, 240-person event */}
{/* Image 7: studio lunch, simple beautiful bowls, architectural studio space, daylight */}
```

### 8. Testimonials (§ 06)
Section label + single large testimonial displayed at a time with prev/next arrows and dot navigation.

Layout: avatar image (60px circle, border 1px rule) + blockquote in Instrument Serif 24px italic + cite in mono.

Auto-advance every 6 seconds. Crossfade transition on change.

Four testimonials:
1. *"We needed a team that could cook like a restaurant but move like a wedding planner. Maison Larder are the only ones who can do both — the room hummed from first bite to last pour."* — Eloise & Theo Harrington · Somerset, 180 guests
2. *"The food was the most talked-about element of our entire brand launch. Three months later, clients still mention the lamb."* — Kaito Suzuki · Creative Director, Aesop Tokyo
3. *"Every detail — the bread, the butter, the way the plates arrived — felt considered. It's the rare caterer that makes you forget you're at a corporate event."* — Caroline Mbeki · Chief People Officer, Index Ventures
4. *"Séverine and her team cooked our wedding feast for 140 guests in a field with a temporary kitchen and somehow made it feel like our favourite restaurant."* — Phoebe & Dom Leclair · Cotswolds

### 9. Process (§ 07)
Heading: `"How it *works.*"` 

Four-step horizontal grid (4 columns on desktop, stacked on mobile):
- **Step 01 · Hello — Brief**: A short form, then a call. We learn the shape of your event, the guests, the room, the season, the feeling you're chasing.
- **Step 02 · Design — Menu**: We write a menu against your brief and budget. Two rounds of revision included. Wine, bar and styling drawn up alongside.
- **Step 03 · Taste — Tasting**: A private tasting at the studio for weddings and large events. We refine, swap and adjust until every plate feels right.
- **Step 04 · Cook — The Day**: We arrive hours before service. Our team handles kitchen, front-of-house, bar and pack-down. You greet your guests.

Each card: step label in mono top, bold h4 title, body text. 1px rule left border. Fade-up animation staggered by 0.1s.

### 10. Pricing (§ 08)
Heading: `"Packages, from *intimate to grand.*"` + sub-note right-aligned: "Prices are per guest, exclusive of VAT and service. Bespoke menus always available."

Three cards side by side. Middle card is `featured` with ink background, paper text, and accent CTA button.

**Gather** (Small):
- £95 per guest · from 8 guests
- Three-course seasonal menu / Chef-at-home service / Canapé reception / Wine recommendation list / Full kitchen pack-down
- CTA: "Request a Quote →" (outline)

**Celebrate** (Most booked) — featured card:
- £185 per guest · from 40 guests
- Five-course tasting + canapés / Full service team (chef + FOH) / Private tasting at the studio / Bar programme & sommelier / Styling consultation / Dedicated event manager
- CTA: "Request a Quote →" (accent fill)

**Grand** (Large):
- POA · Weddings · 120+ guests
- Full-day wedding programme / Canapés, feast & late-night menu / Full bar & wine pairing / Kitchen build-out & logistics / Staff of 12–30 / End-to-end event production
- CTA: "Enquire →" (outline)

### 11. Team (§ 09)
Heading: `"The kitchen, *briefly.*"`

Three team cards in a row. Each:
- Portrait image: tall rectangle, `clip-reveal` animation on scroll, slight inner-shadow overlay
- Name in Instrument Serif 20px
- Role in mono 11px ink-soft
- Short bio in Inter Tight 14px

Members:
1. **Séverine Arnaud** · Founder / Head Chef — Trained at Le Gavroche and Noma. Opened Maison Larder in 2014 above a flower market in Columbia Road.
2. **Josh Okafor** · Sous Chef — Ex-Lyle's and The Clove Club. Leads the wedding and large-event kitchen brigade.
3. **Mira Lindqvist** · Head Sommelier — Natural & low-intervention specialist. Builds the pairings, bar programmes and cellar.

```
{/* Portrait 1: female chef in clean apron, professional kitchen, confident expression, warm light, editorial style */}
{/* Portrait 2: male sous chef plating a dish, focused, dark kitchen with warm accent lighting */}
{/* Portrait 3: female sommelier pouring wine, clean white background, elegant and precise */}
```

### 12. Press (§ 10)
Six press logos as large typographic names in a horizontal grid (3+3 on mobile), ink-soft color, transitions to ink on hover:
`Monocle` · `Cereal` (italic) · `Kinfolk` · `The Gentlewoman` · `Vogue` (italic) · `Condé Nast`

Below: a full-width pull quote in Instrument Serif 28px italic:
*"One of the most **quietly ambitious** catering houses in Britain. Every bite reads like it's been written, not cooked."*
`— Food Editor, The Gentlewoman` in mono below.

### 13. Instagram Grid (§ 11)
Section head: eyebrow "Follow along" + `@maisonlarder` heading + "Open in Instagram ↗" button right-aligned.

10-item square grid (5 columns desktop, 2 columns mobile). Each cell: 1:1 ratio, overflow hidden. On hover: scale(1.04) + brief caption number overlay bottom-left in mono.

```
{/* IG grid: 10 square food/event images — close-up plates, candlelit service, wine being poured, hands arranging flowers, outdoor table, fresh produce, kitchen detail, editorial styling, warm ambient dining */}
```

### 14. FAQ (§ 12)
Two-column layout: left side has heading `"Before you *ask.*"` + contact prompt. Right side: 6 accordion items.

Accordion: `+` rotates to `×` on open. Panel slides down with max-height animation. One open at a time.

Questions and answers:
1. **How far in advance should we book?** — Weddings and large events — 6 to 12 months ahead, especially for peak season (May–September). Private dinners and corporate catering — usually 3 to 6 weeks, though we often have last-minute availability.
2. **Do you travel?** — Yes, frequently. Our home kitchens are in London, Copenhagen and New York, and we travel extensively across the UK, Europe and the US. Destination bookings include travel and accommodation.
3. **Can you accommodate dietary needs?** — Always. Vegetarian, vegan, gluten-free, kosher-style, allergies — just tell us during the brief and we'll build the menu around your guests, not around ours.
4. **What's included in the quote?** — Food, prep, kitchen staff, service team, non-disposable equipment, travel within zone 1–3 (for London), and a dedicated event manager. We list anything additional — bar, styling, rentals — line by line.
5. **Do you offer tastings?** — For weddings and events over 40 guests, a private tasting at the studio is included. For smaller private dinners, tastings can be booked separately or credited against the final invoice.
6. **How do payments work?** — A 25% retainer confirms the date. A second 50% is due four weeks ahead. Final balance is settled within seven days of the event, based on confirmed final guest numbers.

### 15. Booking Form (§ 13)
Dark section — ink background (`var(--ink)`), paper text. Full-width.

Two-column layout inside:
- **Left**: eyebrow + heading `"Request a *quote.*"` + lead text + four info rows in mono: `Response time ≤ 24 hours` / `Minimum event 8 guests` / `Booking window Now → Dec '27` / `Enquiries / week ~ 42`
- **Right**: form

Form fields (2-column grid where sensible):
- Full name + Email (row)
- Event type (select: Wedding / Private dinner / Corporate / Film & press / Something else) + Approx. guests (number) (row)
- Date + Location / city (row)
- **Style** — chip/pill toggle group: `Plated` · `Family-style` · `Canapé reception` · `Feast` · `Bar only`
- Tell us about the day (textarea, placeholder: "The room, the feeling, anything we should know…")
- Submit row: mono note "We reply within 24 hours" left + "Send Enquiry →" accent button right

On success: replace form with confirmation: "Thank you — received." + paragraph in Instrument Serif.

Form validation: mark invalid fields with `--accent` border + error message below.

### 16. Footer
Big display type `"Maison *Larder*."` (italic) at ~9vw, line-reveal animation.

Four-column link grid below:
- **Studio**: 12 Columbia Road · London E2 7RG · United Kingdom + phone in mono
- **Services**: Weddings / Private Dining / Corporate / Film & Press
- **Studio**: About / Team / Press / FAQ
- **Follow**: Instagram / Pinterest / Journal / Newsletter

Bottom row: `© 2026 Maison Larder Ltd. Registered in England.` left + `Built in Framer · Template by Maison Larder Studio` right. Both mono 11px.

---

## Animations Summary

| Element | Animation | Timing |
|---|---|---|
| Hero headline lines | clip-path: inset 100%→0% | 0.75s, cubic-bezier(0.16,1,0.3,1), stagger 0.1s |
| Hero content below | opacity 0→1, y 30→0 | 0.6s easeOut, delay 0.4s |
| Images | clip-path: inset 100%→0% | 0.9s cubic-bezier(0.16,1,0.3,1) |
| Section content | opacity 0→1, y 30→0 | 0.6s easeOut |
| Process steps | fade-up staggered | 0.1s delay per card |
| Pricing cards | fade-up staggered | 0.12s delay per card |
| Marquee | translateX(-50%) infinite | 35s linear |
| Nav blend switch | background/color transition | 0.35s ease |
| Cursor ring | lerp 0.12 factor | rAF |
| Gallery hover | scale 1.04 | 0.4s ease |
| Accordion | max-height 0→auto | 0.35s ease |
| Testimonial switch | opacity crossfade | 0.4s ease |

All scroll-triggered animations use `IntersectionObserver` with `threshold: 0.1`, `rootMargin: '0px 0px -60px 0px'`.

---

## Responsive

- **Desktop (≥1024px)**: All multi-column layouts as described. Nav: 3-column grid. Hero: 2-column split. Gallery: 12-col grid. Services: full-width list.
- **Tablet (768–1023px)**: Hero switches to stacked. Gallery to 6-col. Pricing: scroll horizontally or stack. Team: 2+1.
- **Mobile (<768px)**: Single column throughout. Nav collapses to hamburger + full-screen overlay. Hero: type first, image below. Gallery: 2-column simple grid. Custom cursor hidden (`@media (hover: none)`).

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx",
  "@radix-ui/react-tabs": "^1.x",
  "@radix-ui/react-accordion": "^1.x"
}
```

---

## Quick Notes
- Brand name is **Maison Larder** — feel free to swap to any catering business name. All copy is written and ready to paste.
- The `--accent` terracotta `#b84a28` can be swapped to any single accent: sage green `#6b7a3b`, navy `#1e3a5f`, gold `#b89349`, or burgundy `#6a2b3d` — it's the only color that changes.
- The menu section has real seasonal dishes — replace with your actual menu, or ask the AI to generate a menu for a different cuisine.
