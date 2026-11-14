# Nutritionist & Health Coach Website Prompt
# websiteprompts.ai

---

Build a complete nutritionist and health coach website for **Clara Bloom** — a certified nutritionist and wellness coach. Clean white foundation, fresh green accent, split hero layout. Professional and warm — this is a personal practice, not a clinic. The design should feel like the nutritionist herself: confident, approachable, and grounded in science. Think a modern health brand crossed with a personal coach's site — not a hospital, not a wellness influencer.

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## Design System

```css
:root {
  --background: 0 0% 100%;              /* #ffffff white */
  --surface: 120 20% 97%;               /* #f6faf5 green-tint surface */
  --surface-raised: 120 16% 94%;        /* #edf5ec slightly deeper */
  --border: 120 14% 86%;                /* #dce8dc green-tinted border */
  --foreground: 123 20% 7%;             /* #0c170c deep green-black */
  --muted-foreground: 122 7% 45%;       /* #6b7d6b muted green-grey */
  --subtle: 120 6% 68%;                 /* #a8b4a8 subtle */
  --primary: 140 55% 38%;               /* #2d9a4e fresh green */
  --primary-dark: 140 61% 29%;          /* #1e7a3c dark green hover */
  --primary-light: 140 50% 93%;         /* #edf7ed green tint bg */
  --primary-muted: 140 36% 78%;         /* #a8d4b4 green border */
  --dark-green: 124 32% 9%;             /* #0c1f0e hero dark bg */
  --dark-surface: 124 28% 12%;          /* #122018 dark card */
  --dark-border: 124 22% 19%;           /* #243028 dark border */
  --white: 0 0% 100%;
}
```

---

## Typography

Import: `https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap`

- **Display / H1–H2**: Sora 800, letter-spacing -0.04em, line-height 1.06–1.10
- **Subheadings / H3**: Sora 700, letter-spacing -0.02em
- **Body / UI**: Sora 300–500
- **Labels / Tags / Prices**: JetBrains Mono 400, uppercase, letter-spacing 0.10–0.18em, color muted

---

## Visual Effects

### 1. Floating cards entrance

Two floating cards in the hero right panel animate in after the photo loads:
```
Card 1 (bottom-left):
initial={{ opacity: 0, x: -24, y: 16 }}
animate={{ opacity: 1, x: 0, y: 0 }}
transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}

Card 2 (top-right):
initial={{ opacity: 0, x: 24, y: -16 }}
animate={{ opacity: 1, x: 0, y: 0 }}
transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
```

After entering, both cards have a subtle idle float:
```css
@keyframes float-a {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
@keyframes float-b {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-7px); }
}
.card-1 { animation: float-a 5s ease-in-out infinite; }
.card-2 { animation: float-b 6s ease-in-out infinite 0.5s; }
```

### 2. Staggered content entrance — hero left

```
Tag line: initial={{ opacity: 0, y: 20 }} → animate, delay 0.1s
H1 each word group: initial={{ opacity: 0, y: 28 }} → animate, stagger 0.12s
Sub: delay 0.45s
CTAs: delay 0.6s
Proof stats: delay 0.75s
All: duration 0.55s, ease 'easeOut'
```

### 3. Scroll section reveals

All sections:
```
initial={{ opacity: 0, y: 32 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
Trigger: useInView, once: true, margin: '-70px'
Stagger children: delay index * 0.10
```

### 4. Process step count-up

Process section numbers (01–04) animate from 0 when section enters view:
```
useSpring from 0 to target, duration 800ms
Triggered by IntersectionObserver
```

### 5. Card hover lift — services + testimonials

```css
transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
&:hover {
  transform: translateY(-3px);
  border-color: hsl(var(--primary));
  box-shadow: 0 12px 32px rgba(45, 154, 78, 0.10);
}
```

### 6. Green accent line reveal

Before section headings:
```
A 24px × 2px green line:
initial={{ scaleX: 0, transformOrigin: 'left' }}
animate={{ scaleX: 1 }}
transition={{ duration: 0.45s, ease: 'easeOut' }}
```

---

## Section Breakdown

### Section 1 — Navbar (sticky)

Fixed top. `background: rgba(255,255,255,0.97)`, `backdrop-filter: blur(12px)`, `border-bottom: 1px solid hsl(var(--border))`. Padding 16px 60px.

