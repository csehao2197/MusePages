# Therapist Website Prompt — Clarity Therapy
# websiteprompts.ai

Build a complete, production-ready therapist and psychologist website called **Clarity Therapy** using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react. The site should feel calm, warm, and editorially beautiful — the antithesis of clinical white-box healthcare sites. Think an independent practice run by a thoughtful, caring human being.

---

## 1. Goal Statement

Build a conversion-focused therapist website that makes visitors feel immediately safe, understood, and compelled to book a free introductory session.

---

## 2. Tech Stack

- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS (JIT mode, extend theme with CSS custom properties)
- **Animation:** Framer Motion (import as `motion` from `motion/react`)
- **Components:** shadcn/ui (Button, Input, Badge, Card)
- **Icons:** lucide-react
- **Fonts:** Google Fonts (DM Serif Display + Plus Jakarta Sans)

---

## 3. Design System

```css
:root {
  /* Backgrounds */
  --background: 60 20% 98%;          /* warm white #fafaf7 */
  --surface: 60 15% 95%;             /* off-white surface #f4f4ef */
  --surface-tinted: 42 30% 93%;      /* warm sand surface #ede8df */

  /* Foregrounds */
  --foreground: 30 12% 18%;          /* warm near-black #302b24 */
  --foreground-muted: 30 8% 48%;     /* warm mid-grey #7e7870 */

  /* Primary — sage teal */
  --primary: 173 33% 35%;            /* #3d7a72 */
  --primary-light: 173 28% 48%;      /* #5a9990 */
  --primary-foreground: 0 0% 100%;

  /* Secondary — warm sand */
  --sand: 36 34% 69%;                /* #c8b89a */
  --sand-light: 36 28% 85%;          /* #e2d9cc */
  --sand-foreground: 30 20% 20%;

  /* Accent — warm sage */
  --sage-soft: 152 18% 82%;          /* #c5d4cc */

  /* Borders */
  --border: 42 18% 85%;              /* #ddd8ce */
  --border-muted: 42 12% 91%;        /* #eceae4 */

  /* Typography scale */
  --radius: 0px;
}
```

Apply to `body`: `background-color: hsl(var(--background)); color: hsl(var(--foreground)); font-family: 'Plus Jakarta Sans', sans-serif;`

---

## 4. Typography

### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

### Usage
| Element | Font | Weight | Style | Size | Line-height |
|---|---|---|---|---|---|
| H1 Display | DM Serif Display | 400 | italic | clamp(36px, 5vw, 88px) | 1.08 |
| H2 Section | DM Serif Display | 400 | italic | clamp(28px, 3.5vw, 56px) | 1.15 |
| H3 Cards | DM Serif Display | 400 | normal | clamp(20px, 2vw, 26px) | 1.3 |
| Subheadline | Plus Jakarta Sans | 300 | normal | clamp(16px, 1.4vw, 20px) | 1.65 |
| Body text | Plus Jakarta Sans | 400 | normal | 16px | 1.75 |
| Label / Badge | Plus Jakarta Sans | 700 | normal | 11px, letter-spacing 0.12em | 1 |
| Nav items | Plus Jakarta Sans | 500 | normal | 14px | 1 |
| Button | Plus Jakarta Sans | 600 | normal | 14px, letter-spacing 0.04em | 1 |

---

## 5. Visual Effects

### Effect 1 — Hero Panel Gradient
Left content panel uses a directional gradient that bleeds rightward into the photography panel:
```css
background: linear-gradient(
  to right,
  hsl(60, 20%, 98%) 0%,
  hsl(60, 20%, 98%) 60%,
  hsla(60, 20%, 98%, 0.92) 78%,
  hsla(60, 20%, 98%, 0.60) 90%,
  transparent 100%
);
```
This sits in its own `z-10` div overlapping the photography panel, ensuring text legibility regardless of photo composition or where the subject is positioned.

### Effect 2 — Sand Texture Overlay
Hero and quote sections get a subtle SVG noise texture overlay at 3% opacity:
```jsx
<div
  className="absolute inset-0 pointer-events-none z-0"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize: '128px 128px',
  }}
/>
```

