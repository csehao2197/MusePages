# Nail Salon Website — AI Prompt

## Goal
Build a full luxury nail studio website called **LUNE** — a quiet, editorial beauty space. Soft white background, DM Serif Display headlines, dusty rose accent, and a precision-craft aesthetic. Think: high-end beauty editorial meets minimal gallery. Feminine without being loud. Luxury without the noise.

---

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

---

## Design System — Colors

```css
:root {
  --white:       #fdfcfb;
  --white-2:     #f7f4f0;
  --stone:       #ede8e0;
  --border:      #e0d9cf;
  --ink:         #1c1917;
  --ink-soft:    #78716c;
  --rose:        #c2697a;   /* dusty rose accent */
  --rose-light:  #f0d4d9;
  --rose-deep:   #9e4a5a;
}
```

Background: `--white`. Text: `--ink`. Accent: `--rose` — used on CTA buttons, price highlights, hover states, active nav indicator, and italic accent words. Borders: `--border` (1px, no radius except where noted). Cards: `--white-2` or `--stone`. No drop shadows — clean edges only.

---

## Typography

```
Google Fonts:
https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap
```

- **Display / headings**: `DM Serif Display`, weight 400. Italic for accent words. Letter-spacing -0.02em.
- **Body / UI**: `DM Sans`, weight 300–500, line-height 1.6
- **Labels / prices / nav / tags**: `JetBrains Mono`, 11px, letter-spacing 0.1em, uppercase, `--ink-soft`

Section label system: `§ 01 / Services`, `§ 02 / Gallery`, etc. JetBrains Mono 11px `--ink-soft`, left-aligned. Secondary tag right-aligned same style. 1px `--border` rule below.

Hero headline scale: `clamp(56px, 9vw, 140px)`.

```css
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.eyebrow::before {
  content: '';
  width: 20px; height: 1px;
  background: var(--rose);
}
```

---

## Visual Effects

### 1. Clip-reveal for images
```css
.clip-reveal {
  clip-path: inset(100% 0 0 0);
  transition: clip-path 0.85s cubic-bezier(0.16, 1, 0.3, 1);
}
.clip-reveal.in-view { clip-path: inset(0% 0 0 0); }
```

### 2. Fade-up for content blocks
```js
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
```

### 3. Gallery hover — soft overlay
```css
.nail-item::after {
  content: '';
  position: absolute; inset: 0;
  background: rgba(194, 105, 122, 0.15);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.nail-item:hover::after { opacity: 1; }
.nail-item:hover img { transform: scale(1.04); transition: transform 0.5s ease; }
```

### 4. Service row hover
On hover, the row background shifts to `--white-2` and a `--rose` 2px left border appears:
```css
.service-row {
  border-left: 2px solid transparent;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.service-row:hover {
  background: var(--white-2);
  border-left-color: var(--rose);
}
```

### 5. Horizontal marquee
Between hero and services — a continuous strip:
```
GEL MANICURE · NAIL ART · ACRYLICS · PEDICURE · NAIL EXTENSIONS · CHROME · SOAK-OFF ·
```
DM Serif Display italic, 36px, `--border` color. Rose `✦` separators. Infinite loop, 30s.

### 6. Staggered line reveal (headlines)
```css
.line span {
  display: block;
  clip-path: inset(0 0 100% 0);
  transition: clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.line.in-view span { clip-path: inset(0 0 0% 0); }
```
Multiple lines stagger by 0.08s each.

---

## Component Breakdown

### 1. Navbar (fixed, z-100)
White background `--white` + `--border` bottom. `backdrop-filter: blur(12px)` when scrolled.

Layout: brand left · nav center · CTA right.
- Brand: `LUNE` in DM Serif Display 22px + `®` in JetBrains Mono 9px superscript, ink-soft
- Nav: Services · Gallery · Pricing · Artists · FAQ — JetBrains Mono 11px `--ink-soft`, `--rose` underline on active/hover
- CTA: `Book Now →` — `--rose` background, white text, no border-radius, DM Sans 500 14px
- Mobile: hamburger → full-screen white overlay, links centered + large

### 2. Hero (§ 01)
Full-height section. Asymmetric split: left 40%, right 60%.

**Left column** (full height, sticky-feeling):
- Top: eyebrow `Nail Studio · Est. 2018`
- Headline lines:
  ```
  Nails,
  done with
  *intention.*
  ```
  DM Serif Display, `clamp(52px, 8vw, 110px)`. Third line italic `--rose`.
