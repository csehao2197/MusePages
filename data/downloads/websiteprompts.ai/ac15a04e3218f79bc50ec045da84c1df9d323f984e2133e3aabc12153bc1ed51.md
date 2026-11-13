# Summit Roofing — Roofing Company Website Prompt

## Goal
Build a dark, authoritative premium roofing contractor website with Space Grotesk heavy display type, count-up stats, material type cards, and a prominent emergency roofing section.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System

### Colors
```css
:root {
  --background: 220 35% 8%;
  --foreground: 0 0% 96%;
  --primary: 220 68% 50%;
  --primary-foreground: 0 0% 100%;
  --muted-foreground: 220 15% 60%;
  --border: 220 20% 18%;
  /* Raw hex reference */
  /* deep-slate: #0f1219 */
  /* signal-blue: #2a5cd4 */
  /* warm-white: #f5f5f5 */
  /* mid-grey: #4a5568 */
}
```

### Typography
Google Fonts import: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400&display=swap`
- Hero headline: Space Grotesk 800
- Section headlines: Space Grotesk 700
- Body: Plus Jakarta Sans 400
- Captions: Plus Jakarta Sans 300

## Visual Effects

1. **"SUMMIT" Background Text** — Space Grotesk 800 at clamp(220px,32vw,480px), opacity: 0.03, position: absolute, left 50%, translateX(-50%), top 50%, translateY(-50%), color: #f5f5f5, z-index: 0, pointer-events: none
2. **Count-Up Stats Row in Blue** — 4 stats, useEffect + IntersectionObserver, requestAnimationFrame over 2s easeOutQuart, Bebas-weight Space Grotesk 700 at 56px in #2a5cd4
3. **Service Row Hover** — y:-4px (0.2s), blue 3px left border (0.15s), blue glow box-shadow: 0 4px 20px rgba(42,92,212,0.25)
4. **Trust Badges Strip** — full-width blue bg #2a5cd4, 6 trust items in white with vertical dividers, Plus Jakarta Sans 300

## Component Breakdown

### 1. Navbar
```tsx
// Sticky, bg: #0f1219, border-bottom: 1px solid rgba(42,92,212,0.2), height: 68px
// Left: "Summit Roofing" — Space Grotesk 700, 17px, #f5f5f5
// Center: Services / Materials / Emergency / About / Quote — Plus Jakarta Sans 400, 14px, #c0cce0
// Right: "Get a Free Quote" — bg: #2a5cd4, color: white, Plus Jakarta 400, 14px, px-6 py-2.5, border-radius: 4px
// Hover: scale 1.03, 0.15s
// Framer Motion: y -68→0, 0.5s ease-out
```

### 2. Hero
```tsx
// Full-viewport, min-height: 100vh, position: relative, overflow: hidden, bg: #0f1219

{/* Image: Professional aerial drone shot of a premium completed slate roof on a Victorian London terraced house, morning golden light, clean ridge line and chimney stacks visible, city rooftops stretching into background, high-quality construction photography showing craftsmanship */}
<img src="" alt="Aerial view of premium slate roof installation on London terraced house" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />

// Gradient overlay — composition independent:
// linear-gradient(to right, rgba(15,18,25,0.93) 0%, rgba(15,18,25,0.72) 55%, transparent 100%)
// position: absolute; inset: 0; z-index: 1

// Background text "SUMMIT":
// Space Grotesk 800, clamp(220px,32vw,480px), color: #f5f5f5, opacity: 0.03
// position: absolute, left: 50%, top: 50%, transform: translateX(-50%) translateY(-50%), z-index: 0

// Content panel: position absolute, left 0, top 0, height 100%, width 54%, z-index 10
// padding-left: clamp(24px,6vw,96px), display flex flex-col justify-center

// Kicker: Plus Jakarta Sans 300, 13px, letter-spacing 0.14em, text-transform uppercase, color: #7a9cd4
// "AWARD-WINNING ROOFING CONTRACTORS"

// Headline: "YOUR HOME." line 1 + "PROTECTED." line 2
// Space Grotesk 800, clamp(50px,7vw,128px), line-height: 1.0, color: #f5f5f5
// Framer Motion: opacity 0→1, y 40→0, 0.7s ease-out, delay 0.1s