### Effect 3 — Floating "First Session Free" Card
A small floating card anchored bottom-left of the CTA cluster in the hero. Scales in from `scale: 0.92, opacity: 0` to `scale: 1, opacity: 1` at `delay: 0.5s` with `type: "spring", stiffness: 220, damping: 24`. Permanent subtle float: `y: [0, -4, 0]` on `repeat: Infinity, duration: 3.5, ease: "easeInOut"` (Framer Motion `animate`).

### Effect 4 — Scroll-triggered Section Fade
Every section heading uses:
```jsx
initial={{ opacity: 0, y: 24 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-80px" }}
transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
```

### Effect 5 — Sand-border Card Hover
Area-of-Support cards get `transition: border-color 0.25s ease, box-shadow 0.25s ease` on hover: left border color shifts from `hsl(var(--sand))` to `hsl(var(--primary))`, and a soft shadow `0 4px 24px hsla(173,33%,35%,0.10)` appears.

---

## 6. Component Breakdown

### Section 1 — Navbar

```
Layout: fixed top-0, w-full, z-50, h-16
Background: hsl(var(--background)) at 96% opacity with backdrop-blur-sm
Bottom border: 1px solid hsl(var(--border-muted))
Padding: px-6 md:px-12 lg:px-20
```

**Left:** Logo — "Clarity" in DM Serif Display 400 italic at 22px, sage teal, followed by "Therapy" in Plus Jakarta Sans 300 at 22px, foreground-muted.

**Center (desktop):** Nav links — `How I Work` / `Areas of Support` / `About` / `Fees` / `Contact` — Plus Jakarta Sans 500 at 14px, foreground-muted, hover: foreground. 32px gap between links.

**Right:** `Book Free Session` — button with `background: hsl(var(--primary))`, white text, Plus Jakarta Sans 600, 14px, letter-spacing 0.04em, padding: `10px 20px`, border-radius: 0, hover: `background: hsl(var(--primary-light))`, transition 0.2s.

**Mobile:** Hamburger icon (lucide `Menu`), slide-down drawer with links stacked vertically.

---

### Section 2 — Hero (True Split Layout)

```
Layout: min-h-screen flex, pt-16 (navbar offset)
```

**Left panel — 48% width:**
```
position: relative
z-index: 10
padding: pl-6 md:pl-12 lg:pl-20, pr-8, py-20 md:py-28
display: flex flex-col justify-center
background: linear-gradient(to right, hsl(60,20%,98%) 0%, hsl(60,20%,98%) 60%, hsla(60,20%,98%,0.88) 82%, transparent 100%)
```

Content inside left panel (top to bottom):

1. **Eyebrow label:** "INDIVIDUAL THERAPY · LONDON" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsl(var(--primary))`, margin-bottom 20px. Motion: `initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}`

2. **H1:** "You Don't Have to Figure This Out Alone." — DM Serif Display 400 italic, `clamp(36px,5vw,88px)`, line-height 1.08, `color: hsl(var(--foreground))`, max-width 560px. Motion: `transition={{ duration:0.65, delay:0.2, ease:[0.22,1,0.36,1] }}`

3. **Subheadline:** "Individual therapy for anxiety, burnout, relationships, and life transitions." — Plus Jakarta Sans 300, `clamp(16px,1.4vw,20px)`, line-height 1.65, `color: hsl(var(--foreground-muted))`, max-width 440px, margin-top 20px. Motion: `transition={{ duration:0.55, delay:0.35 }}`

4. **CTA cluster** (margin-top 36px, flex gap-4):
   - Primary button: "Book Free Session" — `background: hsl(var(--primary))`, white, Plus Jakarta Sans 600, 15px, padding: `14px 28px`, border-radius: 0, hover scale 1.01 transition 0.2s
   - Ghost button: "Learn How I Work →" — no background, `color: hsl(var(--primary))`, Plus Jakarta Sans 500, 15px, border-bottom `1px solid hsl(var(--primary))`, no border-radius
   Motion: `transition={{ duration:0.5, delay:0.45 }}`

5. **Floating "First Session Free" card** (margin-top 40px):
   ```
   background: hsl(var(--primary))
   padding: 20px 24px
   max-width: 340px
   border-radius: 0
   ```
   - "FIRST SESSION FREE" — Plus Jakarta Sans 800, 12px, letter-spacing 0.12em, uppercase, `color: hsl(36,34%,85%)` (sand-light)
   - "Try a 50-minute introductory session at no cost — no commitment required." — Plus Jakarta Sans 300, 14px, line-height 1.6, white, margin-top 8px
   - "Book your free session →" — Plus Jakarta Sans 600, 14px, `color: hsl(60,20%,98%)`, margin-top 14px, border-bottom `1px solid hsla(255,255%,255%,0.4)`, hover opacity 0.8
   
   Motion (Framer Motion):
   ```jsx
   initial={{ opacity: 0, scale: 0.92, y: 10 }}
   animate={{ opacity: 1, scale: 1, y: 0 }}
   transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.55 }}
   ```
   Then on the card, add a permanent float:
   ```jsx
   // Wrap in a second motion.div
   animate={{ y: [0, -5, 0] }}
   transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
   ```

**Right panel — 52% width:**
```
position: relative
overflow: hidden
min-height: 100vh (on desktop)
height: 480px (on mobile)
```
```jsx
{/* Image: Moss-covered stones beside a clear, shallow stream — dappled golden light filters through overhanging leaves. Calm, grounding, abstract nature. No people, no clinical setting. Warm green and earthy tones. Shot from slightly above, soft focus background, f/2.8 bokeh. */}
<img
  src=""
  alt="Calm nature photography — moss-covered stones near a stream with dappled light"
  className="w-full h-full object-cover object-center"