- Body: "A calm, considered nail studio in the heart of the city. No rushed appointments. No shortcuts. Just precise, lasting work and a space to breathe."
- Two CTAs: `Book an Appointment →` (rose fill) + `View Services →` (outline `--border`)
- Bottom: JetBrains Mono stats row — `4.9 ★  ·  1,200+ clients  ·  Est. 2018`

**Right column** (edge to edge, no padding):
Tall stacked image composition — two images with a gap, slight offset:
```
{/* Image 1 (tall, fills top 65%): close-up of perfectly shaped nude gel nails resting on white marble surface, soft diffused natural light, extremely clean and precise */}
{/* Image 2 (shorter, bottom 30%): nail artist's hands at work applying gel polish, focused and precise, warm studio lighting, blurred background */}
```
Right column: `overflow: hidden`, `position: relative`.

### 3. Marquee Strip (separator)
`--white-2` background, 64px tall, `--border` top and bottom. Continuous horizontal scroll as described above.

### 4. Services (§ 02)
Section label + heading: `"Our *services.*"` italic accent word.

Short intro: "Every service is carried out by a trained nail technician. We use non-toxic, long-wear formulas. Appointments run on time." — DM Sans 16px `--ink-soft`, max-width 560px.

Stacked service rows. Each row:
- Number (`01` etc.) in JetBrains Mono 11px `--border` far left
- Service name in DM Serif Display 20px
- Short description in DM Sans 14px `--ink-soft`
- Duration + from-price right-aligned: `60 min · from £45` in JetBrains Mono 11px
- Arrow `→` appears on hover far right
- Left rose border hover effect as described

Eight services:
1. **Gel Manicure** — Classic gel polish, shaped and filed to your preference. Long-lasting, chip-resistant. *60 min · from £38*
2. ***Nail Art*** — Custom hand-painted designs, from single accent nails to full sets. Priced on complexity. *75 min · from £55*
3. **BIAB / Builder Gel** — Builder In A Bottle — strength and length without acrylics. Natural, flexible, and repairable. *75 min · from £52*
4. **Acrylic Extensions** — Full set or infills. Sculpted or tip-overlay. Shaped to any length. *90 min · from £65*
5. **Gel Polish Soak-Off** — Careful removal of existing gel or acrylic without damage. Includes mini treatment. *30 min · £20*
6. **Spa Pedicure** — Soak, exfoliate, cuticle care, massage, and gel polish. *75 min · from £50*
7. **Chrome & Foil** — Mirror chrome powder, holographic or foil nail art — add-on to any service. *+15 min · from £12*
8. **Nail Treatment** — Strengthening base treatments for damaged or thin nails. OPI, CND, ORLY. *45 min · from £28*

Below list: `Book Any Service →` CTA centered, rose fill.

### 5. Gallery (§ 03)
Section label + heading: `"The *work.*"` 

Sub: "A selection of recent sets from the studio." JetBrains Mono 11px `--ink-soft`.

12-image CSS grid — unequal sizes, editorial masonry feel:
```css
.nail-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 160px;
  gap: 6px;
}
.n1 { grid-column: span 2; grid-row: span 2; }
.n2 { grid-column: span 1; grid-row: span 1; }
.n3 { grid-column: span 3; grid-row: span 2; }
.n4 { grid-column: span 1; grid-row: span 2; }
.n5 { grid-column: span 2; grid-row: span 1; }
.n6 { grid-column: span 2; grid-row: span 2; }
.n7 { grid-column: span 1; grid-row: span 1; }
.n8 { grid-column: span 3; grid-row: span 1; }
.n9 { grid-column: span 2; grid-row: span 2; }
.n10 { grid-column: span 1; grid-row: span 1; }
.n11 { grid-column: span 2; grid-row: span 1; }
.n12 { grid-column: span 1; grid-row: span 2; }
```
Each image: `object-fit: cover; width: 100%; height: 100%`. Hover: soft rose overlay + scale 1.04.

Image briefs (all close-up nail photography):
```
{/* n1: perfectly oval nude BIAB nails, white marble background, soft natural light, ultra clean */}
{/* n2: single rose chrome accent nail, close-up macro, blurred background */}
{/* n3: abstract swirl nail art in muted beige and terracotta tones, two hands */}
{/* n4: dark plum gel square nails, moody studio light */}
{/* n5: minimal french tip with thin gold line, bright clean background */}
{/* n6: botanical press-on nail art, pastel green with tiny floral details */}
{/* n7: glossy deep red stiletto nails, dramatic crop */}
{/* n8: two hands showing cloud and ombre blue nail art, flat lay on cream surface */}
{/* n9: close-up of nail technician's tools — brushes, foils, gel pots — organized neatly */}
{/* n10: sheer milky nails with single holographic star, minimal and clean */}
{/* n11: warm tortoiseshell gel nail art, autumn tones, white background */}
{/* n12: textured 3D floral nail art, white petals on nude base, extreme close-up */}
```

