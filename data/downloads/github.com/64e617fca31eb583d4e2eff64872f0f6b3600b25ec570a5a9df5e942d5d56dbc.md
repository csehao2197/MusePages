# Short Video Feed App

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], an original short-form motion-story web app for [AUDIENCE], organized around the editorial theme [FEED_THEME]. Six portrait photographs become video-like scenes through slow pans, timed captions and optional generative sound. Include a snapping feed, local social actions, a comment drawer, a following view and a creator profile with a media grid; do not use real video files or any backend.

- Audience: [AUDIENCE]. The experience should feel immediately usable by casual mobile viewers and sufficiently polished for designers evaluating an interactive product concept.
- Goal: Let visitors consume exactly one visual story at a time using touch, wheel or keyboard, then like, comment, save, share, follow and revisit stories through persistent browser-only state. Every visible control must have a real local behavior.
- Tone: Warm, observant, cinematic and quietly playful. Use concise editorial language rather than social-media clichés, growth claims or exaggerated urgency.

## Stack
- Framework: Vite 6 + React 19 + TypeScript
- Styling: Tailwind CSS 4
- Libraries: motion (MIT), lucide-react (ISC), @fontsource-variable/manrope (OFL-1.1), @fontsource/instrument-serif (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Set Vite base to './' and build.sourcemap to false; emit only static files into dist/ with index.html as the sole HTML entry.
  - Configure Tailwind CSS 4 through @tailwindcss/vite; define the color tokens, font families, feed keyframes and reusable utilities in src/index.css.
  - Import Manrope and Instrument Serif from the listed Fontsource packages so all font files ship locally.
  - Create src/content.ts as the single source for variables, navigation, six stories, seed comments, creator profile, image paths and every UI label; derive the profile handle by lowercasing BRAND and removing spaces and punctuation.
  - Implement #/, #/following and #/profile with a small hash router; also accept ./index.html?story=<story-id> and open the matching story, defaulting to the first story when the parameter is absent or invalid.
  - Use React hooks for active-story, navigation, drawer, toast, follow and tab state; persist likes, saves, follows and added comments in localStorage under one versioned key derived from BRAND, with safe JSON parsing and graceful fallback.
  - Use Motion only for interface transitions and CSS keyframes only for scene pans and the sound disc; keep the active story and animation state synchronized.
  - Create quiet ambient sound with the Web Audio API after an explicit sound-button press, using a different two-note oscillator pattern per story; suspend the AudioContext when sound is off or the document is hidden.
  - Implement sharing with navigator.clipboard and a textarea-based fallback, then show a local confirmation toast; never send content to a server.

## Variables
- [BRAND] — Invented publication or app brand (default: "Hearthline"). Use it in the wordmark, profile name, document title and derived handle.
- [FEED_THEME] — Editorial theme of the story collection (default: "Small rituals, beautifully observed"). Rewrite captions, bios and empty states to fit this theme while preserving their length and structure.
- [AUDIENCE] — Primary audience (default: "curious people who collect craft, food and slow-travel stories"). Keep the voice specific to this audience without adding marketing claims.
- [ACCENT] — Primary interface accent as a hex color (default: "#E9B44C"). Apply to active states, progress, focused controls and the Follow button; retain accessible contrast.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/short-video-feed-app in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/short-video-feed-app?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
— Prompt by VibeFather · https://vibefather.ai/t/short-video-feed-app · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
