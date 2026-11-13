# Lens & Frame — Optician Website Prompt

## Goal
Build a warm, editorial independent optician website that communicates genuine expertise and premium eyewear in a clean, fashion-forward aesthetic.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System

### Colors
```css
:root {
  --background: 50 20% 98%;
  --foreground: 0 0% 4%;
  --primary: 170 76% 47%;
  --primary-foreground: 0 0% 4%;
  --muted-foreground: 0 0% 44%;
  --border: 0 0% 87%;
  /* Raw hex reference */
  /* warm-white: #fafaf5 */
  /* near-black: #0a0a0a */
  /* electric-mint: #1ad4b4 */
  /* light-grey: #f0f0ee */
}
```

### Typography
Google Fonts import: `https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@1&family=Inter:wght@300;400&display=swap`
- Display: DM Serif Display 400 italic (all hero and section headlines)
- Sub-headlines: Inter 400
- Body / Captions: Inter 300

## Visual Effects

1. **Floating Frames Preview Card** — absolute positioned right panel card, white bg, 0.5px black border, border-radius: 0, Framer Motion scale 0.85→1 at 0.4s delay, 0.6s ease-out spring, contains frame image + Inter 400 name + Inter 300 description + mint "Try On →" link
2. **Scrolling Brand Marquee** — 8 eyewear brand names, continuous translateX loop at 50s, monochrome Inter 300, 0.5px black dividers between names
3. **Collection Row Hover Raise** — hover triggers y:-3px (0.2s ease-out), mint 3px left border appears (0.15s), mint glow shadow 0 4px 20px rgba(26,212,180,0.18)
4. **Mint Step Number Faded** — large mint numerals 1/2/3 at 80px Inter 300 behind each process step at opacity: 0.08

## Component Breakdown

### 1. Navbar
```tsx
// Sticky, bg: #fafaf5, border-bottom: 0.5px solid #e0e0e0, height: 64px
// Left: "Lens & Frame" in Inter 400, 15px, letter-spacing: 0.08em, near-black
// Center: nav links — Frames / Eye Tests / Contact Lenses / About — Inter 300, 14px, near-black
// Right: "Book" button — bg: #0a0a0a, text: #fafaf5, Inter 400, 13px, 0px border-radius, px-5 py-2
// Framer Motion: navbar slides down from y:-100% at page load, 0.5s ease-out
```

### 2. Hero
```tsx
// Full-bleed, min-height: 100vh, position: relative, overflow: hidden
// Background image fills entire area:
{/* Image: Fashion-forward editorial close-up of a person wearing striking designer eyeglasses — minimalist warm white studio background, soft diffused natural light, face filling right two-thirds of frame, glasses in sharp focus with fine metal frames visible, skin tones warm, mood elegant and confident */}
<img src="" alt="Person wearing designer eyeglasses in editorial studio portrait" />
// img: object-fit: cover; object-position: center; width: 100%; height: 100%; position: absolute; inset: 0;

// Directional gradient overlay (composition-independent):
// background: linear-gradient(to right, rgba(250,250,245,0.97) 0%, rgba(250,250,245,0.88) 45%, transparent 100%);
// position: absolute; inset: 0; z-index: 1;

// Content panel — position: absolute, left: 0, top: 0, height: 100%, width: 52%, z-index: 10, display: flex, flex-direction: column, justify-content: center, padding-left: clamp(24px,6vw,96px)

// Headline:
// "See the World in Detail."
// font-family: 'DM Serif Display', serif; font-style: italic;
// font-size: clamp(42px,6vw,108px); line-height: 1.08; color: #0a0a0a;
// Framer Motion: opacity 0→1, y 30→0, duration: 0.7s, delay: 0.1s

// Sub-headline:
// "Independent opticians in Marylebone — exceptional eyewear, genuine expert care. Eye tests from £35."
// Inter 400, 18px, color: #0a0a0a, margin-top: 20px, max-width: 420px
// Framer Motion: opacity 0→1, y 20→0, duration: 0.6s, delay: 0.3s

// CTA row (flex, gap: 12px, margin-top: 32px):
// "Book an Eye Test" — bg: #0a0a0a, color: #fafaf5, Inter 400, 15px, px-7 py-3, border-radius: 0
// "Browse Frames" — bg: transparent, border: 1px solid #0a0a0a, color: #0a0a0a, Inter 400, 15px, px-7 py-3, border-radius: 0
// Framer Motion: opacity 0→1, y 20→0, duration: 0.6s, delay: 0.5s

// Floating Frames Card — position: absolute, right: 8%, top: 50%, transform: translateY(-50%), z-index: 20
// bg: #ffffff, border: 0.5px solid #0a0a0a, border-radius: 0, padding: 20px, width: 180px
{/* Image: Close-up product shot of a slim titanium eyeglass frame against a clean white background, overhead lighting, precise studio product photography feel */}
<img src="" alt="The Marlow titanium eyeglass frame" style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', objectPosition: 'center' }} />
// Inter 400, 14px, near-black, margin-top: 12px: "The Marlow"
// Inter 300, 12px, #707070: "Titanium · 30 colourways · £195"
// mint (#1ad4b4), Inter 400, 13px, margin-top: 8px: "Try On →"
// Framer Motion: initial scale: 0.85, animate scale: 1, delay: 0.4s, duration: 0.6s, ease: [0.34,1.56,0.64,1]
```

