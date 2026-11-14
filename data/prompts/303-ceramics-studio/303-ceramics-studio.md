# Clay & Form — Ceramics Studio Website Prompt

## Goal
Build a warm, intimate ceramics studio website with Cormorant Garamond italic headlines, a split hero layout, clay-colour left border accent, workshop booking cards, and a dark earth commission section.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System

### Colors
```css
:root {
  --background: 37 40% 97%;
  --foreground: 22 62% 9%;
  --primary: 18 46% 49%;
  --primary-foreground: 37 40% 97%;
  --muted-foreground: 37 18% 44%;
  --border: 37 28% 80%;
  /* Raw hex reference */
  /* warm-white: #faf7f0 */
  /* deep-earth: #221408 */
  /* warm-clay: #b5694a */
  /* warm-sand: #e8d8c0 */
}
```

### Typography
Google Fonts import: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,700&family=Plus+Jakarta+Sans:wght@300;400&display=swap`
- Headlines: Cormorant Garamond 700 italic
- Body text: Cormorant Garamond 300 italic
- UI labels: Plus Jakarta Sans 400
- Captions / prices: Plus Jakarta Sans 300

## Visual Effects

1. **Clay Left Border Headline Accent** — border-left: 4px solid #b5694a on the hero h1 element, padding-left: 16px, gives a handcrafted vertical accent to the main headline, no animation needed — pure CSS confidence
2. **Workshop Card Scroll-In Stagger** — Framer Motion whileInView: scale 0.95→1, opacity 0→1, stagger 0.12s between the 3 workshop cards, ease: [0.25,0.46,0.45,0.94]
3. **Collection Row Warm Hover** — whileHover y: -3px (0.2s), border-left: 3px solid #b5694a (0.15s transition), warm shadow: 0 4px 20px rgba(181,105,74,0.18)
4. **Dark Earth Commission Section** — bg: #221408, an isolated dark section against the warm white — Cormorant italic white text, clay button — creates deep contrast on an otherwise warm-light page

## Component Breakdown

### 1. Navbar
```tsx
// Sticky, bg: #faf7f0, border-bottom: 1px solid #e8d8c0, height: 64px
// Left: "Clay & Form" — Cormorant Garamond 400 italic, 20px, letter-spacing: 0.04em, color: #221408
// Center: Shop / Workshops / About / Commission — Plus Jakarta Sans 400, 13px, color: #7a6a58, letter-spacing: 0.04em
// Right: "Book a Workshop" — bg: #b5694a, color: #faf7f0, Plus Jakarta 400, 13px, px-5 py-2.5, border-radius: 0
// Hover: bg: #9a5038, 0.2s
// Framer Motion: y -64→0, opacity 0→1, 0.5s ease-out
```

### 2. Hero — Split Layout
```tsx
// Full-viewport, min-height: 100vh, display: flex, flex-direction: row (on desktop)
// No full-bleed photo behind content — instead a TRUE SPLIT LAYOUT

// LEFT PANEL — 45% width, bg: #faf7f0, display flex flex-col justify-center
// padding: clamp(48px,6vw,96px)
// z-index: 10

// Small kicker: Plus Jakarta 400, 11px, letter-spacing: 0.18em, text-transform: uppercase, color: #b5694a, margin-bottom 24px
// "Handmade Ceramics & Pottery Workshops · Margate"

// Headline — WITH clay left border accent:
// border-left: 4px solid #b5694a, padding-left: 16px
// Cormorant Garamond 700 italic, clamp(40px,5.5vw,96px), color: #221408, line-height: 1.1
// "Every Piece Begins as Possibility."
// Framer Motion: opacity 0→1, x -30→0, 0.7s ease-out, delay: 0.1s

// Sub: Cormorant Garamond 300 italic, 19px, color: #7a6a58, margin-top: 20px, line-height: 1.75, max-width: 400px
// "Handmade ceramics and pottery workshops in Margate. Every piece thrown, hand-built, and glazed in the studio."
// Framer Motion: opacity 0→1, y 20→0, 0.6s, delay: 0.3s

// CTAs (flex row, gap: 12px, margin-top: 32px):
// "Browse the Shop" — bg: #b5694a, color: #faf7f0, Plus Jakarta 400, 14px, px-7 py-3.5, border-radius: 0
// "Book a Workshop" — bg: transparent, border: 1px solid #b5694a, color: #b5694a, Plus Jakarta 400, 14px, px-7 py-3.5, border-radius: 0
// Framer Motion: opacity 0→1, y 20→0, 0.6s, delay: 0.5s

