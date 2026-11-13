# Moving Company Website Prompt
# websiteprompts.ai

Build a bold, confident moving and removals company website called "Shift Movers" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 0 0% 6%;              /* near-black #0f0f0f */
  --foreground: 0 0% 96%;             /* white */
  --primary: 0 0% 96%;
  --primary-foreground: 0 0% 6%;
  --accent: 48 92% 55%;               /* signal yellow #f0c52a */
  --surface: 0 0% 10%;
  --surface-raised: 0 0% 14%;
  --muted-foreground: 0 0% 52%;
  --border: 0 0% 18%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap`
- Headlines: Bebas Neue — condensed, bold, no-nonsense
- Body: Inter 300–500
- Labels: Inter 600 uppercase 10px letter-spacing 0.14em

## Sections

### 1. Navbar
- Sticky near-black, `backdrop-filter: blur(12px)`
- Left: Bebas Neue "SHIFT" + lucide PackageOpen icon in yellow
- Right: Services · Coverage · About · Quote + "Get a quote →" yellow button (dark text)

### 2. Hero
- Full-viewport height, near-black background
- Full-bleed photography `position: absolute inset-0 w-full h-full object-cover object-center`
- Composition-independent overlay: `linear-gradient(to right, rgba(15,15,15,0.97) 0%, rgba(15,15,15,0.72) 50%, rgba(15,15,15,0.2) 100%)`
- Content `z-index: 10`, left-aligned `padding-left: 7vw`, centered vertically:
  - Inter 600 uppercase 10px yellow label: "Removals & Storage · London & Nationwide"
  - Bebas Neue `clamp(72px, 11vw, 160px)` white, line-height 0.85: "YOUR MOVE.\nHANDLED."
  - Yellow accent on "HANDLED."
  - Inter 300 muted white sub: "House moves, office relocations, and secure storage — fully insured, on time, no damage, no excuses"
  - CTAs: "Get a free quote →" (yellow filled, dark text) + "See our services" (ghost white)
  - Floating trust chips: "Fully Insured · Same-Day Quote · Nationwide Coverage"

{/* Image brief: professional removal team carrying boxes, modern urban building entrance, clean branded uniform, bright daylight, confident commercial photography */}

- Stagger fade-up on mount: label (0s), headline (0.1s), sub (0.26s), CTAs (0.4s)

### 3. Services
- "What We Move" — Bebas Neue `clamp(52px, 7vw, 85px)` white
- 6-service 3×2 grid, dark surface cards:
  - House Moves (local and long distance, full-service packing available)
  - Office Relocations (business moves, IT equipment, minimal downtime)
  - Man & Van (smaller moves, student moves, single items)
  - Piano & Antiques (specialist moves for high-value items)
  - Packing Service (full packing and unpacking, materials provided)
  - Storage (secure climate-controlled storage — short and long term)
- Each card: yellow lucide icon, Bebas Neue 22px service name, Inter 300 muted description
- Hover: yellow border + `box-shadow: 0 0 18px hsl(48 92% 55% / 0.12)`

### 4. Stats Strip
- Full-width yellow `#f0c52a`, 80px height
- 4 dark Bebas Neue stats: "8,000+ Moves" · "100% Insured" · "4.9★ Google" · "Same-Day Quote"
- Dark dividers, count-up on scroll

### 5. How It Works
- "The Shift Process" — Bebas Neue large white
- 4 steps: Get a Quote → Book Your Date → We Pack & Load → Delivered On Time
- Large faded yellow number (opacity 0.07) behind each step
- Inter 300 muted description, stagger fade-up on scroll

### 6. Why Shift
- Split: left text, right image
- Bebas Neue large white: "NO DAMAGE.\nNO DRAMA.\nNO DELAYS."
- Inter 300 muted: 2 paragraphs — every move is handled by trained staff, not casual labour. All vehicles GPS tracked. Full contents insurance on every job.
- 4 yellow checkpoints: "Fully insured team · GPS-tracked fleet · 0% damage claim rate · No hidden charges"

{/* Image brief: removal van being loaded, professional team in action, clean van branded, daytime urban setting */}

### 7. Coverage
- "We Cover All of the UK" — Bebas Neue large
- Centered section, Inter 300 muted "London, Manchester, Birmingham, Leeds, Edinburgh — and everywhere in between"
- 2 CTAs: "Get a quote for your area →" yellow + "Talk to the team" ghost

### 8. Testimonials
- Surface-raised section
- 3 cards: 5-star yellow row, Inter 300 italic white quote, name + move type Inter 10px muted
- Stagger fade-up on scroll

### 9. Quote CTA
- Full-width yellow `#f0c52a` background
- Bebas Neue `clamp(52px, 7vw, 90px)` dark: "GET YOUR FREE QUOTE IN 60 SECONDS"
- Inter 300 dark: "Tell us your move date, locations, and size — we'll come back with a fixed price, no surprises"
- "Get a free quote →" dark near-black button
- "No obligation · Fixed pricing · Available 7 days" Inter 10px dark 70%

### 10. Footer
- Near-black, Bebas Neue "SHIFT" in yellow + lucide PackageOpen
- Google · Facebook · TrustPilot link
- "© 2026 Shift Movers · Removals & Storage · London & Nationwide · Fully Insured · 0800 123 4567"

## Animations
- Hero: stagger fade-up on mount
- Stats strip: count-up on scroll
- Service grid: stagger fade-up
- All hover: 0.15s ease

## Responsive
- Mobile: stacked hero, single-column services, hamburger nav

## Full Copy
- Wordmark: "SHIFT"
- Hero: "YOUR MOVE. HANDLED." / "House moves, office relocations, and secure storage — fully insured, on time"
- Services: House Moves · Office Relocations · Man & Van · Piano & Antiques · Packing · Storage
- Stats: 8,000+ Moves · 100% Insured · 4.9★ Google · Same-Day Quote
- Process: Quote → Book → Pack & Load → Delivered On Time
- Testimonial: "Shift moved our 4-bedroom house in one day. Not a single scratch on anything. The crew were professional and fast — would use again without question." — Mark H., London
- CTA: "GET YOUR FREE QUOTE IN 60 SECONDS" / "Fixed price, no surprises"
