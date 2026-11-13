# Forge — Personal Trainer / Fitness Coach Website Prompt

## 1. Goal Statement
Build a high-energy, results-driven personal trainer website for **Forge**, a fitness brand defined by near-black backgrounds, electric lime accents, and bold Space Grotesk typography that projects accountability, transformation, and athletic intensity.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(0, 0%, 3%);             /* #080808 near-black */
  --foreground: hsl(0, 0%, 98%);            /* #fafafa white */
  --primary: hsl(77, 86%, 57%);             /* #b5f030 electric lime */
  --primary-foreground: hsl(0, 0%, 3%);     /* near-black — text on lime buttons */
  --muted-foreground: hsl(0, 0%, 55%);      /* medium grey */
  --border: hsl(0, 0%, 12%);               /* very dark grey border */
  --card: hsl(0, 0%, 6%);                   /* slightly lighter card bg */
  --glow: rgba(181, 240, 48, 0.35);         /* lime glow for box-shadow */
  --glow-strong: rgba(181, 240, 48, 0.6);   /* strong lime glow */
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap" rel="stylesheet" />
```

- **H1 / hero display:** `font-family: 'Space Grotesk', sans-serif;` weight 700, letter-spacing: -0.03em, uppercase
- **H2 / section headings:** Space Grotesk 700, letter-spacing: -0.02em
- **H3 / card titles / labels:** Space Grotesk 600, letter-spacing: 0.01em
- **Body / paragraphs:** `font-family: 'Inter Tight', sans-serif;` weight 300–400, line-height: 1.7
- **UI eyebrows / tags / badges:** Space Grotesk 500, uppercase, letter-spacing: 0.12em, size: 11–13px
- **Stat numbers:** Space Grotesk 700, letter-spacing: -0.04em, electric lime color
- **Ticker / announcement text:** Space Grotesk 500, uppercase, letter-spacing: 0.08em

---

## 5. Visual Effects

### Effect 1 — Full-Screen Looping Video Hero
```jsx
<section className="relative h-screen w-full overflow-hidden">
  {/* Video: athletic male or female performing heavy barbell squat in dim gym, high contrast cinematic lighting, slow motion, chalk dust particles, intense focus expression, dark background */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover object-center z-0"
    style={{ filter: 'contrast(1.1) brightness(0.65)' }}
  />
  {/* Dark overlay with lime tint at bottom */}
  <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.1) 40%, rgba(8,8,8,0.85) 100%)' }} />
  {/* Content at z-20 */}
</section>
```

### Effect 2 — Animated Stat Counters
```tsx
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2200;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} className="text-[var(--primary)]">{prefix}{count.toLocaleString()}{suffix}</span>;
}
```

### Effect 3 — Before / After Transformation Slider
```tsx
import { useState, useRef, useCallback } from 'react';

