# Keyline Locksmiths — Locksmith Website Prompt

## 1. Goal Statement
Build a bold, high-contrast website for **Keyline Locksmiths**, a 24-hour emergency locksmith — jet black with safety yellow, a massive phone number that is impossible to miss, heavy condensed type, and an engineered, industrial feel that says fast, capable and honest in under two seconds.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries, no forms with validation, no quote calculators. Every call to action is a `tel:` link.

## 3. Design System — Colors
```css
:root {
  --background: hsl(0, 0%, 5%);          /* jet black */
  --foreground: hsl(0, 0%, 96%);
  --primary: hsl(50, 100%, 52%);         /* safety yellow */
  --primary-foreground: hsl(0, 0%, 5%);
  --muted-foreground: hsl(0, 0%, 58%);
  --border: hsl(0, 0%, 18%);
  --card: hsl(0, 0%, 9%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
```
- **H1 and phone number:** Big Shoulders Display 900, uppercase, clamp(64px, 12vw, 190px), line-height 0.85
- **H2:** Big Shoulders Display 700, uppercase, clamp(40px, 5.5vw, 80px), line-height 0.9
- **Body:** Inter Tight 400, 17px, line-height 1.6
- **Labels, prices, times:** JetBrains Mono 500, 12–14px, uppercase, letter-spacing 0.06em

## 5. Visual Effects

**Effect 1 — Hazard stripe.** A 14px band of diagonal yellow and black stripes separates key sections and runs across the top of the page: `repeating-linear-gradient(-45deg, var(--primary) 0 14px, var(--background) 14px 28px)`. The top one scrolls slowly sideways (`background-position` animation, 20s linear infinite).

**Effect 2 — Key-cut line.** A single SVG path drawn as the profile of a key blade — a long horizontal line with a series of sharp peaks and valleys — runs across the hero under the H1 in yellow, 3px stroke. It draws itself on load with `pathLength 0 → 1` over 1.6s.

**Effect 3 — Live dot.** A small pulsing green dot beside `Available now` in the navbar and hero, using a ring that scales 1 → 2.4 and fades out every 1.8s.

## 6. Component Breakdown

1. **Hazard stripe** — Effect 1, full width, top of page.
2. **Navbar** — 76px, black, wordmark left in Big Shoulders with a key icon, `Available now` live dot (Effect 3) centre on desktop, yellow `Call 0800 046 7788` button right. Sticky.
3. **Hero** — full viewport. Mono label, giant H1 across two lines, key-cut line (Effect 2), subline, and then the phone number set enormous in yellow as a `tel:` link. Beneath, three mono facts in a row. Background photograph at 25% opacity with a black gradient. *Image: close-up of a locksmith's hands working on a door lock with tools, dramatic side lighting, dark industrial mood.*
4. **Response time strip** — yellow band, black text: four big numbers with mono labels (`20 MIN`, `24/7`, `£0 CALL-OUT`, `15 YRS`).
5. **Services** — a 2×3 grid of black cards with thin borders, each with a large lucide icon in yellow, service name in Big Shoulders, and two lines. On hover the card border turns yellow and the icon shifts 4px right.
6. **Fixed prices** — a bold list with mono prices right-aligned and dotted leaders between name and price, like a price board. Five rows.
7. **Hazard stripe** divider.
8. **How we work** — three columns with big outlined numbers (`01`, `02`, `03`) using `-webkit-text-stroke: 2px var(--primary)` and transparent fill.
9. **Areas covered** — a wrapped list of area names as yellow-bordered pills. No map.
10. **Reviews** — three reviews on `--card`, five yellow stars, quote, name and area, and the job type in mono.
11. **Final call** — full-width yellow section, black giant text `LOCKED OUT?` and the phone number again, huge.
12. **Footer** — black, small, with registration and insurance details in mono.

