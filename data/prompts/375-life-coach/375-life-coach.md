# Life Coach Website Prompt
# websiteprompts.ai

Build a warm, aspirational life and business coach website called "Clarity Coaching" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 38 20% 97%;         /* warm off-white #faf8f4 */
  --foreground: 270 18% 14%;        /* deep warm near-black */
  --primary: 265 45% 42%;           /* deep plum #5a3480 */
  --primary-foreground: 0 0% 100%;
  --accent: 38 65% 60%;             /* warm gold #c9913a */
  --surface: 38 15% 91%;            /* warm linen */
  --muted-foreground: 270 8% 52%;
  --border: 38 12% 82%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500&display=swap`
- Headlines: Playfair Display 600–700 — italic gold accents
- Body: Inter 300–400
- Labels: Inter 500 uppercase 10px letter-spacing 0.12em

## Sections

### 1. Navbar
- Sticky warm off-white background, `backdrop-filter: blur(10px)`
- Left: Playfair italic wordmark "Clarity" in deep plum
- Right: Coaching · Results · About · Podcast + "Book a call →" plum button

### 2. Hero
- Full-viewport, warm off-white background
- Split layout: left content (52%), right large portrait image (aspect-ratio 3/4, no border-radius)
- Left:
  - Inter 500 uppercase 10px plum label: "Life & Business Coach · ICF Certified"
  - Playfair Display 700 `clamp(44px, 6vw, 88px)`: "The Life You\nWant Is One\nDecision Away."
  - Italic gold accent on "One Decision"
  - Inter 300 sub: "1-to-1 coaching for ambitious professionals who are done settling — for the career, the balance, and the life they actually want"
  - CTAs: "Book a discovery call →" (plum filled) + "See the results" (ghost plum)
  - Trust chips: "ICF Certified · 200+ Clients Coached · Forbes Featured"
- Hero portrait: no animation, static presence

{/* Image brief: female life coach in bright airy home office, warm tones, confident but approachable expression, natural light, aspirational but real */}

### 3. Transformation Strip
- Full-width warm surface strip with gold top border
- 4 transformation chips with Playfair italic gold stat + Inter 300 muted description:
  - "200+ Clients" (from 22 countries, across 6 industries)
  - "87% Report Major Life Change" (within 90 days of coaching)
  - "Forbes Contributor" (writing on mindset and leadership)
  - "ICF Certified" (International Coaching Federation, PCC Level)
- Slide-in from left on scroll, stagger 0.1s

### 4. Coaching Programmes
- "How We Work Together" — Playfair 700 with plum underline rule (scaleX 0→1)
- 3 full-width hover-raise rows:
  - Clarity Intensive (90-day 1-to-1 programme, weekly sessions, unlimited voice note support)
  - Career Pivot Coaching (6-week focused programme for professional transition)
  - Business Founder Programme (for entrepreneurs — strategy, mindset, accountability)
- Each: Playfair 600 large name left + Inter 300 muted description right + gold "→"
- `border-bottom: 1px solid hsl(var(--border))`
- Hover: background raises to surface raised color, gold text

### 5. Client Results
- "What Clients Say Changed" — Playfair 700
- 3 result cards, warm surface background
- Each: Playfair Display 700 plum result headline (e.g., "Left a 15-year career. Zero regrets."), Inter 300 muted 2-sentence client story, programme chip in plum, client name + industry
- Large faded plum Playfair number (opacity 0.06) behind each card
- Stagger fade-up on scroll

### 6. About
- Split: right portrait, left text
- Inter 500 uppercase 10px plum: "Your Coach"
- Playfair 700: "I Walked Away from a Six-Figure Job. Best Thing I Ever Did."
- Inter 300 bio: 2 paragraphs — Sarah Brennan, former investment banker turned ICF-certified coach. Worked with clients from FTSE 100 executives to first-time founders. Forbes contributor. Based in London, coaching globally.
- Plum chips: "ICF Certified · Forbes Contributor · Ex-Finance"
- "Download my free guide →" plum link

{/* Image brief: confident professional woman in bright modern home, warm styling, bookshelf visible, aspirational and real, natural window light */}

### 7. Podcast / Content
- "The Clarity Sessions Podcast" — Playfair 700
- Warm surface section, split: left text, right podcast artwork
- Inter 300 muted: "200+ episodes on career transitions, mindset, business growth, and living with intention — available wherever you listen"
- 3 horizontal episode chips (recent episode titles in Playfair italic)
- "Listen on Spotify →" plum button + Apple Podcasts link

### 8. Testimonials
- 3 cards: Playfair italic quote, client name + background in Inter 10px muted, 5-star row in gold
- Stagger fade-up on scroll

### 9. Discovery Call CTA
- Full-width deep plum `#5a3480` background
- Playfair 700 italic ivory: "Let's Find Your Clarity"
- Inter 300 ivory: "A free 30-minute discovery call — no sales pitch, just a genuine conversation about where you are and where you want to be"
- "Book your free call →" ivory button
- "No commitment · 100% confidential · Available internationally" Inter 10px ivory 70%

### 10. Footer
- Near-black background, Playfair italic wordmark "Clarity" in plum
- Instagram · LinkedIn · Spotify icons
- "© 2026 Clarity Coaching · Sarah Brennan · London, UK · Global Online Coaching"

## Animations
- Hero: stagger fade-up on mount (y: 30→0, 0.7s)
- Transformation strip: slide-in from left, stagger on scroll
- Programme rows: hover raise
- Plum rules: scaleX 0→1, 0.5s
- All hover: 0.2s ease

## Responsive
- Mobile: stacked hero, single-column cards, hamburger nav

## Full Copy
- Wordmark: "Clarity"
- Hero: "The Life You Want Is One Decision Away." / "1-to-1 coaching for ambitious professionals who are done settling"
- Programmes: Clarity Intensive · Career Pivot · Business Founder
- Stats: 200+ Clients · 87% Report Major Life Change · ICF Certified · Forbes Contributor
- Results: "Left a 15-year career. Zero regrets." · "Doubled my income in 8 months." · "Finally started the business I'd been putting off for 6 years."
- Testimonial: "Sarah helped me see that I wasn't stuck — I was just scared. 90 days later I handed in my notice and started my business. I've never looked back." — Claire M., former HR Director
- CTA: "Let's Find Your Clarity" / "A free 30-minute discovery call — no sales pitch"