function BeforeAfterSlider({ beforeAlt, afterAlt }: { beforeAlt: string; afterAlt: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newPos = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPosition(newPos);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] overflow-hidden select-none cursor-col-resize"
      onMouseMove={e => handleMove(e.clientX)}
      onTouchMove={e => handleMove(e.touches[0].clientX)}
    >
      {/* BEFORE image */}
      {/* Image: overweight or untrained man/woman, before photo style, neutral grey background, slightly flat lighting, casual clothes */}
      <img src="" alt={beforeAlt} className="absolute inset-0 w-full h-full object-cover object-top" />
      {/* AFTER image clipped */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        {/* Image: same person transformed, athletic build, confident posture, gym environment, professional lighting, same neutral background, dramatic improvement visible */}
        <img src="" alt={afterAlt} className="absolute inset-0 w-full h-full object-cover object-top" style={{ width: `${10000 / position}%`, maxWidth: 'none' }} />
      </div>
      {/* Drag handle */}
      <div
        className="absolute top-0 bottom-0 z-10 flex items-center justify-center"
        style={{ left: `${position}%`, transform: 'translateX(-50%)', width: '2px', background: 'var(--primary)' }}
      >
        <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 20px var(--glow-strong)' }}>
          <span className="text-black text-xs font-bold select-none">↔</span>
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-medium px-2 py-1 uppercase tracking-wider">Before</div>
      <div className="absolute top-4 right-4 bg-[var(--primary)] text-black text-xs font-bold px-2 py-1 uppercase tracking-wider">After</div>
    </div>
  );
}
```

### Effect 4 — Scrolling Ticker Strip
```tsx
<div className="overflow-hidden whitespace-nowrap border-y border-[var(--border)] py-4 bg-[var(--card)]">
  <motion.div
    animate={{ x: ['0%', '-50%'] }}
    transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
    className="inline-flex"
  >
    {[...Array(2)].map((_, i) => (
      <span key={i} className="inline-flex items-center gap-8 mr-8 text-sm font-medium tracking-widest uppercase text-[var(--foreground)]">
        <span>127 CLIENTS TRANSFORMED</span>
        <span className="text-[var(--primary)]">·</span>
        <span>4.9★ AVERAGE RATING</span>
        <span className="text-[var(--primary)]">·</span>
        <span>8 YEARS IN THE GAME</span>
        <span className="text-[var(--primary)]">·</span>
        <span>NO SHORTCUTS. EVER.</span>
        <span className="text-[var(--primary)]">·</span>
        <span>FORGE YOUR BEST SELF</span>
        <span className="text-[var(--primary)]">·</span>
      </span>
    ))}
  </motion.div>
</div>
```

### Effect 5 — Lime Green Glow on Hover Cards
```tsx
// Applied to program cards and testimonial cards
<div
  className="border border-[var(--border)] rounded-none p-6 md:p-8 transition-all duration-300"
  style={{
    background: 'var(--card)',
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
  }}
  onMouseEnter={e => {
    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px var(--glow), 0 0 60px rgba(181,240,48,0.15)';
    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(181,240,48,0.5)';
    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
  }}
  onMouseLeave={e => {
    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
  }}
>
  {/* card content */}
</div>
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- **Height:** 70px
- **Position:** `fixed top-0 left-0 right-0 z-40`
- **Background:** transparent → `rgba(8,8,8,0.95) blur(12px)` on scroll
- **Left:** "FORGE" wordmark — Space Grotesk 700, electric lime color, letter-spacing 0.1em
- **Center (desktop):** About · Programs · Results · FAQ — Inter Tight 400, 12px, uppercase, white/muted
- **Right:** "Start Today" — electric lime filled button, near-black text, Space Grotesk 600, rounded-none, hover glow
- **Mobile:** wordmark + hamburger (3 lines, lime), full-screen overlay menu

### Section 2 — Hero (Full-Screen Video)
- **Height:** 100vh
- **Background:** full-screen looping training video (Effect 1)
- **Content layout:** `absolute inset-0 z-20 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24`
- **Content:**
  - Eyebrow badge: `[ ONLINE & IN-PERSON COACHING ]` — lime text, bordered pill
  - H1: `FORGE\nYOUR\nBEST SELF` — Space Grotesk 700, white, 80px–160px responsive, line-height 0.9, letter-spacing -0.04em
  - Subline: `No shortcuts. No excuses. Just results.`
  - CTA row: "START YOUR PROGRAM" (lime filled, large) + "SEE TRANSFORMATIONS" (ghost white border)
  - Bottom scroll indicator: `↓ Scroll` in lime, animated bounce

### Section 3 — Results Ticker
- Full-width scrolling ticker (Effect 4)
- Placed directly below hero with no gap

### Section 4 — About
- **Layout:** 2-col, 45% image / 55% text on desktop; image top on mobile
- **Image:**
  ```jsx
  {/* Image: athletic male personal trainer, direct confident eye contact, gym environment, dark background, wearing Forge-branded dark t-shirt, arms crossed showing muscle, professional fitness photography, high contrast dramatic lighting */}
  <img src="" alt="Forge trainer Marcus Webb in his training facility" className="w-full h-full object-cover object-center" />
  ```