**Left — brand**:
- Leaf icon: 28×28px, `background: hsl(var(--primary))`, border-radius 7px, centered 🌿 emoji or leaf SVG (lucide `Leaf`), color white, font-size 14px.
- "Clara Bloom" — Sora 700 15px, letter-spacing -0.02em, color foreground. Gap 10px between icon and text.

**Center links**: Services · About · Results · Blog — Sora 13px weight 400, color muted-foreground. On hover: color foreground.

**Right**: "Book free call" — `background: hsl(var(--primary))`, color white, Sora 13px weight 600, padding 10px 22px, border-radius 7px. On hover: `background: hsl(var(--primary-dark))`.

Mobile: Hamburger → full-screen white overlay, all links stacked, "Book free call" full-width green button at bottom.

---

### Section 2 — Hero (split panel)

`display: grid`, `grid-template-columns: 1fr 1fr`, `min-height: 100vh`, `padding-top: 72px`.

**Left panel** (`background: hsl(var(--background))`, padding 80px 60px, `display: flex`, `flex-direction: column`, `justify-content: center`):

- Tag: Green accent line (24px × 2px) + "Certified nutritionist & health coach" — JetBrains Mono 9px uppercase letter-spacing 0.18em color primary. `display: flex`, gap 10px, align-items center. Margin-bottom 28px.

- H1 with stagger entrance: Sora 800, clamp(40px, 5vw, 64px), line-height 1.08, letter-spacing -0.04em, margin-bottom 22px. Three lines:
  - "Your food."
  - "Your *rules.*" — "rules." in `color: hsl(var(--primary))`
  - "Your results."

- Sub: "I help busy people build a healthy relationship with food — without restriction, calorie counting, or giving up the things you love." — Sora 15px weight 300, color muted-foreground, line-height 1.85, max-width 420px, margin-bottom 40px.

- CTA row, `display: flex`, gap 10px, margin-bottom 48px:
  - Primary: "Book a free 30-min call" — `background: hsl(var(--primary))`, white, Sora 13px weight 600, padding 13px 26px, border-radius 8px. On hover: primary-dark.
  - Ghost: "See my services" — `border: 1.5px solid hsl(var(--border))`, color foreground, background none, same padding. On hover: border-color foreground.

- Proof stats row, `display: flex`, gap 32px:
  - "500+" / "Clients helped"
  - "8 yrs" / "Experience"
  - "4.9★" / "Average rating"
  
  Each: number in Sora 800 24px letter-spacing -0.04em foreground, label in Sora 300 11px muted, gap 3px, flex-direction column.

**Right panel** (`background: hsl(var(--surface))`, position relative, overflow hidden):

Photo (absolute inset, object-cover object-center):
```
{/* Image: confident smiling female nutritionist or wellness coach in a bright modern kitchen, natural window light, holding a bowl of colourful whole foods — berries, greens, avocado — warm and approachable professional portrait */}
<img
  src=""
  alt="Clara Bloom, certified nutritionist, holding a bowl of colourful whole foods"
  className="absolute inset-0 w-full h-full object-cover object-center"
/>
```

Gradient overlay (composition-independent):
```css
background: linear-gradient(
  to bottom,
  rgba(246,250,245,0.1) 0%,
  rgba(246,250,245,0.15) 60%,
  rgba(246,250,245,0.55) 100%
);
```

**Floating card 1** (bottom-left, see Visual Effects for float animation):
Position absolute, bottom 80px, left 24px. White bg, border-radius 12px, `box-shadow: 0 12px 40px rgba(12,23,12,0.13)`, padding 14px 18px, min-width 190px.

Card structure:
- Header: "This week's plan" — JetBrains Mono 9px uppercase letter-spacing 0.08em muted, margin-bottom 8px
- Title: "Anti-inflammatory" — Sora 700 13px foreground
- Status row: green checkmark circle (14×14px, `background: hsl(var(--primary-light))`, `border-radius: 50%`, "✓" in green) + "Day 4 of 7 complete" in Sora 12px muted. Gap 6px.

**Floating card 2** (top-right):
Position absolute, top 80px, right 24px. White bg, border-radius 12px, `box-shadow: 0 12px 40px rgba(12,23,12,0.13)`, padding 16px 18px.

Card structure:
- Stars: "★★★★★" — green, font-size 12px, letter-spacing 2px, margin-bottom 8px
- Quote: `"Lost 8kg in 12 weeks without feeling deprived once."` — Sora 300 12px foreground, line-height 1.55, max-width 170px
- Attribution: "— Sarah M." — JetBrains Mono 9px muted, margin-top 8px

