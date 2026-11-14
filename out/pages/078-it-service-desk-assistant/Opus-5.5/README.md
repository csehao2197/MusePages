# TicketWise — AI assistant pod for service desk tickets

- **Original prompt**: `data/prompts/078-it-service-desk-assistant/078-it-service-desk-assistant.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript landing page with a working in-page demo
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/it-service-desk-assistant/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The real product is a Next.js app that only runs inside a PSA Hosted Tab iframe, with OpenRouter as the LLM. A static page can't do that, so this homepage pairs a product page with a **simulated host**: a generic ticket view (no third-party branding) and the TicketWise pod beside it.

| PRD piece | Browser equivalent |
|---|---|
| Hosted Tab postMessage handshake | The page posts a session message to itself; the pod accepts only allowed origins and shows the verification steps |
| PSA API (ticket, notes, configs) | Four fictional sample tickets (open and closed) |
| OpenRouter LLM | Local answer engine that builds markdown from each ticket's data |
| Similar ticket search | Keyword overlap over 12 fictional past tickets, with the 90-day company and 14-day global windows applied |
| Rate limiter | In-browser counter (30 per minute) |
| Session history | `sessionStorage` per ticket |

## Features

- **Commands:** all nine slash commands (`/summary`, `/suggest`, `/next`, `/similar`, `/config`, `/draft`, `/escalate`, `/5whys`, `/refresh`)
- **Autocomplete:** a dropdown appears on `/` (arrow keys, Enter runs, Tab completes, Esc closes), plus quick-command chips
- **Free-text questions:** who to contact, what was tried, age/SLA, configs, impact and cause, with note search as the fallback
- **Responses:** markdown (headings, lists, tables, quotes, code). Copy places `text/html` and `text/plain` on the clipboard for Outlook and Teams.
- **Pod Mode Only:** the lock screen can be toggled from the demo bar
- **Product sections:** command reference with "Run in demo", how it works, security and permissions, and setup with a copyable `.env` template

## Mocks and limitations

- **Simulated AI:** answers come from prewritten analysis and rules per sample ticket, not a model. The model name is shown for illustration only.
- **No real PSA connection:** there is no authentication or API, and the handshake is same-page.
- **Fictional data:** tickets, people and companies are fictional.
- **Independent concept:** not affiliated with ConnectWise, and the footer says so.

## Run and verify

From the repo root, `node out/pages/078-it-service-desk-assistant/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- handshake and ticket context
- autocomplete keyboard flow
- every command's output and markdown
- free-text answers
- rich-text and plain-text clipboard
- per-ticket session history and `/refresh`
- rate limit error
- Pod Mode Only and command cards
- mobile layout
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
