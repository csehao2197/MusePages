# Form Studio — Branding Agency Website Prompt

## Goal
Build a bold, typography-dominant branding agency website for "Form Studio" — off-white background, pure black structure, electric red accent used sparingly, Space Grotesk 800 display type at large scale, Swiss-modernist grid aesthetic, zero decorative photography in the hero.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System

### Colors
```css
:root {
  --background: 40 8% 96%;
  --foreground: 0 0% 4%;
  --primary: 4 76% 47%;
  --primary-foreground: 0 0% 98%;
  --muted-foreground: 0 0% 48%;
  --border: 0 0% 84%;
  --accent: 4 76% 47%;
}
```

Hex reference:
- Background: #f5f4f2 (off-white, warm paper)
- Foreground: #0a0a0a (pure black)
- Primary (electric red): #d42a1a
- Muted grey: #808080
- Border: #d6d6d6

### Typography
Google Fonts import:
`https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300,700,800&family=Inter:wght@400&display=swap`

- Hero/Display: Space Grotesk 800
- Section headlines: Space Grotesk 700
- Body/descriptions: Space Grotesk 300
- UI labels/captions: Inter 400

## Visual Effects

### Effect 1: Massive Background Brand Text
```css
.bg-brand-text {
  position: absolute;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: clamp(260px, 38vw, 560px);
  opacity: 0.04;
  color: hsl(var(--foreground));
  letter-spacing: -0.04em;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
  z-index: 0;
  overflow: visible;
}
```
Text: "FORM" — overflows left and right beyond viewport intentionally.

### Effect 2: Red Dot Period
In the hero headline "WE BUILD BRANDS THAT MEAN SOMETHING." — the period at the end is replaced by a `<span>` with a red dot:
```css
.red-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #d42a1a;
  margin-left: 3px;
  vertical-align: middle;
  position: relative;
  top: -4px;
}
```
This red dot is the ONLY red element in the hero section.