/>
```
Bottom-right attribution: "Photo for illustration" in Plus Jakarta Sans 300, 10px, white at 50% opacity, positioned `absolute bottom-4 right-4 z-10`.

---

### Section 3 — Areas of Support

```
Section: py-24 md:py-32, background: hsl(var(--background))
Container: max-w-5xl mx-auto px-6 md:px-12
```

**Section heading block** (margin-bottom 56px):
- Label: "AREAS OF SUPPORT" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsl(var(--primary))`, margin-bottom 12px
- H2: "What We Can Work Through Together" — DM Serif Display 400 italic, `clamp(28px,3.5vw,52px)`, max-width 480px

**4-card grid:** `grid grid-cols-1 md:grid-cols-2 gap-6`

Each card:
```
background: hsl(var(--surface))
border-left: 3px solid hsl(var(--sand))
padding: 28px 28px 28px 32px
transition: border-color 0.25s ease, box-shadow 0.25s ease
hover: border-left-color hsl(var(--primary)), box-shadow 0 4px 28px hsla(173,33%,35%,0.10)
```

Content per card:
```
Icon (lucide, stroke-width 1.5, color hsl(var(--primary)), size 28px) — margin-bottom 16px
H3: DM Serif Display 400 normal, 22px
Description: Plus Jakarta Sans 400, 15px, line-height 1.7, color hsl(var(--foreground-muted)), margin-top 8px
```

Cards:

**Card 1 — Anxiety & Stress**
Icon: `Brain` (lucide)
Heading: "Anxiety & Stress"
Text: "Persistent worry, panic, overwhelm — these aren't character flaws. Together we'll find what drives your anxiety and build lasting strategies to reclaim your calm."

**Card 2 — Relationship Difficulties**
Icon: `Heart` (lucide)
Heading: "Relationship Difficulties"
Text: "Whether it's communication breakdowns, trust issues, or patterns that keep repeating, therapy can help you understand what you bring to your relationships — and change it."

**Card 3 — Burnout & Life Transitions**
Icon: `Flame` (lucide)
Heading: "Burnout & Life Transitions"
Text: "Career change, loss of identity, exhaustion that sleep won't fix — I work with people navigating the in-between spaces where old maps no longer apply."

**Card 4 — Grief & Loss**
Icon: `Cloud` (lucide)
Heading: "Grief & Loss"
Text: "Grief doesn't run on a timeline and it isn't only about death. Whether you're mourning a person, a relationship, or a version of yourself — this is a space to feel it fully."

