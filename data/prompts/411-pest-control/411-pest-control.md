# Pest Control Website Prompt
# websiteprompts.ai

Build a professional pest control services website for **ShieldPest** — a local pest control company offering residential and commercial treatments. Near-black foundation, clean white type, sharp lime-green accent. Professional and trustworthy but modern and bold — not the dusty yellow pest control cliché. Think premium service brand.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System
```css
:root {
  --background: 0 0% 6%;            /* #0f0f0f near-black */
  --surface: 0 0% 9%;               /* #171717 surface */
  --surface-raised: 0 0% 12%;       /* #1f1f1f raised */
  --border: 0 0% 16%;               /* #292929 border */
  --foreground: 0 0% 96%;           /* #f5f5f5 white */
  --muted: 0 0% 48%;                /* #7a7a7a muted */
  --primary: 88 72% 44%;            /* #5db81e lime green */
  --primary-dark: 88 76% 34%;       /* #468f16 hover */
  --primary-light: 88 60% 94%;      /* #f0fae6 green tint */
  --primary-glow: 88 72% 44% / 0.12;
  --mono: 'JetBrains Mono', monospace;
}
```

## Typography
Import: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap`
- Display / H1–H2: Plus Jakarta Sans 700–800, letter-spacing -0.03em
- Body / UI / Nav: Plus Jakarta Sans 400–600
- Labels / Tags / Numbers: JetBrains Mono 400

## Visual Effects

**Green badge pill** — service and guarantee labels:
```css
.badge { background: hsl(var(--primary-light)); color: hsl(var(--primary-dark));
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em;
  padding: 4px 10px; border-radius: 100px; text-transform: uppercase; }
/* Dark mode version for dark bg sections: */
.badge-dark { background: hsl(88 72% 44% / 0.12); color: hsl(var(--primary)); border: 1px solid hsl(88 72% 44% / 0.25); }
```

**Glow card hover** — service cards: `border-color: hsl(var(--primary))`, `box-shadow: 0 0 32px hsl(88 72% 44% / 0.15)`. Transition 0.18s.

**Count-up stats** — stat numbers animate from 0 using Framer Motion `useSpring`, triggered by IntersectionObserver.

**Stagger fade-up** — `initial={{ opacity: 0, y: 24 }}` → `animate={{ opacity: 1, y: 0 }}`, 0.5s, per-section.

## Sections

**1. Navbar** — fixed, `background: hsl(var(--background) / 0.94)`, blur 12px, border-bottom. Left: "ShieldPest" Plus Jakarta 800 18px white with small green shield icon (lucide `Shield`). Center: Services · How It Works · Coverage · Contact. Right: "Get a free quote" — green filled, border-radius 6px, Plus Jakarta 600 13px. Top micro-bar above nav: "24/7 Emergency Call-Out · +44 800 123 4567" — JetBrains Mono 10px muted on slightly darker bg.

**2. Hero** — full viewport, two-column, align-items center, padding 100px 64px. Left: JetBrains Mono 10px green badge "LICENSED · INSURED · GUARANTEED". H1 Plus Jakarta 800, clamp(52px, 6vw, 80px), line-height 0.96, white:
```
Your home.
Pest-free.
Guaranteed.
```
"Guaranteed." in green. Sub: Plus Jakarta 400 15px muted, max-width 400px: "Fast, discreet, and fully guaranteed pest control for homes and businesses across the region. Same-day appointments available."
CTAs: "Get a free quote" (green filled) + "Call now" (ghost white border, lucide `Phone` icon). Below: 3 trust chips — "Same-day service" · "12-month guarantee" · "Certified technicians" — white bg, border, dark text, JetBrains Mono 10px.
Right: hero photo with rounded-xl overflow hidden:
```
{/* Image: pest control technician in professional uniform and protective gear inspecting a home exterior, confident professional expression, natural daylight, clean modern residential setting */}
```
Green glow below image: `box-shadow: 0 24px 60px hsl(88 72% 44% / 0.2)`.

**3. Proof strip** — full-width surface, border-top + bottom, padding 20px 64px. Flex row with 4 stat items separated by dividers. Count-up numbers: 5,000+ homes treated · 15 yrs experience · 4.9★ rating · 98% first-visit success. Each: JetBrains Mono 11px green value + Plus Jakarta 12px muted label.

**4. Services** — padding 96px 64px. H2 Plus Jakarta 800: "What we treat." 3-column card grid (2 rows = 6 services). Each card `background: hsl(var(--surface))`, border, border-radius 10px, padding 28px, glow hover. Card structure: lucide icon (green, 24px) + service name Plus Jakarta 700 18px + 2-line description + badge-dark pill (e.g. "Residential" or "Commercial") + "Learn more →" green text link. Services: Rats & Mice · Bed Bugs · Cockroaches · Wasps & Hornets · Ants · Moths & Beetles.

**5. How It Works** — surface bg, padding 96px 64px. H2 "Simple. Fast. Guaranteed." 4-step horizontal row: 01 Book online in 2 min → 02 Technician visits within 24h → 03 Treatment applied safely → 04 Guaranteed results. Each step: large JetBrains Mono number in faded green (opacity 0.12) + step name Plus Jakarta 700 + 1-line description.

**6. Coverage & Guarantee** — two-column, padding 96px 64px. Left: H2 "We cover your area." Map placeholder div (dark surface, border, aspect 4/3, centered "Check your postcode" search input with green button). Right: Guarantee card — surface bg, border-left 3px green, padding 32px. Content: large ✓ green icon + H3 "12-month guarantee" + 3 bullet points (re-treatment if needed · no extra charge · no questions asked) + "View guarantee terms →" link.

**7. Testimonials** — padding 96px 64px. H2 "Trusted by thousands." 3-column grid. Each card: surface bg, border, border-radius 10px, padding 28px. Stars ★★★★★ green + quote Plus Jakarta 300 italic 14px + client name Plus Jakarta 600 + pest type tag JetBrains Mono 10px muted. Stagger entrance.

**8. CTA Banner** — green background `hsl(var(--primary))`, padding 72px 64px, centered. Subtle diagonal texture overlay (white 4% opacity repeating-linear-gradient). H2 Plus Jakarta 800 white: "Ready to take back your home?" Sub white 70%. Two CTAs: "Get a free quote" (black bg, white text) + "Call us now" (ghost white border). Below: "No call-out fee · Response within 2 hours" JetBrains Mono 11px white 50%.

**9. Footer** — `hsl(0 0% 4%)`, padding 48px 64px 28px. 3-column: Brand (logo + address + phone + email) / Services links / Company links (About · Coverage · Blog · Contact). Bottom: copyright + "Licensed by BPCA · Fully insured" JetBrains Mono 10px muted.

## Responsive
Mobile: top micro-bar hidden · nav hamburger overlay · hero single column, photo below · services 2-column · how-it-works 2×2 · testimonials scroll snap · coverage single column.

## Animations Summary
| Element | Animation | Trigger |
|---|---|---|
| Hero content | Stagger fade-up | On mount |
| Proof stats | Count-up useSpring | Scroll |
| Service cards | Stagger fade-up + glow hover | Scroll |
| Process steps | Stagger fade-up | Scroll |
| Testimonials | Stagger fade-up | Scroll |
| CTA section | Fade-up | Scroll |

## Key Dependencies
```json
{ "motion": "^12.x", "lucide-react": "^0.400.x" }
```

> **Quick notes:** "ShieldPest" name, phone number, and coverage area are placeholders. Postcode checker is static UI — connect to real coverage database post-generation. BPCA mention in footer should reflect real certification. Green accent swaps via `--primary`.