Below: `Follow @lunenailstudio →` JetBrains Mono 11px link with arrow.

### 6. Process (§ 04)
Section label + heading: `"What to *expect.*"` 

Horizontal 4-step timeline on desktop, vertical on mobile. Each step connected by a thin `--border` line.

Each step:
- Step number in JetBrains Mono 11px `--rose`
- Name in DM Serif Display 22px
- Description DM Sans 14px `--ink-soft`

Steps:
1. **Book** — Choose your service and artist online. Pick a time that works. We'll confirm within the hour and send a reminder the day before.
2. **Consult** — Your appointment starts with a quick chat — shape, length, finish, inspo. We look at your nails and make a plan.
3. **Create** — Your artist works precisely and without rushing. We never double-book. Your time is yours.
4. **Last** — We finish with a topcoat and aftercare advice. Gels last 3–4 weeks. We guarantee our work for 7 days.

### 7. Pricing (§ 05)
Section label + heading: `"Simple *pricing.*"` + note: "All prices include removal of previous gel/polish where required."

Three pricing tiers in a row. Middle card is featured — `--stone` background, `--rose` badge.

**Essential** (Technician level):
- Gel Manicure — £38
- BIAB Set — £52
- Pedicure — £50
- Soak-Off — £20
- CTA: `Book Essential →` outline

**Signature** (Senior Technician) — featured, most popular:
- Gel Manicure — £48
- BIAB Set — £62
- Nail Art (per nail) — from £5
- Pedicure — £60
- Acrylic Full Set — £75
- CTA: `Book Signature →` rose fill

**Artist** (Lead Artist):
- Custom Nail Art (full set) — from £85
- Editorial / Press Sets — POA
- Event Nails (weddings etc.) — POA
- CTA: `Enquire →` outline

Below: "Not sure? DM us on Instagram and we'll point you in the right direction." JetBrains Mono 11px `--ink-soft`.

### 8. Artists (§ 06)
Section label + heading: `"Your *artists.*"`

Three artist cards in a row. Each:
- Portrait image, tall (aspect 3/4), clip-reveal animation, `--rose` bottom border on hover
- Name: DM Serif Display 20px
- Title: JetBrains Mono 11px `--rose`
- Bio: DM Sans 14px `--ink-soft`
- Speciality chips: small pill tags, `--stone` bg, `--ink-soft` text

Three artists:
1. **Chloe Park** · Founder & Lead Artist — Trained in Seoul and London. Specialises in minimalist nail art, BIAB and press-on construction. 8 years in the studio. · `Nail Art` `BIAB` `Press-Ons`
2. **Margot Leclerc** · Senior Technician — French manicure specialist with a background in fashion styling. Precise, fast, and deeply calm to sit with. · `French` `Gel` `Acrylics`
3. **Amara Osei** · Nail Artist — Known for painterly nail art and texture work — 3D florals, sculpted gels, bespoke designs. · `3D Art` `Sculpted Gel` `Editorial`

```
{/* Portrait 1: female nail artist in studio, looking at camera with confidence, clean white apron, tools in background, warm natural light */}
{/* Portrait 2: female nail technician working on a client's nails, side profile, focused, bright airy studio */}
{/* Portrait 3: female nail artist holding up a painted nail tip, smiling, studio setting, natural light */}
```

### 9. Testimonials (§ 07)
Section: `--white-2` background. Heading: `"Kind *words.*"`

Single large testimonial displayed at a time. Prev/next arrows + dots. Auto-advance 7s. Fade transition.

Blockquote: DM Serif Display italic, 26px, max-width 720px centered.
Author: JetBrains Mono 11px `--rose`.

Four testimonials:
1. *"I've been to a lot of nail salons. This is the only one where I never feel rushed, never feel like an inconvenience, and always leave with exactly what I asked for. Chloe is extraordinary."* — Isabelle N., client since 2021
2. *"My wedding nails were perfect. Amara spent two hours on a custom design I showed her on Pinterest and somehow made it better. The photos look incredible."* — Priya K., Bride 2024
3. *"I have genuinely bad nails — thin, peeling, won't grow. After three BIAB appointments here, they're the strongest they've ever been. The nail treatment advice changed everything."* — Rachel O., client since 2023
4. *"The studio itself is beautiful — quiet, clean, no chemical smell. I take my lunch break here and come back to the office feeling like a completely different person."* — Sophie W., weekly client

### 10. Booking (§ 08)
Full-width `--rose` section. Centered layout.