// Sub: Plus Jakarta Sans 400, 18px, color: #c0cce0, margin-top 20px, max-width 460px, line-height 1.6
// "Award-winning roofing contractors for London and the South East. 500+ roofs completed. 15-year workmanship guarantee."
// Framer Motion: opacity 0→1, y 20→0, 0.6s, delay 0.3s

// CTAs (flex row gap 12px, margin-top 32px):
// "Get a Free Quote" — bg: #2a5cd4, color: white, Plus Jakarta 400, 15px, px-7 py-3.5, border-radius: 4px
// "Emergency Roofing →" — bg: transparent, border: 1px solid rgba(255,255,255,0.4), color: #f5f5f5, Plus Jakarta 400, 15px, px-7 py-3.5, border-radius: 4px
// Small red dot (width 6px height 6px bg: #e53e3e border-radius 50%) before the text on emergency button
// Framer Motion: opacity 0→1, y 20→0, 0.6s, delay 0.5s

// Count-up stats (flex row gap 48px, margin-top 48px):
// Each: flex-col
// Value: Space Grotesk 700, 56px, color: #2a5cd4, line-height 1
// Label: Plus Jakarta Sans 300, 13px, color: #7a9cd4, letter-spacing 0.06em, uppercase

// Stat 1: "500+" / "Roofs Completed"
// Stat 2: "15yr" / "Guarantee"
// Stat 3: "48hr" / "Emergency"
// Stat 4: "4.9★" / "Google Rating"

// Count-up: IntersectionObserver fires animation when row enters viewport
// requestAnimationFrame over 2000ms, easeOutQuart
```

### 3. Services
```tsx
// Section bg: #0f1219, padding: 80px clamp(24px,6vw,96px)
// Section label: Plus Jakarta 300, 12px, letter-spacing 0.14em, uppercase, color: #2a5cd4, margin-bottom 48px
// "OUR SERVICES"
// Section headline: Space Grotesk 700, clamp(32px,4vw,60px), #f5f5f5, margin-bottom 0

// 4 service rows, each: border-top: 0.5px solid rgba(255,255,255,0.1), padding: 32px 0
// flex justify-between align-center, cursor pointer
// Hover (Framer Motion whileHover): y -4px (0.2s), transition

// Row layout:
// Left block: Space Grotesk 700, 22px, #f5f5f5 — service name
//             Plus Jakarta 400, 15px, #8a9ab4, margin-top 6px — description
// Right block: flex align-center gap 16px
//   Plus Jakarta 300, 14px, #7a9cd4 — price range
//   Color: #2a5cd4, font-size 24px — "→"
// Hover state: border-left: 3px solid #2a5cd4, padding-left: 16px, box-shadow: 0 4px 20px rgba(42,92,212,0.25)

// Row 1: "New Roof Installation"
// "Full new roof installation from groundwork to ridge tiles. All materials, felt, battens, and tiles included."
// "from £3,500"

// Row 2: "Re-Roofing & Replacement"
// "Strip and re-lay on existing structure. New breathable felt, treated battens, and tiles to match or upgrade."
// "from £2,800"

// Row 3: "Repairs & Maintenance"
// "Broken tiles, ridge issues, valleys, chimney lead flashings, and pointing. Same-week availability."
// "from £150"

// Row 4: "Guttering & Drainage"
// "Full replacement, cleaning, and repair. UPVC, cast iron, and aluminium. Includes downpipes and brackets."
// "from £400"
```

### 4. Material Cards
```tsx
// Section bg: #111827 (slightly lighter than main bg), padding: 80px clamp(24px,6vw,96px)
// Headline: Space Grotesk 700, clamp(32px,4vw,60px), #f5f5f5, margin-bottom 48px
// "ROOFING MATERIALS"

// 3-column flex, gap: 24px

// Each card: position relative, overflow hidden, border-radius: 8px, cursor pointer
// Framer Motion whileHover: scale 1.02, box-shadow: 0 8px 40px rgba(42,92,212,0.3)