// Small trust note: Plus Jakarta 300, 13px, #9a8a7a, margin-top 24px
// "Charlotte Reid · Studio open by appointment · Margate Old Town"

// RIGHT PANEL — 55% width, position: relative, overflow: hidden
// Directional gradient from left: linear-gradient(to right, rgba(250,247,240,1) 0%, rgba(250,247,240,0.95) 0%, transparent 100%)
// Wait — ONLY on the seam between left and right panels (8% width at left edge of photo)
// gradient: linear-gradient(to right, #faf7f0 0%, transparent 12%), applied as overlay on left edge only

{/* Image: Extreme close-up of hands shaping wet clay on a pottery wheel — fingers pressing into the clay, clay texture and finger grooves clearly visible, warm golden afternoon light from a large studio window to the left, very intimate close-up that conveys the tactile, handmade quality of the work, warm terracotta earth tones of the clay contrasting with the cool wheel surface */}
<img src="" alt="Hands shaping clay on pottery wheel in ceramic studio" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />

// Left-edge gradient overlay to blend photo into left panel:
// position: absolute, inset: 0, background: linear-gradient(to right, #faf7f0 0%, transparent 15%), z-index: 1
```

### 3. Workshop Cards
```tsx
// Section bg: #faf7f0, padding: 80px clamp(24px,6vw,96px)
// Section label: Plus Jakarta 400, 11px, letter-spacing 0.18em, uppercase, color: #b5694a, margin-bottom 8px: "BOOK A WORKSHOP"
// Headline: Cormorant Garamond 700 italic, clamp(32px,4.5vw,68px), #221408, margin-bottom 48px
// "Learn to Make."

// 3-column flex, gap: 24px

// Framer Motion: each card whileInView scale 0.95→1, opacity 0→1, stagger 0.12s, ease [0.25,0.46,0.45,0.94]

// Each card: bg: #ffffff, border: 1px solid #e8d8c0, overflow hidden
// Hover: y: -4px, box-shadow: 0 8px 32px rgba(181,105,74,0.12), 0.25s ease-out

// Card photo (4:3 crop):
// Card 1 — Wheel Throwing:
{/* Image: Close-up photography of pottery wheel throwing in action — clay being centred on the wheel with water spray visible, hands cupped around the opening form, warm studio light, movement blur on the spinning wheel showing speed, intimate and focused */}
<img src="" alt="Wheel throwing pottery workshop with hands on spinning clay" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center' }} />

// Card 2 — Hand Building:
{/* Image: Hands carefully coiling clay rope to build a vessel wall — clay coils stacked in organic layers, natural light from studio window, worn wooden work surface, meditative and precise, warm clay and cream tones */}
<img src="" alt="Hand building ceramics workshop with clay coil technique" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center' }} />

// Card 3 — Glazing & Firing:
{/* Image: Hands applying glaze to a bisqueware ceramic bowl with a wide soft brush — deep teal glaze colour against the pale bisqueware, glaze drip visible, studio shelf of other glazed pieces in soft background bokeh, thoughtful and creative atmosphere */}
<img src="" alt="Glazing ceramics in pottery studio with soft brush application" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center' }} />

// Card body, padding: 24px
// Price chip: bg: rgba(181,105,74,0.1), border: 1px solid rgba(181,105,74,0.25), Plus Jakarta 400, 12px, #b5694a, px-3 py-1 inline-block, margin-bottom 12px: "£75/person" / "£65/person" / "£45/person"
// Cormorant Garamond 700 italic, 24px, #221408: workshop name
// Plus Jakarta 300, 13px, #9a8a7a, margin-top 4px: duration + max group
// Cormorant Garamond 300 italic, 15px, #6a5a48, margin-top 12px, line-height 1.7: description
// "Book →" link: Plus Jakarta 400, 13px, #b5694a, margin-top 16px

// Card 1: "£75/person" / "Wheel Throwing" / "2hrs · Up to 6 people"
// "The most popular workshop. Learn to centre clay, open, and throw your first pot on the wheel. You'll make 2-3 pieces to take home after firing." / "Book →"