**Stagger animation (Framer Motion):**
```jsx
// Wrap grid in motion.div with staggerChildren
<motion.div
  variants={{ visible: { transition: { staggerChildren: 0.10 } } }}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-60px" }}
>
  {cards.map(card => (
    <motion.div
      key={card.title}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22,1,0.36,1] } }
      }}
    >
```

---

### Section 4 — How Sessions Work

```
Section: py-24 md:py-32, background: hsl(var(--surface))
Container: max-w-5xl mx-auto px-6 md:px-12
```

**Section heading block** (margin-bottom 64px, centered):
- Label: "THE PROCESS" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsl(var(--primary))`, centered
- H2: "Simple, Structured, and at Your Pace" — DM Serif Display italic, centered, max-width 480px, margin: 0 auto

**3-step horizontal row:** `grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12`

Each step:
```
position: relative
padding: 12px 0 0 0
```

Behind each heading, a large faded step number:
```
position: absolute
top: -12px
left: -8px
font-family: DM Serif Display
font-size: clamp(80px, 10vw, 120px)
font-weight: 400
color: hsl(var(--primary))
opacity: 0.07
line-height: 1
z-index: 0
pointer-events: none
user-select: none
```

Content (z-index: 1, position: relative):
```
Step number chip: "Step 01" — Plus Jakarta Sans 700, 10px, letter-spacing 0.14em, color hsl(var(--primary)), margin-bottom 14px
H3: DM Serif Display 400 normal, 24px, margin-bottom 10px
Text: Plus Jakarta Sans 400, 15px, line-height 1.75, color hsl(var(--foreground-muted))
```

Steps:

**Step 1:**
Label: "Step 01"
Heading: "Book a Free 20-Minute Call"
Text: "We start with a relaxed, no-obligation phone call. You share what's brought you here; I explain how I work. No forms, no pressure — just a conversation."

**Step 2:**
Label: "Step 02"
Heading: "We Meet Weekly"
Text: "Sessions are 50 minutes, held weekly — in person in central London or via secure video. We go at your pace, building a consistent space that's entirely yours."

**Step 3:**
Label: "Step 03"
Heading: "You Build Tools That Last"
Text: "Therapy isn't forever. The goal is to give you frameworks, insights, and skills that outlast our sessions — so you leave more resilient than you arrived."

Connecting line between steps on desktop:
```css
/* pseudo-element on each step except last */
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 24px;
  right: -24px;
  width: 48px;
  height: 1px;
  background: hsl(var(--sand));
}
```

---

### Section 5 — About Dr. Sarah

```
Section: py-24 md:py-32, background: hsl(var(--background))
Container: max-w-5xl mx-auto px-6 md:px-12
Layout: grid grid-cols-1 md:grid-cols-2 gap-16 items-center
```

**Left — Portrait photography:**
```
aspect-ratio: 4/5
overflow: hidden
max-width: 440px
```
```jsx
{/* Image: Professional female therapist portrait — warm natural light, soft smile, approachable expression. She sits at ease near a window with a large leafy plant visible behind her. Linen blouse. Shot on 85mm, shallow depth of field, warm skin tones, light plaster wall background. Feels like a calm, welcoming workspace. */}
<img
  src=""
  alt="Dr. Sarah Holloway — Clarity Therapy"
  className="w-full h-full object-cover object-center"
