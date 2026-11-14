# Fenn Mallory: Voice Over Artist Website Prompt

## 1. Goal
Build a quiet, confident one page site for **Fenn Mallory**, a voice over artist who records from a treated booth at home. Warm charcoal, bone text, one ochre accent, a large serif, and one signature: a waveform that draws itself once across the page. The page should feel like listening, not like a showreel.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no audio player library. If audio is included at all, use a plain `<audio>` element with native controls, one per sample. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #EDE8DF;            /* bone, used as text on dark */
  --ink: #1F1D1A;              /* warm charcoal, the default ground */
  --accent: #C08A2E;           /* ochre */
  --on-accent: #1F1D1A;
  --surface: #2A2723;
  --muted: #98918A;
  --line: rgba(237,232,223,0.15);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Dark led: `--ink` is the ground and `--paper` the text. Rhythm: dark, dark, surface, light, dark, accent, dark footer. One light section for the rates.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,500;1,6..72,300&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Newsreader 300, clamp(46px, 6.5vw, 104px), line-height 1.0, letter-spacing -0.02em
- **Body:** Inter 300, 16px, line-height 1.65
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Durations, rates, turnaround, index labels.
- At most one italic word per headline, in ochre.

## 5. Signature element
**A waveform, drawn once.** A single ochre stroke across the full width, shaped like a spoken sentence: dense clusters of tall peaks with real gaps between them where the breaths are. It is one SVG path, 2px, no fill. On scroll into view it draws from left to right over 1.8 seconds with `pathLength`, then stops. Beneath it, a mono caption names the line that was spoken.

It never animates to audio and never loops. It is a picture of a voice, not a visualiser.

## 6. Sections, each a different skeleton

1. **Navbar**: 70px, transparent, wordmark left, three links right, ochre pill with a round arrow circle.
2. **Hero, statement**: dark. One long serif sentence from one third of the width, mono label `000/ Fenn Mallory` in the left column, a short paragraph and two actions. No photograph. Min height `clamp(500px, 74vh, 760px)`.
3. **The waveform**: the signature element (section 5) with its caption.
4. **What I sound like, index swap**: dark. Five categories listed large on the left. Hovering one swaps a short description and a mono note on the right, saying what the read is for and how fast it usually is.
5. **Samples, ruled list**: surface. Six rows on hairlines: client, what it was, length in mono, and a plain play control. Nothing autoplays.
6. **The booth, photo led**: surface. One wide photograph with a mono caption naming the microphone and the treatment. *Photograph: a small treated recording booth with a large diaphragm microphone, foam and blankets, warm lamp, no person.*
7. **Rates, hairline rows**: light bone ground, inset 16px, `--panel-radius`, dark text. Five rows: type of job, what it covers, rate. Figures right aligned in mono.
8. **How a session runs, numbered rows**: dark. Four rows: the script, the record, the pickups, delivery. Honest about how long each takes.
9. **One quote**: dark. A single centred quote in Newsreader at 30px with a signature line in mono.
10. **Send a script, accent panel**: ochre ground, dark text, inset panel. One line, two actions, a mono note about the free test read.
11. **Footer**: dark. Giant cropped `FENN MALLORY` wordmark, email, union status, three small links.

## 7. Motion
- Hero sentence fades up 16px once.
- Waveform draws once, as described.
- Index swap crossfades text over 0.2s.
- Sample rows fade in with 0.05s stagger.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the waveform already drawn.

## 8. Responsive
- **Mobile under 768px:** hero at 40px from the left margin. Waveform keeps its full width but loses fine detail. Index swap becomes a stacked list with the description always visible. Rates table becomes stacked rows with the rate on the same line. No horizontal page scroll.
- **Tablet:** index swap keeps hover.
- **Desktop:** content max-width 1160px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** FENN MALLORY. Meta: `VOICE OVER. BRITISH, WARM, MID RANGE. HOME BOOTH.`

**Nav:** Samples, Rates, Booth. Button: `Send a script`

**Hero** (label `000/ Fenn Mallory`)
- Sentence: `A voice that sounds like someone *telling* you, not someone selling you.`
- Paragraph: `British, warm, mid range, and comfortable being quiet. Fifteen years of documentary, corporate and audiobook work, recorded from a treated booth with a Neumann and delivered the same day.`
- Actions: `Send a script`, `Hear samples`

**Waveform caption:** `"It takes two days, because it has to." Twelve seconds, one take, no compression.`

**What I sound like** (label `001/ Reads`)
- **Documentary.** `Unhurried, low, plenty of space between sentences.` `USUALLY 110 TO 130 WORDS A MINUTE`
- **Corporate.** `Clear and friendly without the smile you can hear.` `USUALLY 140 WORDS A MINUTE`
- **Audiobook.** `Long form, consistent across sessions, character work where needed.` `ABOUT 9,500 WORDS A DAY`
- **Explainer.** `Brighter, faster, still no forced enthusiasm.` `USUALLY 160 WORDS A MINUTE`
- **Telephone and IVR.** `Neutral, patient, recorded to spec.` `PROMPTS AT 24 BIT, 48 KHZ`

**Samples** (label `002/ Samples`)
- **National Trust**: `Visitor film, Fountains Abbey` `2:40`
- **Wellcome Collection**: `Exhibition audio guide` `18:00`
- **Faber**: `Audiobook, literary fiction` `9 HRS`
- **Siemens**: `Internal training series` `4:10`
- **Channel 4**: `Documentary narration, two episodes` `48:00`
- **NHS Somerset**: `Telephone system, 140 prompts` `N/A`

**Booth caption:** `Neumann TLM 103, Cloudlifter, treated booth in a spare room. Silent after 22:00 because of the trains.`

**Rates** (label `003/ Rates`)
- `Corporate or explainer, up to 2 minutes` ... `Script, record, one round of pickups` ... `220 GBP`
- `Documentary narration, per finished minute` ... `Record and pickups, no sync` ... `65 GBP`
- `Audiobook, per finished hour` ... `Record, punch and roll, proof corrections` ... `280 GBP`
- `Telephone prompts, up to 50` ... `Recorded to your spec and named` ... `180 GBP`
- `Live session direction` ... `Source Connect or Zoom, per hour` ... `90 GBP`
Mono: `Usage for broadcast and paid media is quoted separately. I will tell you when it applies rather than hiding it in a footer.`

**How a session runs** (label `004/ Process`)
- `DAY ONE` **The script arrives.** `I read it aloud once and send back anything that trips the tongue.`
- `SAME DAY` **The record.** `Two takes of everything, plus alternates on the lines that matter.`
- `WITHIN 24 HOURS` **Pickups.** `One round included. Send timecodes and I will match the level and the room.`
- `DELIVERY` **Files how you want them.** `WAV at 48 kHz by default, mixed or raw, named to your convention.`

**Quote:** `He rerecorded four lines at eleven at night because the edit changed. Did not mention it and did not charge for it.`
Signature: `Ruth Ellery, producer`

**Send a script panel**
- Line: `Send the script and I will record thirty seconds of it for free.`
- Actions: `Send a script`, `Book a live session`
- Mono: `TEST READS BACK WITHIN A WORKING DAY, USUALLY SOONER.`

**Footer**
`FENN MALLORY`, `fenn@fennmallory.voice`, `Equity member. Source Connect and Cleanfeed.`
Links: `Samples`, `Rates`, `Booth`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, autoplaying audio, animated visualisers reacting to sound, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