// Card 2: "£65/person" / "Hand Building" / "2hrs · Up to 8 people"
// "No wheel required. Pinch pots, coil building, and slab construction. Perfect for those who prefer a more meditative, tactile process." / "Book →"

// Card 3: "£45/person" / "Glazing & Firing" / "1hr · Existing pieces"
// "Bring existing unfired work, or use studio bisqueware. Experiment with our glaze palette and leave the rest to us." / "Book →"
```

### 4. Collection Rows
```tsx
// Section bg: #f0ece0 (warm sand, slightly warmer than bg), padding: 80px clamp(24px,6vw,96px)
// Section label: Plus Jakarta 400, 11px, letter-spacing 0.18em, uppercase, color: #b5694a: "THE SHOP"
// Headline: Cormorant Garamond 700 italic, clamp(32px,4.5vw,68px), #221408, margin-bottom 48px: "Handmade to Last."

// 3 collection rows, each: border-top: 1px solid #d8c8b0, padding: 28px 0
// flex justify-between align-center, cursor pointer

// Hover (Framer Motion whileHover): y -3px (0.2s), border-left: 3px solid #b5694a, padding-left 16px, box-shadow: 0 4px 20px rgba(181,105,74,0.18)

// Left: Cormorant Garamond 700 italic, 24px, #221408 — collection name
//       Cormorant Garamond 300 italic, 15px, #9a8a7a, margin-top 6px — description
// Right: Plus Jakarta 300, 14px, #7a6a58 — "from £28" / "from £45" / "from £120"
//        Clay "→" Cormorant 400, 24px, #b5694a, margin-left 12px

// Row 1: "Tableware" / "Bowls, mugs, plates, and platters. Made to be used daily. Dishwasher safe." / "from £28"
// Row 2: "Decorative Vessels" / "Vases, jugs, and storage jars. Each one unique from throwing." / "from £45"
// Row 3: "Sculptural Works" / "Wall pieces, sculptural forms, and one-off works." / "from £120"
```

### 5. Artist Statement Split
```tsx
// Section bg: #faf7f0, padding: 0 (full-bleed split), min-height: 520px
// 2 columns, 50%/50%

// Left 50%: position relative, overflow hidden
{/* Image: Interior of a ceramics studio — shelves of finished ceramic pieces (bowls, vases, mugs) in warm earthy tones, late afternoon window light casting long warm shadows, thrown forms at different stages of drying, quiet and atmospheric, documentary photography feel */}
<img src="" alt="Clay & Form ceramics studio shelves with finished handmade pieces" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />

// Right 50%: bg: #faf7f0, padding: 64px clamp(32px,4vw,80px), display flex flex-col justify-center
// Pull quote (Cormorant Garamond 700 italic, clamp(22px,3vw,40px), #221408, line-height 1.4, border-left 3px solid #b5694a, padding-left 20px):
// "I make work that holds things — water, light, memory."

// Name chip: bg: #b5694a, color: #faf7f0, Plus Jakarta 400, 12px, letter-spacing 0.08em, px-3 py-1, inline-block, margin-top 20px
// "CHARLOTTE REID — POTTER & FOUNDER"

// Bio: Cormorant Garamond 300 italic, 17px, #7a6a58, margin-top 20px, line-height 1.75
// "Every piece is made in my Margate studio. Thrown, trimmed, dried, bisque fired, glazed by hand, and kiln fired. No shortcuts. Just clay, time, and hands."

// Second bio paragraph:
// "I'm Charlotte Reid. I've been making in Margate since 2018. Before ceramics, I worked in graphic design. I left that world to make things with my hands, and I haven't looked back."

// Location note: Plus Jakarta 300, 13px, #9a8a7a, margin-top 16px: "Studio visits by appointment · Margate Old Town · Margate, Kent"
```

### 6. Class Schedule
```tsx
// Section bg: #f5f0e8, padding: 80px clamp(24px,6vw,96px)
// Headline: Cormorant Garamond 700 italic, clamp(28px,4vw,56px), #221408, margin-bottom 48px: "Upcoming Workshops"

// 2-column table layout: date column (40%) + details column (60%)
// Header row: Plus Jakarta 400, 11px, uppercase, letter-spacing 0.14em, #9a8a7a, border-bottom 1px solid #d8c8b0, padding-bottom 12px
// "DATE" / "WORKSHOP · SPACES"

