# Meridian Law Group — Law Firm / Attorney Website Prompt

## 1. Goal Statement
Build an authoritative yet human law firm website for **Meridian Law Group**, defined by deep navy, warm gold accents, and a parchment texture aesthetic that communicates decades of experience, personal attention, and unwavering trustworthiness.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(221, 47%, 11%);          /* #0d1628 deep navy */
  --foreground: hsl(36, 30%, 93%);           /* #f2ede4 parchment */
  --primary: hsl(41, 55%, 54%);              /* #c9a84c warm gold */
  --primary-foreground: hsl(221, 47%, 11%);  /* navy — text on gold */
  --muted-foreground: hsl(36, 15%, 65%);     /* muted parchment-grey */
  --border: hsl(41, 25%, 22%);               /* dark gold border */
  --card: hsl(221, 44%, 14%);                /* slightly lighter card */
  --card-dark: hsl(221, 50%, 9%);            /* darker card for contrast */
  --accent: hsl(41, 55%, 54%);               /* warm gold */
  --texture-overlay: rgba(18, 14, 8, 0.15);  /* paper texture tint */
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

- **H1 / hero display:** `font-family: 'Cormorant', serif;` weight 300–400, letter-spacing: 0.02em, italic variation for emphasis
- **H2 / section headings:** Cormorant 400, letter-spacing: 0.01em
- **H3 / subheadings / card titles:** Cormorant italic 400, size 20–26px
- **Body / paragraphs:** `font-family: 'Inter', sans-serif;` weight 300–400, line-height: 1.8, letter-spacing: 0.01em
- **Navigation / UI labels / eyebrows:** Inter 500, uppercase, letter-spacing: 0.15em, size: 11–12px
- **Gold accent text / firm name:** Cormorant 400, gold color `--primary`
- **Phone number / contact:** Inter 600, parchment or gold

---

## 5. Visual Effects

### Effect 1 — Parchment / Linen Texture Overlay (Fixed)
```jsx
{/* Fixed paper/linen texture overlay — creates warmth and authority */}
<div
  className="fixed inset-0 z-50 pointer-events-none"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
    mixBlendMode: 'multiply',
    opacity: 0.7,
  }}
/>
```

### Effect 2 — Gold Animated Underline on Practice Areas Heading
```tsx
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

function GoldAnimatedHeading({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div ref={ref} className="inline-block">
      <h2 className="font-serif font-light text-4xl md:text-5xl tracking-wide text-[var(--foreground)]">
        {children}
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        style={{
          originX: 0,
          height: '1px',
          width: '100%',
          backgroundColor: 'var(--primary)',
          marginTop: '10px',
        }}
      />
    </div>
  );
}
```

### Effect 3 — Practice Area Cards with Gold Left Border + Hover Lift
```tsx
<div
  className="group relative p-6 md:p-8 cursor-pointer transition-all duration-300"
  style={{
    background: 'var(--card)',
    borderLeft: '3px solid var(--primary)',
    transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
  }}
  onMouseEnter={e => {
    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.2)';
  }}
  onMouseLeave={e => {
    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
  }}
>
  {/* card content */}
</div>
```

### Effect 4 — Staggered Attorney Profile Card Entrance
```tsx
const attorneys = [...];

function AttorneyProfiles() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {attorneys.map((attorney, i) => (
        <motion.div
          key={attorney.name}
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* attorney card */}
        </motion.div>
      ))}
    </div>
  );
}
```