- **Text side:**
  - Eyebrow: `THE TRAINER`
  - H2: `MARCUS WEBB`
  - Sub-heading: `8 Years. 127 Clients. Zero Shortcuts.`
  - Bio paragraphs (3)
  - Credentials badges: `NASM-CPT · Precision Nutrition L2 · NSCA-CSCS · USA Weightlifting`

### Section 5 — Programs
- **Padding:** `py-24 px-6 md:px-16`
- **Eyebrow:** `WHAT I OFFER`
- **Heading:** `CHOOSE YOUR PATH`
- **Grid:** 3 cards (see Effect 5)
- **Each card:** lime top border (2px), program name (Space Grotesk 700 white), price/month, bullet list of inclusions, "Get Started →" lime link

### Section 6 — Transformations
- **Eyebrow:** `REAL RESULTS`
- **Heading:** `THE PROOF IS IN THE PROGRESS`
- **3 before/after sliders** in a row (desktop), stacked (mobile)
- **Below each slider:** client name + stats (weight lost / time with Forge)

### Section 7 — Testimonials
- **Background:** `--card`
- **4 cards** in 2x2 grid (desktop), 1-col (mobile)
- **Each card:** dark background, lime glow on hover (Effect 5), star rating (5 lime stars), quote text (Inter Tight), name + program type badge
- **Staggered entrance animation**

### Section 8 — FAQ
- **Background:** `--background`
- **Accordion items:** shadcn Accordion, borderless, each Q in Space Grotesk 500 white, A in Inter Tight 300 muted
- **Open chevron:** lime color
- **Dividers:** 1px `--border`

### Section 9 — CTA Banner
- **Full-width:** electric lime background `--primary`
- **All text near-black:** `--primary-foreground`
- **Heading:** `READY TO START?`
- **Subline:** `Your first session is a conversation. No pressure, no commitment.`
- **Button:** near-black filled, white text, hover: dark grey bg

### Section 10 — Footer
- **Background:** `#040404` (darker than bg)
- **Lime top border 2px**
- **3-col layout (desktop), stacked (mobile)**
- Col 1: FORGE wordmark (lime) + tagline
- Col 2: Quick Links
- Col 3: Socials + Instagram handle
- Bottom: © + "Built for people who show up."

---

## 7. Animations

### Hero Video Entrance
- H1 letters: `initial={{ opacity: 0, y: 60 }}` → `animate={{ opacity: 1, y: 0 }}`
- Stagger: 0.05s per character using split text approach, delay: 0.5s
- Duration: 0.7s, ease: `[0.22, 1, 0.36, 1]`