/>
```

**Right — Bio content:**
- Label: "ABOUT YOUR THERAPIST" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, color hsl(var(--primary)), margin-bottom 16px
- H2: "Dr. Sarah Holloway" — DM Serif Display 400 italic, clamp(28px,3.5vw,48px), margin-bottom 24px
- Bio paragraph 1 (Plus Jakarta Sans 400, 16px, line-height 1.8, color hsl(var(--foreground-muted))):
  "I've been a therapist for over ten years, and in that time I've sat with a lot of different kinds of pain — anxiety that won't quieten, relationships that have lost their thread, lives that feel somehow off-course. What I've learned is that the most important thing isn't technique or theory. It's feeling genuinely heard."
- Bio paragraph 2 (margin-top 16px):
  "My approach draws on psychodynamic principles, CBT, and — where it fits — EMDR for trauma. But mostly, I believe in the relationship we build together. I'm warm, direct, and I don't do false optimism. If you're ready to do the work, I'll be right there with you."

- Credentials (flex-wrap, gap-2, margin-top 28px):
  Each as a `<span>` badge:
  ```
  display: inline-flex
  align-items: center
  padding: 6px 14px
  background: hsl(var(--surface-tinted))
  border: 1px solid hsl(var(--sand))
  font-family: Plus Jakarta Sans
  font-weight: 600
  font-size: 12px
  letter-spacing: 0.04em
  color: hsl(var(--primary))
  border-radius: 0
  ```
  Badges: `BACP Accredited` / `PG Dip Counselling` / `10+ Years Practice` / `EMDR Trained` / `CBT Practitioner`

---

### Section 6 — Fees & Insurance

```
Section: py-24 md:py-32, background: hsl(var(--surface-tinted))
Container: max-w-3xl mx-auto px-6 md:px-12 text-center
```

- Label: "FEES" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, color hsl(var(--primary)), margin-bottom 12px
- H2: "Transparent Pricing, No Surprises" — DM Serif Display italic, clamp(28px,3vw,48px)
- Subtext: "All sessions are conducted in confidence. I do not work with insurance panels directly, but can provide receipts for reimbursement." — Plus Jakarta Sans 300, 16px, color hsl(var(--foreground-muted)), margin-top 12px, margin-bottom 48px

**Fees table:**
```
width: 100%
border: 1px solid hsl(var(--border))
```

Table header row: `background: hsl(var(--primary))`, white text, Plus Jakarta Sans 700, 13px, letter-spacing 0.06em

| Session Type | Duration | Fee |
|---|---|---|
| Free Introductory Call | 20 min | FREE |
| Individual Session | 50 min | £80 |
| Couples / Relationship Session | 50 min | £100 |
| Sliding Scale (low income) | 50 min | From £55 |

Each row: `border-bottom: 1px solid hsl(var(--border-muted))`, `padding: 16px 20px`, alternating background `hsl(var(--surface))` / `hsl(var(--background))`.
Fee column: DM Serif Display 400 normal, 20px, color hsl(var(--primary)), text-right.

**Note below table** (margin-top 24px):
```
background: hsl(var(--sand-light))
border-left: 3px solid hsl(var(--sand))
padding: 16px 20px
text-align: left
```
"Sliding scale spaces are limited but I believe cost should not be a barrier to getting support. Please reach out and we'll find something that works for your situation." — Plus Jakarta Sans 400, 14px, color hsl(var(--foreground-muted))

---

### Section 7 — Testimonials

```
Section: py-24 md:py-32, background: hsl(var(--background))
Container: max-w-5xl mx-auto px-6 md:px-12
```

- Label: "WHAT CLIENTS SAY" — centered, Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, color hsl(var(--primary)), margin-bottom 16px
- H2: "Words from the People I Work With" — DM Serif Display italic, centered, clamp(28px,3.5vw,48px), margin-bottom 56px

**3-card grid:** `grid grid-cols-1 md:grid-cols-3 gap-6`

Each card:
```
background: hsl(var(--surface-tinted))
border-left: 3px solid hsl(var(--sand))
padding: 32px
```

Card structure:
- Opening quote mark: DM Serif Display 400 italic, 60px, `color: hsl(var(--sand))`, line-height 0, margin-bottom 20px
- Quote text: Plus Jakarta Sans 300, 15px, line-height 1.85, `color: hsl(var(--foreground))`, font-style: italic
- Attribution: Plus Jakarta Sans 600, 12px, letter-spacing 0.06em, color hsl(var(--foreground-muted)), margin-top 24px

**Testimonials:**

Quote 1:
"I'd tried therapy twice before and never stuck with it. With Sarah, something clicked from the second session. She has this way of reflecting things back that makes you see yourself without judgment. Six months in, my relationship with anxiety is genuinely different."
— Anonymous, 34

Quote 2:
"After my burnout I honestly didn't think I'd go back to work. Clarity Therapy didn't just help me recover — it helped me figure out why I'd ended up there in the first place. That's the part that's changed everything."
— Anonymous, 41

Quote 3:
"The grief after my marriage ended was like nothing I expected. I didn't want tips or exercises — I needed someone to just sit with me in it. Sarah did that, and eventually helped me find my way out. I'm really grateful."
— Anonymous, 29

---

### Section 8 — Booking CTA

```
Section: py-28 md:py-40
Background: hsl(var(--primary)) — sage teal #3d7a72
Position: relative, overflow: hidden
```

Subtle texture: rotated large "C" letterform from DM Serif Display, `position: absolute, right: -60px, bottom: -40px, font-size: 480px, opacity: 0.05, color: white, pointer-events: none, user-select: none, line-height: 1`

Container: `max-w-3xl mx-auto px-6 text-center`

- Label: "TAKE THE FIRST STEP" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsla(0,0%,100%,0.6)`, margin-bottom 16px
- H2: "Ready to Begin?" — DM Serif Display 400 italic, `clamp(36px,5vw,80px)`, white, line-height 1.1
- Subtext: "Your first session is completely free. No commitment, no paperwork, no pressure — just a conversation." — Plus Jakarta Sans 300, `clamp(16px,1.4vw,20px)`, `color: hsla(0,0%,100%,0.75)`, margin-top 16px, margin-bottom 40px, max-width 520px, mx-auto