### Effect 5 — Quote Slider with Auto-Advance
```tsx
const [activeIndex, setActiveIndex] = useState(0);
const quotes = [...];

useEffect(() => {
  const timer = setInterval(() => {
    setActiveIndex(prev => (prev + 1) % quotes.length);
  }, 6000);
  return () => clearInterval(timer);
}, []);

// AnimatePresence wraps the active quote
<AnimatePresence mode="wait">
  <motion.div
    key={activeIndex}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* quote content */}
  </motion.div>
</AnimatePresence>
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- **Height:** 80px desktop / 64px mobile
- **Position:** `fixed top-0 left-0 right-0 z-40`
- **Background:** `rgba(13,22,40,0.97)` always (never fully transparent — law firm credibility)
- **Bottom border:** 1px `--border` (gold-tinted)
- **Left:** "MERIDIAN" in Cormorant 400, letter-spacing 0.2em, gold + "LAW GROUP" in Inter 500, 10px, uppercase, parchment/muted
- **Center (desktop):** Practice Areas · Our Attorneys · Case Results · Process · Contact
- **Right (always visible):** `+1 512 555 0193` in Inter 600 gold + "Free Consultation" button (gold outlined)
- **Mobile:** wordmark + phone icon (gold) + hamburger icon

### Section 2 — Hero (Split Panel)
- **Height:** 100vh
- **Layout:** 60% left text panel (navy) / 40% right image panel
- **Left panel:**
  - Eyebrow (Inter, tiny, gold uppercase): `AUSTIN, TEXAS · FOUNDED 1989 · AV PREEMINENT® RATED`
  - H1: `Counsel You\nCan Count On` (Cormorant weight 300, 72px–104px, parchment)
  - Subline (Inter 300): `Decades of experience in personal injury, family law, and business litigation. Personal attention from the attorney — not the paralegal.`
  - CTA row: "Schedule Free Consultation" (gold filled) + "View Practice Areas" (ghost parchment)
  - Trust strip below CTAs: padlock icon + "Confidential · No obligation · Same-day response"
- **Right panel (40% desktop, bg overlay mobile):**
  ```jsx
  {/* Image: classic courthouse exterior with dramatic columns, low angle shot looking up, golden hour warm light, slightly overcast sky adding gravitas, architectural photography, deep navy sky visible */}
  <img src="" alt="Federal courthouse exterior with columns at golden hour" className="w-full h-full object-cover object-center" />
  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,22,40,1) 0%, rgba(13,22,40,0.3) 40%, transparent 70%)' }} />
  ```

### Section 3 — Trust Bar
- **Background:** `--card-dark`
- **Border top/bottom:** 1px `--border`
- **Layout:** `flex flex-wrap justify-center items-center gap-8 md:gap-12 py-8 px-6`
- **Logo-style seals/badges:** text-only styled badges in gold:
  - AV Preeminent® 2024
  - Super Lawyers® 2019–2024
  - State Bar of Texas
  - Best Law Firms® US News
  - AVVO Rating 10.0
  - 35+ Years Established

### Section 4 — Practice Areas
- **Padding:** `py-24 px-6 md:px-16`
- **Eyebrow + GoldAnimatedHeading:** "Practice Areas"
- **Grid:** 2x3 grid on desktop (6 cards), 1-col on mobile
- **Each card:** gold left border, dark bg, icon (lucide-react), area name (Cormorant italic), 1-sentence description (Inter 300)

### Section 5 — Attorney Profiles
- **Background:** `--background`
- **Eyebrow:** "OUR ATTORNEYS"
- **Heading:** "The People in Your Corner"
- **3-col grid** on desktop, 1-col mobile
- **Each profile card:**
  - Headshot (circular frame, `rounded-full`, gold ring border)
  - Name (Cormorant, 22px)
  - Title / speciality (Inter 400, gold, small)
  - 2-sentence bio
  - "View Full Profile →" gold link

### Section 6 — Case Results
- **Background:** `--card-dark`
- **Eyebrow:** "TRACK RECORD"
- **Heading:** `Results That Speak for Themselves`
- **3 highlighted outcomes** in large card format
- **Each case:** large settlement amount (Cormorant, 48px, gold), case type label, brief anonymized description
- **Disclaimer:** small Inter 300 muted text — "Past results do not guarantee future outcomes. All amounts are approximate."

### Section 7 — Testimonials
- **Background:** `--background`
- **Eyebrow:** "CLIENT TESTIMONIALS"
- **Quote slider** with auto-advance (Effect 5)
- **Quote text:** Cormorant italic, 26–32px, parchment
- **Attribution:** Inter 400, gold, 12px
- **Case type badge:** pill below attribution
- **Dot nav:** 4 gold dots

### Section 8 — Process
- **Background:** `--card`
- **Eyebrow:** "HOW IT WORKS"
- **Heading:** "From First Call to Resolution"
- **4-step timeline** (horizontal desktop, vertical mobile)
- **Each step:** gold number (Cormorant 60px, transparent outline), title, description
- **Connecting line:** thin gold horizontal line (desktop)

### Section 9 — Contact
- **Layout:** 2-col, form left / office info right
- **Left col:**
  - Heading: "Schedule Your Free Consultation"
  - Form: Full Name / Email / Phone / Practice Area (dropdown) / Brief description
  - CTA: "Submit — We'll Call Within 24 Hours" (gold filled, full-width)
  - Trust note: padlock icon + "Your information is 100% confidential."
- **Right col:**
  - Heading: "Get in Touch"
  - Phone (large, gold): +1 512 555 0193
  - Email: intake@meridianlaw.com
  - Address: 500 W 2nd Street, Suite 1900, Austin, TX 78701
  - Hours: Mon–Fri 8am–6pm · Emergency line 24/7
  - Map placeholder (grey box with "View on Maps" link)

### Section 10 — Footer
- **Background:** `hsl(221, 52%, 7%)` (darkest navy)
- **Gold top border 1px**
- **4-col layout** (desktop), stacked (mobile)
- Col 1: MERIDIAN LAW GROUP + tagline + bar number
- Col 2: Practice Areas links
- Col 3: Contact info
- Col 4: Social (LinkedIn, Facebook) + Bar association logos
- Bottom strip: © + disclaimer text (small) + "Attorney Advertising" notice

---

## 7. Animations

### Navbar Scroll Behavior
- `window.scrollY > 60` → add box-shadow: `0 4px 30px rgba(0,0,0,0.5)`
- `transition: box-shadow 0.4s ease`

### Hero Panel Reveal
```tsx
// Left panel: staggered content reveal
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