### 3. Collections
```tsx
// Section bg: #fafaf5, padding: 80px clamp(24px,6vw,96px)
// Section label: Inter 400, 11px, letter-spacing: 0.12em, text-transform: uppercase, color: #1ad4b4, margin-bottom: 48px

// 4 collection rows — each separated by border-top: 0.5px solid #e0e0e0
// Row layout: flex, justify-content: space-between, align-items: center, padding: 28px 0, cursor: pointer
// Hover (Framer Motion whileHover): y:-3px (0.2s ease-out), border-left: 3px solid #1ad4b4 (transition 0.15s), box-shadow: 0 4px 20px rgba(26,212,180,0.18)

// Row 1: Designer Frames
// Left: DM Serif Display italic 24px "Designer Frames" / Inter 300 14px #707070 "Over 200 premium frames from Silhouette, Lindberg, and Oliver Peoples. Tried on properly, not just handed to you."
// Right: Inter 300 14px #0a0a0a "from £125" / mint "→" Inter 400 22px

// Row 2: Sports & Performance
// "Sports & Performance" / "Prescription sports eyewear for cycling, running, golf, and skiing."
// "from £149" / mint "→"

// Row 3: Reading & Screen
// "Reading & Screen" / "Single vision, varifocal, and blue-light filtering for screen-heavy lives."
// "from £95" / mint "→"

// Row 4: Sunglasses
// "Sunglasses" / "Prescription and non-prescription sunglasses. Including polarised options."
// "from £110" / mint "→"
```

### 4. Process — 3-Step
```tsx
// Section bg: #f0f0ee, padding: 80px clamp(24px,6vw,96px)
// Section headline: DM Serif Display italic 40px "From Test to Perfect Fit." near-black, margin-bottom: 60px

// 3 columns, flex, gap: 48px on desktop; stack on mobile

// Each column:
// Faded step number: Inter 300, 80px, color: #1ad4b4, opacity: 0.12, line-height: 1, margin-bottom: -20px (overlaps below)
// Step label: Inter 400, 13px, letter-spacing: 0.1em, text-transform: uppercase, color: #1ad4b4
// Step name: DM Serif Display italic, 26px, #0a0a0a
// Description: Inter 300, 15px, #707070, line-height: 1.7

// Step 1 — "1" / "Step One" / "Book Your Test"
// "A comprehensive eye test that doesn't feel like a conveyor belt. 45 minutes. Thorough. Honest. From £35."

// Step 2 — "2" / "Step Two" / "Expert Advice"
// "Your optician will spend time understanding how you actually use your eyes — work, sport, daily life — before recommending any lenses or frames."

// Step 3 — "3" / "Step Three" / "Precision Fitting"
// "Frame selection with a trained dispenser. Measurements taken properly. Lenses glazed to your exact prescription. Adjustments included."

// Framer Motion: each column fades in (opacity 0→1, y 24→0) with stagger 0.15s on scroll entry (whileInView)
```

### 5. Brand Marquee
```tsx
// Section bg: #fafaf5, padding: 40px 0, border-top: 0.5px solid #e0e0e0, border-bottom: 0.5px solid #e0e0e0, overflow: hidden

// Label: Inter 400, 11px, letter-spacing: 0.12em, uppercase, color: #ababab, text-align: center, margin-bottom: 24px
// "BRANDS WE STOCK"

// Marquee track: display: flex, gap: 64px, animation: marquee 50s linear infinite
// 8 brand names, each: Inter 300, 15px, color: #0a0a0a, opacity: 0.7, white-space: nowrap
// "Silhouette · Lindberg · Oliver Peoples · Tom Ford · Ray-Ban · Oakley · Persol · Maui Jim"
// Duplicate array for seamless loop

// @keyframes marquee: from translateX(0) to translateX(-50%)
```