**Email capture row** (`flex gap-0 max-w-md mx-auto`):
```jsx
<input
  type="email"
  placeholder="Your email address"
  className="flex-1 px-5 py-4 text-sm font-medium bg-white text-foreground border-0 outline-none rounded-none"
  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
/>
<button
  className="px-6 py-4 text-sm font-semibold tracking-wide rounded-none"
  style={{
    background: 'hsl(var(--sand))',
    color: 'hsl(var(--sand-foreground))',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '0.04em'
  }}
>
  Book Free Session
</button>
```

Note below: "Or email directly: hello@claritytherapy.co.uk" — Plus Jakarta Sans 400, 14px, `color: hsla(0,0%,100%,0.55)`, margin-top 20px

**Section entrance animation:**
```jsx
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-100px" }}
transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
```

---

### Section 9 — Footer

```
Section: py-16
Background: hsl(var(--foreground)) — warm near-black
Color: hsla(0,0%,100%,0.7)
```

**3-column grid** (gap-12):

**Column 1 — Brand:**
- Logo: "Clarity Therapy" (same style as nav but white)
- "A warm, private practice for individuals navigating anxiety, burnout, and life's harder seasons." — Plus Jakarta Sans 300, 14px, line-height 1.75, color hsla(0,0%,100%,0.55), margin-top 12px
- BACP placeholder: `[BACP Accredited Logo]` — small badge, white at 40% opacity, margin-top 20px

**Column 2 — Practice:**
Heading: "PRACTICE" — Plus Jakarta Sans 700, 10px, letter-spacing 0.14em, color hsl(var(--sand)), margin-bottom 16px
Links (Plus Jakarta Sans 400, 14px, color hsla(0,0%,100%,0.6), hover: white, block, margin-bottom 10px):
- How I Work
- Areas of Support
- Fees
- Book a Session
- Privacy & Confidentiality

**Column 3 — Contact:**
Heading: "CONTACT" — same style
Info:
- "Clarity Therapy"
- "24 Harley Mews, London W1G 9PQ"
- "hello@claritytherapy.co.uk"
- "+44 (0)20 7946 0823"
- Mon–Fri: 8am–7pm
- Sat: 9am–1pm

**Bottom bar** (border-top: 1px solid hsla(0,0%,100%,0.1), margin-top 48px, padding-top 24px, flex between):
- "© 2025 Clarity Therapy. All rights reserved." — 13px
- "Registered with BACP · Member No. 000000" — 13px

---

## 7. Animations — Complete Reference