// Card 1 — Concrete & Clay Tiles:
{/* Image: Close-up professional photography of pristine concrete roof tiles on a newly completed roof, warm morning light, smooth geometric tile pattern, grey-brown earthy tones, shallow depth of field showing tile texture and quality */}
<img src="" alt="Concrete roof tiles close-up on completed roofing installation" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center' }} />
// Gradient overlay on bottom: linear-gradient(to top, rgba(15,18,25,0.92) 0%, transparent 60%)
// Card body (absolute bottom 0, padding 24px, z-index 10):
// Space Grotesk 700, 22px, #f5f5f5: "Concrete & Clay Tiles"
// Plus Jakarta 300, 14px, #8a9ab4: "The most popular choice. 50yr lifespan. Available in 40+ colours."
// Blue border bottom (Plus Jakarta 300, 13px, #2a5cd4, margin-top 8px): "25–50 year lifespan"
// "Book a Survey" button: bg #2a5cd4, color white, Plus Jakarta 400, 13px, px-4 py-2, border-radius 4px, margin-top 12px

// Card 2 — GRP Flat Roofing:
{/* Image: Clean flat roof extension on a contemporary house, GRP fibreglass surface with smooth finish visible, afternoon light, modern domestic architecture, no joins or seams in the roofing surface */}
<img src="" alt="GRP fibreglass flat roof on modern house extension" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center' }} />
// "GRP Flat Roofing" / "Seamless fibreglass. Ideal for extensions, garages, and bay windows. 25-year guarantee." / "25-year guarantee" / "Book a Survey"

// Card 3 — Welsh Slate:
{/* Image: Premium natural Welsh slate roof on a period Victorian property, dramatic overcast sky, dark blue-grey slate texture with fine grain visible, ridge tile capping in crisp line, traditional craftsmanship */}
<img src="" alt="Natural Welsh slate roof on Victorian period property" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center' }} />
// "Welsh Slate" / "Natural Welsh slate. 100yr+ lifespan. The premium choice for period and prestige properties." / "100yr+ lifespan" / "Book a Survey"
```

### 5. Trust Badges Strip
```tsx
// Full-width, bg: #2a5cd4, padding: 24px clamp(24px,6vw,96px)
// flex flex-wrap justify-center align-center gap-x-12 gap-y-4

// 6 items, each: flex align-center gap 8px
// Lucide icon (CheckCircle), 16px, white
// Plus Jakarta Sans 300, 14px, white, letter-spacing 0.04em

// Items:
// NFRC Member · TrustMark Approved · Which? Trusted Trader · 15yr Guarantee · All Work Insured · 500+ Roofs

// Between items: vertical dividers: 1px solid rgba(255,255,255,0.3), height 16px
```

### 6. Quote Process
```tsx
// Section bg: #0f1219, padding: 80px clamp(24px,6vw,96px)
// Headline: Space Grotesk 700, clamp(32px,4vw,56px), #f5f5f5, margin-bottom 60px
// "HOW IT WORKS"

// 3-column flex, gap 0, position relative
// Connecting horizontal line between steps: position absolute, top 40px, left 16.6%, right 16.6%, height 1px, bg: linear-gradient(to right, transparent, #2a5cd4, transparent)

// Each step:
// Faded number: Space Grotesk 800, 80px, color: #2a5cd4, opacity: 0.1, margin-bottom: -16px, line-height 1
// Circle badge: 40px×40px, bg: #2a5cd4, border-radius: 50%, Plus Jakarta 400, 16px, white, text-align center
// Step label: Plus Jakarta Sans 300, 13px, letter-spacing 0.1em, uppercase, color: #7a9cd4, margin-top 16px
// Step name: Space Grotesk 700, 20px, #f5f5f5, margin-top 8px
// Description: Plus Jakarta 400, 15px, #8a9ab4, line-height 1.6

// Step 1: "1" faded / "01" circle / "FIRST STEP" / "Free Survey" / "We visit your property, inspect the roof from ground and access point, and give you an honest assessment."
// Step 2: "2" faded / "02" / "SECOND STEP" / "Written Quote (24hrs)" / "You'll have a full written quote with materials, timeline, and total cost within 24 hours of the survey."
// Step 3: "3" faded / "03" / "THIRD STEP" / "Work Starts Within 2 Weeks" / "Our crew arrives on the agreed date. Fully insured, NFRC registered, and tidy throughout."

