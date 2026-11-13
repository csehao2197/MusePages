# Clearwater — Pool Service Website Prompt

## 1. Goal Statement
Build a bright, refreshing website for **Clearwater**, a residential pool cleaning and maintenance company — pale sky and deep aqua, a slow caustic light pattern rippling across the hero like sunlight on a pool floor, rounded wave section edges, and photography that makes the water look cold and clean.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries, no booking system, no chemical calculator. Plans link to a phone number and email.

## 3. Design System — Colors
```css
:root {
  --background: hsl(196, 60%, 97%);      /* pale sky */
  --foreground: hsl(206, 44%, 16%);      /* deep water navy */
  --primary: hsl(191, 84%, 40%);         /* aqua */
  --primary-foreground: hsl(0, 0%, 100%);
  --deep: hsl(204, 62%, 24%);            /* deep end, used for dark bands */
  --muted-foreground: hsl(206, 12%, 44%);
  --border: hsl(196, 34%, 88%);
  --card: hsl(0, 0%, 100%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet" />
```
- **H1:** Outfit 800, clamp(44px, 6vw, 88px), line-height 1.02, letter-spacing -0.035em
- **H2:** Outfit 800, clamp(30px, 3.6vw, 52px)
- **Body:** Outfit 400, 17px, line-height 1.65
- **Labels and prices:** Outfit 600, 12px, uppercase, letter-spacing 0.12em

## 5. Visual Effects

**Effect 1 — Caustic light.** Over the hero image, a layer of overlapping blurred white shapes in `mix-blend-mode: soft-light` that drift and scale slowly on an 18-second loop, so the hero looks like it is lit through moving water. Three shapes only, built from radial gradients.

```jsx
<motion.div
  aria-hidden
  className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-70"
  style={{
    backgroundImage:
      "radial-gradient(38% 26% at 30% 40%, #fff 0%, transparent 60%), radial-gradient(28% 22% at 70% 55%, #fff 0%, transparent 60%), radial-gradient(22% 30% at 52% 22%, #fff 0%, transparent 60%)",
    filter: "blur(18px)",
  }}
  animate={{ backgroundPosition: ["0% 0%", "6% 10%", "0% 0%"], scale: [1, 1.06, 1] }}
  transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
/>
```

**Effect 2 — Wave edges.** Sections in aqua or deep navy begin and end with a full-width SVG wave path 70px tall, offset slightly between top and bottom so it never looks symmetrical.

**Effect 3 — Water ripple on cards.** Plan cards have a very subtle aqua radial glow that grows from the bottom edge on hover, 400ms, like light coming up through water.

## 6. Component Breakdown

1. **Top bar** — 38px, deep navy, white text: a line about the season's opening schedule.
2. **Navbar** — 80px, white with a soft shadow on scroll. Wordmark left with a small droplet icon, links centre, aqua `Get a quote` pill right. Sticky.
3. **Hero** — full-width photograph at 80vh with the caustic layer (Effect 1) and a soft navy gradient at the bottom. Text sits bottom-left in a white block with its own rounded corners: label, H1, subline, two buttons. *Image: sparkling clean residential swimming pool in bright sunlight, blue water with visible light patterns, tidy stone surround, no people.*
4. **Plans** — three cards with wave edges above the section (Effect 2): Weekly, Fortnightly and Open-and-close. Each with price per visit, what is included as five ticked lines, and a button. Middle card in aqua with white text.
5. **What every visit includes** — a 4-column row of eight short items with droplet-style icons: skim and net, brush walls and steps, vacuum floor, empty baskets, backwash filter, test and balance chemistry, check pump and heater, photo report by text.
6. **Chemistry band** — deep navy section with wave edges: three big figures for the target ranges of chlorine, pH and alkalinity, with one line each explaining what happens when they drift.
7. **Extra services** — a simple list of six with prices: green pool recovery, filter deep clean, heater service, leak detection, cover replacement, winterising.
8. **Green pool rescue** — a two-image before and after with a short paragraph and a typical turnaround time. *Image briefs: a neglected green algae-filled pool, and the same style of pool restored to clear blue water.*
9. **Seasons** — four short columns, one per season, saying what they do and when.
10. **Reviews** — three cards with five aqua stars, quote, name, town and the plan they are on.
11. **Areas and hours** — towns as soft pills, hours beneath.
12. **Final CTA** — aqua band with wave edges, white text, H2, phone number and button.
13. **Footer** — white, four columns, insurance and certification line.

