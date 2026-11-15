# Danmaku Video Platform

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], an original English-language danmaku video platform for [AUDIENCE], focused on [CONTENT_FOCUS]. Its editorial line is [TAGLINE]. Include a searchable home feed and a complete watch experience with a code-drawn Canvas film, synchronized lane comments, a density timeline, comment filters, local comment injection, an uploader card, and related films. The default featured film is [FEATURED_VIDEO].

- Audience: The default audience is [AUDIENCE]: people who enjoy carefully made visual films and want to react at a precise moment. The template also serves creators and developers who need a convincing client-side social video product rather than a static media-gallery mockup.
- Goal: Let a visitor discover a film, start playback immediately, understand where conversation peaks occur, filter the overlay, seek through the timeline, and add a comment that appears in the stream and density map. Make saving, following, sharing, search, sorting, and related-video navigation work locally.
- Tone: Warm, observant, and culturally curious rather than loud or juvenile. Use compact, specific editorial copy and believable viewer reactions. The interface should feel energetic because the conversation moves, while the underlying layout stays calm and readable.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: lucide-react (ISC), @fontsource/space-grotesk (OFL), @fontsource/inter (OFL), @fontsource/jetbrains-mono (OFL)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Set Vite base: './' and build.sourcemap: false. Implement the two views with hash routes '#/' and '#/watch' using React state and window.location.hash; do not add a server or router dependency.
  - Keep all variable values, video records, categories, timed comments, uploader data, and interface copy in src/content.ts. Rewrite default-specific copy when variables change, derive handles and internal identifiers from [BRAND], and keep the six image subjects aligned with their rewritten titles.
  - Import only the listed Space Grotesk, Inter, and JetBrains Mono weights from their Fontsource packages so every font file is bundled locally.
  - Use a devicePixelRatio-aware Canvas 2D renderer capped at 2x, requestAnimationFrame for playback, transform-only danmaku movement, and full cleanup of timers and listeners on route or video changes.
  - Use Lucide icons for controls and navigation. Give icon-only buttons accessible names, visible keyboard focus, and minimum 44px touch targets on mobile.
  - Persist saved video IDs, followed channel IDs, locally added comments, and comment preferences in localStorage. Keep playback time in memory and provide a safe fallback when storage or clipboard access is unavailable.

## Variables
- [BRAND] — Platform brand (default: "Rillcast"). Invented mascot-free video-community name.
- [TAGLINE] — Editorial tagline (default: "Watch together. Think out loud."). One short line used in the featured area and footer.
- [CONTENT_FOCUS] — Catalogue focus (default: "visual culture, design, and urban stories"). The editorial theme used to rewrite film descriptions and collections.
- [AUDIENCE] — Audience (default: "curious makers and visual learners"). The people the catalogue and footer address.
- [FEATURED_VIDEO] — Featured film title (default: "A City Before It Wakes"). Title of the first film; keep it compatible with the dawn-city image.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/danmaku-video-platform in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/danmaku-video-platform?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
— Prompt by VibeFather · https://vibefather.ai/t/danmaku-video-platform · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