| Element | Initial | Animate/WhileInView | Transition |
|---|---|---|---|
| Nav logo + links | `{ opacity: 0, y: -8 }` | `{ opacity: 1, y: 0 }` | `duration: 0.4, delay: 0.1` |
| Hero eyebrow | `{ opacity: 0, y: 12 }` | `{ opacity: 1, y: 0 }` | `duration: 0.5, delay: 0.1` |
| Hero H1 | `{ opacity: 0, y: 20 }` | `{ opacity: 1, y: 0 }` | `duration: 0.65, delay: 0.2, ease:[0.22,1,0.36,1]` |
| Hero subheadline | `{ opacity: 0, y: 16 }` | `{ opacity: 1, y: 0 }` | `duration: 0.55, delay: 0.35` |
| Hero CTAs | `{ opacity: 0, y: 12 }` | `{ opacity: 1, y: 0 }` | `duration: 0.5, delay: 0.45` |
| Free session card | `{ opacity: 0, scale: 0.92, y: 10 }` | `{ opacity: 1, scale: 1, y: 0 }` | `type:"spring", stiffness:220, damping:24, delay:0.55` |
| Card float (infinite) | — | `{ y: [0,-5,0] }` | `duration:3.8, repeat:Infinity, ease:"easeInOut", delay:1.2` |
| Area cards (stagger) | `{ opacity: 0, y: 20 }` | `{ opacity: 1, y: 0 }` | `staggerChildren: 0.10, duration: 0.55, ease:[0.22,1,0.36,1]` |
| Process steps | `{ opacity: 0, y: 24 }` | `{ opacity: 1, y: 0 }` | `staggerChildren: 0.12, duration: 0.6` |
| About section | `{ opacity: 0, x: -20 }` (left) / `{ opacity: 0, x: 20 }` (right) | `{ opacity: 1, x: 0 }` | `duration: 0.7, ease:[0.22,1,0.36,1]` |
| Testimonial cards | `{ opacity: 0, y: 20 }` | `{ opacity: 1, y: 0 }` | `staggerChildren: 0.10, duration: 0.55` |
| CTA section | `{ opacity: 0, y: 30 }` | `{ opacity: 1, y: 0 }` | `duration: 0.7, ease:[0.22,1,0.36,1]` |

---

## 8. Responsive Behaviour

### Desktop (≥1024px)
- Hero: true side-by-side split, left 48% / right 52%, both full viewport height
- Areas grid: 2 columns
- Process steps: 3-column horizontal
- About: 2-column (portrait + bio)
- Testimonials: 3-column

### Tablet (768px–1023px)
- Hero: left panel takes 55% width, right shrinks to 45%, hero height 80vh minimum
- Areas grid: 2 columns
- Process steps: stacked vertically (connecting line hidden)
- About: stacked (portrait above, bio below), portrait capped at 360px height

### Mobile (<768px)
- Navbar: hamburger menu, slide-down overlay
- Hero: photo becomes background behind left panel; left panel gets `background: hsl(var(--background))` at 90% opacity + `backdrop-blur-sm` instead of CSS gradient approach; photo height 65vh
- All grids: 1 column
- Free session card: full width on mobile
- Table: horizontal scroll wrapper
- Footer: 1 column stacked

---

## 9. Full Copy

### Navigation
Logo: `Clarity Therapy`
Links: `How I Work` · `Areas of Support` · `About` · `Fees` · `Contact`
CTA Button: `Book Free Session`

### Hero
Eyebrow: `INDIVIDUAL THERAPY · LONDON`
H1: `You Don't Have to Figure This Out Alone.`
Subheadline: `Individual therapy for anxiety, burnout, relationships, and life transitions.`
Primary CTA: `Book Free Session`
Secondary CTA: `Learn How I Work →`
Card label: `FIRST SESSION FREE`
Card body: `Try a 50-minute introductory session at no cost — no commitment required.`
Card link: `Book your free session →`

### Areas of Support
Section label: `AREAS OF SUPPORT`
H2: `What We Can Work Through Together`

**Anxiety & Stress:** Persistent worry, panic, overwhelm — these aren't character flaws. Together we'll find what drives your anxiety and build lasting strategies to reclaim your calm.

**Relationship Difficulties:** Whether it's communication breakdowns, trust issues, or patterns that keep repeating, therapy can help you understand what you bring to your relationships — and change it.

**Burnout & Life Transitions:** Career change, loss of identity, exhaustion that sleep won't fix — I work with people navigating the in-between spaces where old maps no longer apply.

**Grief & Loss:** Grief doesn't run on a timeline and it isn't only about death. Whether you're mourning a person, a relationship, or a version of yourself — this is a space to feel it fully.