### Hero CTA Buttons
- `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Delay: 1.0s (after headline), duration: 0.5s

### Ticker
- Linear infinite scroll, `duration: 20, ease: 'linear', repeat: Infinity`
- Pauses on hover: `whileHover` animates to `x: current value`

### Stat Counters (About)
- Count-up on inView, 2200ms, 60fps

### Program Card Hover (Effect 5)
- `box-shadow, border-color, transform` — all `transition: 0.3s ease`
- Glow: `0 0 30px rgba(181,240,48,0.35), 0 0 60px rgba(181,240,48,0.15)`

### Testimonial Stagger
- `initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}` → animate on inView
- delay: `i * 0.1`, duration: 0.6s

### FAQ Accordion
- shadcn Accordion with `AnimatePresence`, `height: 0 → auto`, duration: 0.3s ease

### CTA Banner
- On inView: heading `initial={{ opacity: 0, scale: 0.95 }}` → `animate={{ opacity: 1, scale: 1 }}`
- Duration: 0.6s, ease: `[0.22, 1, 0.36, 1]`

### Before/After Slider
- Initial position animates from 75 → 50 on mount: `useEffect` with smooth interpolation

---

## 8. Responsive

### Mobile (< 768px)
- Navbar: "FORGE" wordmark + hamburger (lime)
- Hero: H1 font-size 64px, content left-aligned, CTA buttons stacked
- Ticker: same (works on mobile)
- About: photo full-width top (h-[60vw]), text below
- Programs: 1-column stacked cards
- Transformations: 1-column stacked, each slider full-width
- Testimonials: 1-column
- FAQ: same (accordion adapts naturally)
- CTA: text centered, font slightly smaller

### Tablet (768px–1024px)
- Hero: H1 100px
- Programs: 2+1 layout or 3-col tighter
- Transformations: 2-col (2 sliders side by side, 1 below)
- Testimonials: 2-col

### Desktop (> 1024px)
- Full 2-col about
- 3-col programs
- 3-col transformations
- 2x2 testimonials

---

## 9. Full Copy

### Brand
**FORGE**

### Taglines
- "FORGE YOUR BEST SELF"
- "No shortcuts. No excuses. Just results."
- "Training programs built around you — not around the gym."

### Navbar
- About
- Programs
- Results
- FAQ
- [Button] Start Today

### Hero
- Badge: `[ ONLINE & IN-PERSON COACHING ]`
- H1: `FORGE\nYOUR\nBEST SELF`
- Subline: `No shortcuts. No excuses. Just results.`
- CTA Primary: `START YOUR PROGRAM`
- CTA Secondary: `SEE TRANSFORMATIONS`
- Scroll hint: `↓ Scroll`

### Ticker
`127 CLIENTS TRANSFORMED · 4.9★ AVERAGE RATING · 8 YEARS IN THE GAME · NO SHORTCUTS. EVER. · FORGE YOUR BEST SELF · RESULTS OR YOUR MONEY BACK ·`

### About Section
- Eyebrow: `THE TRAINER`
- H2: `MARCUS WEBB`
- Sub-heading: `8 Years. 127 Clients. Zero Shortcuts.`
- Para 1: `I didn't become a trainer to count reps. I became one because I spent years being the person who needed someone to believe in them before they believed in themselves. That's the job.`
- Para 2: `I hold certifications from NASM, Precision Nutrition, and NSCA. More importantly, I've been in the trenches with clients at every fitness level — from complete beginners to competitive athletes — and I've built a track record that speaks for itself.`
- Para 3: `My programs aren't one-size-fits-all. They're built around your body, your schedule, your goals, and your ceiling — which is higher than you think.`
- Credentials badges: `NASM-CPT · Precision Nutrition L2 · NSCA-CSCS · USA Weightlifting L1`
- Stat below credentials: 127 clients · 4.9★ avg rating · 8 years experience

### Programs Section
- Eyebrow: `WHAT I OFFER`
- H2: `CHOOSE YOUR PATH`

**Program 1 — 1-on-1 Training**
- Badge: `MOST PERSONAL`
- Price: From $350 / month
- Inclusions:
  - 3 x 60-minute in-person sessions/week
  - Fully customized training program
  - Weekly nutrition guidance
  - Daily check-in via app
  - Monthly progress assessment
  - Video form reviews between sessions
- CTA: `Apply for 1-on-1 →`

**Program 2 — Online Coaching**
- Badge: `MOST POPULAR`
- Price: From $150 / month
- Inclusions:
  - Custom training program (updated monthly)
  - Macro & nutrition blueprint
  - Weekly video check-in call
  - Unlimited message support
  - App-based programming tracker
  - Access to Forge private community
- CTA: `Start Online →`

**Program 3 — Group Training**
- Badge: `BEST VALUE`
- Price: From $80 / month
- Inclusions:
  - 4 x group sessions/week (max 8 people)
  - Shared programming, individual attention
  - Monthly group nutrition workshop
  - App access & tracking
  - Community accountability
- CTA: `Join a Group →`

### Transformations Section
- Eyebrow: `REAL RESULTS`
- H2: `THE PROOF IS IN THE PROGRESS`

**Client 1:**
- Name: James T.
- Stats: Lost 42 lbs · 6 months with Forge
- Before alt: `Before: James, untrained, extra weight, casual clothes, neutral background`
- After alt: `After: James, athletic build, confident posture, visible muscle tone, same neutral background`

**Client 2:**
- Name: Priya M.
- Stats: Lost 28 lbs + built 12 lbs muscle · 9 months with Forge
- Before alt: `Before: Priya, before transformation, gym casual, flat lighting`
- After alt: `After: Priya, lean athletic physique, gym environment, dramatic improvement`

**Client 3:**
- Name: Ryan K.
- Stats: Went from 165 lbs to 195 lbs (muscle) · 12 months with Forge
- Before alt: `Before: Ryan, skinny build, plain t-shirt`
- After alt: `After: Ryan, muscular athletic build, same plain background`

### Testimonials Section
- Eyebrow: `CLIENT WINS`
- H2: `DON'T TAKE MY WORD FOR IT`

