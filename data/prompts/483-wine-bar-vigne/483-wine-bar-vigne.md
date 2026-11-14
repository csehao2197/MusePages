# Vigne Wine Bar — Wine Bar Website Prompt

## Goal
Build a dark cinematic natural wine bar website for "Vigne Wine Bar" — deep burgundy background, aged champagne accents, warm terracotta highlights, Cormorant Garamond italic editorial typography, intimate and evocative in mood.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System

### Colors
```css
:root {
  --background: 330 40% 8%;
  --foreground: 37 68% 86%;
  --primary: 37 48% 67%;
  --primary-foreground: 330 40% 8%;
  --muted-foreground: 37 20% 58%;
  --border: 37 18% 20%;
  --accent: 12 44% 55%;
}
```

Hex reference:
- Background: #1a0d1a (deep burgundy-black)
- Foreground (warm cream): #f5ede0
- Primary (aged champagne): #d4b882
- Accent (terracotta): #c47a55
- Muted: #9e8e78
- Border: #3d3020

### Typography
Google Fonts import:
`https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,700&family=Inter:wght@300,400&display=swap`

- Display/Headlines: Cormorant Garamond 700 italic
- Body/Descriptions: Cormorant Garamond 300
- UI/Labels/Nav: Inter 300

## Visual Effects

### Effect 1: Background Overflow Brand Text
```css
.bg-brand-text {
  position: absolute;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 700;
  font-size: clamp(180px, 25vw, 380px);
  opacity: 0.03;
  color: hsl(var(--foreground));
  right: -4%;
  top: 50%;
  transform: translateY(-50%);
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
  z-index: 0;
  letter-spacing: -0.02em;
}
```
Text: "VIGNE"

### Effect 2: Animated Chip Strip (Hero)
5 champagne-colored chips animate in from left with stagger. Each chip: background: rgba(212,184,130,0.12), border: 0.5px solid hsl(var(--primary)), color: hsl(var(--primary)), border-radius: 100px, padding: 6px 16px, Inter 300, 12px, letter-spacing: 0.1em.
Framer Motion: initial={{ opacity: 0, x: -24 }}, animate={{ opacity: 1, x: 0 }}, transition={{ delay: 0.6 + index * 0.1, duration: 0.5, ease: 'easeOut' }}

### Effect 3: Dual-Zone Gradient Hero Overlay
```css
background: linear-gradient(
  to bottom,
  rgba(26,13,26,0.78) 0%,
  transparent 40%,
  transparent 60%,
  rgba(26,13,26,0.88) 100%
);
```
Creates a readable top zone (nav area) and a readable bottom zone (content area) while the atmospheric photography breathes through the middle.

### Effect 4: Wine Region Hover Rows
Each row lifts on hover: transform: translateY(-3px), box-shadow: 0 4px 20px rgba(212,184,130,0.15). Champagne left border appears on hover: border-left: 2px solid hsl(var(--primary)). Transition: 0.22s ease.

## Component Breakdown

