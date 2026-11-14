# Lumen — dark mode AI chat

- **Original prompt**: `data/prompts/080-ai-chatbot-website/080-ai-chatbot-website.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript chat app (hash routes `#c/<id>` per conversation)
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/ai-chatbot-website/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD uses Next.js with a server route `/api/chat` that holds the Gemini key. A static page has no server, so Lumen offers two engines:

| Engine | How it works |
|---|---|
| **Demo assistant** (default) | Local responder covering 10 explainer topics with "tell me more" follow-ups, JS and Python snippets, arithmetic, `summarize:`, greetings and help. Anything else gets an honest "demo mode" reply. |
| **Gemini with your own key** | The browser calls `generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` directly, sending the conversation history (last 10/20/50 messages). The key stays in `sessionStorage` for the tab session and never goes in `localStorage`. |

## Features

- Exclusively dark UI; user messages on the right in blue, AI on the left in gray, with timestamps
- Markdown answers (escaped first for XSS safety): lists, headings, inline code, highlighted code blocks with copy
- Simulated streaming with a cursor, typing indicator, Stop (button or Esc), auto-scroll and a "Latest" jump button
- Textarea up to 120px; Enter sends, Shift+Enter adds a new line; input disabled while answering; send disabled when empty
- **Conversation history:** grouped by date, search, switching, delete one or all, saved in `localStorage` (`lumen-v1`)
- **Errors:**
  - offline banner
  - network, invalid key, rate limit (15/min), server and empty responses, each with "Try again"
  - Settings can simulate the next error
- **Keyboard:** `/`, Alt+N, Ctrl+K, Alt+↑/↓, Esc, ?
- **Mobile:** sidebar drawer; empty state with suggestion cards

## Mocks and limitations

- **Demo answers are prewritten:** not model output.
- **Gemini mode runs in the browser:** it exposes the user's own key to their browser (unlike the PRD's server-side key). Use a restricted key.
- **Rate limit is per tab:** the limit is enforced client-side only.

## Run and verify

From the repo root, `node out/pages/080-ai-chatbot-website/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- empty state and history
- send flow: loading and disabled states, bubble sides and colours, timestamps
- context follow-up, multi-line, math, code, summary and fallback
- XSS safety
- stop
- simulated and real offline errors with retry
- **Gemini mode** against a mocked API: key validation, sessionStorage only, 400 mapped to "invalid key", retry, history sent as context
- history search, switch, persist, delete and shortcuts
- mobile drawer
- no runtime errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
