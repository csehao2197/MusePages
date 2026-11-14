# Street Burgers — Food Truck Website Prompt

## Goal
Build a bold, high-energy street food truck website with Bebas Neue display type, warm saffron accents on near-black, a floating menu preview card, location tracker, and count-up stats strip.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System

### Colors
```css
:root {
  --background: 0 0% 6%;
  --foreground: 0 0% 96%;
  --primary: 38 85% 56%;
  --primary-foreground: 0 0% 4%;
  --muted-foreground: 0 0% 58%;
  --border: 0 0% 20%;
  /* Raw hex reference */
  /* warm-saffron: #f0a82a */
  /* near-black: #0f0f0f */
  /* warm-white: #fafafa */
  /* deep-orange: #c47a1a */
}
```

### Typography
Google Fonts import: `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@300;400&display=swap`
- Display: Bebas Neue 400 (all headlines, prices, labels, sections)
- Body: Plus Jakarta Sans 400
- Captions / prices: Plus Jakarta Sans 300

## Visual Effects

1. **"STREET" Background Text** — Bebas Neue at clamp(240px,34vw,500px), color: #f0a82a, opacity: 0.04, position: absolute, right: -2%, top: 50%, transform: translateY(-50%), z-index: 0, pointer-events: none
2. **Floating Menu Preview Card** — absolute positioned below hero CTAs, near-black bg #1a1a1a, 1px saffron border, border-radius: 4px, Framer Motion scale 0.9→1 at 0.4s delay
3. **Count-Up Stats Strip** — saffron bg, near-black text, 4 stats in Bebas Neue 72px, requestAnimationFrame over 1.6s
4. **Signature Item Card Hover** — image scale 1.04 (0.25s), saffron 1px border appears (0.2s), translateY -4px

## Component Breakdown

### 1. Navbar
```tsx
// Sticky, bg: #0f0f0f, border-bottom: 1px solid #1f1f1f, height: 60px
// Left: "Street Burgers" — Bebas Neue, 22px, letter-spacing: 0.06em, color: #fafafa
// Center: Menu / Locations / About / Instagram — Plus Jakarta Sans 400, 14px, #c0c0c0
// Right: "Find Us" — bg: #f0a82a, color: #0f0f0f, Plus Jakarta 400, 14px, px-5 py-2.5, border-radius: 3px
// Framer Motion: y -60→0, 0.45s ease-out
```

### 2. Hero
```tsx
// Full-viewport, min-height: 100vh, position: relative, overflow: hidden, bg: #0f0f0f

{/* Image: Street food truck photography — bold branded yellow-and-black Street Burgers food truck at street level, steam rising from the grill visible through the serving window, queue of happy customers waiting, city street setting at golden hour or at night with warm street light glow, vibrant and high-energy urban food scene */}
<img src="" alt="Street Burgers food truck on city street with customers queuing" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />

// Gradient overlay — composition independent:
// linear-gradient(to right, rgba(15,15,15,0.92) 0%, rgba(15,15,15,0.65) 55%, transparent 100%)
// position: absolute; inset: 0; z-index: 1

// Background text "STREET":
// Bebas Neue, clamp(240px,34vw,500px), color: #f0a82a, opacity: 0.04
// position: absolute, right: -2%, top: 50%, transform: translateY(-50%), z-index: 0

// Content panel: position absolute, left 0, top 0, height 100%, width 55%, z-index 10
// padding-left: clamp(24px,6vw,96px), display flex flex-col justify-center

// Kicker: Plus Jakarta 300, 12px, letter-spacing 0.16em, uppercase, color: #f0a82a, margin-bottom 12px
// "SMASH BURGERS · LONDON"

// Main headline: "THE BEST BURGER YOU'LL EAT ALL WEEK."
// Bebas Neue, clamp(58px,8.5vw,145px), line-height: 0.92, color: #fafafa
// Framer Motion: opacity 0→1, x -40→0, 0.7s ease-out, delay: 0.1s

// Sub: Plus Jakarta Sans 300, 17px, color: #8c8c8c, margin-top 20px, max-width 440px, line-height 1.65
// "Premium smash burgers. Maximum flavour. Zero pretension. Five locations across London this week."
// Framer Motion: opacity 0→1, y 20→0, 0.6s, delay 0.3s

// CTAs (flex row, gap 12px, margin-top 28px):
// "See Full Menu" — bg: #f0a82a, color: #0f0f0f, Plus Jakarta 400, 15px, px-7 py-3.5, border-radius: 3px
// "Find Us This Week" — bg: transparent, border: 1px solid rgba(240,168,42,0.5), color: #fafafa, Plus Jakarta 400, 15px, px-7 py-3.5, border-radius: 3px
// Framer Motion: opacity 0→1, y 20→0, 0.6s, delay 0.5s

// Floating Menu Card — position relative z-20, margin-top 32px, display inline-block:
// bg: #1a1a1a, border: 1px solid #f0a82a, border-radius: 4px, padding: 16px 20px, min-width: 220px
// Framer Motion: initial scale 0.9, animate scale 1, delay 0.4s, duration 0.5s, ease [0.34,1.56,0.64,1]

// Card header: Bebas Neue, 16px, letter-spacing 0.08em, color: #f0a82a: "TODAY'S TOP PICKS"
// Divider: 1px solid #2a2a2a, margin 8px 0

// 3 menu items (each: flex justify-between align-center, padding: 6px 0):
// Left: Plus Jakarta 300, 14px, #fafafa — item name
// Right: Plus Jakarta 300, 13px, #f0a82a — price

// Item 1: "The Classic" / "£11"
// Item 2: "The Smash BBQ" / "£13"
// Item 3: "The Vegan" / "£11"

// Card footer: saffron "See Full Menu →" Plus Jakarta 300, 12px, #f0a82a, margin-top 10px
```