// Right panel: clipPath reveal
initial={{ clipPath: 'inset(0 100% 0 0)' }}
animate={{ clipPath: 'inset(0 0% 0 0)' }}
transition={{ duration: 1.4, ease: [0.77, 0, 0.18, 1], delay: 0.1 }}
```

### Gold Underline (Practice Areas)
- `scaleX: 0 → 1`, `originX: 0`, duration: 0.9s, delay: 0.3s

### Practice Area Cards
- Staggered entrance: `i * 0.08` delay, `opacity: 0, y: 20 → 1, 0`, duration: 0.6s
- Hover: `translateY(-4px)` + gold glow shadow, `0.3s cubic-bezier`

### Attorney Cards
- Staggered: `i * 0.15`, blur+fade in, duration: 0.7s

### Case Results Numbers
- Count-up animation on `useInView`, 1800ms

### Quote Slider
- `AnimatePresence mode="wait"`, `x: 20 → 0` in / `x: -20 → out`, duration: 0.45s

### Process Steps
- Each step: `initial={{ opacity: 0, x: -20 }}` → animate on scroll, `delay: i * 0.15`

### All Section Headings
- `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Duration: 0.65s, ease: `[0.22, 1, 0.36, 1]`

---

## 8. Responsive

### Mobile (< 768px)
- Navbar: wordmark (abbreviated "MERIDIAN") + phone icon (gold, calls direct) + hamburger
- Hero: full-screen, text over dimmed courthouse image, all content centered, CTAs stacked
- Trust bar: horizontal scroll with overflow-x, 2–3 visible at once
- Practice Areas: 1-column, 6 stacked cards
- Attorneys: 1-column, headshots full-width rectangle (not circle) or circle maintained
- Case Results: 1-column stacked
- Testimonials: slider maintained
- Process: vertical timeline (not horizontal)
- Contact: stacked (form top, info below)

### Tablet (768px–1024px)
- Hero: split maintained at 60/40
- Practice Areas: 2x3 grid maintained (smaller cards)
- Attorneys: 3-col with tighter spacing
- Process: horizontal maintained

### Desktop (> 1024px)
- Full spec as designed

---

## 9. Full Copy

### Brand
**MERIDIAN LAW GROUP**

### Taglines
- "Counsel You Can Count On"
- "We fight for what matters most."
- "Decades of experience. Personal attention every step of the way."

