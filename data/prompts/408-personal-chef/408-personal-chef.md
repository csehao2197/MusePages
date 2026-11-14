# Personal Chef / Catering Website Prompt
# websiteprompts.ai

Build a sophisticated personal chef and private catering website called "Chef Elise Laurent" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 38 30% 96%;         /* warm ivory #faf4e8 */
  --foreground: 340 15% 15%;        /* warm near-black */
  --primary: 340 58% 28%;           /* deep burgundy #6d1f35 */
  --primary-foreground: 38 30% 96%;
  --primary-light: 340 30% 92%;     /* blush tint for chips */
  --surface: 38 25% 91%;
  --muted-foreground: 340 8% 52%;
  --border: 38 18% 82%;
  --gold: 42 60% 52%;               /* warm gold #c9a030 — for prices/labels */
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500&display=swap`
- Headlines: Playfair Display 600–700 — italic for accent phrases
- Body: Inter 300–500
- Prices/labels: Inter 500, gold color

## Sections

### 1. Navbar
- Sticky ivory background with blur
- Left: Playfair italic wordmark "Chef Elise Laurent" in burgundy
- Right: Menus · Events · About · Contact + "Enquire →" burgundy button

### 2. Hero
- Full-screen, ivory background
- Split: left content, right tall hero image (aspect-ratio 3/4, rounded-2xl)
- Left:
  - Inter 500 uppercase 10px muted label: "Private Chef & Catering · London"
  - Playfair Display 700 `clamp(48px, 7vw, 96px)`: "Extraordinary\nDining,\nIn Your\nHome"
  - Playfair italic burgundy accent on "Extraordinary"
  - Inter 300 sub: "Bespoke menus crafted for intimate dinners, celebrations, and corporate events"
  - Two CTAs: "Plan your event →" (burgundy filled) + "View menus" (ghost burgundy)
  - Below: 3 trust chips: "Michelin-trained · 10+ years · 4.9★ on Tagvenue"

{/* Image brief: elegantly plated fine dining dish, dark moody surface, warm light, artistic food photography, garnished with microgreens */}

### 3. Signature Menu Teaser
- "Signature Menus" in Playfair 700 with thin burgundy rule (scaleX 0→1)
- 3 menu cards in a row, ivory surface background:
  - Seasonal Tasting (7 courses, paired wines available, from £120pp)
  - Classic British (3 courses, Sunday celebration style, from £65pp)
  - Mezze & Sharing (abundant sharing feast, dietary-flexible, from £55pp)
- Each card: Playfair 600 menu name, Inter 300 description, 3 dish highlights with bullet, gold price/pp tag
- Hover: burgundy left border + soft ivory lift

### 4. Event Types
- "I Cook For" in Playfair 700
- 4 full-width horizontal rows, `border-bottom: 1px solid hsl(var(--border))`
- Each row: event type in Playfair 600 large left + Inter 300 description right + burgundy lucide icon
- Event types: Intimate Dinner Parties · Celebrations & Birthdays · Corporate Lunches · Wedding Catering
- Hover: ivory surface tint raises

### 5. About / Chef
- Split: left text, right portrait
- Burgundy chip badge: "Executive Chef"
- Playfair 700: "The Philosophy Behind Every Plate"
- Inter 300 bio: 2 paragraphs — trained at Le Cordon Bleu Paris, worked in Michelin kitchens, now brings restaurant-quality dining to private homes. Seasonal produce, dietary needs met with care.
- Three burgundy chips: "Le Cordon Bleu · Michelin-trained · Seasonal & Local"
- "Learn more about Elise →" burgundy link

{/* Image brief: female chef in elegant kitchen, white chef jacket, preparing dish, warm light, professional but personal */}

### 6. How It Works
- "The Process" in Playfair 700
- 4-step horizontal row with large faded burgundy Playfair number (opacity 0.08) behind each step:
  1. "Initial Enquiry" — Tell me your vision, guest count, and dietary needs
  2. "Bespoke Menu Design" — I craft a menu tailored to your occasion and preferences
  3. "Sourcing & Prep" — I shop at trusted local suppliers and prep the day before
  4. "The Dinner" — I cook, plate, and serve in your home — you just enjoy
- Inter 300 descriptions, stagger fade-up on scroll

### 7. Testimonials
- Ivory surface section
- 3 cards: Playfair italic quote, client name + event type in Inter 10px muted
- Small 5-star row in gold above each quote
- Stagger fade-up on scroll

### 8. Gallery Strip
- 5 images in a horizontal scrollable strip (overflow-x auto on mobile, flex on desktop)
- Fixed height 300px, each image min-width 380px, object-cover, slight scale on hover
- No border radius

{/* Image brief: beautifully plated starter, elegant ceramic, dark slate background, warm studio light */}
{/* Image brief: dinner party table setting, candles, flowers, intimate warm atmosphere */}
{/* Image brief: chef hands finishing a dish, artistic plating detail, close-up */}
{/* Image brief: sharing feast table, abundance of dishes, warm candle light, celebratory */}
{/* Image brief: dessert plate, elegant fine dining style, dark background, gold accents */}

### 9. CTA Banner
- Full-width deep burgundy `#6d1f35` background
- Playfair 700 italic ivory: "Let's Plan Your Perfect Evening"
- Inter 300 ivory sub: "Every event is bespoke — get in touch to start the conversation"
- "Send an enquiry →" ivory bg burgundy text button
- Inter 10px ivory 60%: "Usually responds within 24 hours · Available across London & Home Counties"

### 10. Footer
- Warm near-black background, Playfair italic wordmark in gold
- Nav links · Instagram · Email
- "© 2026 Chef Elise Laurent · Private Chef · London & Home Counties"

## Animations
- Hero image: gentle float `y: 0→-6→0`, 7s loop
- Menu cards: stagger fade-up on scroll (y: 20→0)
- Burgundy rules: scaleX 0→1, 0.5s
- Gallery: fade-in stagger on scroll

## Responsive
- Mobile: stacked hero, single-column menus, scrollable gallery strip

## Full Copy
- Wordmark: "Chef Elise Laurent"
- Tagline: "Private Chef & Catering · London"
- Hero: "Extraordinary Dining, In Your Home" / "Bespoke menus crafted for intimate dinners, celebrations, and corporate events"
- Menus: Seasonal Tasting from £120pp · Classic British from £65pp · Mezze & Sharing from £55pp
- Events: Intimate Dinner Parties · Celebrations & Birthdays · Corporate Lunches · Wedding Catering
- Process: Initial Enquiry → Bespoke Menu Design → Sourcing & Prep → The Dinner
- Testimonial: "Elise turned our anniversary dinner into something we'll talk about for years. Seven courses of pure magic." — Claire & David H., March 2026
- CTA: "Let's Plan Your Perfect Evening" / "Every event is bespoke — get in touch"
