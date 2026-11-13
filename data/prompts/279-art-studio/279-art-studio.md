# Ninth Street: Art Studio Website Prompt

## 1. Goal
Build a website for **Ninth Street**, a painting studio in Manchester that runs evening classes and hires out easels. Raw canvas paper, charcoal ink, one vermilion accent, Instrument Serif.

**The idea here is the wall, not a gadget.** The whole page behaves like a studio wall with work pinned to it: things are not centred, not evenly spaced, and not all the same size. There is no animated centrepiece and nothing that draws itself. The interest comes from the layout being slightly off, on purpose, and from the work being allowed to be uneven in quality.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
Motion is used for image settling only. No component libraries, no booking engine, no lightbox.

## 3. Design system
```css
:root {
  --paper: #EDE7DA;
  --ink: #1C1A16;
  --accent: #B5431E;
  --on-accent: #FFFFFF;
  --surface: #E2DBCB;
  --muted: #635F56;
  --line: rgba(28,26,22,0.18);
  --radius: 0px;
  --panel-radius: 0px;
}
```
Radius is zero everywhere. Nothing on a studio wall has rounded corners.

Section rhythm: paper, paper, surface, paper, paper, surface, paper. **No dark section anywhere** and no accent coloured panel. Vermilion appears only as a small mark: a pinned dot, a price, one word.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Instrument Serif 400, clamp(52px, 8vw, 128px), line-height 0.92, letter-spacing -0.02em. Large and a little too big for its box, deliberately.
- **Body:** Inter 300, 16px, line-height 1.65
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase. Nights, prices, class sizes, dates.

## 5. The layout rule, which replaces a signature element
Every block on this page is offset from the one above it. Nothing shares a left edge with its neighbour. Use a twelve column grid and start sections at column 1, then 3, then 2, then 5, then 1 again, with widths that do not match. Two of the photographs hang 20px lower than their neighbours as if pinned crooked.

This is the entire concept. Resist the urge to tidy it into a neat grid, and resist the urge to add a drawn easel, a paint stroke, a palette or a brush.

## 6. Sections

Nine sections.

1. **Navbar**: 64px, paper, no hairline beneath. Wordmark left. Three links right. **The call to action is a plain underlined word**, `Classes`, in vermilion, at the same size as the links. No pill, no box, no arrow.
2. **Hero, full bleed photograph with the headline over it**: the studio from the back, the headline sitting in the lower left over the image in paper colour, no scrim, placed where the picture is dark enough to read. Min height `clamp(560px, 80vh, 880px)`.
3. **Statement**: starting at column 3, a single Instrument Serif paragraph at 30px, narrow measure, with a mono label above it.
4. **Classes**: four classes, each as a block starting at a different column, with the night, the length, the class size and the price in mono. Not a table and not four equal cards.
5. **What you work on**: starting at column 2. A plain two column list of what is provided and what to bring, set in body text.
6. **Work from the room**: surface tinted, full bleed edge to edge. Six paintings at six different sizes, two of them hanging slightly lower than the rest, captioned in mono with the student's first name only. The captions say plainly that some of these are first attempts.
7. **The tutors**: two people, inline portraits at 120px, one sentence each. Starting at column 5, so this block sits noticeably further right than anything else.
8. **Term dates**: surface tinted, three terms as mono lines with how a place is held. One vermilion dot marks the term that is nearly full.
9. **Footer**: three short lines at 14px, left aligned at column 1, and nothing else. No wordmark, no block, no panel.

## 7. Motion
- Hero photograph settles from `scale 1.03` once.
- Paintings settle from `scale 1.02` with a 0.06s stagger and lift 3px on hover.
- Nothing draws, nothing counts, nothing assembles.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** the column offsets collapse to a single 24px margin, but keep two of the paintings hanging lower so the wall idea survives. Headline at 46px. One column throughout. No horizontal page scroll.
- **Tablet:** offsets halve.
- **Desktop:** content max-width 1240px, gutters 32px, section padding varies between 80px and 160px so the rhythm is uneven.

## 9. Full copy

**Wordmark:** NINTH STREET. Meta: `PAINTING STUDIO. EVENING CLASSES. MANCHESTER.`

**Nav:** Classes, The room, Terms. Underlined action: `Classes`

**Hero**
- Headline over the photograph: `A room with bad light and good company.`
- *Photograph: a working painting studio from the back of the room, easels at different angles, paint on the floor, window light from one side, nobody in shot.*

**Statement** (label `001/ Eight at a time`)
`Eight easels, one room above a carpet warehouse, and a tutor who will not tell you that you have a good eye. We teach oil and acrylic to people who have never held a brush and to people who painted at school in 1974 and stopped. Nobody shows anybody their phone photographs of the Lake District.`

**Classes**
- **Monday, oil for beginners.** `Three hours. Six people. Twelve weeks, start any week.` `MONDAYS 18:30. 22 GBP A SESSION`
- **Wednesday, life drawing.** `Two and a half hours, a model, no instruction unless you ask for it.` `WEDNESDAYS 19:00. 16 GBP A SESSION`
- **Thursday, acrylic and colour.** `Three hours. Eight people. Mixing, mostly, for the first month.` `THURSDAYS 18:30. 22 GBP A SESSION`
- **Saturday, open studio.** `Four hours, no tutor, bring your own work. Easel and a sink.` `SATURDAYS 10:00. 9 GBP`

**What you work on**
- Provided: `Easel and board`, `Oil or acrylic paint in the basic range`, `Brushes, including the ones you will ruin`, `Turps, rags and a sink`, `Somewhere to leave a wet canvas for a week`
- Bring: `An apron or a shirt you have stopped caring about`, `Your own canvas if you want a size we do not stock`, `Nothing else`

**Work from the room** (label `002/ From the room`)
`Jess, first term` · `Mo, second attempt at the same jug` · `Priya, life drawing, twenty minutes` · `Alan, after four years` · `Dee, week three` · `Tom, abandoned and then finished`
Caption beneath: `Some of these are first attempts and we have not quietly left those out.`

**The tutors**
- **Ruth Agyeman.** `Paints large, teaches small. Twelve years here and she still sets up her own easel on a Monday.`
- **Stefan Barcz.** `Life drawing only. Says almost nothing for the first hour and then says the one thing that fixes it.`

**Term dates**
`AUTUMN TERM, FROM 15 SEPTEMBER, TWO PLACES LEFT` · `WINTER TERM, FROM 6 JANUARY, OPEN` · `SPRING TERM, FROM 20 APRIL, OPEN`
Line: `A place is held for a week without payment. Easel hire for a term is 45 GBP if you want to work here on Saturdays.`

**Footer**
`Ninth Street, Unit 2a, Hilton Works, Manchester M4 6AF`
`hello@ninthstreet.studio`
Links: `Classes`, `Terms`, `Easel hire`

## 10. Never
Drawn easels, paint strokes, palettes, brushes as graphics, anything that assembles or draws itself, rounded corners, shadows, gradients, glow, dark sections, accent panels, giant wordmarks, icon grids, emoji, evenly spaced grids, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono layer, `100vh` heroes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "clsx": "^2.1.0" }
```