Heading: `"Ready to *book?*"` DM Serif Display, `clamp(52px, 8vw, 110px)`, white.
Sub: "Real-time availability. Cancel or reschedule up to 24 hours ahead." DM Sans 16px white opacity 0.8.

Two CTAs:
- `Book Online →` — white background, `--rose` text
- `Send a Message →` — outline white border, white text

Below: `Appointments available Mon–Sat, 9am–7pm. Last booking 6pm.` JetBrains Mono 11px white opacity 0.6.

Four trust badges in a row (icon + text), white:
- `4.9 ★ Google Reviews`
- `Non-toxic formulas only`
- `7-day guarantee`
- `Always on time`

### 11. FAQ (§ 09)
Two-column: heading left (`"Before you *ask.*"`), accordion right.

Contact sub-text: "Still unsure? Email hello@lunenailstudio.com" JetBrains Mono 11px `--ink-soft` with `--rose` link.

Six accordion items. `+` → `×`. Panel slides:

1. **How do I book?** — Online through our booking page — choose your service, pick an artist, select a time. You'll get a confirmation immediately and a reminder the day before.
2. **How long does gel last?** — Most gel manicures last 3–4 weeks. BIAB tends to last slightly longer. We guarantee our work for 7 days — if anything lifts, chips or breaks, come back and we'll fix it free.
3. **Do you offer removal?** — Yes, removal of previous gel or acrylic is included in all manicure appointments. If you only need removal, we offer a 30-minute soak-off for £20.
4. **Can I bring nail art inspiration?** — Please do. Screenshots from Instagram, Pinterest, a mood board — anything helps. Send it ahead via Instagram or show us at the start of your appointment.
5. **What's your cancellation policy?** — We ask for 24 hours' notice to cancel or reschedule. Late cancellations or no-shows may be charged at 50% of the service.
6. **Do you do events and bridal parties?** — Yes. We offer group bookings for hen parties, weddings, editorial shoots, and corporate events. Email us with your date and headcount for a quote.

### 12. Footer
White background, `--border` top.

Big display text: `LUNE.` DM Serif Display `9vw`, ink — line-reveal animation.

Three-column layout below:
- **Studio**: 14 Redchurch Street · London E2 7DD · hello@lunenailstudio.com · Mon–Sat 9–7pm
- **Services**: Gel Manicure / BIAB / Nail Art / Acrylics / Pedicure / Soak-Off
- **Follow**: Instagram / Pinterest / TikTok / Google Reviews

Bottom: `© 2026 LUNE Nail Studio · London` left + `Appointments: Mon–Sat 9–7pm` right. JetBrains Mono 11px `--ink-soft`.

---

## Animations Summary

| Element | Animation | Timing |
|---|---|---|
| Hero headline lines | clip-path reveal | 0.7s, stagger 0.08s |
| Hero images | clip-path reveal | 0.9s, delay 0.2s |
| Service rows | fade-up staggered | 0.45s, 0.05s per row |
| Gallery items | clip-reveal on scroll | 0.8s, stagger 0.04s |
| Pricing cards | fade-up | 0.5s, 0.1s per card |
| Artist cards | fade-up | 0.5s, 0.1s per card |
| Process steps | fade-up | 0.5s, 0.1s per step |
| Testimonial swap | opacity crossfade | 0.4s ease |
| Gallery hover | rose overlay + scale 1.04 | 0.3s ease |
| Service row hover | border + bg | 0.2s ease |
| Marquee | translateX(-50%) | 30s linear infinite |
| Footer headline | clip-path line reveal | 0.9s, delay 0.1s |

All scroll-triggered: `IntersectionObserver`, threshold 0.1, rootMargin `0px 0px -50px 0px`.

---

## Responsive

- **Desktop (≥1024px)**: Hero 40/60 split, Services full list, Gallery 6-col grid, Artists 3-col, Pricing 3-col.
- **Tablet (768–1023px)**: Hero stacked (image below), Gallery 4-col, Artists 2+1, Pricing scroll horizontal.
- **Mobile (<768px)**: All single-column. Hero: type, image, CTAs stacked. Gallery: 2-col simple. Pricing: scroll with snap. Service rows: stack duration/price below name.

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
- Brand name `LUNE` swaps to any salon name. All copy is written and ready.
- The `--rose` accent `#c2697a` is the single brand color — easy to swap: sage `#7a9e7e`, terracotta `#b84a28`, mauve `#9b7fa6`, or nude `#c4a882`.
- The booking CTA links to an external booking platform (Fresha, Treatwell, Square, etc.) — the prompt assumes a link-out, not an embedded calendar.
