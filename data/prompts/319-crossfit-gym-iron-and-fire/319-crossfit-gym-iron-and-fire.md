# Iron & Fire CrossFit — CrossFit Gym Website Prompt

## Goal
Build a raw, high-intensity CrossFit box website with zero border-radius, signal red accents, Bebas Neue display type, and count-up stats that communicates elite coaching and community.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System

### Colors
```css
:root {
  --background: 0 0% 4%;
  --foreground: 0 0% 100%;
  --primary: 4 76% 50%;
  --primary-foreground: 0 0% 100%;
  --muted-foreground: 0 0% 55%;
  --border: 0 0% 22%;
  /* Raw hex reference */
  /* pure-black: #0a0a0a */
  /* signal-red: #d42a1a */
  /* concrete-grey: #3a3a3a */
  /* white: #ffffff */
}

/* CRITICAL: 0px border-radius on EVERY element without exception */
* {
  border-radius: 0px !important;
}
```

### Typography
Google Fonts import: `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400&display=swap`
- Display: Bebas Neue 400, letter-spacing: 0.04em (ALL display text, section headlines, stats, labels)
- Body: Inter 400
- Captions: Inter 300

## Visual Effects

1. **"ELITE" Background Text** — Bebas Neue at clamp(280px,40vw,560px), color: #3a3a3a (concrete grey), opacity: 0.03, position: absolute, right: -4%, top: 50%, transform: translateY(-50%), z-index: 0, pointer-events: none, user-select: none
2. **Count-Up Stats Row** — 4 stats in signal red, useEffect with requestAnimationFrame counter: 0→target over 1.8s, triggered on scroll entry via Intersection Observer, Bebas Neue 64px
3. **Schedule Grid Hover Fill** — available cells: hover triggers bg: #d42a1a transition 0.1s instant fill; cursor: pointer; full cell colour flip from transparent to red
4. **Coach Card Red Top Border** — hover: border-top: 4px solid #d42a1a appears with transition 0.15s, translateY: -4px, 0.15s ease-out

## Component Breakdown

### 1. Navbar
```tsx
// Sticky, bg: #0a0a0a, border-bottom: 1px solid #222, height: 64px
// Left: "Iron & Fire CrossFit" in Bebas Neue, 20px, letter-spacing: 0.04em, white
// Center: Classes / Schedule / Membership / Coaches / Book — Inter 300, 14px, white
// Right: "Book Free Intro" — bg: #d42a1a, color: white, Bebas Neue, 16px, px-6 py-3, border-radius: 0
// Framer Motion: y -64→0, opacity 0→1, 0.5s ease-out on mount
```

### 2. Hero
```tsx
// Full-viewport, min-height: 100vh, position: relative, overflow: hidden, bg: #0a0a0a

// Background image:
{/* Image: Ultra-high-intensity CrossFit photography — athlete at maximum exertion performing a barbell overhead squat or heavy clean and jerk, gym chalk dust visible in the air, industrial warehouse ceiling with pendant lights, concrete floor, raw and gritty athletic power, dramatic low-key lighting */}
<img src="" alt="CrossFit athlete at maximum exertion with barbell overhead" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />

// Gradient overlay — composition-independent:
// background: linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.65) 55%, transparent 100%);
// position: absolute; inset: 0; z-index: 1;

// Background text — "ELITE":
// Bebas Neue, clamp(280px,40vw,560px), color: #3a3a3a, opacity: 0.03
// position: absolute, right: -4%, top: 50%, transform: translateY(-50%), z-index: 0

// Content panel — position: absolute, left: 0, top: 0, height: 100%, width: 56%, z-index: 10
// padding-left: clamp(24px,6vw,96px), display: flex, flex-direction: column, justify-content: center

// Kicker label: Bebas Neue, 15px, letter-spacing: 0.1em, color: #d42a1a, margin-bottom: 12px
// "CENTRAL MANCHESTER · EST. 2016"

// Main headline: "BUILT DIFFERENT."
// Bebas Neue, clamp(72px,11vw,170px), line-height: 0.92, color: white, letter-spacing: 0.04em
// Framer Motion: opacity 0→1, x -40→0, 0.7s ease-out, delay: 0.1s

// Sub: Inter 300, 17px, color: #8c8c8c, margin-top: 20px, max-width: 480px, line-height: 1.6
// "CrossFit coaching for people who take their training seriously. 220+ members across 3 daily classes. Central Manchester."

// CTAs (flex row, gap: 12px, margin-top: 32px):
// "Book a Free Intro" — bg: #d42a1a, color: white, Bebas Neue, 18px, letter-spacing: 0.04em, px-8 py-4, border-radius: 0
// "Our Classes" — bg: transparent, border: 1px solid white, color: white, Bebas Neue, 18px, px-8 py-4, border-radius: 0
// Hover: scale 1.03, 0.15s

// Count-up stats row (flex, gap: 40px, margin-top: 48px):
// Each stat: flex-direction column
// Value: Bebas Neue, 64px, color: #d42a1a, line-height: 1
// Label: Inter 300, 13px, color: #8c8c8c, letter-spacing: 0.06em, text-transform: uppercase

// Stat 1: count-up to "220+" / "Members"
// Stat 2: count-up to "3" / "Daily Classes"
// Stat 3: count-up to "18+" / "WOD Types"
// Stat 4: count-up to "94%" / "Retention"

// Count-up logic:
// useEffect + Intersection Observer: when stats row enters viewport, start counter
// requestAnimationFrame loop: duration 1800ms, easeOutQuart, value rounds to integer
```