// Framer Motion: each column whileInView opacity 0→1, y 24→0, stagger 0.18s
```

### 7. Emergency Section
```tsx
// Section bg: #0f1219, padding: 80px clamp(24px,6vw,96px), border-top: 2px solid #e53e3e
// Small red badge: bg #e53e3e, Plus Jakarta 300, 12px, white, letter-spacing 0.14em uppercase, px-3 py-1, border-radius 2px, margin-bottom 20px
// "48HR EMERGENCY RESPONSE"

// Headline: Space Grotesk 700, clamp(32px,4.5vw,72px), #f5f5f5
// "EMERGENCY ROOFING — 48hr RESPONSE"

// Sub: Plus Jakarta 400, 17px, #8a9ab4, margin-top 16px, max-width 580px, line-height 1.7
// "Storm damage? Leak? Active water ingress? We know it can't wait. Call us now and we'll have a roofer with you within 48 hours — usually sooner."

// Phone number: Space Grotesk 800, clamp(36px,5vw,80px), #f5f5f5, margin-top 32px
// "0800 123 4567"
// Plus Jakarta 300, 14px, #7a9cd4: "Free to call · 8am–8pm Mon–Sat"

// Button: bg: #2a5cd4, color white, Plus Jakarta 400, 15px, px-8 py-4, border-radius 4px, margin-top 24px
// "Get Emergency Help"
// Hover: scale 1.04, 0.2s