### Effect 3: Client Name Marquee
Below CTAs: continuous marquee of 8 client placeholder names in Space Grotesk 300 monochrome (black 40% opacity) separated by small red dots (●, 8px, #d42a1a). Scrolling left at 40s linear infinite.
"APEX ● MERIDIAN ● VANTAGE ● STRATUM ● ORION ● VOLTA ● HELIX ● NOVA"
Duplicate for seamless loop. The red separator dots are the only other red elements in the entire site alongside the primary CTA.

### Effect 4: Service Row Red Left Border
On hover of each service row: a 3px solid #d42a1a left border appears (initially invisible/transparent). Transition: 0.15s ease. Simultaneously: y: -2px, box-shadow: 0 2px 12px rgba(0,0,0,0.08).

### Effect 5: Case Study Hover Split
Each case study card on hover reveals a left/right split. Left half shows a muted grey desaturated "Before" state. Right half shows bold black text "After" state. A 2px vertical red line slides from center outward on hover using clip-path transition. Transition: 0.3s ease.

## Component Breakdown

### 1. Navbar
- Position: fixed top, background: rgba(245,244,242,0.95), backdrop-filter: blur(12px)
- Height: 60px
- Border-bottom: 1px solid hsl(var(--border))
- Left: "Form" in Space Grotesk 800, 16px, black + "Studio" in Space Grotesk 300, 16px, grey (60%) — on one line, gap: 6px
- Center: Inter 400, 12px, letter-spacing: 0.12em, uppercase, black — Work / Services / Process / Pricing / Contact
- Right: "Start a Project" — black bg, white text, Space Grotesk 700, 12px, letter-spacing: 0.08em, border-radius: 0, padding: 10px 22px
- Hover on nav links: electric red (#d42a1a). Transition: 0.15s.

### 2. Hero
Full-viewport. Background: #f5f4f2. Position: relative, overflow: hidden.

**No photography — purely typographic.**

**Background Text (z-index: 0):**
"FORM" — Space Grotesk 800, clamp(260px,38vw,560px), opacity: 0.04, black, letter-spacing: -0.04em, centered (left: 50%, top: 50%, translate -50% -50%), user-select: none, pointer-events: none, white-space: nowrap, overflow: visible.

**Content (z-index: 10):**
Position: relative, max-width: 1200px, margin: auto, padding: 0 6%, display: flex, flex-direction: column, justify-content: center, min-height: 100vh.

- Eyebrow label (Inter 400, 11px, grey #808080, letter-spacing: 0.16em, uppercase, margin-bottom: 24px): "BRAND IDENTITY · STRATEGY · MOTION · WEB"

- Headline: "WE BUILD BRANDS THAT MEAN SOMETHING" followed immediately (no space) by the red dot span `<span class="red-dot"></span>` — Space Grotesk 800, clamp(40px,5.5vw,100px), line-height: 0.95, black, letter-spacing: -0.02em, margin-bottom: 28px.
- Framer Motion: initial={{ opacity: 0, y: 40 }}, animate={{ opacity: 1, y: 0 }}, transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}

- Sub (Inter 400, 16px, grey #808080, line-height: 1.6, max-width: 520px, margin-bottom: 36px): "Strategy. Identity. Motion. Web. Everything your brand needs to compete — nothing it doesn't."
- Framer Motion: delay: 0.15s

- CTAs (flex, gap: 14px, margin-bottom: 48px):
  - "Start a Project" — black bg, white text, Space Grotesk 700, 13px, letter-spacing: 0.08em, padding: 14px 32px, border-radius: 0 (sharp)
  - "See Our Work" — transparent, border: 1.5px solid black, black text, same font, same padding
  - Framer Motion: delay: 0.25s

- Thin 1px black divider line (full width): margin-bottom: 32px

- Client name marquee strip:
  Overflow: hidden. Font: Space Grotesk 300, 13px, letter-spacing: 0.12em, uppercase, black 40% opacity.
  Separator: "●" color: #d42a1a, font-size: 8px, padding: 0 20px.
  Content (×2 for loop): "APEX ● MERIDIAN ● VANTAGE ● STRATUM ● ORION ● VOLTA ● HELIX ● NOVA"
  Animation: translateX(0%) → translateX(-50%), duration: 40s, linear, infinite.
  Framer Motion: delay: 0.4s fade-in on initial load.

### 3. Services Section
Background: white (#ffffff). Padding: 120px 6%.

**Header:**
- Inter 400, 11px, grey, letter-spacing: 0.16em, uppercase, margin-bottom: 12px: "WHAT WE DO"
- Space Grotesk 800, clamp(32px,4.5vw,72px), black, line-height: 1.0, margin-bottom: 72px: "Four disciplines. One studio."

**4 Service Rows:**
Each: position: relative, padding: 36px 0. Border-top: 0.5px solid hsl(var(--border)). Display: flex, justify-content: space-between, align-items: flex-start. Cursor: pointer.

Left: visual left-border indicator (position: absolute, left: 0, top: 0, bottom: 0, width: 3px, background: #d42a1a, opacity: 0, transition: opacity 0.15s ease).
On hover: left-border opacity → 1. Row: translateY(-2px), box-shadow: 0 2px 12px rgba(0,0,0,0.08). Transition: 0.2s ease.

Left column:
- Space Grotesk 700, clamp(22px,3vw,40px), black: service name
- Space Grotesk 300, 15px, grey #808080, max-width: 440px, line-height: 1.65: description

Right column (flex-shrink: 0, margin-left: 32px):
- Inter 400, 20px, black, letter-spacing: -0.02em: "→"

**The 4 services:**
1. "Brand Strategy" / "Positioning, messaging, and the clarity that makes everything else possible. We define who you are, who you're for, and why it matters." / →
2. "Visual Identity" / "Logos, colour, type, and the brand systems that scale across every touchpoint. Work that endures, not trends that expire." / →
3. "Motion & Content" / "Bringing the brand to life across video, social, and digital. Motion guidelines, campaign assets, and content that performs." / →
4. "Web & Digital" / "Websites and digital experiences built entirely on the identity. Fast, accessible, and designed to convert." / →

Last row: border-bottom: 0.5px solid hsl(var(--border)).

Framer Motion: each row whileInView, stagger 0.1s, opacity 0→1, x -16→0, viewport={{ once: true }}

### 4. Case Studies Grid
Background: #f5f4f2. Padding: 120px 6%.

**Header:**
- Inter 400, 11px, grey, letter-spacing: 0.16em: "SELECTED WORK"
- Space Grotesk 800, clamp(32px,4.5vw,72px), black: "Work that made a difference."
- Margin-bottom: 56px

**6 Case Study Cards — 2×3 grid (2 columns, 3 rows), gap: 2px:**
Each card: aspect-ratio: 4/3, position: relative, overflow: hidden, background: hsl(var(--border)) (neutral grey). No border-radius.

Card content (normal state):
- Grey background (#d6d6d6 / light)
- Space Grotesk 700, 22px, black: brand name
- Inter 400, 12px, grey: industry label
- Inter 400, 11px, grey, letter-spacing: 0.12em: "VIEW CASE STUDY →"

On hover — Split Reveal:
- Left half: position: absolute, left: 0, top: 0, width: 50%, height: 100%, background: #d6d6d6, contains "Before" label in Space Grotesk 300, 11px, grey: "BEFORE"
- Right half: position: absolute, right: 0, top: 0, width: 50%, height: 100%, background: #0a0a0a, contains brand name in Space Grotesk 800, 20px, white
- Red divider line: position: absolute, left: 50%, top: 0, bottom: 0, width: 2px, background: #d42a1a, transform-origin: center. On hover: scaleY 0→1, transition: 0.3s ease.
- The split reveal uses clip-path or z-index overlay approach.

**The 6 brands:**
1. "Apex" / "Sustainable materials" / Row 1 Col 1
2. "Meridian" / "Architecture & property" / Row 1 Col 2
3. "Vantage" / "Financial services" / Row 2 Col 1
4. "Stratum" / "Fashion & apparel" / Row 2 Col 2
5. "Orion" / "Technology" / Row 3 Col 1
6. "Volta" / "Electric vehicles" / Row 3 Col 2

Framer Motion: cards fade-in on scroll, stagger 0.08s, viewport={{ once: true }}

### 5. Process Section
Background: white. Padding: 120px 6%.

**Header:**
- Inter 400, 11px, grey, letter-spacing: 0.16em: "OUR PROCESS"
- Space Grotesk 800, clamp(28px,4vw,62px), black, margin-bottom: 80px: "How we build brands that last."

**4 Steps — horizontal on desktop, vertical on mobile:**
Layout: flex row, gap: 0, each step: flex: 1.

Between steps: a red dot connector (●, #d42a1a, 10px, centered vertically between the step number and next step).

Each step: position: relative.
- Red dot step marker: width: 12px, height: 12px, border-radius: 50%, background: #d42a1a, margin-bottom: 20px
- Space Grotesk 700, 18px, black: step number + name (e.g., "01 Discovery")
- Space Grotesk 300, 14px, grey, line-height: 1.65, max-width: 220px: description
- Inter 400, 12px, grey, margin-top: 12px: timeframe

Horizontal connection between steps: a 1px grey line connects the red dots across the top of all steps.

**The 4 steps:**
1. "01 Discovery" / "Two weeks understanding your market, competitors, and what you're really building. Stakeholder interviews, brand audit, competitive analysis." / "Approx. 2 weeks"
2. "02 Strategy" / "A complete brand brief: position, personality, voice, audience, and the single idea that makes you different." / "Approx. 1 week"
3. "03 Design" / "Identity designed across all touchpoints. Logo system, colour, typography, photography art direction, and the complete visual language." / "Approx. 3–4 weeks"
4. "04 Launch" / "Complete handoff: editable files, brand guidelines document, usage examples, and optional ongoing support retainer." / "1 week + ongoing"

Framer Motion: steps animate in left-to-right, stagger 0.15s, opacity 0→1, y 20→0.

### 6. Pricing Section
Background: #0a0a0a (pure black). Padding: 100px 6%.

**Header:**
- Inter 400, 11px, white 50%, letter-spacing: 0.16em: "INVESTMENT"
- Space Grotesk 800, clamp(30px,4vw,64px), white, margin-bottom: 64px: "Straightforward pricing."

**3 Pricing Tiers — 3-column grid, gap: 1px (grid lines as gaps):**
Each: background: #141414, padding: 48px 36px. No border-radius.

Tier structure:
- Space Grotesk 300, 12px, grey, letter-spacing: 0.16em, uppercase: tier name
- Space Grotesk 800, clamp(28px,3.5vw,56px), white, line-height: 1.0: price
- Divider: 1px solid #333, margin: 24px 0
- Space Grotesk 300, 14px, grey, line-height: 1.65: what's included (as paragraph, not bullet list)
- CTA: Space Grotesk 700, 13px, letter-spacing: 0.1em, margin-top: 32px

Recommended tier: border: 1px solid #d42a1a (red border on all 4 sides). Badge: "MOST POPULAR" in Inter 400, 10px, red, letter-spacing: 0.15em, position: absolute, top: -12px, left: 50%, translateX(-50%), background: #0a0a0a, padding: 0 8px.

**The 3 tiers:**
1. "Brand Starter" / "£4,800" / "Logo mark and wordmark, brand colour palette, typography selection, and a 12-page brand guidelines PDF. Ideal for new businesses launching cleanly." / "Start Here →" (Inter 400, 13px, grey)
2. "Studio Package" / "£9,600" / "Everything in Starter, plus motion design guidelines, a 5-page website design, social media templates, and photography art direction brief. Our most popular engagement." / "Most popular" badge + red border / "Begin the Conversation →" (Space Grotesk 700, white)
3. "Full Partnership" / "Bespoke" / "Full brand strategy, identity, motion, web build, ongoing asset creation, and a dedicated monthly retainer. Built for companies at inflection points." / "Let's Talk →" (Inter 400, 13px, grey)

Framer Motion: cards scale 0.96→1 on whileInView, stagger 0.12s, viewport={{ once: true }}.

### 7. Red CTA Section
Full-width. Background: #d42a1a (electric red). Padding: 120px 6%. Text-align: center.

- Space Grotesk 800, clamp(40px,6vw,108px), white, line-height: 0.95, letter-spacing: -0.02em: "LET'S BUILD SOMETHING"
- Margin-bottom: 44px
- "Start a Project →" — white bg, black text, Space Grotesk 700, 15px, letter-spacing: 0.08em, padding: 18px 48px, border-radius: 0
- Below: Inter 400, 13px, white 70%, margin-top: 20px: "Average response time: 4 hours"

Framer Motion: y 24→0, opacity 0→1 on whileInView.

### 8. Footer
Background: #0a0a0a. Padding: 64px 6%.
4-column grid:

Column 1: "Form Studio" Space Grotesk 800, 16px, white. Space Grotesk 300, 13px, grey: "Brand Identity Studio · London". Small red dot inline after "Studio". Social icons (lucide: Instagram, Twitter) in grey, hover: white.

Column 2: "Work" — Inter 400, 11px, grey, letter-spacing header. Links: Space Grotesk 300, 13px, grey 70%: Brand Strategy / Visual Identity / Motion & Content / Web & Digital

Column 3: "Studio" — same header. Space Grotesk 300, 13px, grey 70%: "hello@formstudio.co" / "+44 (0)20 7000 0001" / "4 Shoreditch High Street, London E1 6PQ"

Column 4: "Work with us" — same. Space Grotesk 300, 13px: "Currently booking: Q3 2025" / "studio@formstudio.co"

Bottom: Inter 400, 11px, grey 40%: "© 2025 Form Studio Ltd. All rights reserved." + small red dot.

## Animations

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Hero headline | opacity 0→1, y 40→0 | 0.8s | 0s | [0.16,1,0.3,1] |
| Hero sub | opacity 0→1, y 30→0 | 0.8s | 0.15s | [0.16,1,0.3,1] |
| Hero CTAs | opacity 0→1, y 24→0 | 0.8s | 0.25s | [0.16,1,0.3,1] |
| Marquee fade-in | opacity 0→1 | 0.6s | 0.4s | ease |
| Service rows | opacity 0→1, x -16→0 | 0.5s | i×0.1s | ease |
| Case study cards | opacity 0→1, scale 0.97→1 | 0.5s | i×0.08s | ease |
| Process steps | opacity 0→1, y 20→0 | 0.6s | i×0.15s | ease |
| Pricing tiers | scale 0.96→1, opacity 0→1 | 0.6s | i×0.12s | ease |
| CTA section | opacity 0→1, y 24→0 | 0.7s | 0s | ease |
| Service row hover | y 0→-2 + red border | 0.2s | — | ease |
| Marquee scroll | translateX loop | 40s | — | linear, infinite |
| Case split reveal | clip-path / red line | 0.3s | — | ease |

## Responsive

**Desktop (≥1024px):**
- Hero: full viewport, centered text, "FORM" overflows
- Services: full-width rows
- Case studies: 2-column grid
- Process: 4-column horizontal with connecting line
- Pricing: 3-column grid
- Footer: 4-column grid

**Tablet (768–1023px):**
- Case studies: 2-column (3 rows same)
- Process: 2×2 grid (steps 1-2 / 3-4)
- Pricing: 1×3 vertical stack
- Footer: 2×2 grid

**Mobile (<768px):**
- Navbar: hamburger, full-screen black overlay with Space Grotesk 800 white links
- Hero "FORM" background: clamp to 120px max, opacity reduced to 0.025
- Case studies: 1-column stack
- Process: vertical numbered list, red dots as left column markers
- Pricing: 1-column stack
- Marquee: same (works on all sizes)
- Footer: single column

## Full Copy

**Navigation:** Form · Work · Services · Process · Pricing · Contact · Start a Project

**Hero:**
- Eyebrow: "BRAND IDENTITY · STRATEGY · MOTION · WEB"
- Headline: "We Build Brands That Mean Something" [+ red dot]
- Sub: "Strategy. Identity. Motion. Web. Everything your brand needs to compete — nothing it doesn't."
- CTA 1: "Start a Project"
- CTA 2: "See Our Work"
- Marquee: "APEX ● MERIDIAN ● VANTAGE ● STRATUM ● ORION ● VOLTA ● HELIX ● NOVA"

**Services:** "WHAT WE DO" / "Four disciplines. One studio."
- Brand Strategy: "Positioning, messaging, and the clarity that makes everything else possible. We define who you are, who you're for, and why it matters."
- Visual Identity: "Logos, colour, type, and the brand systems that scale across every touchpoint. Work that endures, not trends that expire."
- Motion & Content: "Bringing the brand to life across video, social, and digital. Motion guidelines, campaign assets, and content that performs."
- Web & Digital: "Websites and digital experiences built entirely on the identity. Fast, accessible, and designed to convert."

**Case Studies:** "SELECTED WORK" / "Work that made a difference."
- Apex / Sustainable materials
- Meridian / Architecture & property
- Vantage / Financial services
- Stratum / Fashion & apparel
- Orion / Technology
- Volta / Electric vehicles

**Process:** "OUR PROCESS" / "How we build brands that last."
- 01 Discovery: "Two weeks understanding your market, competitors, and what you're really building. Stakeholder interviews, brand audit, competitive analysis." / Approx. 2 weeks
- 02 Strategy: "A complete brand brief: position, personality, voice, audience, and the single idea that makes you different." / Approx. 1 week
- 03 Design: "Identity designed across all touchpoints. Logo system, colour, typography, photography art direction, and the complete visual language." / Approx. 3–4 weeks
- 04 Launch: "Complete handoff: editable files, brand guidelines document, usage examples, and optional ongoing support retainer." / 1 week + ongoing

**Pricing:** "INVESTMENT" / "Straightforward pricing."
- Brand Starter: £4,800 / "Logo mark and wordmark, brand colour palette, typography selection, and a 12-page brand guidelines PDF. Ideal for new businesses launching cleanly." / "Start Here →"
- Studio Package: £9,600 / "Everything in Starter, plus motion design guidelines, a 5-page website design, social media templates, and photography art direction brief. Our most popular engagement." / "Begin the Conversation →"
- Full Partnership: Bespoke / "Full brand strategy, identity, motion, web build, ongoing asset creation, and a dedicated monthly retainer. Built for companies at inflection points." / "Let's Talk →"

**CTA Section:** "LET'S BUILD SOMETHING" / "Start a Project →" / "Average response time: 4 hours"

**Footer:**
- Tagline: "Brand Identity Studio · London"
- Address: "4 Shoreditch High Street, London E1 6PQ"
- Email: "hello@formstudio.co"
- Phone: "+44 (0)20 7000 0001"
- Booking: "Currently booking: Q3 2025"
- Contact email: "studio@formstudio.co"
- Legal: "© 2025 Form Studio Ltd. All rights reserved."

## Key Dependencies
```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx",
  "tailwindcss": "^3.x"
}
```