### Navbar
- Practice Areas
- Our Attorneys
- Case Results
- Process
- Contact
- `+1 512 555 0193`
- [Button] Free Consultation

### Hero
- Eyebrow: `AUSTIN, TEXAS · FOUNDED 1989 · AV PREEMINENT® RATED`
- H1: `Counsel You\nCan Count On`
- Subline: `Decades of experience in personal injury, family law, and business litigation. Personal attention from the attorney — not the paralegal.`
- CTA Primary: `Schedule Free Consultation`
- CTA Secondary: `View Practice Areas`
- Trust strip: `🔒 Confidential · No obligation · Same-day response`

### Trust Bar
- AV Preeminent® Martindale-Hubbell 2024
- Super Lawyers® 2019–2024
- State Bar of Texas
- Best Law Firms® — U.S. News 2024
- AVVO Rating: 10.0 Superb
- 35 Years in Practice

### Practice Areas Section
- Eyebrow: `WHAT WE HANDLE`
- H2: `Practice Areas`

**Area 1 — Personal Injury**
- Icon: `Shield` (lucide-react)
- Description: Accidents, wrongful death, and catastrophic injury cases. We fight aggressively for maximum compensation.

**Area 2 — Family Law**
- Icon: `Heart` (lucide-react)
- Description: Divorce, child custody, adoption, and protective orders handled with both legal skill and human sensitivity.

**Area 3 — Business Litigation**
- Icon: `Briefcase` (lucide-react)
- Description: Contract disputes, partnership disagreements, and commercial claims resolved with decisive strategy.

**Area 4 — Criminal Defense**
- Icon: `Scale` (lucide-react)
- Description: DWI, felony, and misdemeanor defense. We protect your rights from the moment of arrest through verdict.

**Area 5 — Estate Planning**
- Icon: `FileText` (lucide-react)
- Description: Wills, trusts, powers of attorney, and probate. Secure your legacy and protect the people you love.

**Area 6 — Employment Law**
- Icon: `Users` (lucide-react)
- Description: Wrongful termination, discrimination, and wage theft. When your employer violates your rights, we hold them accountable.

### Attorney Profiles Section
- Eyebrow: `OUR ATTORNEYS`
- H2: `The People in Your Corner`

**Attorney 1 — Robert Meridian**
```jsx
{/* Image: distinguished male attorney in his 60s, dark suit, silver hair, warm and authoritative expression, professional headshot, plain dark background, confident bearing */}
<img src="" alt="Robert Meridian, founding partner" className="w-full h-full object-cover object-center" />
```
- Title: Founding Partner · Personal Injury & Business Litigation
- Bio: Robert founded Meridian Law Group in 1989 after serving as a federal prosecutor. In 35 years of practice, he has tried over 200 cases and secured more than $180 million in client recoveries.
- Link: View Full Profile →

**Attorney 2 — Diana Vasquez**
```jsx
{/* Image: professional female attorney in her 40s, dark blazer, warm confident smile, professional headshot, neutral background, approachable yet authoritative demeanor */}
<img src="" alt="Diana Vasquez, Partner at Meridian Law Group" className="w-full h-full object-cover object-center" />
```
- Title: Partner · Family Law & Estate Planning
- Bio: Diana is a board-certified specialist in family law with 18 years of experience. She is known for resolving complex custody disputes with clarity and compassion — and for winning when it matters most.
- Link: View Full Profile →

**Attorney 3 — James Okafor**
```jsx
{/* Image: professional Black male attorney in his 30s, sharp dark suit, confident posture, professional headshot, office bookshelf background slightly blurred, serious but approachable expression */}
<img src="" alt="James Okafor, Associate Attorney" className="w-full h-full object-cover object-center" />
```
- Title: Associate · Criminal Defense & Employment Law
- Bio: James joined Meridian after clerking for the Fifth Circuit Court of Appeals. His analytical precision and courtroom confidence have earned him a reputation as one of Austin's most effective young trial attorneys.
- Link: View Full Profile →

### Case Results Section
- Eyebrow: `TRACK RECORD`
- H2: `Results That Speak for Themselves`
- Disclaimer: `Past results do not guarantee future outcomes. All settlement and verdict amounts are approximate and may vary based on circumstances.`