**Testimonial 1:**
> "Marcus doesn't just coach your body — he coaches your mindset. Six months in and I'm down 42 pounds and genuinely enjoying training for the first time in my life."
> — *James T., 1-on-1 Client* ★★★★★

**Testimonial 2:**
> "The online program is every bit as effective as in-person coaching. The weekly check-ins keep me accountable and the programming is brilliant — I've hit PRs I thought were years away."
> — *Priya M., Online Coaching Client* ★★★★★

**Testimonial 3:**
> "I tried three other trainers before Forge. None of them actually listened. Marcus built me a program that fit my life — not the other way around."
> — *Sarah W., 1-on-1 Client* ★★★★★

**Testimonial 4:**
> "The group sessions have the energy of a class with the programming of a personal trainer. Best fitness investment I've ever made."
> — *David L., Group Training Client* ★★★★★

### FAQ Section
- H2: `QUESTIONS ANSWERED`

**Q1: Where are you based and do you train remotely?**
A: My physical gym is in Austin, Texas. All in-person sessions happen there. Online coaching is fully location-independent — I have clients in the US, UK, Canada, and Australia. Everything runs through my coaching app.

**Q2: How quickly will I see results?**
A: Most clients notice changes in energy and performance within 2–3 weeks. Visible physical changes typically become clear by weeks 6–8, depending on consistency, starting point, and goals. I'll be honest with you about timelines from day one.

**Q3: Do I need to be experienced to work with you?**
A: Absolutely not. I've trained complete beginners, returning-after-years clients, and competitive athletes. The program adapts to you — not the other way around. If you're nervous, that's normal. Just show up.

**Q4: What does the nutrition guidance include?**
A: All programs include macro targets and food-first nutrition principles. Premium plans include detailed meal blueprint, weekly adjustments, and food logging review. I don't believe in unsustainable diets — I'll teach you to eat in a way you can maintain for life.

**Q5: What's your cancellation policy?**
A: Monthly contracts on all programs. Cancel anytime with 14 days notice. No hidden fees, no penalty. I'd rather you stay because it's working — not because you're locked in.

### CTA Section
- H2: `READY TO START?`
- Subline: `Your first session is a conversation. No pressure, no commitment.`
- Sub-subline: `Book a free 20-minute consultation call and let's figure out if we're a fit.`
- CTA: `BOOK YOUR FREE CALL`
- Trust note: `No credit card. No commitment. Just a conversation.`

### Footer
- FORGE (lime wordmark)
- Tagline: `Built for people who show up.`
- Links: About · Programs · Results · FAQ · Contact · Privacy Policy
- Instagram: @forgebymarcos
- Email: marcus@forgetraining.co
- © 2024 Forge. All rights reserved. Austin, Texas.

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-accordion": "^1.2.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```

**Tailwind config additions:**
```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Inter Tight', 'system-ui', 'sans-serif'],
      },
      colors: {
        'forge-black': '#080808',
        'forge-lime': '#b5f030',
        'forge-white': '#fafafa',
      },
    },
  },
};
```