// 8 workshop rows, each: flex justify-between, border-bottom 1px solid #e8d8c0, padding 16px 0
// Left: Cormorant Garamond 400, 16px, #221408 — date / Plus Jakarta 300, 13px, #9a8a7a — day
// Center: Cormorant Garamond 400, 16px, #221408 — workshop name
// Right: Plus Jakarta 300, 13px, #b5694a — spaces available + link "Book"

// Row 1: "15 Jan" / Wed / "Wheel Throwing" / "4 spaces · Book"
// Row 2: "18 Jan" / Sat / "Hand Building" / "6 spaces · Book"
// Row 3: "22 Jan" / Wed / "Wheel Throwing" / "2 spaces · Book"
// Row 4: "25 Jan" / Sat / "Glazing & Firing" / "3 spaces · Book"
// Row 5: "29 Jan" / Wed / "Wheel Throwing" / "Full"
// Row 6: "1 Feb" / Sat / "Hand Building" / "5 spaces · Book"
// Row 7: "5 Feb" / Wed / "Wheel Throwing" / "6 spaces · Book"
// Row 8: "8 Feb" / Sat / "Glazing & Firing" / "Full"

// "Full" rows: color #c0a890, cursor: not-allowed
// "Book" links: Plus Jakarta 400, 13px, #b5694a

// Note below: Cormorant Garamond 300 italic, 15px, #9a8a7a: "Gift vouchers available for all workshops."
```

### 7. Commission Section — Dark Earth
```tsx
// Section bg: #221408 (deep earth), padding: 80px clamp(24px,6vw,96px)
// Split: left content, right decorative image

// Left (60% on desktop, full on mobile):
// Small label: Plus Jakarta 400, 11px, letter-spacing 0.18em, uppercase, color: #b5694a, margin-bottom 20px
// "COMMISSIONS & BESPOKE WORK"
// Headline: Cormorant Garamond 700 italic, clamp(28px,4.5vw,64px), #faf7f0, line-height 1.15
// "Have something specific in mind?"
// Body: Cormorant Garamond 300 italic, 17px, #c0a890, margin-top 20px, line-height 1.8
// "I take commissions year-round for tableware sets, bespoke gifts, and sculptural works. Each commission starts with a conversation — to understand the use, the recipient, and what you're hoping to hold."
// Second para: "Typical turnaround is 6-8 weeks from sign-off. Prices from £150 for single pieces, from £350 for tableware sets."
// Button: bg: #b5694a, color: #faf7f0, Plus Jakarta 400, 14px, px-7 py-3.5, border-radius: 0, margin-top 32px
// "Enquire About a Commission"
// Hover: bg: #9a5038, 0.2s