## 7. Animations
- Hero H1: slams in, `y: 80 → 0`, `opacity 0 → 1`, spring (stiffness 500, damping 30), lines stagger 0.1s
- Key-cut line: Effect 2
- Phone number: `scale 0.95 → 1`, delay 0.6s; on hover the letters shift 2px up in sequence with 0.02s stagger
- Response numbers: fade up with 0.08s stagger (no counting animation)
- Service cards: fade up 20px, stagger 0.06s
- Hazard stripe scroll: Effect 1

## 8. Responsive
- **Mobile (<768px):** a sticky yellow bar is fixed to the bottom of the screen with `Call now — 0800 046 7788`; H1 at 64px; phone number in the hero at 44px; response strip becomes 2×2; services 1 column; price leaders shorten; navbar shows wordmark and a yellow phone icon button only.
- **Tablet:** services 2 columns; response strip stays 4 across.
- **Desktop:** max-width 1320px, `px-8`, section spacing `py-24`.

## 9. Full Copy

**Brand:** KEYLINE LOCKSMITHS · Leeds

**Navbar:** Services · Prices · Areas · Reviews — `● Available now` — Call 0800 046 7788

**Hero**
- Label: `24-HOUR EMERGENCY LOCKSMITH · LEEDS & WEST YORKSHIRE`
- H1: `LOCKED OUT? / WE'RE ON OUR WAY.`
- Subline: `Local, DBS-checked locksmiths who open doors without drilling in nine jobs out of ten. Fixed prices told to you on the phone, before we set off.`
- Phone: `0800 046 7788`
- Facts: `NO CALL-OUT FEE` · `NON-DESTRUCTIVE ENTRY` · `INSURANCE-APPROVED LOCKS`

**Response strip:** `20 MIN` average arrival · `24/7` including bank holidays · `£0` call-out fee · `15 YRS` in West Yorkshire

**Services** — H2 `WHAT WE DO`
- **Emergency lockouts** — `Home, office or car. Opened without damage wherever possible.`
- **Lock changes** — `New tenants, lost keys or a break-up. Same day.`
- **Burglary repairs** — `Doors and frames secured tonight, repaired properly tomorrow.`
- **uPVC door repairs** — `Failed mechanisms and dropped doors fixed on the spot.`
- **Security upgrades** — `British Standard locks that satisfy your insurer.`
- **Safes** — `Opened, repaired and installed, domestic and commercial.`

**Fixed prices** — H2 `PRICES. UP FRONT.`
- Daytime lockout (8am–6pm) ........ `£79`
- Evening and night lockout ........ `£119`
- Euro cylinder lock change ........ `from £89`
- uPVC mechanism replacement ........ `from £165`
- British Standard deadlock fitted ........ `from £140`
Note: `All prices include labour and VAT. Parts are quoted before fitting.`

**How we work** — H2 `NO SURPRISES`
- **01** — **You call, we quote.** `A real locksmith answers and gives you a fixed price.`
- **02** — **We arrive fast.** `Average arrival is twenty minutes across Leeds.`
- **03** — **You pay after.** `Card or cash, only once the job is done.`

**Areas covered:** Leeds City Centre · Headingley · Chapel Allerton · Roundhay · Horsforth · Kirkstall · Armley · Morley · Pudsey · Wetherby · Garforth · Otley · Bradford · Wakefield

**Reviews**
- `"Locked out at 2am with a toddler asleep inside. He was here in fifteen minutes and the door was open in two."` — *Emma, Headingley* — `EMERGENCY LOCKOUT`
- `"Quoted £89 on the phone, charged £89. Rare."` — *Marcus, Roundhay* — `LOCK CHANGE`
- `"Came out after our burglary, secured everything and dealt with our insurer's paperwork."` — *Jan, Horsforth* — `BURGLARY REPAIR`

**Final call** — `LOCKED OUT?` · `0800 046 7788` · `Answered by a locksmith, 24 hours a day.`

**Footer** — KEYLINE LOCKSMITHS · Services · Prices · Areas · Reviews · Privacy · `Master Locksmiths Association approved · DBS checked · £5m public liability insurance` · `Keyline Locksmiths Ltd, company no. 08765432` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