### 1. Navbar
- Fixed top, background: rgba(26,13,26,0.90), backdrop-filter: blur(16px)
- Height: 60px
- Left: "Vigne" in Cormorant Garamond 700 italic, 22px, champagne color (#d4b882), letter-spacing: 0.06em
- Center: Nav links in Inter 300, 11px, letter-spacing: 0.15em, uppercase, cream color — The List / Cheese & Boards / Wine Flights / Private Dining / Reserve
- Right: "Reserve a Table" — ghost button, 0.5px champagne border, Cormorant 300, 13px, champagne color, padding: 8px 20px, no border-radius
- Bottom border: 0.5px solid hsl(var(--border))
- Hover on nav links: champagne color, transition 0.2s

### 2. Hero
Full-viewport, position: relative, overflow: hidden.

**Background Image:**
{/* Image: Cinematic wide-angle photography of a wine cellar interior — stone walls, rows of dark wooden aging barrels receding into darkness, a single warm amber pendant light visible at center-frame. Golden evening light filtering through a narrow stone window on the right. The atmosphere is ancient, intimate, and deeply atmospheric. Shot on a wide prime lens with visible grain. Mood: timeless, sensory, invitation to linger. */}
<img src="" alt="Wine cellar with stone walls and aging barrels in golden light" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%', position: 'absolute', inset: 0 }} />

**Gradient Overlay (z-index: 1, position: absolute, inset: 0):**
```css
background: linear-gradient(
  to bottom,
  rgba(26,13,26,0.78) 0%,
  transparent 40%,
  transparent 60%,
  rgba(26,13,26,0.88) 100%
);
```

**Background Text (z-index: 0):**
"VIGNE" — Cormorant 700 italic, clamp(180px,25vw,380px), opacity: 0.03, cream, right: -4%, top: 50%, translateY(-50%), user-select: none.

**Content Block (z-index: 10):**
Position: absolute, bottom: 10vh, left: 50%, transform: translateX(-50%), width: 90%, max-width: 800px, text-align: center.

- Headline: "Drink Well. Drink Slowly." — Cormorant 700 italic, clamp(56px,7.5vw,132px), letter-spacing: -0.02em, cream (#f5ede0), margin-bottom: 20px
- Framer Motion: initial={{ opacity: 0, y: 30 }}, animate={{ opacity: 1, y: 0 }}, transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}

- Sub: "A curated list of natural and artisan wines from small producers. No rush. No noise. Just great wine." — Cormorant 300, 19px, cream 80% opacity, max-width: 520px, margin: 0 auto 32px
- Framer Motion: delay: 0.15s

- CTAs (flex, justify: center, gap: 16px, margin-bottom: 36px):
  - "Explore the List" — champagne bg (#d4b882), dark text (#1a0d1a), Cormorant 300, 15px, letter-spacing: 0.08em, padding: 13px 36px, no border-radius
  - "Reserve a Table" — transparent bg, border: 0.5px solid hsl(var(--primary)), cream text, same typography
  - Framer Motion: delay: 0.25s

- Chips row (flex, justify: center, gap: 10px, flex-wrap: wrap):
  "50+ Natural Wines" · "Organic Selection" · "Cheese Board" · "Live Jazz Thu–Sat" · "Open Late"
  Each chip: champagne 12% background, 0.5px champagne border, champagne text, border-radius: 100px, padding: 6px 16px, Inter 300, 11px
  Framer Motion stagger: delay: 0.6 + index × 0.1s

### 3. Wine List by Region
Background: hsl(var(--background)). Padding: 120px 6%.

**Header:**
- Inter 300, 11px, champagne, letter-spacing: 0.18em, uppercase: "THE LIST BY REGION"
- Below: Cormorant 700 italic, 42px, cream: "Small producers. Big conviction."
- Margin-bottom: 72px

**4 Region Rows:**
Each: flex, justify-content: space-between, align-items: center. Padding: 36px 0. Border-top: 1px solid hsl(var(--border)). Cursor: pointer.
Hover: translateY(-3px), box-shadow: 0 4px 20px rgba(212,184,130,0.15). Transition: 0.22s ease.

Left column:
- Cormorant 700 italic, 32px, cream: region name
- Cormorant 300, 15px, muted (#9e8e78): producer types description

Right column (flex, gap: 24px, align-items: center):
- Cormorant 300, 14px, champagne: price range
- Cormorant 700 italic, 24px, champagne: "→"

**The 4 regions:**
1. France / "Domaines and négociants from Burgundy, Loire, and the Rhône. The classics and the unknowns." / from £9 / glass
2. Italy / "Skin-contact from Friuli. Volcanic reds from Etna. Coastal whites from Liguria." / from £9 / glass
3. Spain / "Natural Rioja, Galician Albariño, old-vine Garnacha from Aragón." / from £8 / glass
4. New World / "Australia, South Africa, Georgia. The producers most wine bars haven't found yet." / from £10 / glass

Last row: border-bottom: 1px solid hsl(var(--border)).

Framer Motion: each row whileInView={{ opacity: 1, y: 0 }}, initial={{ opacity: 0, y: 20 }}, transition={{ duration: 0.55, delay: index * 0.1 }}, viewport={{ once: true }}

### 4. Cheese & Charcuterie Split Section
Background: hsl(var(--background)). No padding top — flows directly from regions.

**Layout:** 2-column, 50% / 50%, min-height: 560px.

**Left 50% — Photography:**
{/* Image: Overhead flat-lay photography of a wooden cheese board with three varieties of cheese (brie, aged cheddar, blue), folded prosciutto, olives, walnuts, grapes, and a glass of white wine beside the board. Warm candlelight illuminating the scene from the left. Shot on a dark wooden surface. Rich, tactile, abundant. Mood: convivial, generous, intimate dinner party. */}
<img src="" alt="Artisan cheese and charcuterie board with wine glass and candlelight" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }} />

**Right 50% — Content:**
Background: rgba(26,13,26,0.95). Padding: 80px 6%.
- Inter 300, 11px, champagne, letter-spacing: 0.18em, uppercase, margin-bottom: 24px: "CHEESE & BOARDS"
- Cormorant 700 italic, clamp(32px,4vw,56px), cream, margin-bottom: 24px: Pull quote: "We choose producers we'd visit, not just approve."
- Cormorant 300, 17px, muted (#9e8e78), line-height: 1.7, margin-bottom: 32px: "Our cheese selection changes with the season. We work directly with two affineurs in France and one in Somerset. Every board is assembled to order."
- Champagne chip: background: rgba(212,184,130,0.1), border: 0.5px solid champagne, color: champagne, Inter 300, 12px, letter-spacing: 0.1em, border-radius: 100px, padding: 8px 20px, display: inline-block: "Board from £18"
- Below chip, margin-top: 24px: Cormorant 300, 15px, muted: "Add a flight for £12 more"

### 5. Wine Flights
Background: hsl(var(--background)). Padding: 120px 6%.

**Header:**
- Inter 300, 11px, champagne, letter-spacing: 0.18em: "WINE FLIGHTS"
- Cormorant 700 italic, 42px, cream: "Three glasses. One story."
- Margin-bottom: 64px

**3 Flight Cards — 3-column grid, gap: 24px:**
Each: border: 0.5px solid hsl(var(--border)), background: rgba(255,255,255,0.02), padding: 40px 32px, no border-radius.
Hover: scale: 1.02, border-color: champagne (#d4b882). Transition: 0.3s ease.

Card structure:
- Cormorant 300, 12px, champagne, letter-spacing: 0.15em, uppercase, margin-bottom: 12px: flight tier
- Cormorant 700 italic, 30px, cream, margin-bottom: 16px: flight name
- Cormorant 300, 16px, muted, line-height: 1.65, margin-bottom: 28px: description
- champagne divider: 1px, full width, margin-bottom: 20px
- Cormorant 700 italic, 26px, cream: price

**The 3 flights:**
1. "Discovery" — "A themed journey through three glasses. Designed to introduce a region, grape, or style you may not have tried. Chosen nightly by our sommelier." — £28
2. "Classical" — "Three celebrated regions, three celebrated producers. Burgundy, Rioja, and Barossa in sequence. A masterclass in structure and place." — £38
3. "Prestige" — "Three exceptional bottles served by the glass — wines we open only when the table is ready. Ask the team what's open tonight." — £58

Framer Motion: stagger 0.12s, same entry animation as other cards.

### 6. Private Dining Section
Background: rgba(26,13,26,0.97). Padding: 100px 6%. Max-width: 760px, margin: auto, text-align: center.
Border-top and bottom: 1px solid hsl(var(--border)).

- Inter 300, 11px, champagne, letter-spacing: 0.18em, uppercase, margin-bottom: 20px: "PRIVATE DINING"
- Cormorant 700 italic, clamp(36px,5vw,72px), cream, margin-bottom: 20px: "The List is Private. The Room Can Be Too."
- Cormorant 300, 18px, muted, line-height: 1.7, margin-bottom: 36px: "Our basement seats twelve. The list travels with the meal. For corporate bookings, private celebrations, and wine dinners — our team will build a menu around you."
- Two chips side-by-side: "From £45 / head" + "Min. 8 guests"
- Inter 300, 13px, champagne, margin-top: 32px, underline, cursor pointer: "Enquire about private dining →"

### 7. Testimonial
Background: hsl(var(--background)). Padding: 80px 6%. Max-width: 680px, margin: auto.

Single featured testimonial:
- Cormorant 700 italic, 28px, cream, line-height: 1.4: "The most thoughtful wine list in the neighbourhood. There is not a single wine on it I wouldn't order."
- Inter 300, 12px, champagne, letter-spacing: 0.12em, margin-top: 20px: "— James T., Verified Guest"
- Left border: 1px solid champagne (#d4b882), padding-left: 28px.

### 8. Reservation CTA
Full-width. Background: hsl(var(--background)). Border-top: 1px solid hsl(var(--border)). Padding: 140px 6%. Text-align: center.

- Cormorant 700 italic, clamp(36px,5.5vw,96px), cream: "Come as you are. Stay as long as you like."
- Margin-bottom: 20px
- Cormorant 300, 18px, muted: "Open Monday to Wednesday 4pm–midnight · Thursday to Saturday 3pm–1am · Sunday 2pm–10pm"
- Margin-bottom: 48px
- CTA: "Reserve a Table" — champagne bg (#d4b882), dark text (#1a0d1a), Cormorant 300, 15px, letter-spacing: 0.08em, padding: 16px 44px, no border-radius
- Below: Cormorant 300, 13px, muted 60%: "No deposit required for parties under 6"

### 9. Footer
Background: rgba(10,5,10,1). Border-top: 1px solid hsl(var(--border)). Padding: 64px 6%.
3-column grid:

Column 1: "Vigne" Cormorant 700 italic, 20px, champagne. Below: Cormorant 300, 13px, muted: "Natural wines & small plates. Open late." Social icons (lucide: Instagram) hover: champagne.

Column 2: "Find Us" — Inter 300, 11px, champagne, letter-spacing: 0.15em. Links: Cormorant 300, 14px, muted: "42 Lexington Street, Soho, London W1F 0LP" / "Mon–Wed 4pm–midnight" / "Thu–Sat 3pm–1am" / "Sun 2pm–10pm"

Column 3: "Get in Touch" — same. Cormorant 300, 14px, muted: "reservations@vignewinebar.com" / "+44 (0)20 7456 8910" / "Reservations recommended for Fri & Sat"

Bottom: Inter 300, 11px, muted 50%: "© 2025 Vigne Wine Bar. All rights reserved."

## Animations

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Hero headline | opacity 0→1, y 30→0 | 0.9s | 0s | [0.16,1,0.3,1] |
| Hero sub | opacity 0→1, y 30→0 | 0.9s | 0.15s | [0.16,1,0.3,1] |
| Hero CTAs | opacity 0→1, y 30→0 | 0.9s | 0.25s | [0.16,1,0.3,1] |
| Chips (5) | opacity 0→1, x -24→0 | 0.5s | 0.6s + i×0.1s | easeOut |
| Region rows | opacity 0→1, y 20→0 | 0.55s | i×0.1s | ease |
| Flight cards | opacity 0→1, y 24→0 | 0.6s | i×0.12s | [0.16,1,0.3,1] |
| Testimonial | opacity 0→1, x -20→0 | 0.7s | 0s | ease |
| CTA block | scale 0.96→1, opacity 0→1 | 0.65s | 0s | ease |
| Row hover | y 0→-3 | 0.22s | — | ease |
| Card hover | scale 1→1.02 | 0.3s | — | ease |

All whileInView: viewport={{ once: true }}

## Responsive

**Desktop (≥1024px):**
- Hero content centered, max-width 800px
- Region rows: full-width horizontal
- Cheese section: 50/50 split
- Flights: 3-column grid
- Footer: 3-column grid

**Tablet (768–1023px):**
- Cheese section: stacks vertically (photo on top, content below)
- Flights: 1×3 vertical stack
- Footer: 2-column grid

**Mobile (<768px):**
- Navbar: Cormorant italic "Vigne" left, hamburger right
- Hero: chips wrap to 2 rows, text left-aligned
- Region rows: stack with smaller type
- Cheese section: full-width vertical
- Flights: single column cards
- Footer: single column
- Background "VIGNE" text: display none on mobile

## Full Copy

**Navigation:** Vigne · The List · Cheese & Boards · Wine Flights · Private Dining · Reserve

**Hero:**
- Headline: "Drink Well. Drink Slowly."
- Sub: "A curated list of natural and artisan wines from small producers. No rush. No noise. Just great wine."
- CTA 1: "Explore the List"
- CTA 2: "Reserve a Table"
- Chips: "50+ Natural Wines" · "Organic Selection" · "Cheese Board" · "Live Jazz Thu–Sat" · "Open Late"

**Wine List section:**
- Label: "THE LIST BY REGION"
- Tagline: "Small producers. Big conviction."
- France: "Domaines and négociants from Burgundy, Loire, and the Rhône. The classics and the unknowns." | from £9 / glass
- Italy: "Skin-contact from Friuli. Volcanic reds from Etna. Coastal whites from Liguria." | from £9 / glass
- Spain: "Natural Rioja, Galician Albariño, old-vine Garnacha from Aragón." | from £8 / glass
- New World: "Australia, South Africa, Georgia. The producers most wine bars haven't found yet." | from £10 / glass

**Cheese & Boards:**
- Label: "CHEESE & BOARDS"
- Pull quote: "We choose producers we'd visit, not just approve."
- Body: "Our cheese selection changes with the season. We work directly with two affineurs in France and one in Somerset. Every board is assembled to order."
- Price chip: "Board from £18"
- Sub: "Add a flight for £12 more"

**Wine Flights:**
- Label: "WINE FLIGHTS"
- Tagline: "Three glasses. One story."
- Discovery: "A themed journey through three glasses. Designed to introduce a region, grape, or style you may not have tried. Chosen nightly by our sommelier." | £28
- Classical: "Three celebrated regions, three celebrated producers. Burgundy, Rioja, and Barossa in sequence. A masterclass in structure and place." | £38
- Prestige: "Three exceptional bottles served by the glass — wines we open only when the table is ready. Ask the team what's open tonight." | £58

**Private Dining:**
- Label: "PRIVATE DINING"
- Headline: "The List is Private. The Room Can Be Too."
- Body: "Our basement seats twelve. The list travels with the meal. For corporate bookings, private celebrations, and wine dinners — our team will build a menu around you."
- Chips: "From £45 / head" / "Min. 8 guests"
- Link: "Enquire about private dining →"

**Testimonial:** "The most thoughtful wine list in the neighbourhood. There is not a single wine on it I wouldn't order. — James T., Verified Guest"

**Reservation CTA:**
- Headline: "Come as you are. Stay as long as you like."
- Hours: "Open Monday to Wednesday 4pm–midnight · Thursday to Saturday 3pm–1am · Sunday 2pm–10pm"
- Button: "Reserve a Table"
- Sub: "No deposit required for parties under 6"

**Footer:**
- Tagline: "Natural wines & small plates. Open late."
- Address: "42 Lexington Street, Soho, London W1F 0LP"
- Email: "reservations@vignewinebar.com"
- Phone: "+44 (0)20 7456 8910"
- Note: "Reservations recommended for Fri & Sat"
- Legal: "© 2025 Vigne Wine Bar. All rights reserved."

## Key Dependencies
```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx",
  "tailwindcss": "^3.x"
}
```