## 7. Animations
- Hero text block: fade up 24px, 0.9s; the caustics run from the start
- Plan cards: fade up 20px, stagger 0.1s; Effect 3 on hover
- Included items: fade in with 0.04s stagger
- Chemistry figures: fade up, no counter animation
- Before-and-after images: the after image fades in 0.5s after the before image
- Wave edges: static, no motion

## 8. Responsive
- **Mobile (<768px):** hero drops to 62vh with the text block full width beneath the image rather than overlapping; H1 at 44px; plans stack with the middle one first; included items become 2 columns; chemistry band stacks to 3 rows; sticky aqua call button at the bottom of the screen; navbar shows wordmark and a phone icon.
- **Tablet:** plans stay 3 across at tighter padding; included items 4 columns.
- **Desktop:** max-width 1240px, `px-8`, section spacing `py-24`.

## 9. Full Copy

**Top bar:** `Now booking spring openings — first week of April is almost full`

**Navbar:** Plans · What's included · Extras · Areas — Get a quote

**Hero**
- Label: `POOL CLEANING & MAINTENANCE · SCOTTSDALE, AZ`
- H1: `A pool you swim in, not a pool you look after.`
- Subline: `Weekly service from a team that sends you a photo after every visit, balances the chemistry properly, and tells you about a failing pump before it fails.`
- Buttons: `Get a quote` · `Call (480) 555-0142`

**Plans** — H2 `Three ways to never think about it again.`
- **Fortnightly** — `$36 per visit` — `Skim, brush and vacuum` · `Chemistry tested and balanced` · `Baskets emptied` · `Photo report after every visit` · `No contract, cancel any time`
- **Weekly** — `$29 per visit` — `MOST POPULAR` — `Everything in fortnightly` · `Filter backwash as needed` · `Equipment check each visit` · `Priority booking for repairs` · `Chemicals included`
- **Open & close** — `$240 per season` — `Spring opening and winter closing` · `Cover on and off` · `Full chemistry reset` · `Equipment inspection` · `Ideal for seasonal homes`

**What every visit includes** — H2 `Eight things, every single time.`
Skim and net · Brush walls and steps · Vacuum the floor · Empty skimmer and pump baskets · Backwash the filter · Test and balance chemistry · Check pump, heater and timer · Text you a photo report

**Chemistry band** — H2 `The three numbers that matter.`
- `1–3 ppm` **Free chlorine** — `Below one and algae starts within two warm days. Above five and it stings eyes.`
- `7.4–7.6` **pH** — `Drift high and the chlorine stops working, however much you add.`
- `80–120 ppm` **Total alkalinity** — `This is what stops pH bouncing around after every rainstorm.`

**Extra services** — H2 `When something needs more than a clean.`
- Green pool recovery — `from $280`
- Filter deep clean and strip — `$145`
- Heater service — `$165`
- Leak detection — `$220`
- Cover replacement — `quoted`
- Winterising — `$180`

**Green pool rescue** — H2 `Green on Friday, blue by Tuesday.` `A neglected pool usually takes three visits: a shock treatment and filter strip on day one, a heavy vacuum on day three, then a final balance. We quote a fixed price after seeing a photo, and we don't charge again if it takes longer than we thought.`

**Seasons** — H2 `What we do, and when.`
- **Spring** — `Open the pool, remove and clean the cover, reset the chemistry and restart the equipment.`
- **Summer** — `Weekly visits, heavier chlorine demand, and a filter check every month.`
- **Autumn** — `Leaf season. Baskets fill fast, so visits stay weekly even as it cools.`
- **Winter** — `Reduced schedule or full winterising, depending on whether you swim year-round.`

**Reviews**
- `"They caught a failing pump seal before it flooded the equipment pad. Saved me a few thousand dollars."` — *Denise, North Scottsdale* — `WEEKLY PLAN`
- `"The photo after every visit is such a small thing and it's the reason I trust them."` — *Aaron, Paradise Valley* — `WEEKLY PLAN`
- `"Inherited a green swamp when we bought the house. Blue in five days."` — *The Mercers, Tempe* — `GREEN POOL RECOVERY`

**Areas and hours:** Scottsdale · Paradise Valley · Tempe · Mesa · Chandler · Gilbert · Fountain Hills · Cave Creek · Ahwatukee · Phoenix
`Monday to Friday 7am – 5pm · Saturday 8am – 1pm · Emergency callouts by arrangement`

**Final CTA** — H2 `Get a quote in about a minute.` `Send a photo of your pool and we'll come back with a fixed weekly price.` `(480) 555-0142` · Button `Get a quote`

**Footer** — CLEARWATER POOL SERVICE · Plans · What's included · Extras · Areas · Reviews · Contact · `Licensed ROC 341882 · Bonded and insured · CPO-certified technicians` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