### 3. Weekly Schedule Grid
```tsx
// Section bg: #0f0f0f, padding: 80px clamp(24px,6vw,96px)
// Headline: Bebas Neue, clamp(36px,5vw,72px), white, letter-spacing: 0.04em, margin-bottom: 8px
// "THIS WEEK'S SCHEDULE"
// Sub: Inter 300, 15px, #8c8c8c, margin-bottom: 48px: "All classes 60 minutes. Scaled and Rx options available."

// Grid: 7 columns header row (Time / Mon / Tue / Wed / Thu / Fri / Sat) + 3 rows
// Header: Bebas Neue, 15px, #d42a1a, letter-spacing: 0.06em
// Time column: Inter 400, 14px, white

// Row 1 — "6:00am"
// Mon: "Available" → hover red fill instant (0.1s)
// Tue: "Available"
// Wed: "Full" → bg: #222, Inter 300 14px #555, cursor: not-allowed
// Thu: "Available"
// Fri: "Available"
// Sat: "Open WOD" → bg: #1a0a00, border: 1px solid #d42a1a, color: #d42a1a

// Row 2 — "12:00pm"
// Mon: "Available" / Tue: "Full" / Wed: "Available" / Thu: "Available" / Fri: "Full" / Sat: "Open WOD"

// Row 3 — "5:30pm"
// Mon: "Full" / Tue: "Available" / Wed: "Available" / Thu: "Full" / Fri: "Available" / Sat: "Open WOD"

// Each available cell: bg: #1a1a1a, border: 1px solid #333, Inter 300, 14px, white, text-align: center, padding: 14px
// Hover: bg: #d42a1a instantly (transition: background-color 0.1s), color: white
// Framer Motion whileHover on available cells only
```

### 4. Membership Cards
```tsx
// Section bg: #0a0a0a, padding: 80px clamp(24px,6vw,96px)
// Headline: Bebas Neue clamp(36px,5vw,72px) white "JOIN IRON & FIRE"

// 3-column flex, gap: 24px

// Card 1 — Drop-In:
// bg: #111, border: 1px solid #333, border-radius: 0, padding: 40px 32px
// Bebas Neue 18px #d42a1a "DROP-IN"
// Bebas Neue 72px white "£20" + Inter 300 16px #8c8c8c "/session"
// Divider: 1px solid #333, margin: 24px 0
// Inter 300 15px white list (no bullets — em dash instead):
// — Single class, no booking required
// — All equipment included
// — Rx and Scaled options
// — Guest friendly
// Button: bg: transparent, border: 1px solid #d42a1a, color: #d42a1a, Bebas Neue 18px, px-6 py-3, border-radius: 0, margin-top: 32px
// "BOOK A CLASS"

// Card 2 — Monthly (BEST VALUE chip):
// bg: #111, border: 2px solid #d42a1a, border-radius: 0, padding: 40px 32px
// Top: Bebas Neue 13px letter-spacing 0.12em bg: #d42a1a px-3 py-1 color white inline "BEST VALUE"
// Bebas Neue 18px #d42a1a "MONTHLY"
// Bebas Neue 72px white "£89" + Inter 300 16px #8c8c8c "/month"
// Divider: 1px solid #333
// Inter 300 15px white list:
// — Unlimited classes
// — Open Gym access (Mon–Fri 6am–8pm)
// — Progress tracking
// — Member community app
// — First month money-back guarantee
// Button: bg: #d42a1a, color: white, Bebas Neue 18px, px-6 py-3, border-radius: 0
// "JOIN NOW"
// Framer Motion: scale 1.02 relative to siblings (always slightly larger)

// Card 3 — Annual:
// bg: #111, border: 1px solid #333, border-radius: 0, padding: 40px 32px
// Bebas Neue 18px #d42a1a "ANNUAL"
// Bebas Neue 72px white "£79" + Inter 300 16px #8c8c8c "/month (billed annually)"
// Small red chip: "SAVE £120/yr"
// Divider: 1px solid #333
// Inter 300 15px list: — Everything in Monthly / — Competition entry discounts / — Nutrition coaching (4 sessions) / — Priority class booking
// Button: bg: transparent, border: 1px solid white, color: white, Bebas Neue 18px, px-6 py-3, border-radius: 0
// "JOIN ANNUAL"

// All cards: whileHover scale 1.02, 0.2s ease-out, whileInView opacity 0→1 y 30→0 stagger 0.15s
```

