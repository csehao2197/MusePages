# Northlight: Real Estate Photography Website Prompt

## 1. Goal
Build a website for **Northlight**, a photographer who shoots houses for estate agents in Sussex. Near white, graphite ink, one slate blue accent, a tight grotesk.

**This one keeps a single moving idea and nothing else.** Three bracketed exposures merge into the finished frame, because that one movement explains the entire craft in a second and a half and saves four paragraphs of text. Everything around it is deliberately flat: no dark panel, no coloured closing band, no counters, no second animation. If a page has one trick, it has to earn its place by replacing words.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking system, no lightbox, no filter.

## 3. Design system
```css
:root {
  --paper: #FAFAF8;
  --ink: #1D1F22;
  --accent: #46617F;
  --on-accent: #FFFFFF;
  --surface: #EEEEEB;
  --muted: #666B72;
  --line: rgba(29,31,34,0.15);
  --radius: 2px;
  --panel-radius: 2px;
}
```
Section rhythm: light, light, surface, light, light, surface, light. **No dark section and no accent panel on this page.** Slate blue appears only in the merge animation, in the turnaround line and on text links.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;600;700&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Schibsted Grotesk 700, clamp(38px, 4.8vw, 68px), line-height 1.02, letter-spacing -0.03em. Restrained, because the photographs are the loud part.
- **Body:** Inter 300, 16px, line-height 1.6
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase. Turnaround, prices, bedroom counts, towns.

## 5. The one moving thing
**Three exposures, merged.** Three small frames of the same living room sit in a row: one dark with the window correctly exposed, one mid, one bright with the room correct and the window blown out. When the section enters view they slide together and crossfade into a single larger finished frame where both the room and the view through the window are right. 1.6 seconds, once.

Four images, opacity and transform. No slider, no hover, no repeat, and nothing else on this page animates beyond photographs settling.

## 6. Sections

Ten sections. Note that the page ends on a plain section, not on a coloured call to action band.

1. **Navbar**: 64px, paper, one hairline beneath. Wordmark left. Four links right. **The action is a text link with a 1px underline**, reading `Book a shoot`, not a button. Beside it, a mono line stating the current turnaround, which is the single most persuasive thing on the page.
2. **Hero, three photographs in a row**: no headline over an image. Instead a short grotesk headline in plain paper space, then three interiors side by side beneath it at equal height, captioned in mono with town and bedroom count. Min height is whatever the content needs.
3. **Statement**: one paragraph at 22px starting at one third, about the one second a photograph has to stop a thumb.
4. **The three exposures**: surface tinted. The one moving thing (section 5) with a mono caption.
5. **Packages**: three packages as a plain ruled list, not cards. Name, what is included, turnaround and price, each on hairlines. The middle one is not highlighted and nothing is labelled most popular.
6. **Recent work**: a loose grid of six interiors at varied sizes with mono captions giving town, bedrooms and agent.
7. **How a shoot runs**: surface tinted. Four plain paragraphs with mono time markers. No panel, no inset, no dark ground.
8. **Preparing the house**: two ruled columns, what the vendor does and what the photographer moves. This is the page agents forward to their sellers, so it is written to be forwarded.
9. **One line about editing**: a single sentence, set large, stating plainly whether skies get replaced. Nothing else in the section.
10. **Contact**: plain. Phone number and email as large underlined links on paper, the coverage area in mono beneath, and three small footer links on the same block. The page ends here with no band of colour.

## 7. Motion
- The merge, once, as described.
- Photographs settle from `scale 1.02` with a 0.06s stagger and lift 3px on hover.
- Nothing else. No counters, no drawn lines, no reveals on the text.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the merged frame.

## 8. Responsive
- **Mobile under 768px:** the three hero photographs become one with the other two below it. The exposures stack vertically and the merge becomes a simple crossfade into the final frame. Packages become stacked rows. Grid one column. No horizontal page scroll and no sticky bar.
- **Tablet:** grid two columns, exposures stay in a row.
- **Desktop:** content max-width 1240px, gutters 40px, section padding 100px.

## 9. Full copy

**Wordmark:** NORTHLIGHT. Meta: `PROPERTY PHOTOGRAPHY. SUSSEX AND SURREY.`

**Nav:** Packages, Work, Preparing, Contact. Underlined action: `Book a shoot`. Mono: `CURRENT TURNAROUND: NEXT MORNING`

**Hero**
- Headline: `Photographs that survive being looked at on a phone, in a list of forty houses.`
- Three captions: `LEWES, 4 BED` · `HOVE, 2 BED FLAT` · `DITCHLING, 5 BED`
- *Photographs: a bright living room with the garden visible through the doors, a small flat kitchen that still reads as spacious, a hallway with the front door open.*

**Statement**
`An estate agency photograph has one job, which is to stop a thumb. It has about a second to do it, on a phone, in a list of forty other houses. That is why I shoot early, why I bracket every frame, and why I will spend ten minutes moving a bin and a car before I unpack anything.`

**Exposures caption:** `Three frames, two stops apart. The window keeps its view and the room keeps its light.`

**Packages**
- **Standard.** `Up to 15 images, one hour on site, straightened and colour corrected.` `NEXT MORNING. 145 GBP`
- **Full.** `Up to 30 images, floor plan, and a twilight exterior if the weather allows.` `NEXT MORNING. 245 GBP`
- **Premium.** `Everything in full, plus drone exteriors and a one minute walkthrough video.` `48 HOURS. 395 GBP`

**Recent work**
Lewes, 4 bed, for Aldridge & Co · Brighton, 2 bed flat, for Harding · Ditchling, 5 bed, for Aldridge & Co · Hove, 3 bed, for Seaward · Uckfield, cottage, for Mayhew · Steyning, barn conversion, for Harding

**How a shoot runs**
- `THE DAY BEFORE` `A short brief. Address, access, which rooms matter and whether the vendor will be in.`
- `ON SITE, ONE HOUR` `Room by room. Tripod, brackets, lights on, blinds up. I move small things and put them back.`
- `THAT EVENING` `The edit. Merged, straightened, colour corrected.`
- `BY 09:00` `A download link with full size and web sized versions, ready for the portals.`

**Preparing the house**
- Vendor: `Cars off the drive`, `Bins out of sight`, `Beds made, cushions straightened`, `Worktops cleared except one nice thing`, `Toilet seats down, towels matching`, `Lights on in every room, even in daylight`
- I will: `Move small clutter and put it back`, `Open blinds and curtains`, `Close the laptop and hide the cables`, `Turn off the television`, `Tidy the shoes by the door`, `Say nothing about your taste in art`

**One line about editing**
`No sky replacements unless you ask for them, and if you ask I will say so in the file names.`

**Contact**
`01273 555 0166` · `book@northlight.photo`
Mono: `COVERING SUSSEX, SURREY AND SOUTH LONDON. NEXT DAY SLOTS MOST WEEKS. SAME DAY EDITS FOR AN EXTRA 40 GBP.`
Mono, smaller: `Fully insured. CAA licensed for drone work, operator ID on request.`
Links: `Packages`, `Work`, `Preparing the house`

## 10. Never
A second animation of any kind, before and after sliders, dark sections, accent panels, giant cropped wordmarks, sticky call bars, a highlighted middle package, most popular badges, rounded cards, shadows, gradients, glow, icon grids, emoji, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono layer, `100vh` heroes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "clsx": "^2.1.0" }
```