**Result 1:**
- Amount: $4.2M
- Type: Personal Injury — Truck Accident
- Description: Settlement secured for a family whose vehicle was struck by a commercial truck driver who had been on the road for 22 consecutive hours. The firm negotiated directly with the carrier's insurer over 9 months.

**Result 2:**
- Amount: $1.8M
- Type: Wrongful Termination — Employment Discrimination
- Description: Jury verdict for a senior employee terminated after reporting safety violations to OSHA. The case was taken on contingency after two other firms declined.

**Result 3:**
- Amount: $3.5M
- Type: Medical Malpractice
- Description: Settlement for a patient who suffered permanent injury during a routine procedure due to surgical team negligence. Negotiated in 14 months without trial.

### Testimonials Section
- Eyebrow: `CLIENT TESTIMONIALS`
- H2: `What Our Clients Say`

**Quote 1:**
> "Robert took my call on a Sunday evening after my accident. By Monday morning he had already sent a preservation letter to the truck company. That tells you everything about how this firm operates."
> — *Michael T., Personal Injury Client* · Settled $1.2M ★★★★★

**Quote 2:**
> "Diana navigated my divorce with legal skill and genuine empathy. My children's interests were protected at every step. I don't know what I would have done without her."
> — *Sarah W., Family Law Client* ★★★★★

**Quote 3:**
> "James got my DWI dismissed on procedural grounds that another attorney told me didn't exist. I'm grateful I got a second opinion. My record is clean."
> — *Anonymous, Criminal Defense Client* ★★★★★

**Quote 4:**
> "I was skeptical that a law firm would treat me like a person and not a case number. Meridian proved me wrong from the very first meeting."
> — *Donna R., Estate Planning Client* ★★★★★

### Process Section
- Eyebrow: `HOW IT WORKS`
- H2: `From First Call to Resolution`

Steps:
1. **01 — Free Consultation** — Call us or submit a form. We'll speak with you within 24 hours — often the same day. You'll talk to an attorney from the start, not a receptionist. No obligation. No fee.
2. **02 — Case Evaluation** — We review the facts, research the law, and give you an honest assessment. If we believe we can help you — and only then — we'll tell you how.
3. **03 — Strategy & Action** — We build your legal strategy and begin work immediately: gathering evidence, engaging experts, filing on your behalf, and communicating with opposing counsel.
4. **04 — Resolution** — Whether through negotiation, mediation, or trial, we pursue the outcome you deserve. You'll know what's happening at every step — because we believe that's your right.

### Contact Section
- Eyebrow: `REACH OUT`
- H2: `Schedule Your Free Consultation`
- Subline: `We respond within 24 hours. Emergency matters: call directly.`
- Form labels: Full Name / Email Address / Phone Number / Practice Area / How can we help you?
- Practice Area options: Personal Injury · Family Law · Business Litigation · Criminal Defense · Estate Planning · Employment Law · Other
- CTA: `Submit — We'll Call Within 24 Hours`
- Trust note: `🔒 Your information is completely confidential and protected by attorney-client privilege.`
- Right col:
  - Heading: `Get in Touch`
  - Phone: `+1 512 555 0193`
  - Email: `intake@meridianlaw.com`
  - Address: `500 W 2nd Street, Suite 1900\nAustin, TX 78701`
  - Hours: `Monday – Friday: 8am – 6pm\n24/7 Emergency Line: +1 512 555 0199`

### Footer
- MERIDIAN LAW GROUP
- Tagline: "Decades of experience. Personal attention every step of the way."
- Links: Practice Areas · Our Attorneys · Case Results · Process · Contact · Privacy Policy
- Address: 500 W 2nd Street, Suite 1900, Austin, TX 78701
- © 2024 Meridian Law Group. All rights reserved.
- "Attorney Advertising. Prior results do not guarantee a similar outcome."
- State Bar of Texas License #TX-1989-0042

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-select": "^2.1.0",
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
        serif: ['Cormorant', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'meridian-navy': '#0d1628',
        'meridian-parchment': '#f2ede4',
        'meridian-gold': '#c9a84c',
      },
    },
  },
};
```