{/* Image: Storm damage close-up on a residential roof — displaced tiles, exposed felt, urgent situation, overcast sky, wet conditions, documentary photography style */}
<img src="" alt="Storm damage to residential roof requiring emergency repair" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', objectPosition: 'center', marginTop: '48px' }} />
```

### 8. Testimonial
```tsx
// Section bg: #111827, padding: 80px clamp(24px,6vw,96px)
// Stars: 5× "★" in #2a5cd4, 20px, margin-bottom 24px
// Quote: Space Grotesk 700, clamp(24px,3.5vw,48px), #f5f5f5, font-style italic, line-height 1.3
// "Summit re-roofed our Victorian terrace and the finish is exceptional. Tidy, professional, and on time."
// Attribution: Plus Jakarta 300, 15px, #7a9cd4, margin-top 20px
// "— David K., Wimbledon"
```

### 9. Blue CTA
```tsx
// Section bg: #2a5cd4, padding: 80px clamp(24px,6vw,96px), text-align center
// Space Grotesk 800, clamp(40px,6vw,96px), white: "GET YOUR FREE SURVEY"
// Plus Jakarta 400, 17px, rgba(255,255,255,0.85), margin-top 16px
// "No obligation. Written quote within 24 hours. Work guaranteed for 15 years."
// Button: bg white, color #2a5cd4, Space Grotesk 700, 16px, px-10 py-5, border-radius 4px, margin-top 40px
// "Book Free Survey"
// Hover: bg #0f1219, color white, 0.2s
// Small text below: Plus Jakarta 300, 13px, rgba(255,255,255,0.7): "London and South East · 500+ roofs completed · NFRC registered"
```

### 10. Footer
```tsx
// bg: #080c12, border-top: 1px solid rgba(42,92,212,0.2), padding: 48px clamp(24px,6vw,96px) 32px
// 4 columns: Brand / Services / Coverage / Contact
// Brand: "Summit Roofing" Space Grotesk 700, 17px, #f5f5f5 / Plus Jakarta 300, 14px, #4a5568
// Services: Plus Jakarta 300, 14px, #6a7a94 — New Roofs / Re-Roofing / Repairs / Guttering / Emergency
// Coverage: Plus Jakarta 300, 14px, #6a7a94 — London / Surrey / Kent / Sussex / Essex / Hertfordshire
// Contact: Plus Jakarta 300, 14px, #6a7a94 — phone / email / address
// Copyright: "© 2025 Summit Roofing. All rights reserved." Plus Jakarta 300, 12px, #4a5568
```

## Animations

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Navbar | y: -68→0 | 0.5s | 0s | ease-out |
| Hero headline | opacity 0→1, y 40→0 | 0.7s | 0.1s | ease-out |
| Hero sub | opacity 0→1, y 20→0 | 0.6s | 0.3s | ease-out |
| Hero CTAs | opacity 0→1, y 20→0 | 0.6s | 0.5s | ease-out |
| Count-up stats | 0→target, rAF | 2s | on scroll entry | easeOutQuart |
| Service rows | whileHover y:-4px, blue border+glow | 0.2s | 0s | ease-out |
| Material cards | whileHover scale 1.02, blue glow | 0.25s | 0s | ease-out |
| Process steps | whileInView opacity 0→1, y 24→0, stagger 0.18s | 0.6s | scroll | ease-out |
| Emergency section | whileInView opacity 0→1 | 0.6s | scroll | ease-out |
| CTA button | whileHover scale 1.04 | 0.2s | 0s | ease-out |

## Responsive

- **Mobile (<768px)**: Hero single column, background text hidden, stats 2×2, services stack, material cards 1-col, process steps stack, emergency phone number smaller
- **Tablet (768–1024px)**: Material cards 2+1, process horizontal
- **Desktop**: Full layout as described

## Full Copy

**Brand**: Summit Roofing

**Navbar**: Summit / Services / Materials / Emergency / About / Quote

**Hero**:
- Kicker: "AWARD-WINNING ROOFING CONTRACTORS"
- Headline: "YOUR HOME. PROTECTED."
- Sub: "Award-winning roofing contractors for London and the South East. 500+ roofs completed. 15-year workmanship guarantee."
- CTA 1: "Get a Free Quote"
- CTA 2: "Emergency Roofing →"

**Stats**: 500+ Roofs Completed / 15yr Guarantee / 48hr Emergency / 4.9★ Google Rating

**Services**:
- New Roof Installation: "Full new roof installation from groundwork to ridge tiles. All materials, felt, battens, and tiles included." — from £3,500
- Re-Roofing & Replacement: "Strip and re-lay on existing structure. New breathable felt, treated battens, and tiles to match or upgrade." — from £2,800
- Repairs & Maintenance: "Broken tiles, ridge issues, valleys, chimney lead flashings, and pointing. Same-week availability." — from £150
- Guttering & Drainage: "Full replacement, cleaning, and repair. UPVC, cast iron, and aluminium. Includes downpipes and brackets." — from £400

**Materials**:
- Concrete & Clay Tiles: "The most popular choice. 50yr lifespan. Available in 40+ colours." / 25–50 year lifespan
- GRP Flat Roofing: "Seamless fibreglass. Ideal for extensions, garages, and bay windows. 25-year guarantee." / 25-year guarantee
- Welsh Slate: "Natural Welsh slate. 100yr+ lifespan. The premium choice for period and prestige properties." / 100yr+ lifespan

**Trust badges**: NFRC Member · TrustMark Approved · Which? Trusted Trader · 15yr Guarantee · All Work Insured · 500+ Roofs

**Process**:
1. "Free Survey" — "We visit your property, inspect the roof from ground and access point, and give you an honest assessment."
2. "Written Quote (24hrs)" — "You'll have a full written quote with materials, timeline, and total cost within 24 hours of the survey."
3. "Work Starts Within 2 Weeks" — "Our crew arrives on the agreed date. Fully insured, NFRC registered, and tidy throughout."

**Emergency**: "EMERGENCY ROOFING — 48hr RESPONSE" / "Storm damage? Leak? Active water ingress? We know it can't wait. Call us now and we'll have a roofer with you within 48 hours — usually sooner." / "0800 123 4567" / "Free to call · 8am–8pm Mon–Sat" / "Get Emergency Help"

**Testimonial**: "Summit re-roofed our Victorian terrace and the finish is exceptional. Tidy, professional, and on time." — David K., Wimbledon

**CTA**: "GET YOUR FREE SURVEY" / "No obligation. Written quote within 24 hours. Work guaranteed for 15 years." / "Book Free Survey" / "London and South East · 500+ roofs completed · NFRC registered"

**Coverage**: London / Surrey / Kent / Sussex / Essex / Hertfordshire

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