### 3. Menu Category Rows
```tsx
// Section bg: #0f0f0f, padding: 80px clamp(24px,6vw,96px)
// Section label: Plus Jakarta 300, 12px, letter-spacing 0.16em, uppercase, color: #f0a82a, margin-bottom 8px: "THE MENU"
// Headline: Bebas Neue, clamp(36px,5vw,80px), #fafafa, margin-bottom 48px: "WHAT WE SERVE"

// 4 category rows, each: border-top 1px solid rgba(255,255,255,0.12), padding 28px 0
// flex justify-between align-center, cursor pointer
// Hover (Framer Motion whileHover): y -3px (0.2s), border-left: 4px solid #f0a82a, padding-left 16px, box-shadow: 0 4px 20px rgba(240,168,42,0.25)

// Left: Bebas Neue, 28px, #fafafa — category name
//       Plus Jakarta 400, 14px, #8c8c8c, margin-top 4px — description
// Right: Plus Jakarta 300, 14px, #7a7a7a — "from £9"
//        Saffron "→" Bebas Neue, 24px, #f0a82a, margin-left 12px

// Row 1: "Signature Burgers" / "Our smash burger line-up. Every one made fresh to order." / "from £11"
// Row 2: "Loaded Fries" / "Skin-on fries, four ways. A meal on their own." / "from £5"
// Row 3: "Drinks" / "Fanta floats, Mexican Coke, fresh lemonade, iced tea." / "from £2.50"
// Row 4: "Weekly Specials" / "A different special every week. Always worth it." / "from £12"
```

