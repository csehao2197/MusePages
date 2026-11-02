# PRD: Claude Code Cheatsheet — Interactive Web Hub

**Version:** 1.0  
**Datum:** 2026-04-01  
**Owner:** Chris Hubmann / BIK GmbH  

---

## Vision
Die beste, immer aktuelle Referenz für Claude Code — schöner als die offizielle Doku, mobil perfekt nutzbar, mit PDF-Export und Newsletter.

## Zielgruppe
- Entwickler die Claude Code täglich nutzen
- Teams die Claude Code einführen wollen
- Power User die alle Shortcuts kennen wollen

---

## Features (MVP)

### 1. Interaktives Cheatsheet
- Alle Sektionen aus dem offiziellen Cheatsheet als strukturierte Web-Komponenten
- Sektionen: Keyboard Shortcuts, Slash Commands, Workflows & Tips, Skills & Agents, MCP Servers, Memory & Files, Config & ENV, CLI & Flags
- Jede Zeile klickbar → Erklärung/Beispiel aufklappen (Accordion)
- Suchfunktion (live filter über alle Commands)
- Copy-to-clipboard für jeden Command
- Dark Mode (Standard, weil Dev-Tool)
- Version-Badge + "Last updated" immer sichtbar

### 2. Design
- Stack: **Next.js 14 + Tailwind CSS + shadcn/ui**
- Dark theme: #0d1117 (GitHub-style) mit Accent #f97316 (orange) oder #a855f7 (purple)
- Farbcodierte Sektionen (wie das Original-Cheatsheet)
- Mobile-first, aber Desktop perfekt
- Smooth animations (Framer Motion)
- Hero: "The Ultimate Claude Code Reference" + Version Badge

### 3. PDF Export
- Button "Download PDF" → generiert aktuelles Cheatsheet als PDF
- Via Puppeteer oder react-pdf
- Kompaktes A4 Layout, druckbar

### 4. Newsletter / Waitlist
- Einfaches Email-Formular: "Get notified when Claude Code updates"
- Backend: Supabase (einfach, kostenlos) oder simple JSON-File
- Confirmation Email via Resend (kostenlos tier)
- Ziel: Community aufbauen für zukünftige Releases

### 5. Auto-Update Workflow (Cron/GitHub Actions)
- Täglich: Crawle https://docs.anthropic.com/en/docs/claude-code/ + Release Notes
- Vergleiche mit letztem Stand
- Bei Änderungen: Auto-PR mit Updated Content
- Version in `data/cheatsheet.json` tracken
- GitHub Actions Workflow: `.github/workflows/update-cheatsheet.yml`

---

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **PDF:** @react-pdf/renderer oder Puppeteer
- **Newsletter DB:** Supabase (free tier) oder simple file-based
- **Email:** Resend (free: 100 emails/Tag)
- **Hosting:** Vercel (free tier)
- **Crawler:** Playwright oder Cheerio (Node.js script)
- **CI/CD:** GitHub Actions

---

## Datenstruktur (`data/cheatsheet.json`)
```json
{
  "version": "2.81",
  "lastUpdated": "2026-03-24",
  "sections": [
    {
      "id": "keyboard-shortcuts",
      "title": "Keyboard Shortcuts",
      "color": "#3b82f6",
      "icon": "⌨️",
      "items": [
        {
          "key": "Ctrl C",
          "description": "Cancel input/generation",
          "explanation": "Stoppt laufende Generierung sofort. Nützlich wenn Claude zu viel schreibt.",
          "example": null
        }
      ]
    }
  ]
}
```

---

## Seiten-Struktur
```
/ (Home) — Hero + alle Cheatsheet-Sektionen + Search
/pdf — PDF-Preview + Download
/changelog — Versionshistorie
/newsletter — Sign-up Seite
```

---

## MVP Deadline
1 Tag (Claude Code baut es)

## Repo
`~/Projects/claude-code-cheatsheet`
GitHub: `github.com/chhubmann/claude-code-cheatsheet` (public, community-driven)

---

## Referenz-Bild
Das Cheatsheet-Image liegt unter:
`/Users/chris/.openclaw/media/inbound/1774799850151---7f6333a0-8064-41f1-927c-7631664f7df4.jpg`

Alle Sektionen und Inhalte daraus extrahieren für die initiale `data/cheatsheet.json`.

