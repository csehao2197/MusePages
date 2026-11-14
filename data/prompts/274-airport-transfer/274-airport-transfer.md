# Meridian Cars: Airport Transfer Website Prompt

## 1. Goal
Build a calm, dependable website for **Meridian Cars**, an airport transfer company with fixed prices. Deep night blue, warm white, one amber accent, a clean grotesk, and one signature: a split flap board that flips to show the next pickup. Everything says the car will be there.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking engine, no flight API. Actions are a phone link and an email link.

## 3. Design system
```css
:root {
  --paper: #F4F3EF;
  --ink: #101A2B;              /* night blue, used as dark ground */
  --accent: #D79A2B;           /* amber */
  --on-accent: #101A2B;
  --surface: #E7E6E1;
  --muted: #5D6675;
  --line: rgba(16,26,43,0.15);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: dark, light, light, surface, dark, accent, dark footer.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@500;600;700&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet" />
```
- **Display:** Instrument Sans 600, clamp(42px, 5.6vw, 84px), line-height 1.0, letter-spacing -0.035em
- **Body:** Inter 300, 16px, line-height 1.6
- **Meta layer:** IBM Plex Mono 500, 11px, uppercase, letter-spacing 0.06em. Times, prices, terminals, index labels. Also used for the split flap board.
- No italics. Emphasis by a whole line in amber.

## 5. Signature element
**A split flap board.** One row of a departure board built from small dark tiles, each showing a character in mono. On load the tiles flip through a few characters and settle, one after another from left to right, 40ms apart, spelling the next scheduled pickup: time, airport code, terminal and a passenger initial. Each tile flips on the X axis with a hairline across its middle, exactly like the real thing.

One row only, one flip on load. It does not loop and it makes no sound.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, night blue, wordmark left, four links right, amber pill with a round arrow circle, and the phone number in mono.
2. **Hero, split portrait**: night blue ground. Headline left over a hairline, a photograph of a saloon car at an airport set bleeding off the right edge, a sentence and two actions beneath. Min height `clamp(520px, 76vh, 780px)`. *Photograph: a clean dark saloon car waiting outside an airport terminal at dawn, warm interior light, driver stepping out.*
3. **The board**: light. The split flap row (section 5), centred, with a mono caption.
4. **Fixed prices, ruled table**: light. Eight rows: from, to, car, price. All in mono, right aligned prices. A line beneath about what is included.
5. **What is included, index**: surface. Two ruled columns: always included and never charged extra. Flight tracking, waiting time, meet and greet, tolls, child seats.
6. **How it works, numbered rows**: light. Four rows on hairlines with mono markers: booking, the night before, arrivals, the drive.
7. **The cars**: dark night blue, inset 16px, `--panel-radius`. Three rows in paper colour: saloon, estate, van. Each with seats, cases and a price note in mono.
8. **Waiting and delays, statement**: light. One paragraph at 22px starting at one third about what happens when a flight is three hours late, which is the thing people actually worry about.
9. **One quote**: surface. A single centred quote in Instrument Sans at 28px with a signature line in mono.
10. **Book, accent panel**: amber ground, night blue text, inset panel. One line, the phone number set large, and a mono note about booking by text.
11. **Footer**: dark night blue. Giant cropped `MERIDIAN CARS` wordmark, licence line, coverage, three small links.

## 7. Motion
- Headline fades up 16px once.
- Split flap flips on load, as described.
- Table rows fade in with 0.04s stagger.
- Hover: rows lighten their hairline, arrow circles slide 4px.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the board already settled.

## 8. Responsive
- **Mobile under 768px:** an amber call bar is fixed to the bottom with padding that adds `env(safe-area-inset-bottom)`. Hero photograph moves above the headline at 40vh. The price table becomes stacked rows with the price on the same line as the route. The board shrinks to fit and drops the passenger initial. No horizontal page scroll.
- **Tablet:** hero stays split, table unchanged.
- **Desktop:** content max-width 1200px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** MERIDIAN CARS. Meta: `AIRPORT TRANSFERS. FIXED PRICES. TWENTY TWO YEARS.`

**Nav:** Prices, Included, The cars, Contact. Button: `Book a car`. Mono: `01279 555 0117`

**Hero**
- Headline: `The car is already there when you land.`
- Sentence: `Fixed prices agreed when you book, flights tracked automatically, and an hour of free waiting after you land. No surge, no meter, no surprises at the kerb.`
- Actions: `Book a car`, `Get a price`

**The board caption:** `Next pickup on the board. We run about fourteen of these a day.`
Board content: `06:20  LHR  T5  A. REYNOLDS`

**Fixed prices** (label `001/ Prices`)
| From | To | Car | Price |
|---|---|---|---|
| Bishop's Stortford | Stansted | Saloon | 32 GBP |
| Bishop's Stortford | Heathrow T5 | Saloon | 128 GBP |
| Cambridge | Stansted | Saloon | 78 GBP |
| Cambridge | Heathrow T2 | Estate | 185 GBP |
| Hertford | Luton | Saloon | 74 GBP |
| Hertford | Gatwick | Saloon | 148 GBP |
| Saffron Walden | Stansted | Van | 62 GBP |
| Chelmsford | Heathrow T3 | Estate | 195 GBP |
Note: `Prices include tolls, parking, meet and greet and an hour of waiting. They do not change at night or at weekends.`

**What is included** (label `002/ Included`)
- Always: `Flight tracking, we move with your flight`, `One hour free waiting after landing`, `Meet and greet in arrivals with a name board`, `Tolls, drop off charges and parking`, `Child seats, any age, booked free`, `A text when the driver sets off`
- Never charged: `Night surcharge`, `Bank holiday surcharge`, `Extra luggage`, `Card payment fee`, `Cancellation up to 12 hours before`, `Waiting caused by a late flight`

**How it works** (label `003/ How it works`)
- `WHEN YOU BOOK` **We agree the price.** `By phone, text or email. You get it in writing the same day.`
- `THE NIGHT BEFORE` **A message.** `Driver name, car, registration and the time they will set off.`
- `ON ARRIVAL` **In the hall, not the car park.** `We track the flight, park up and meet you at arrivals with a board.`
- `THE DRIVE` **Quiet or chatty, your call.** `Water in the door, charger in the back, radio off unless you want it.`

**The cars**
- **Saloon.** `Three passengers, two large cases.` `STANDARD PRICE`
- **Estate.** `Four passengers, four large cases.` `PLUS 15 GBP`
- **Van.** `Seven passengers, seven cases.` `PLUS 35 GBP`

**Waiting and delays** (label `004/ When things go wrong`)
`If your flight is three hours late at two in the morning, the driver will still be there. We track every flight from the moment it leaves, so the car moves with it. After the first free hour we charge 12 GBP an hour, and if the delay was the airline's fault rather than yours, we usually do not charge it at all.`

**Quote:** `Our flight landed four hours late. He was standing there with the board and had bought my daughter a hot chocolate.`
Signature: `The Nolan family, Hertford`

**Book panel**
- Line: `Tell us the flight number and we will do the rest.`
- Phone set large: `01279 555 0117`
- Mono: `BOOK BY TEXT OR WHATSAPP. ANSWERED BETWEEN 06:00 AND 23:00, EVERY DAY.`

**Footer**
`MERIDIAN CARS`, `Covering Hertfordshire, Essex and Cambridgeshire`, `bookings@meridiancars.co.uk`
Mono: `Licensed private hire operator, East Herts Council, licence PH0118. Fully insured, DBS checked drivers.`
Links: `Prices`, `Included`, `Contact`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, live maps, countdown timers, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
