# Accountant / Financial Advisor Website Prompt
# websiteprompts.ai

Build a clean, trust-focused accountant and financial advisor website called "Harlow & Co Accountants" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 0 0% 100%;
  --foreground: 220 25% 12%;        /* deep navy-charcoal #0d1826 */
  --primary: 218 68% 22%;           /* deep navy #0d1b3e */
  --primary-foreground: 0 0% 100%;
  --accent: 34 72% 50%;             /* warm amber #d4892a */
  --surface: 216 20% 96%;
  --surface-dark: 218 68% 22%;
  --muted-foreground: 220 12% 52%;
  --border: 216 18% 88%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap`
- All text: Plus Jakarta Sans
- Headlines: Plus Jakarta Sans 700–800
- Body: Plus Jakarta Sans 300–400
- Labels/badges: Plus Jakarta Sans 600 uppercase 10px letter-spacing 0.12em

## Sections

### 1. Navbar
- Sticky white bg, thin bottom border on scroll
- Left: Plus Jakarta Sans 700 wordmark "Harlow & Co" + "Chartered Accountants" in 300 muted
- Right: Services · About · Resources · Contact + "Book free consultation →" navy button

### 2. Hero
- Split layout: left content (55%), right illustration/image (45%)
- Left:
  - Plus Jakarta Sans 600 uppercase 10px amber label: "Chartered Accountants & Financial Advisors"
  - Plus Jakarta Sans 800 `clamp(40px, 5vw, 72px)`: "Clear Numbers.\nSmart Decisions.\nPeace of Mind."
  - Plus Jakarta Sans 300 sub: "Accounting, tax, and financial advice for UK small businesses and individuals — straightforward, jargon-free."
  - Two CTAs: "Book a free consultation →" (navy filled) + "See our services" (ghost navy)
  - Trust strip below CTAs: 3 chips — "ICAEW Member · 200+ clients · Est. 2008"

{/* Image brief: clean modern accountancy office interior, light wood desk, laptop, natural light, professional but approachable, not corporate */}

### 3. Trust Bar
- Full-width navy `#0d1b3e` background, 72px tall
- 4 white stats in Plus Jakarta Sans 700: "200+ Clients" · "15 Years" · "4.9★ Google" · "ICAEW Registered"
- Amber dividers between stats
- Framer Motion useSpring count-up triggered by IntersectionObserver

### 4. Services Grid
- "What We Do" in Plus Jakarta Sans 800 with amber underline rule (scaleX 0→1)
- 6-service 3×2 grid:
  - Accounts & Bookkeeping · Tax Returns (Personal & Business) · VAT Returns · Payroll · Business Start-Up · Financial Planning
- Each card: amber lucide icon, Plus Jakarta Sans 700 service name, Plus Jakarta Sans 300 short description, "Learn more →" amber link
- Hover: amber border + `box-shadow: 0 0 20px hsl(34 72% 50% / 0.10)`
- Stagger fade-up on scroll

### 5. Why Choose Us
- Split: left text, right image
- Plus Jakarta Sans 800: "Straightforward Accounting — No Jargon"
- Plus Jakarta Sans 300: 2 paragraphs — personal service, dedicated account manager, proactive advice not just year-end filing
- 4 check points with lucide Check icons in amber:
  - "Dedicated account manager — always the same person"
  - "Fixed monthly fees — no surprise invoices"
  - "Proactive tax planning, not just filing"
  - "Response within 24 hours, guaranteed"

{/* Image brief: accountant at desk, reviewing documents, friendly professional expression, bright office, approachable not corporate */}

### 6. Pricing
- "Simple, Fixed Pricing" in Plus Jakarta Sans 800 with amber rule
- 3 cards: Sole Trader (from £89/mo) · Limited Company (from £149/mo) · Growing Business (from £249/mo)
- Each card: Plus Jakarta Sans 700 tier name, amber price, Plus Jakarta Sans 300 feature list with lucide Check icons
- Middle "Limited Company" card: navy border + "Most popular" amber badge
- Hover: navy border + soft navy glow

### 7. Process
- "Getting Started Is Easy" in Plus Jakarta Sans 800
- 4-step row: Free Consultation → Onboarding Call → We Handle Everything → Monthly Reports
- Large faded amber Plus Jakarta Sans 800 number (opacity 0.08) behind each step
- Plus Jakarta Sans 300 description per step
- Stagger fade-up on scroll

### 8. Testimonials
- Light surface section
- 3 cards: 5-star row in amber, Plus Jakarta Sans 300 italic quote, client name + business type in Plus Jakarta Sans 10px muted
- Stagger fade-up

### 9. FAQ Teaser
- "Common Questions" in Plus Jakarta Sans 800
- 4 accordion items using shadcn/ui Accordion: each Q expands to reveal A
  - "Do I need an accountant if I use accounting software?" · "What's the difference between bookkeeping and accounting?" · "When do I need to register for VAT?" · "How quickly can you take over from my current accountant?"
- Plus Jakarta Sans 300 answers
- Navy left border on open item

### 10. CTA Banner
- Full-width navy `#0d1b3e` background
- Plus Jakarta Sans 800 white: "Book Your Free 30-Minute Consultation"
- Plus Jakarta Sans 300 white sub: "No commitment — just clear advice from a qualified accountant"
- Amber "Book now →" button
- Plus Jakarta Sans 10px white muted: "Spaces limited · Usually available within 3 working days"

### 11. Footer
- Dark navy background, 3 columns: Brand + ICAEW badge · Services links · Contact (address, phone, email)
- Plus Jakarta Sans 10px muted white: "Harlow & Co Accountants Ltd is registered with the Institute of Chartered Accountants in England and Wales (ICAEW). Company No. 08234567."
- "© 2026 Harlow & Co Accountants"

## Animations
- Trust bar: count-up on scroll
- Service grid: stagger fade-up on scroll
- Amber rules: scaleX 0→1, 0.5s
- Accordion: smooth height transition via shadcn
- All hover: 0.2s ease

## Responsive
- Mobile: single-column services, stacked hero, hamburger nav

## Full Copy
- Wordmark: "Harlow & Co Chartered Accountants"
- Tagline: "Clear Numbers. Smart Decisions. Peace of Mind."
- Hero sub: "Accounting, tax, and financial advice for UK small businesses and individuals — straightforward, jargon-free."
- Services: Accounts & Bookkeeping · Tax Returns · VAT Returns · Payroll · Business Start-Up · Financial Planning
- Pricing: Sole Trader from £89/mo · Limited Company from £149/mo · Growing Business from £249/mo
- Trust: "Dedicated account manager · Fixed monthly fees · Proactive tax planning · 24hr response guarantee"
- Testimonial: "Harlow & Co saved us thousands in our first year by catching tax reliefs our previous accountant had missed entirely." — Sarah T., e-commerce founder, 2025
- CTA: "Book Your Free 30-Minute Consultation" / "No commitment — just clear advice from a qualified accountant"
- Disclaimer: "ICAEW registered · Company No. 08234567 · Registered in England & Wales"