### 5. Coaches
```tsx
// Section bg: #0f0f0f, padding: 80px clamp(24px,6vw,96px)
// Headline: Bebas Neue clamp(36px,5vw,72px) white "MEET THE COACHES"

// 3-column flex, gap: 32px

// Each coach card: bg: #111, border: 1px solid #222, border-radius: 0
// Hover: border-top: 4px solid #d42a1a (0.15s), translateY: -4px (0.15s ease-out)
// Framer Motion whileHover: borderTopWidth "4px", y: -4

{/* Image: Square professional headshot of a CrossFit coach in gym setting, industrial background, confident direct gaze, wearing branded Iron & Fire t-shirt, high-contrast lighting */}
<img src="" alt="[Coach name] head coach Iron & Fire CrossFit" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', objectPosition: 'center' }} />

// Card body, padding: 24px
// Bebas Neue 28px white — coach name
// Inter 300 13px #d42a1a letter-spacing 0.08em — title
// Inter 300 14px #8c8c8c line-height 1.6 margin-top 12px — bio

// Coach 1: "COACH MIKEY" / "Head Coach · L3 CrossFit"
// "Coach Mikey founded Iron & Fire in 2016 after 5 years competing at Regionals level. L3 CrossFit Coach. Specialist in Olympic lifting and strength programming."

// Coach 2: "COACH RACH" / "Olympic Lifting Specialist · L2 CrossFit"
// "Coach Rach is a British Olympic Weightlifting Champion and CrossFit L2 trainer. Rach coaches all Olympic lifting sessions and runs the weekly technique clinic."

// Coach 3: "COACH DAZ" / "Conditioning & Competition · Masters Athlete"
// "Coach Daz specialises in conditioning and has competed at the CrossFit Open Masters every year since 2018. He runs our Saturday Open WOD and competition prep programme."
```

### 6. Community & Competition
```tsx
// Section bg: #0a0a0a, padding: 80px clamp(24px,6vw,96px)
// Headline: Bebas Neue clamp(36px,5vw,72px) white "JOIN THE COMPETITION."
// Sub: Inter 300, 16px, #8c8c8c, margin-bottom: 48px
// "Iron & Fire athletes compete at throwdowns, the CrossFit Open, and sanctioned events throughout the year."

// 2-column layout: left upcoming events, right team photo or comp action shot

// Upcoming events (left):
// "UPCOMING THROWDOWNS" — Bebas Neue 18px #d42a1a letter-spacing 0.08em

// 3 event rows, each: flex justify-between, border-bottom 1px solid #222, padding: 16px 0
// Left: date chip (bg: #d42a1a, Bebas Neue 14px white, px-2 py-1) + event name Inter 400 15px white margin-left 12px
// Right: Inter 300 13px #8c8c8c location

// Event 1: "15 MAR" chip + "North West CrossFit Throwdown" / "Manchester"
// Event 2: "29 MAR" chip + "Iron & Fire In-House Competition" / "Our Box"
// Event 3: "12 APR" chip + "Battle of the Box" / "Liverpool"

{/* Image: CrossFit competition photograph — team of athletes celebrating after a competition, Rx jerseys visible, raw energy and camaraderie, industrial venue setting */}
<img src="" alt="Iron & Fire CrossFit team at competition" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', objectPosition: 'center' }} />
```

### 7. Red CTA
```tsx
// Full-width section bg: #d42a1a, padding: 80px clamp(24px,6vw,96px), text-align: center
// Bebas Neue clamp(48px,7vw,120px) white letter-spacing 0.04em
// "YOUR FREE INTRO."
// Bebas Neue clamp(36px,5vw,84px) white letter-spacing 0.04em — below, slightly smaller
// "ZERO EXCUSES."
// Inter 300 17px rgba(255,255,255,0.8) margin-top 24px
// "45 minutes. See the box, meet a coach, and do a workout. No cost, no commitment."
// Button: bg: white, color: #d42a1a, Bebas Neue 20px letter-spacing 0.04em, px-10 py-5, border-radius: 0, margin-top: 40px
// "BOOK FREE INTRO"
// Hover: bg: #0a0a0a, color: white, 0.2s
```