### 6. Why Independent
```tsx
// Section bg: #fafaf5, padding: 80px clamp(24px,6vw,96px)
// Headline: DM Serif Display italic 40px "Why Choose Independent?"

// 2×2 grid, gap: 32px, margin-top: 48px
// Each cell: border-left: 3px solid #1ad4b4, padding-left: 20px
// Cell label: Inter 400, 16px, near-black
// Cell sub: Inter 300, 14px, #707070

// Cell 1: "No chain targets" / "We recommend what's right for your eyes. Not what shifts the most units."
// Cell 2: "Genuinely independent advice" / "Every recommendation comes from clinical judgement, not sales incentives."
// Cell 3: "All major brands stocked" / "Over 200 frames from Silhouette, Lindberg, Oliver Peoples, and more."
// Cell 4: "Same optician every visit" / "Build a relationship with a clinician who actually knows your history."

// Trust strip below: bg: #0a0a0a, padding: 24px, margin-top: 48px, text-align: center
// Inter 300, 15px, color: #fafaf5, letter-spacing: 0.04em
// "Family-run since 1998 · 5★ Google · 2,400+ patients · FODO member"
```

### 7. Eye Test Pricing
```tsx
// Section bg: #f0f0ee, padding: 80px clamp(24px,6vw,96px)
// Headline: DM Serif Display italic 40px "Eye Tests & Appointments"
// Sub: Inter 300, 17px, #707070, margin-bottom: 48px, max-width: 540px
// "A comprehensive eye test that doesn't feel like a conveyor belt. 45 minutes. Thorough. Honest."

// 4 pricing rows, each: flex justify-between align-center, border-bottom: 0.5px solid #d0d0d0, padding: 20px 0
// Left: Inter 400, 16px, near-black — service name / Inter 300, 13px, #707070 — short note
// Right: DM Serif Display italic, 24px, #1ad4b4 — price

// Row 1: "Comprehensive Eye Test" / "Includes full health check, OCT available on request" → "£35"
// Row 2: "Contact Lens Fitting" / "New fits and aftercare. All major brands." → "£45"
// Row 3: "Children's Eye Test" / "Under 16. Fully subsidised under GOS." → "Free"
// Row 4: "NHS Vouchers" / "We accept all NHS optical vouchers." → "Accepted"

// Note below: Inter 300, 13px, #909090 "Private eye tests only. NHS sight tests available for eligible patients."
```

### 8. Featured Frames
```tsx
// Section bg: #fafaf5, padding: 80px clamp(24px,6vw,96px)
// Section label + headline: "New In" / DM Serif Display italic 40px "Selected Frames"

// 3-column card grid, gap: 24px

// Each card: bg: #ffffff, border: 0.5px solid #e0e0e0
{/* Image: Studio product photography of designer eyeglasses flat on white surface, perfect overhead lighting, shadow visible beneath frame, premium editorial quality */}
<img src="" alt="[Frame name] designer eyeglasses" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center' }} />
// Card body padding: 20px
// DM Serif Display italic 20px "The Marlow" (/ "The Camden" / "The Mayfair")
// Inter 300 13px #707070 "Titanium · 30 colourways · Made in Austria" (/ "Acetate · 12 colourways · Handmade in Italy" / "Stainless Steel · 18 colourways · Japanese engineering")
// Flex justify-between margin-top: 16px: Inter 400 16px near-black "£195" (/ "£225" / "£175") + mint "Try In Store →" Inter 300 13px

// Hover: Framer Motion scale 1.015, 0.2s ease-out
```

### 9. Testimonial
```tsx
// Section bg: #0a0a0a, padding: 80px clamp(24px,6vw,96px), text-align: center
// DM Serif Display italic, clamp(28px,4vw,56px), color: #fafaf5
// "Switched from a chain optician 3 years ago and will never go back."
// Inter 300, 15px, #1ad4b4, margin-top: 24px: "— Sarah J., Marylebone"
// 5 mint stars (★★★★★) Inter 400 18px above the quote
```

### 10. Book CTA
```tsx
// Section bg: #0a0a0a, padding: 80px clamp(24px,6vw,96px), text-align: center
// DM Serif Display italic clamp(38px,5vw,80px) color: #fafaf5 "Book Your Eye Test Today"
// Inter 300, 17px, color: #ababab, margin-top: 16px: "Appointments available within 48 hours. Evening and Saturday slots available."
// mint bg (#1ad4b4) button, margin-top: 32px: Inter 400, 15px, near-black text "Book Online"
// border-radius: 0, px-8 py-4
// Hover: Framer Motion scale 1.04, 0.2s
```

### 11. Footer
```tsx
// bg: #0a0a0a, border-top: 0.5px solid #222, padding: 48px clamp(24px,6vw,96px) 32px
// 3 columns: Brand / Navigation / Contact
// Brand col: "Lens & Frame Independent Opticians" Inter 300 14px #ababab, mint dot decorative
// Nav col: Inter 300 14px, links: Frames / Eye Tests / Contact Lenses / About / Book / Privacy
// Contact col: Inter 300 14px #ababab: "12 Marylebone High Street, London, W1U 4PY" / "020 7000 0000" / "hello@lensandframe.co.uk"
// Copyright row: "© 2025 Lens & Frame Independent Opticians" Inter 300 12px #555
```