### 4. Signature Items
```tsx
// Section bg: #0f0f0f, padding: 80px clamp(24px,6vw,96px)
// Headline: Bebas Neue, clamp(32px,4.5vw,72px), #fafafa, margin-bottom 48px: "THE SIGNATURES"

// 3-column flex, gap 24px

// Each card: bg: #111, border: 1px solid #1f1f1f, border-radius: 4px, overflow hidden
// Hover: Framer Motion (image scale 1.04, border-color #f0a82a, 0.25s ease-out)

// Card 1 — The Classic:
{/* Image: Close-up overhead photography of a double smash burger — two thin crispy-edged smash patties, melted American cheese, pickles, mustard, ketchup, glossy brioche bun, served on parchment in a dark metal tray, dramatic side lighting showing texture and juiciness, steam visible */}
<img src="" alt="The Classic double smash burger with American cheese and pickles" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center' }} />
// Card body, padding 20px
// Bebas Neue, 28px, #fafafa: "THE CLASSIC"
// Plus Jakarta 300, 13px, #8c8c8c, margin-top 6px: "Double smash patty · American cheese · Pickles · Mustard · Ketchup · Brioche"
// Saffron price, Bebas Neue 24px, #f0a82a, margin-top 12px: "£11"

// Card 2 — The Smash BBQ:
{/* Image: Side-angle close-up of The Smash BBQ burger — two smash patties with crispy bacon rasher visible, glossy BBQ sauce dripping, crispy fried onions on top, brioche bun, dramatic backlighting, dark moody food photography */}
<img src="" alt="The Smash BBQ burger with bacon and house BBQ sauce" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center' }} />
// "THE SMASH BBQ" / "Double smash patty · Smoked streaky bacon · House BBQ · Crispy fried onions · Brioche" / "£13"

// Card 3 — The Vegan:
{/* Image: Overhead shot of The Vegan burger — Beyond Beef smash patty, vegan cheese, vivid pickled red onion slices, shredded green iceberg lettuce, vegan mayo, brioche bun, shot on dark slate surface with vibrant colour contrast */}
<img src="" alt="The Vegan Beyond Beef smash burger with pickled red onion" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center' }} />
// "THE VEGAN" / "Beyond Beef smash patty · Vegan cheese · Pickled red onion · Shredded iceberg · Vegan mayo · Brioche" / "£11"
```

### 5. Location Tracker
```tsx
// Section bg: #0f0f0f, padding: 80px clamp(24px,6vw,96px)
// Inner card: bg: #111, border: 1px solid #1f1f1f, border-radius: 4px, padding: 40px 40px

// Bebas Neue, clamp(28px,4vw,56px), #fafafa: "THIS WEEK'S LOCATIONS."
// Plus Jakarta 300, 14px, #8c8c8c, margin-bottom 32px: "We move. Check Instagram for same-day updates."

// 3 location chips (flex-col, gap 16px):
// Each: bg #1a1a1a, border 1px solid #2a2a2a, border-radius 4px, padding 16px 20px
// flex align-center gap 16px

// Left icon: MapPin lucide, 18px, #f0a82a
// Center: flex flex-col
//   Bebas Neue, 18px, #fafafa — location name
//   Plus Jakarta 300, 13px, #8c8c8c — days and times
// Right: saffron chip (flex align-center, bg rgba(240,168,42,0.12), border 1px solid rgba(240,168,42,0.3), border-radius 2px, px-3 py-1)
//   Plus Jakarta 300, 12px, #f0a82a — status

// Location 1: "Shoreditch Market" / "Tue–Fri · 12pm–9pm" / "OPEN NOW"
// Location 2: "Brixton Market" / "Sat · 11am–8pm" / "SAT ONLY"
// Location 3: "Peckham Rye" / "Sun · 12pm–7pm" / "SUN ONLY"

// Instagram follow prompt below:
// flex align-center gap 8px, margin-top 24px
// Instagram icon (lucide), 18px, #f0a82a
// Plus Jakarta 300, 14px, #8c8c8c: "Follow "
// Plus Jakarta 400, 14px, #f0a82a: "@streetburgers"
// Plus Jakarta 300, 14px, #8c8c8c: " for daily location updates."

// Framer Motion: card whileInView scale 0.97→1, opacity 0→1, 0.5s ease-out
```

### 6. Count-Up Stats Strip
```tsx
// Full-width section, bg: #f0a82a, padding: 48px clamp(24px,6vw,96px)
// flex flex-wrap justify-around align-center gap-x-16 gap-y-8

// 4 stats, each: flex-col align-center text-align center
// Value: Bebas Neue, 72px, #0f0f0f, line-height 1
// Label: Plus Jakarta Sans 300, 14px, #3a2a00, letter-spacing 0.06em, text-transform uppercase, margin-top 4px

// Stat 1: count-up "50K+" / "Burgers Served"
// Stat 2: "Since 2019" (no count-up — static text in Bebas 56px)
// Stat 3: count-up "4.9★" / "Google Rating"
// Stat 4: count-up "5" / "Weekly Locations"

// Count-up: IntersectionObserver + requestAnimationFrame, 1600ms easeOutQuart
```