### 8. Footer
```tsx
// bg: #0a0a0a, border-top: 1px solid #222, padding: 48px clamp(24px,6vw,96px) 32px
// 3 columns: Brand / Navigation / Contact
// "IRON & FIRE CROSSFIT" Bebas Neue 20px white letter-spacing 0.06em
// Inter 300 14px #555: "Est. 2016 · Central Manchester"
// Nav: Inter 300 14px #8c8c8c — Classes / Schedule / Membership / Coaches / Book / Privacy
// Contact: Inter 300 14px #8c8c8c — address / phone / email / Instagram @ironandfireboxmcr
// Copyright: "© 2025 Iron & Fire CrossFit" Inter 300 12px #444
```

## Animations

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Navbar | y: -64→0, opacity 0→1 | 0.5s | 0s | ease-out |
| Hero headline | opacity 0→1, x -40→0 | 0.7s | 0.1s | ease-out |
| Hero sub | opacity 0→1, y 20→0 | 0.6s | 0.35s | ease-out |
| Hero CTAs | opacity 0→1, y 20→0 | 0.6s | 0.5s | ease-out |
| Count-up stats | 0→target, requestAnimationFrame | 1.8s | on scroll entry | easeOutQuart |
| Schedule cells | bg: transparent→#d42a1a on hover | 0.1s | 0s | linear (instant) |
| Membership cards | opacity 0→1, y 30→0, stagger 0.15s | 0.6s | scroll | ease-out |
| Membership hover | scale 1.02 | 0.2s | 0s | ease-out |
| Coach hover | y: -4px, borderTopWidth 0→4px | 0.15s | 0s | ease-out |
| CTA section | whileInView opacity 0→1, y 24→0 | 0.6s | scroll | ease-out |

## Responsive

- **Mobile (<768px)**: Hero single column, background text "ELITE" hidden, CTAs stack, stats 2×2 grid, schedule scrolls horizontally, membership cards stack, coaches stack
- **Tablet (768–1024px)**: Schedule may horizontally scroll, 3-col coaches becomes 2-col + 1 below
- **Desktop**: Full layout. Never any border-radius anywhere.

## Full Copy

**Brand**: Iron & Fire CrossFit

**Navbar**: Iron & Fire / Classes / Schedule / Membership / Coaches / Book

**Hero**:
- Kicker: "CENTRAL MANCHESTER · EST. 2016"
- Headline: "BUILT DIFFERENT."
- Sub: "CrossFit coaching for people who take their training seriously. 220+ members across 3 daily classes. Central Manchester."
- CTA 1: "Book a Free Intro"
- CTA 2: "Our Classes"

**Stats**: 220+ Members / 3 Daily Classes / 18+ WOD Types / 94% Retention

**Schedule sub**: "All classes 60 minutes. Scaled and Rx options available."

**WOD Types** (for context section): Strength / Power Lifting / Olympic Lifting / AMRAP / EMOM / Chipper / Hero WODs / Benchmark WODs / Gymnastics / Open Training

**Membership**:
- Drop-In (£20/session): Single class no booking required / All equipment included / Rx and Scaled options / Guest friendly
- Monthly (£89/month): Unlimited classes / Open Gym access (Mon–Fri 6am–8pm) / Progress tracking / Member community app / First month money-back guarantee
- Annual (£79/month billed annually): Everything in Monthly / Competition entry discounts / Nutrition coaching (4 sessions) / Priority class booking

**Coaches**:
- Coach Mikey: "Head Coach · L3 CrossFit" — "Coach Mikey founded Iron & Fire in 2016 after 5 years competing at Regionals level. L3 CrossFit Coach. Specialist in Olympic lifting and strength programming."
- Coach Rach: "Olympic Lifting Specialist · L2 CrossFit" — "Coach Rach is a British Olympic Weightlifting Champion and CrossFit L2 trainer. Rach coaches all Olympic lifting sessions and runs the weekly technique clinic."
- Coach Daz: "Conditioning & Competition · Masters Athlete" — "Coach Daz specialises in conditioning and has competed at the CrossFit Open Masters every year since 2018. He runs our Saturday Open WOD and competition prep programme."

**Competition events**:
- 15 MAR / North West CrossFit Throwdown / Manchester
- 29 MAR / Iron & Fire In-House Competition / Our Box
- 12 APR / Battle of the Box / Liverpool

**Competition sub**: "Iron & Fire athletes compete at throwdowns, the CrossFit Open, and sanctioned events throughout the year."

**Red CTA**: "YOUR FREE INTRO. / ZERO EXCUSES." / "45 minutes. See the box, meet a coach, and do a workout. No cost, no commitment." / "BOOK FREE INTRO"

**Testimonial**: "First time doing CrossFit properly in 4 years of going to commercial gyms. Iron & Fire is a completely different thing." — Tom W.

**Contact**: [Box address, Central Manchester] / hello@ironandfire.co.uk / @ironandfireboxmcr

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
