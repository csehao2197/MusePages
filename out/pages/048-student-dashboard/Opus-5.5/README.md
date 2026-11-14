# BrightPath — student dashboard

- **Original prompt**: `data/prompts/048-student-dashboard/048-student-dashboard.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js` (sample data, SVG art and interactions); browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/student-dashboard/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Top bar:** live search (courses, assignments, people, grades; arrow keys and Enter), notification and message popovers with badges, profile dropdown.
- **Sidebar:** 260px with the student card, eight nav items, an indigo active border and a "Need Help?" card. It collapses to icons with a toggle (icons by default below 1100px).
- **Welcome:** time-aware greeting, due-this-week summary computed from the assignments, "Spring 2026" badge, and quick actions including a "Join Next Class" countdown.
- **Overview cards:** GPA with sparkline, courses ring, assignments due, streak.
- **Courses:** three cards (all five via "View All") with SVG thumbnails, progress, next class and grade. A click opens course detail.
- **Due Soon:** urgency dots (red, amber, green) from real due dates; overdue items sort to the top with a red tint. A submit dialog takes a local file, then marks the item submitted and updates counts.
- **Weekly schedule:** Mon–Sun with today highlighted. Events show details and a join option. "Sync to Google Calendar" downloads a `.ics` file built in the browser.
- **Grades:** three recent grades, a full-feedback dialog and an all-grades table.
- **Study activity:** 12-week heatmap (#E0E7FF to #4F46E5) with tooltips, weekly summary and hours by course.
- **Panels:** announcements (pinned, unread, mark all read), 2×2 quick links, and a footer with links and v3.2.1.
- **Mobile:** bottom tab bar (Dashboard, Courses, Assignments, Schedule, More sheet), stacked cards, a one-day schedule with swipe and prev/next, a scrollable heatmap and quick actions, and the assignments panel below the courses.

## Mocks and limitations

- **Sample data:** all data is sample data held in the page. Nothing is uploaded, sent or saved; Sign Out, Study Groups, Library and similar links show a notice.
- **Dates:**
  - assignment due dates and the schedule are relative to the viewer's current date
  - "Join Next Class" counts down 45 minutes from page load
  - heatmap hours are seeded sample values, so the weekly totals are computed and differ from the brief's 14.5, 12.8 and 13.1
  - the brief's October grade and announcement dates are kept as written, although they sit oddly with "Spring 2026"
- **Calendar sync:** Google Calendar sync is an `.ics` download for manual import, not an OAuth connection.
- **Additions:** Database Systems and Discrete Mathematics fill out the "5 of 5" active courses.
- **Icons:** the brief's emoji (wave, colored circles, megaphone, memo, party) are replaced by icons and colored dots.
- **Images:** avatars and course thumbnails are SVG illustrations.

## Run and verify

From the repo root, `node out/pages/048-student-dashboard/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- top bar
- sidebar and collapse
- welcome and stats
- courses
- assignments and submit
- schedule, join and `.ics`
- grades and heatmap
- announcements, links and footer
- mobile tab bar, daily schedule and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