### 7. Full Menu Detail
```tsx
// Section bg: #0f0f0f, padding: 80px clamp(24px,6vw,96px)
// Headline: Bebas Neue clamp(32px,4.5vw,68px) #fafafa "THE FULL MENU"

// 4 menu sections, each with:
// Bebas Neue, 20px, letter-spacing 0.1em, color: #f0a82a, margin-bottom 20px — section name
// list of items, each: flex justify-between, border-bottom 1px solid rgba(255,255,255,0.08), padding 12px 0

// SIGNATURE BURGERS
// "The Classic — Two thin smash patties. American cheese. Pickles. Mustard. Ketchup. Brioche. That's it." / "£11"
// "The Smash BBQ — Two smash patties, smoked streaky bacon, house BBQ, crispy fried onions, brioche." / "£13"
// "The Vegan — Beyond Beef smash patty. Vegan cheese. Pickled red onion. Shredded iceberg. Vegan mayo. Brioche." / "£11"
// "The Double Classic — Four patties. Four slices American cheese. The same brioche (barely)." / "£15"

// LOADED FRIES
// "Classic Cheese Fries" / "£5"
// "Bacon & Cheese Fries" / "£6.50"
// "Truffle Fries" / "£6"
// "Chilli Cheese Fries" / "£6.50"

// DRINKS
// "Fanta Float" / "£3"
// "Mexican Coke" / "£3.50"
// "Lemonade" / "£2.50"
// "Iced Tea" / "£2.50"

// WEEKLY SPECIAL (saffron bg section):
// bg: rgba(240,168,42,0.08), border: 1px solid rgba(240,168,42,0.2), border-radius: 4px, padding 20px
// Bebas Neue 16px #f0a82a "THIS WEEK'S SPECIAL"
// Plus Jakarta 400 18px #fafafa "The Korean Smash"
// Plus Jakarta 300 14px #8c8c8c "Gochujang mayo, kimchi, smash patty, sesame slaw. It'll be gone by Saturday."
// Bebas Neue 24px #f0a82a "£14"
```

### 8. About Strip
```tsx
// Section bg: #111, padding: 64px clamp(24px,6vw,96px)
// 2 columns, gap 48px

// Left: Bebas Neue clamp(28px,4vw,56px) #fafafa "FOUR YEARS. 50,000 BURGERS."
// Right: Plus Jakarta 400, 16px, #8c8c8c, line-height 1.7
// "Street Burgers started with one truck and one obsession: the perfect smash burger. Four years and 50,000 burgers later, it's still the same obsession. No restaurant deals. No franchises. Just us, the truck, and the queue."
// Plus Jakarta 300, 14px, #f0a82a, margin-top 16px: "Est. 2019 · London · @streetburgers"
```

### 9. Saffron CTA
```tsx
// Section bg: #f0a82a, padding: 64px clamp(24px,6vw,96px), text-align center
// Bebas Neue, clamp(48px,7vw,110px), #0f0f0f: "HUNGRY?"
// Plus Jakarta 400, 17px, #3a2a00, margin-top 12px: "Find our schedule above or follow us on Instagram for daily updates and surprise locations."
// Button: bg #0f0f0f, color #fafafa, Plus Jakarta 400, 15px, px-8 py-4, border-radius 3px, margin-top 32px
// "Follow @streetburgers"
// Hover: bg #1a1a1a, 0.2s
```

### 10. Footer
```tsx
// bg: #0a0a0a, border-top: 1px solid #1f1f1f, padding: 40px clamp(24px,6vw,96px) 24px
// 3 columns: Brand / Menu / Find Us
// "STREET BURGERS" Bebas Neue 20px #f0a82a + Plus Jakarta 300 13px #555 "London Smash Burgers · Est. 2019"
// Menu: Plus Jakarta 300 14px #6a6a6a — Signature Burgers / Loaded Fries / Drinks / Weekly Special
// Find Us: Plus Jakarta 300 14px #6a6a6a — Shoreditch Market / Brixton Market / Peckham Rye / Instagram
// Copyright: "© 2025 Street Burgers. Follow us @streetburgers" Plus Jakarta 300 12px #333
```