---

### Section 3 — Social proof strip

Full-width, `background: hsl(var(--surface))`, `border-top: 1px solid hsl(var(--border))`, `border-bottom: 1px solid hsl(var(--border))`, padding 18px 60px.

`display: flex`, justify-between, align-items center.

Left: "Trusted by 500+ clients across the UK" — Sora 13px weight 500 foreground. Prefix dot in green.

Right: star rating display + publication mentions. `display: flex`, gap 32px, align-items center.

- Rating: "★★★★★ 4.9 — Google Reviews" — stars in green, text in JetBrains Mono 10px muted
- Divider: 1px vertical border, height 20px
- "As featured in:" + mention names (Healthline · Women's Health · The Telegraph) — JetBrains Mono 9px muted, opacity 0.5

---

### Section 4 — How it works (dark green section)

`background: hsl(var(--dark-green))`, padding 96px 60px. Light text on dark green.

**Header** (max-width 560px, margin-bottom 64px):
- Green accent line (on dark: use `hsl(var(--primary))`)
- Tag above h2: "How it works" — JetBrains Mono 9px uppercase letter-spacing 0.18em color primary, margin-bottom 16px
- H2: Sora 800, clamp(36px, 4vw, 52px), letter-spacing -0.04em, line-height 1.08, color white. "From first call to *lasting results.*" — "lasting results." in `color: hsl(var(--primary))`

**4-step grid**: `display: grid`, `grid-template-columns: repeat(4, 1fr)`, gap 0, `border: 1px solid hsl(var(--dark-border))`. Stagger fade-up on scroll.

Each step (padding 32px 28px, `border-right: 1px solid hsl(var(--dark-border))`, last child no border-right):
- Step number: Sora 800 clamp(36px,4vw,48px), `color: rgba(255,255,255,0.07)`, line-height 1, margin-bottom 20px. Count-up animation.
- Step name: Sora 600 15px, color white, margin-bottom 10px
- Description: Sora 300 13px, `color: rgba(255,255,255,0.45)`, line-height 1.75

Four steps:
1. **Free intro call** — "30 minutes. We talk about your goals, health history, and lifestyle — and whether I'm the right fit. No obligation, no pressure."
2. **Full assessment** — "An intake form, food diary review, and optional bloodwork analysis. I learn everything about your current baseline before making a single recommendation."
3. **Your personal plan** — "A fully personalised nutrition plan, meal ideas, and practical strategies designed for your specific goals and real life. Delivered within 5 working days."
4. **Ongoing support** — "Weekly check-ins, plan adjustments as you progress, and direct messaging access between sessions. You're never left to figure it out alone."

**Bottom row below grid** (margin-top 32px, `display: flex`, justify-center):
- "Start with a free call →" — Sora 13px weight 600, `background: hsl(var(--primary))`, white, padding 13px 28px, border-radius 8px. On hover: primary-dark.

---

### Section 5 — Services / Programmes

`background: hsl(var(--surface))`, `border-top: 1px solid hsl(var(--border))`, padding 96px 60px.

**Header** (`display: grid`, `grid-template-columns: 1fr 1fr`, gap 80px, align-items end, margin-bottom 56px):
- Left: H2 Sora 800, clamp(36px, 4vw, 52px), "Choose your *path.*" — "path." in primary.
- Right: "All programmes include a personalised nutrition plan, weekly check-ins, and direct messaging support between sessions." — Sora 300 14px muted, line-height 1.8.

**Cards grid**: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, gap 16px. Centre card is the featured "Most popular" option — slightly elevated with green border.

Each card: `background: hsl(var(--background))`, `border: 1.5px solid hsl(var(--border))`, border-radius 14px, padding 32px. Hover lift animation.

Featured (middle) card additional styles: `border-color: hsl(var(--primary))`, `box-shadow: 0 8px 32px rgba(45,154,78,0.12)`. Has a "Most popular" badge: `background: hsl(var(--primary-light))`, `color: hsl(var(--primary))`, JetBrains Mono 9px uppercase, padding 4px 10px, border-radius 4px, display inline-block, margin-bottom 16px.

Three programmes:

**Kickstart — 4 weeks**
- Tag: "Getting started"
- Description: "A focused 4-week programme to reset your habits, understand your body's signals, and build a nutritional foundation you can actually sustain."
- Includes (checklist, 4 items): Full initial assessment · Personalised 4-week meal plan · 2 × video check-ins · WhatsApp support
- Price: "from £320" — JetBrains Mono 12px primary, margin-top 20px, padding-top 16px, border-top 1px border
- CTA: "Book Kickstart →" — text link, Sora 12px weight 600 primary

**Transform — 12 weeks** (featured)
- "Most popular" badge
- Tag: "Full transformation"
- Description: "The complete programme. Comprehensive assessment, personalised 12-week nutrition plan, weekly video calls, bloodwork review, and unlimited messaging throughout."
- Includes (6 items): Full health & bloodwork assessment · Week-by-week nutrition plan · 12 × weekly video sessions · Recipe bank & meal ideas · Restaurant & social guide · Unlimited WhatsApp support
- Price: "from £840" — same style
- CTA: "Book Transform →" — full-width green button

**Ongoing Coaching — Monthly**
- Tag: "Already a client"
- Description: "For graduates of Transform who want to keep progressing. Two sessions per month, regular plan updates, and continued accountability as your life evolves."
- Includes: 2 × monthly sessions · Plan refresh each quarter · Ongoing messaging support · Priority booking
- Price: "from £180/mo"
- CTA: "Book ongoing →"

---

### Section 6 — Results / Testimonials

`background: hsl(var(--background))`, `border-top: 1px solid hsl(var(--border))`, padding 96px 60px.

**Header** (center, max-width 560px, margin 0 auto 56px):
Green accent line (centered, `transformOrigin: center`).
H2: Sora 800, clamp(36px, 4vw, 52px): "Real people. *Real results.*"
Sub: Sora 300 15px muted, margin-top 14px: "Not before/after photos — actual transformations in how people eat, feel, and live."

**Testimonial grid**: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, gap 20px. Stagger fade-up.

Each testimonial card (`background: hsl(var(--surface))`, `border: 1.5px solid hsl(var(--border))`, border-radius 14px, padding 28px):
- Stars: "★★★★★" — `color: hsl(var(--primary))`, font-size 13px, letter-spacing 2px, margin-bottom 14px
- Result stat: large pull-quote number + short label. E.g. "−8 kg" in Sora 800 32px letter-spacing -0.05em primary, "in 12 weeks" in Sora 300 13px muted. Margin-bottom 14px.
- Quote: Sora 300 14px foreground, line-height 1.8, margin-bottom 20px
- Client: avatar circle (36×36px, `background: hsl(var(--surface-raised))`, border-radius 50%, initial letter centered in Sora 700 14px primary) + name (Sora 500 13px foreground) + programme (JetBrains Mono 9px uppercase muted). Display flex, gap 10px, align-items center.

Six testimonials (2 rows of 3):

1. **−8 kg in 12 weeks** — "After years of yo-yo dieting, Clara helped me understand *why* I was making the choices I was making. The weight loss almost happened by itself once that clicked." — Sarah M. · Transform programme

2. **Energy restored** — "I was exhausted all the time and assumed it was just life with two kids. Within 6 weeks of following Clara's plan, I had energy I hadn't felt since my twenties." — James T. · Kickstart

3. **Cholesterol down 22%** — "My GP had been worried about my cholesterol for two years. Three months with Clara and it was back in the healthy range. No medication needed." — Priya K. · Transform

4. **−5 kg + kept it off 18 months** — "I've kept the weight off for a year and a half now. That's never happened before. The plan actually works in real life." — Emma R. · Ongoing Coaching

5. **Cleared 10-year IBS** — "I'd had IBS for a decade and been told it was just something I had to live with. Clara identified three specific triggers in my first week. I wish I'd done this sooner." — Tom F. · Transform

6. **First healthy relationship with food** — "I've been calorie counting since I was 16. Clara's approach was the opposite of everything I thought I knew — and the first thing that's actually worked." — Amara N. · Transform

**Below grid** (margin-top 40px, center): "Read all 200+ reviews →" — Sora 12px weight 500, `border: 1px solid hsl(var(--border))`, padding 10px 24px, border-radius 8px, color muted. On hover: border-color foreground, color foreground.

---

### Section 7 — About Clara

`background: hsl(var(--surface))`, `border-top: 1px solid hsl(var(--border))`, padding 96px 60px. `display: grid`, `grid-template-columns: 1fr 1fr`, gap 80px, align-items center.

**Left — photo:**

`border-radius: 14px`, overflow hidden, aspect-ratio 4/5, border `1.5px solid hsl(var(--border))`.
```
{/* Image: friendly professional portrait of female nutritionist in a bright modern setting, warm natural light, confident and approachable, clean background — clinic, kitchen, or garden setting */}
<img src="" alt="Clara Bloom, certified nutritionist" className="w-full h-full object-cover object-center" />
```

Green badge overlaid (absolute bottom-left of photo container, margin 16px):
- White card, border-radius 8px, padding 10px 14px, box-shadow
- "🌿 Certified by BANT & CNHC" — JetBrains Mono 9px muted

**Right — bio (flex column, gap 24px, justify-content center):**

Green accent line. Tag: "About Clara" — JetBrains Mono 9px uppercase letter-spacing 0.16em primary.
H2: Sora 800, clamp(32px, 3.5vw, 44px), letter-spacing -0.04em: "Food should work *for you.* Not against you."

Two bio paragraphs (Sora 300 15px muted line-height 1.9):
1. "I'm a registered nutritionist with a BSc in Nutritional Science and a Masters in Clinical Nutrition. I've been working with private clients for 8 years — helping people untangle complicated relationships with food and build something that actually lasts."
2. "My approach is rooted in the science, but delivered in plain English. I don't believe in perfection. I believe in progress — and in finding an approach that fits your life, not the other way round."

Credentials row (margin-top 8px, `display: flex`, gap 12px, flex-wrap wrap):
Credential chips: each `background: hsl(var(--primary-light))`, `border: 1px solid hsl(var(--primary-muted))`, border-radius 100px, padding 5px 12px, JetBrains Mono 10px primary weight 600.

Chips: BSc Nutritional Science · MSc Clinical Nutrition · mBANT Registered · CNHC Accredited · 8 Years Practice

"Read my full story →" link below chips (margin-top 12px): Sora 13px weight 600 primary, border-bottom 1px primary.

---

### Section 8 — FAQ

`background: hsl(var(--background))`, `border-top: 1px solid hsl(var(--border))`, padding 80px 60px. `display: grid`, `grid-template-columns: 1fr 1fr`, gap 80px.

**Left — heading:**
Green accent line.
H2: Sora 800, clamp(32px, 3.5vw, 44px), letter-spacing -0.04em: "Questions, *answered.*"
Sub: Sora 300 14px muted line-height 1.85: "If your question isn't here, the free intro call is the best place to ask it."
"Book a free call →" button below, Sora 13px weight 600, `background: hsl(var(--primary))`, white, padding 12px 24px, border-radius 8px, margin-top 24px.

**Right — accordion** (shadcn/ui Accordion, 6 questions):

Each: full-width trigger, padding 18px 0, `border-bottom: 1px solid hsl(var(--border))`. Sora 500 14px foreground. "+" / "−" icon right-aligned in primary. Answer slides open with height animation, Sora 300 14px muted line-height 1.8.

1. **Do I need to follow a specific diet?** — No. I don't prescribe diets. Every plan is built around your preferences, intolerances, and lifestyle. The goal is to make healthier choices feel natural — not forced.

2. **How quickly will I see results?** — Most clients notice changes in energy and digestion within 2–3 weeks. More significant physical changes typically begin around week 4–6, depending on your goals and starting point.

3. **Do you work online or in person?** — Both. I see clients in person in London, and online via video call for clients anywhere in the UK and internationally. The experience is the same — just more convenient.

4. **What if I have a medical condition?** — I work alongside GPs and specialists for clients with diagnosed conditions including IBS, PCOS, thyroid disorders, diabetes, and cardiovascular concerns. I'll always flag if I think a medical referral is needed.

5. **Is the free intro call really free?** — Yes, completely. It's a 30-minute conversation — no sales pressure, no commitment. I just want to make sure I can genuinely help you before you invest.

6. **Can I spread the cost?** — Yes. All programmes of 8 weeks or longer can be paid monthly. Payment plans are available at no extra charge.

---

### Section 9 — CTA Banner

Full-width, `background: hsl(var(--primary))`, padding 80px 60px. Subtle diagonal texture:
```css
background-image: repeating-linear-gradient(
  -45deg,
  rgba(255,255,255,0.04) 0px 6px,
  transparent 6px 18px
);
```

Centered content, max-width 600px:
- H2: Sora 800 italic clamp(38px, 4.5vw, 58px), letter-spacing -0.04em, white, line-height 0.98: "Ready to change *how you eat?*"
- Sub: Sora 300 15px `rgba(255,255,255,0.72)` margin 20px 0 36px: "Book a free 30-minute intro call — no commitment, no hard sell. Just an honest conversation about whether I can help."
- Two buttons, centered, gap 12px:
  - Primary: "Book your free call" — white bg, `color: hsl(var(--primary))`, Sora 700 14px, padding 14px 32px, border-radius 9px. On hover: `background: hsl(var(--primary-light))`.
  - Ghost: "See pricing first →" — `border: 1.5px solid rgba(255,255,255,0.35)`, white text, transparent bg.
- Trust line below (margin-top 20px): JetBrains Mono 10px `rgba(255,255,255,0.5)`, flex justify-center gap 16px: "No commitment" · "Free 30-min call" · "Online & in-person" · "Cancel anytime"

---

### Section 10 — Footer

`background: hsl(var(--foreground))` (dark green-black). Padding 48px 60px 28px.

**Top grid**: `grid-template-columns: 2fr 1fr 1fr 1fr`, gap 48px.

Column 1 (Brand):
- Leaf icon (white, 24px) + "Clara Bloom" Sora 700 15px white. Gap 8px.
- "Registered nutritionist helping people build a healthier relationship with food." — Sora 300 12px `rgba(255,255,255,0.4)`, margin-top 10px, max-width 220px, line-height 1.7
- Instagram · TikTok · LinkedIn icons: 18px, `rgba(255,255,255,0.3)`, gap 14px, margin-top 18px

Column 2 (Services):
- Header: "Services" — JetBrains Mono 9px uppercase `rgba(255,255,255,0.28)`
- Links (Sora 12px `rgba(255,255,255,0.5)`, gap 9px): Kickstart Programme · Transform Programme · Ongoing Coaching · Free Intro Call

Column 3 (Info):
- Header: "Info"
- Links: About Clara · How It Works · Results · Blog · Press

Column 4 (Contact):
- Header: "Contact"
- Links: hello@clarabloom.co.uk · Book a call · Instagram DM · FAQ

**Bottom bar** (margin-top 40px, padding-top 20px, `border-top: 1px solid rgba(255,255,255,0.08)`):
- Left: "© 2026 Clara Bloom Nutrition Ltd. All rights reserved."
- Right: "Privacy Policy · Terms"
Both: JetBrains Mono 9px `rgba(255,255,255,0.25)`.

---

## Animations Summary

| Element | Animation | Trigger |
|---|---|---|
| Hero tag + H1 lines | Stagger fade-up y:28 | On mount, stagger 0.12s |
| Hero sub + CTAs | Fade-up y:20 | On mount, 0.45–0.6s |
| Hero proof stats | Fade-up y:16 | On mount, 0.75s |
| Floating card 1 | Slide in from left + float loop | On mount 0.7s |
| Floating card 2 | Slide in from right + float loop | On mount 0.9s |
| Process numbers | Count-up 0→01–04 | IntersectionObserver |
| Process steps | Stagger fade-up | Scroll inView |
| Service cards | Stagger fade-up | Scroll inView |
| Testimonial cards | Stagger fade-up | Scroll inView |
| FAQ accordion | Height 0→auto | Click |
| CTA banner | Fade-up | Scroll inView |
| Green line dividers | scaleX 0→1 | Scroll inView |

---

## Responsive

**Mobile (< 768px):**
- Nav: hamburger → full-screen white overlay, leaf icon + name at top, all links stacked, "Book free call" full-width green button at bottom
- Hero: single column, photo below content, aspect-ratio 3/4, floating cards hidden on mobile
- Social proof strip: 2-line wrap
- Process: single column vertical steps
- Services: single column cards
- Testimonials: horizontal scroll snap, one card visible
- About: single column, photo above bio
- FAQ: full-width
- CTA: single column
- Footer: single column, 2-column link grid

**Tablet (768px–1024px):**
- Hero: keep split, reduce padding to 40px
- Process: 2×2 grid
- Services: single column or 2-col
- Testimonials: 2-column grid

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.400.x",
  "@radix-ui/react-accordion": "^1.2.x"
}
```

---

## Quick notes

- Brand name is **Clara Bloom** — swap everywhere (nav, footer, meta, about copy) with a single find-replace.
- The floating cards in the hero use placeholder content (plan name, testimonial). Wire to real client data or CMS if needed, or leave as static UI.
- All prices are suggestions — update before publishing. Monthly payment plan copy in FAQ is included to reduce friction at the decision stage.