## Animations

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Navbar | y: -100% → 0 | 0.5s | 0s | ease-out |
| Hero headline | opacity 0→1, y 30→0 | 0.7s | 0.1s | ease-out |
| Hero sub | opacity 0→1, y 20→0 | 0.6s | 0.3s | ease-out |
| Hero CTAs | opacity 0→1, y 20→0 | 0.6s | 0.5s | ease-out |
| Floating card | scale 0.85→1 | 0.6s | 0.4s | spring [0.34,1.56,0.64,1] |
| Collection rows | whileHover y: -3px, border-left + glow | 0.2s | 0s | ease-out |
| Process columns | opacity 0→1, y 24→0, stagger 0.15s | 0.6s | scroll | ease-out |
| Brand marquee | translateX loop | 50s | 0s | linear, infinite |
| Frame cards | whileHover scale 1.015 | 0.2s | 0s | ease-out |
| CTA button | whileHover scale 1.04 | 0.2s | 0s | ease-out |

## Responsive

- **Mobile (<768px)**: Hero becomes single column, floating card hidden, headline at clamp min, process steps stack vertically, 2×2 grid becomes 1-column, marquee speed unchanged
- **Tablet (768–1024px)**: Hero content wider, floating card remains, 3-col frame grid becomes 2-col
- **Desktop**: Full layout as described

## Full Copy

**Brand**: Lens & Frame Independent Opticians

**Navbar**: Lens & Frame / Frames / Eye Tests / Contact Lenses / About / Book

**Hero**:
- Headline: "See the World in Detail."
- Sub: "Independent opticians in Marylebone — exceptional eyewear, genuine expert care. Eye tests from £35."
- CTA 1: "Book an Eye Test"
- CTA 2: "Browse Frames"
- Floating card: "The Marlow" / "Titanium · 30 colourways · £195" / "Try On →"

**Collections**:
- Designer Frames: "Over 200 premium frames from Silhouette, Lindberg, and Oliver Peoples. Tried on properly, not just handed to you." — from £125
- Sports & Performance: "Prescription sports eyewear for cycling, running, golf, and skiing." — from £149
- Reading & Screen: "Single vision, varifocal, and blue-light filtering for screen-heavy lives." — from £95
- Sunglasses: "Prescription and non-prescription sunglasses. Including polarised options." — from £110

**Process**:
1. "Book Your Test" — "A comprehensive eye test that doesn't feel like a conveyor belt. 45 minutes. Thorough. Honest. From £35."
2. "Expert Advice" — "Your optician will spend time understanding how you actually use your eyes — work, sport, daily life — before recommending any lenses or frames."
3. "Precision Fitting" — "Frame selection with a trained dispenser. Measurements taken properly. Lenses glazed to your exact prescription. Adjustments included."

**Brands**: Silhouette · Lindberg · Oliver Peoples · Tom Ford · Ray-Ban · Oakley · Persol · Maui Jim

**Why Independent**:
- "No chain targets" — "We recommend what's right for your eyes. Not what shifts the most units."
- "Genuinely independent advice" — "Every recommendation comes from clinical judgement, not sales incentives."
- "All major brands stocked" — "Over 200 frames from Silhouette, Lindberg, Oliver Peoples, and more."
- "Same optician every visit" — "Build a relationship with a clinician who actually knows your history."
- Trust strip: "Family-run since 1998 · 5★ Google · 2,400+ patients · FODO member"

**Eye Tests**:
- Comprehensive Eye Test — "Includes full health check, OCT available on request" — £35
- Contact Lens Fitting — "New fits and aftercare. All major brands." — £45
- Children's Eye Test — "Under 16. Fully subsidised under GOS." — Free
- NHS Vouchers — "We accept all NHS optical vouchers." — Accepted

**Featured Frames**:
- The Marlow: "Titanium · 30 colourways · Made in Austria" — £195
- The Camden: "Acetate · 12 colourways · Handmade in Italy" — £225
- The Mayfair: "Stainless Steel · 18 colourways · Japanese engineering" — £175

**Testimonial**: "Switched from a chain optician 3 years ago and will never go back." — Sarah J., Marylebone

**Book CTA**: "Book Your Eye Test Today" / "Appointments available within 48 hours. Evening and Saturday slots available." / "Book Online"

**Contact**: 12 Marylebone High Street, London, W1U 4PY / 020 7000 0000 / hello@lensandframe.co.uk

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