### How Sessions Work
Section label: `THE PROCESS`
H2: `Simple, Structured, and at Your Pace`

Step 01: `Book a Free 20-Minute Call` — We start with a relaxed, no-obligation phone call. You share what's brought you here; I explain how I work. No forms, no pressure — just a conversation.
Step 02: `We Meet Weekly` — Sessions are 50 minutes, held weekly — in person in central London or via secure video. We go at your pace, building a consistent space that's entirely yours.
Step 03: `You Build Tools That Last` — Therapy isn't forever. The goal is to give you frameworks, insights, and skills that outlast our sessions — so you leave more resilient than you arrived.

### About
Section label: `ABOUT YOUR THERAPIST`
H2: `Dr. Sarah Holloway`

Para 1: I've been a therapist for over ten years, and in that time I've sat with a lot of different kinds of pain — anxiety that won't quieten, relationships that have lost their thread, lives that feel somehow off-course. What I've learned is that the most important thing isn't technique or theory. It's feeling genuinely heard.

Para 2: My approach draws on psychodynamic principles, CBT, and — where it fits — EMDR for trauma. But mostly, I believe in the relationship we build together. I'm warm, direct, and I don't do false optimism. If you're ready to do the work, I'll be right there with you.

Credentials: `BACP Accredited` · `PG Dip Counselling` · `10+ Years Practice` · `EMDR Trained` · `CBT Practitioner`

### Fees
Section label: `FEES`
H2: `Transparent Pricing, No Surprises`
Subtext: All sessions are conducted in confidence. I do not work with insurance panels directly, but can provide receipts for reimbursement.

| Session | Duration | Price |
|---|---|---|
| Free Introductory Call | 20 min | FREE |
| Individual Session | 50 min | £80 |
| Couples / Relationship Session | 50 min | £100 |
| Sliding Scale (low income) | 50 min | From £55 |

Note: Sliding scale spaces are limited but I believe cost should not be a barrier to getting support. Please reach out and we'll find something that works for your situation.

### Testimonials
Section label: `WHAT CLIENTS SAY`
H2: `Words from the People I Work With`

Quote 1: "I'd tried therapy twice before and never stuck with it. With Sarah, something clicked from the second session. She has this way of reflecting things back that makes you see yourself without judgment. Six months in, my relationship with anxiety is genuinely different." — Anonymous, 34

Quote 2: "After my burnout I honestly didn't think I'd go back to work. Clarity Therapy didn't just help me recover — it helped me figure out why I'd ended up there in the first place. That's the part that's changed everything." — Anonymous, 41

Quote 3: "The grief after my marriage ended was like nothing I expected. I didn't want tips or exercises — I needed someone to just sit with me in it. Sarah did that, and eventually helped me find my way out. I'm really grateful." — Anonymous, 29

### Booking CTA
Section label: `TAKE THE FIRST STEP`
H2: `Ready to Begin?`
Body: Your first session is completely free. No commitment, no paperwork, no pressure — just a conversation.
Input placeholder: `Your email address`
Button: `Book Free Session`
Link note: `Or email directly: hello@claritytherapy.co.uk`

### Footer
Tagline: A warm, private practice for individuals navigating anxiety, burnout, and life's harder seasons.

Column headings: `PRACTICE` / `CONTACT`

Practice links: How I Work · Areas of Support · Fees · Book a Session · Privacy & Confidentiality

Contact: Clarity Therapy · 24 Harley Mews, London W1G 9PQ · hello@claritytherapy.co.uk · +44 (0)20 7946 0823 · Mon–Fri: 8am–7pm · Sat: 9am–1pm

Bottom bar: © 2025 Clarity Therapy. All rights reserved. · Registered with BACP · Member No. 000000

---

## 10. Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "latest",
    "postcss": "latest"
  }
}
```

**shadcn/ui components to install:**
```bash
npx shadcn@latest add button input badge card
```

**Tailwind config additions:**
```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      sand: 'hsl(var(--sand))',
      surface: 'hsl(var(--surface))',
    },
    fontFamily: {
      serif: ['"DM Serif Display"', 'serif'],
      sans: ['"Plus Jakarta Sans"', 'sans-serif'],
    },
  },
}
```
