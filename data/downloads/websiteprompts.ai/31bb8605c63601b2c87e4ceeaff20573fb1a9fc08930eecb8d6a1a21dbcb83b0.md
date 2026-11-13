# Mortgage Broker Website Prompt
# websiteprompts.ai

Build a clean, trustworthy mortgage broker and financial advisor website called "Clearpath Mortgages" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 0 0% 100%;
  --foreground: 215 30% 12%;        /* deep navy near-black */
  --primary: 215 52% 28%;           /* deep navy #1e3a5f */
  --primary-foreground: 0 0% 100%;
  --accent: 42 60% 55%;             /* warm gold #c9a55a */
  --surface: 215 15% 96%;           /* light blue-grey */
  --surface-navy: 215 30% 92%;      /* navy tint */
  --muted-foreground: 215 12% 52%;
  --border: 215 16% 88%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap`
- All text: Plus Jakarta Sans
- Headlines: Plus Jakarta Sans 700–800
- Body: Plus Jakarta Sans 300–400
- Labels: Plus Jakarta Sans 600 uppercase 10px letter-spacing 0.12em

## Sections

### 1. Navbar
- Sticky white bg, thin navy bottom border on scroll
- Left: Plus Jakarta Sans 700 wordmark "Clearpath" + small lucide Home icon in navy
- Right: Services · How It Works · About · Contact + "Get a quote →" navy button

### 2. Hero
- Split layout: left content (55%), right large image (45%, rounded-2xl)
- Left:
  - Plus Jakarta Sans 600 uppercase 10px navy label: "Independent Mortgage Broker"
  - Plus Jakarta Sans 800 `clamp(38px, 5vw, 70px)`: "Your Mortgage,\nMade Simple."
  - Plus Jakarta Sans 300 sub: "Access to over 90 lenders, whole-of-market advice, and a fee-free service — finding you the right deal in days, not weeks"
  - CTAs: "Get a free quote →" (navy filled) + "How it works" (ghost navy)
  - Trust chips: "CeMAP Qualified · FCA Regulated · Whole of Market"

{/* Image brief: couple at home reviewing documents at kitchen table, warm light, relaxed and happy, homeownership milestone moment */}

### 3. Trust Bar
- Full-width navy `#1e3a5f` background, 72px
- 4 white stats in Plus Jakarta Sans 700: "90+ Lenders" · "£800M+ Arranged" · "4.9★ Google" · "Fee Free Service"
- Framer Motion useSpring count-up on scroll, white dividers

### 4. Services
- "How We Can Help" — Plus Jakarta Sans 800 with navy underline rule
- 6-service 3×2 grid:
  - First-Time Buyer (we handle everything, from AIP to completion)
  - Home Mover (seamless transition, best rate for your situation)
  - Remortgage (save money when your fixed rate ends)
  - Buy-to-Let (landlord mortgages for portfolio and first-time landlords)
  - Self-Employed (complex income? We find lenders who understand it)
  - Protection (life insurance, critical illness, income protection)
- Each card: navy lucide icon, Plus Jakarta Sans 700 service name, Plus Jakarta Sans 300 description, "Learn more →" navy link
- Hover: navy border + navy glow `0 0 20px hsl(215 52% 28% / 0.10)`

### 5. How It Works
- "The Clearpath Process" — Plus Jakarta Sans 800
- 4-step: Free Consultation → Whole Market Search → Mortgage Application → Completion
- Large faded navy number (opacity 0.07) behind each step
- Plus Jakarta Sans 300 muted description per step, stagger fade-up on scroll

### 6. Why Choose Clearpath
- Split: left text, right image
- Plus Jakarta Sans 800: "We Work for You, Not the Lenders"
- Plus Jakarta Sans 300: 2 paragraphs — whole-of-market means no bias, fee-free means our income comes from lenders, not you. CeMAP qualified. FCA regulated.
- 4 check points with lucide Check in navy:
  - "Whole of market — 90+ lenders compared"
  - "Completely fee-free advice"
  - "CeMAP qualified advisors"
  - "FCA regulated and fully insured"

{/* Image brief: mortgage advisor at desk with client, professional warm office setting, documents visible, trust and expertise conveyed */}

### 7. Meet the Team
- "Your Advisors" — Plus Jakarta Sans 800
- 3 advisor cards: portrait (square, rounded-xl), Plus Jakarta Sans 700 name, navy specialty chip (CeMAP Qualified / FCA ARN), short bio
- Hover: soft navy glow

{/* Image brief: professional male mortgage advisor, business casual, warm office background, approachable expression */}
{/* Image brief: female financial advisor, professional headshot, modern office, confident and friendly */}
{/* Image brief: male advisor headshot, professional setting, warm smile, trustworthy */}

### 8. Reviews
- Light navy surface section
- 3 cards: 5-star row in gold, Plus Jakarta Sans 300 italic quote, client name + mortgage type in Plus Jakarta Sans 10px muted
- Stagger fade-up on scroll

### 9. FAQ Accordion
- "Common Questions" — Plus Jakarta Sans 800
- 4 items via shadcn/ui:
  - "How long does the mortgage process take?"
  - "Do I need a big deposit to get a mortgage?"
  - "Can I get a mortgage if I'm self-employed?"
  - "What documents will I need?"
- Navy left border on open item

### 10. CTA Banner
- Full-width navy `#1e3a5f` background
- Plus Jakarta Sans 800 white: "Find Out How Much You Could Borrow"
- Plus Jakarta Sans 300 white: "Free consultation · No obligation · Whole market comparison in 24 hours"
- "Get a free quote →" white bg navy text button
- "FCA regulated · Fee-free · Available evenings and weekends" muted below

### 11. Footer
- Deep navy background, 3 columns
- "Clearpath Mortgages Ltd is authorised and regulated by the Financial Conduct Authority. FCA No. 123456. Your home may be repossessed if you do not keep up repayments on your mortgage." Plus Jakarta Sans 10px muted
- "© 2026 Clearpath Mortgages · London & Remote"

## Animations
- Trust bar: count-up on scroll
- Service grid: stagger fade-up on scroll
- Process steps: stagger fade-up on scroll
- Navy rules: scaleX 0→1, 0.5s

## Responsive
- Mobile: split hero stacks, single-column service grid, hamburger nav

## Full Copy
- Wordmark: "Clearpath"
- Hero: "Your Mortgage, Made Simple." / "Access to over 90 lenders, whole-of-market advice, and a fee-free service"
- Services: First-Time Buyer · Home Mover · Remortgage · Buy-to-Let · Self-Employed · Protection
- Stats: 90+ Lenders · £800M+ Arranged · 4.9★ Google · Fee Free
- Testimonial: "Clearpath found us a rate 0.4% lower than our bank's best offer. The process was completely stress-free and they handled everything." — James & Priya, first-time buyers
- CTA: "Find Out How Much You Could Borrow" / "Free consultation · No obligation"