## Animations

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Navbar | y: -60→0 | 0.45s | 0s | ease-out |
| Hero headline | opacity 0→1, x -40→0 | 0.7s | 0.1s | ease-out |
| Hero sub | opacity 0→1, y 20→0 | 0.6s | 0.3s | ease-out |
| Hero CTAs | opacity 0→1, y 20→0 | 0.6s | 0.5s | ease-out |
| Floating menu card | scale 0.9→1 | 0.5s | 0.4s | spring [0.34,1.56,0.64,1] |
| Category rows | whileHover y:-3px, saffron border+glow | 0.2s | 0s | ease-out |
| Signature cards | whileHover img scale 1.04, amber border | 0.25s | 0s | ease-out |
| Location card | whileInView scale 0.97→1, opacity 0→1 | 0.5s | scroll | ease-out |
| Count-up stats | 0→target, rAF | 1.6s | on scroll entry | easeOutQuart |
| CTA button | whileHover bg darken | 0.2s | 0s | ease-out |

## Responsive

- **Mobile (<768px)**: Hero single column, background text hidden, floating card full-width below CTAs, category rows simplify, signature cards 1-col, location chips full-width, stats 2×2
- **Tablet**: Signature cards 2+1, stats row 2×2, location chips full-width
- **Desktop**: Full layout as described

## Full Copy

**Brand**: Street Burgers

**Navbar**: Street / Menu / Locations / About / Instagram

**Hero**:
- Kicker: "SMASH BURGERS · LONDON"
- Headline: "THE BEST BURGER YOU'LL EAT ALL WEEK."
- Sub: "Premium smash burgers. Maximum flavour. Zero pretension. Five locations across London this week."
- CTA 1: "See Full Menu"
- CTA 2: "Find Us This Week"

**Floating card**: "TODAY'S TOP PICKS" / The Classic £11 / The Smash BBQ £13 / The Vegan £11 / "See Full Menu →"

**Menu categories**:
- Signature Burgers: "Our smash burger line-up. Every one made fresh to order." — from £11
- Loaded Fries: "Skin-on fries, four ways. A meal on their own." — from £5
- Drinks: "Fanta floats, Mexican Coke, fresh lemonade, iced tea." — from £2.50
- Weekly Specials: "A different special every week. Always worth it." — from £12

**Full Menu**:
- The Classic £11: "Two thin smash patties. American cheese. Pickles. Mustard. Ketchup. Brioche. That's it."
- The Smash BBQ £13: "Two smash patties, smoked streaky bacon, house BBQ, crispy fried onions, brioche."
- The Vegan £11: "Beyond Beef smash patty. Vegan cheese. Pickled red onion. Shredded iceberg. Vegan mayo. Brioche."
- The Double Classic £15: "Four patties. Four slices American cheese. The same brioche (barely)."
- Loaded Fries: Classic Cheese £5 / Bacon & Cheese £6.50 / Truffle £6 / Chilli Cheese £6.50
- Drinks: Fanta Float £3 / Mexican Coke £3.50 / Lemonade £2.50 / Iced Tea £2.50
- This Week's Special: "The Korean Smash — Gochujang mayo, kimchi, smash patty, sesame slaw. It'll be gone by Saturday." £14

**Locations**:
- Shoreditch Market · Tue–Fri · 12pm–9pm · OPEN NOW
- Brixton Market · Sat · 11am–8pm · SAT ONLY
- Peckham Rye · Sun · 12pm–7pm · SUN ONLY
- "Follow @streetburgers for daily location updates."

**Stats**: 50K+ Burgers Served / Since 2019 / 4.9★ Google / 5 Weekly Locations

**About**: "Street Burgers started with one truck and one obsession: the perfect smash burger. Four years and 50,000 burgers later, it's still the same obsession. No restaurant deals. No franchises. Just us, the truck, and the queue." / "Est. 2019 · London · @streetburgers"

**CTA**: "HUNGRY?" / "Find our schedule above or follow us on Instagram for daily updates and surprise locations." / "Follow @streetburgers"

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