// Right (40%): Decorative stack of finished ceramic pieces image:
{/* Image: Stack of hand-thrown ceramic bowls in earthy matte glazes — stacked off-centre, warm earthy brown, sage green, and cream glazes visible, dark minimal background, product photography, studio lighting showing glaze texture and form */}
<img src="" alt="Stacked handmade ceramic bowls in earthen glazes" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', objectPosition: 'center', opacity: 0.9 }} />
```

### 8. Testimonial
```tsx
// Section bg: #faf7f0, padding: 64px clamp(24px,6vw,96px), text-align center
// Cormorant Garamond 700 italic, clamp(24px,3.5vw,48px), #221408, max-width 640px, margin auto
// "My Christmas present to myself. The Wheel Throwing workshop was two of the best hours I've spent."
// Plus Jakarta 300, 15px, #b5694a, margin-top 20px: "— Emma W. · Workshop participant"
```

### 9. Footer
```tsx
// bg: #221408, border-top: 1px solid rgba(181,105,74,0.2), padding: 48px clamp(24px,6vw,96px) 32px
// 3 columns: Brand / Navigate / Studio
// "Clay & Form" Cormorant 400 italic, 18px, #faf7f0 + Cormorant 300 italic 14px #9a8a7a "Handmade ceramics · Margate"
// Navigate: Plus Jakarta 300, 14px, #9a8a7a — Shop / Workshops / About / Commission / Gift Vouchers
// Studio: Plus Jakarta 300, 14px, #9a8a7a — "Margate Old Town" / "By appointment" / "hello@clayandform.co.uk"
// Copyright: "© 2025 Clay & Form. Charlotte Reid." Plus Jakarta 300, 12px, #5a4030
```

## Animations

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Navbar | y: -64→0, opacity 0→1 | 0.5s | 0s | ease-out |
| Hero headline | opacity 0→1, x -30→0 | 0.7s | 0.1s | ease-out |
| Hero sub | opacity 0→1, y 20→0 | 0.6s | 0.3s | ease-out |
| Hero CTAs | opacity 0→1, y 20→0 | 0.6s | 0.5s | ease-out |
| Workshop cards | whileInView scale 0.95→1, opacity 0→1, stagger 0.12s | 0.6s | scroll | [0.25,0.46,0.45,0.94] |
| Workshop card hover | y: -4px, box-shadow | 0.25s | 0s | ease-out |
| Collection rows | whileHover y:-3px, clay border+glow | 0.2s | 0s | ease-out |
| Commission section | whileInView opacity 0→1, y 24→0 | 0.6s | scroll | ease-out |
| CTA button | whileHover bg darken | 0.2s | 0s | ease-out |

## Responsive

- **Mobile (<768px)**: Hero stacks (photo above, content below), workshop cards 1-col, collection rows simplify, artist split stacks, schedule simplifies to key columns, commission section single column
- **Tablet**: Workshop cards 2+1, artist split keeps ratio
- **Desktop**: Full split hero (45/55), all sections full-width as described

## Full Copy

**Brand**: Clay & Form

**Navbar**: Clay & Form / Shop / Workshops / About / Commission

**Hero**:
- Kicker: "Handmade Ceramics & Pottery Workshops · Margate"
- Headline: "Every Piece Begins as Possibility."
- Sub: "Handmade ceramics and pottery workshops in Margate. Every piece thrown, hand-built, and glazed in the studio."
- CTA 1: "Browse the Shop"
- CTA 2: "Book a Workshop"
- Note: "Charlotte Reid · Studio open by appointment · Margate Old Town"

**Workshops**:
- Wheel Throwing: £75/person / 2hrs / Up to 6 people / "The most popular workshop. Learn to centre clay, open, and throw your first pot on the wheel. You'll make 2-3 pieces to take home after firing."
- Hand Building: £65/person / 2hrs / Up to 8 people / "No wheel required. Pinch pots, coil building, and slab construction. Perfect for those who prefer a more meditative, tactile process."
- Glazing & Firing: £45/person / 1hr / Existing pieces / "Bring existing unfired work, or use studio bisqueware. Experiment with our glaze palette and leave the rest to us."

**Collections**:
- Tableware: "Bowls, mugs, plates, and platters. Made to be used daily. Dishwasher safe." — from £28
- Decorative Vessels: "Vases, jugs, and storage jars. Each one unique from throwing." — from £45
- Sculptural Works: "Wall pieces, sculptural forms, and one-off works." — from £120

**Artist statement**:
- Pull quote: "I make work that holds things — water, light, memory."
- Name: "CHARLOTTE REID — POTTER & FOUNDER"
- Bio 1: "Every piece is made in my Margate studio. Thrown, trimmed, dried, bisque fired, glazed by hand, and kiln fired. No shortcuts. Just clay, time, and hands."
- Bio 2: "I'm Charlotte Reid. I've been making in Margate since 2018. Before ceramics, I worked in graphic design. I left that world to make things with my hands, and I haven't looked back."
- Location: "Studio visits by appointment · Margate Old Town · Margate, Kent"

**Schedule** (8 workshops in Jan/Feb — see section 6 above)

**Commission**: "Have something specific in mind?" / "I take commissions year-round for tableware sets, bespoke gifts, and sculptural works. Each commission starts with a conversation — to understand the use, the recipient, and what you're hoping to hold." / "Typical turnaround is 6-8 weeks from sign-off. Prices from £150 for single pieces, from £350 for tableware sets." / "Enquire About a Commission"

**Testimonial**: "My Christmas present to myself. The Wheel Throwing workshop was two of the best hours I've spent." — Emma W. · Workshop participant

**Contact**: Margate Old Town / By appointment / hello@clayandform.co.uk

## Key Dependencies
```json
{
  "dependencies": {
    "react": "^18",
    "framer-motion": "^11",
    "lucide-react": "latest",
    "@shadcn/ui": "latest",
    "tailwindcss": "^3"
  }
}
```
