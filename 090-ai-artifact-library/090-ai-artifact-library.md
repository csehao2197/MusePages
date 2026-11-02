# Artifact Vault v3 — Build Spec

## Overview
A personal artifact library for AI-generated code, dashboards, apps, and tools. Built as a single Next.js 15 application with an integrated MCP server. Runs on Mac Pro with OrbStack (no external database server needed).

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** SQLite via Drizzle ORM + better-sqlite3
- **Styling:** TailwindCSS v4 + shadcn/ui
- **MCP Server:** Built into the same project (separate entry point using the MCP SDK)
- **Package Manager:** pnpm

## Project Structure
```
artifact-vault/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Gallery/home
│   │   ├── artifacts/
│   │   │   ├── [id]/page.tsx   # Artifact detail + preview
│   │   │   └── new/page.tsx    # Create artifact
│   │   └── api/                # REST API routes
│   │       └── artifacts/
│   │           ├── route.ts     # GET list, POST create
│   │           └── [id]/
│   │               ├── route.ts # GET, PUT, DELETE
│   │               └── versions/route.ts
│   ├── components/
│   │   ├── ui/                 # shadcn components
│   │   ├── artifact-card.tsx
│   │   ├── artifact-grid.tsx
│   │   ├── artifact-preview.tsx
│   │   ├── search-bar.tsx
│   │   ├── tag-filter.tsx
│   │   └── version-timeline.tsx
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema
│   │   ├── index.ts            # DB connection
│   │   └── migrations/
│   ├── lib/
│   │   ├── auto-tag.ts         # Pattern-based auto-tagging
│   │   └── utils.ts
│   └── mcp/
│       ├── index.ts            # MCP server entry point
│       └── tools.ts            # MCP tool definitions
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── tsconfig.json
└── docker-compose.yml          # Just for easy run, optional
```

## Database Schema (SQLite via Drizzle)

### artifacts table
- id: text (nanoid)
- name: text (not null)
- slug: text (unique, auto-generated from name)
- description: text (nullable)
- content: text (not null) — the artifact source code/content
- type: text (not null) — enum: html, react, svg, mermaid, code, markdown, json, css, text, python, typescript, javascript, shell
- tags: text (JSON array string) — auto-populated + user-editable
- project: text (nullable) — grouping field
- version: integer (default 1)
- is_favorite: boolean (default false)
- created_at: text (ISO timestamp)
- updated_at: text (ISO timestamp)

### artifact_versions table
- id: text (nanoid)
- artifact_id: text (FK → artifacts)
- version: integer
- content: text (snapshot)
- created_at: text

## API Endpoints

### GET /api/artifacts
- Query params: `search`, `type`, `tag`, `project`, `page`, `limit`
- Returns paginated list with metadata
- Search uses LIKE on name/description/content

### POST /api/artifacts
- Body: `{ name, description, content, type, project?, tags? }`
- Auto-generates slug, tags (if not provided), timestamps
- Creates initial version record

### GET /api/artifacts/[id]
- Returns full artifact with all metadata

### PUT /api/artifacts/[id]
- Update name, description, content, type, tags, project
- If content changes, creates new version record

### DELETE /api/artifacts/[id]
- Soft delete (or hard, up to you — soft is nicer)

### GET /api/artifacts/[id]/versions
- Returns version history for an artifact

## MCP Server

Entry point: `src/mcp/index.ts` — a standalone Node script that can be run via:
```
node dist/mcp/index.js
```

### MCP Tools
1. **save_artifact** — Save a new artifact or update existing by name
   - Params: name, content, type, description?, project?, tags?
   - Behavior: if artifact with same name+project exists, update it (creating a version)

2. **get_artifact** — Retrieve artifact by name or ID
   - Params: name (or id)

3. **search_artifacts** — Search artifacts
   - Params: query?, type?, tag?, project?

4. **list_artifacts** — List all artifacts
   - Params: type?, project?, limit?

5. **delete_artifact** — Delete an artifact
   - Params: name (or id)

## Auto-Tagging (Pattern Matching, No LLM)

In `src/lib/auto-tag.ts`:
- Detect language/framework from content patterns (e.g., `import React` → react, `def ` → python, `SELECT ` → sql)
- Detect purpose from keywords (e.g., `backup` → backup, `dashboard` → dashboard, `api` → api)
- File type heuristics from the type field
- Returns array of tag strings

## UI Design

### Gallery Page (/)
- Top: Search bar + filter chips (type, tags)
- Grid of artifact cards showing: name, type icon, tags, preview thumbnail, date
- Click card → detail page
- Responsive: 1 col mobile, 2 col tablet, 3-4 col desktop

### Artifact Detail (/artifacts/[id])
- Header: name, type badge, tags, project, actions (edit, delete, favorite)
- Tabbed preview area: Preview | Code | Versions
- Preview tab renders based on type:
  - HTML: iframe sandbox
  - React: iframe sandbox (with React CDN)
  - SVG: inline render
  - Mermaid: raw source shown in a code block (mermaid.js rendering not yet implemented)
  - Markdown: rendered markdown
  - Code: syntax highlighted code block (in Code tab)
- Versions tab: timeline of changes, click to view diff or restore

### Create/Edit (/artifacts/new or /artifacts/[id]/edit)
- Name, description, type selector, project, tags
- Code editor: plain `<Textarea>` (Monaco/CodeMirror integration not yet implemented)
- Save button

## Design Aesthetic
- Clean, dark mode default (can add light mode toggle later)
- Minimalist — no glassmorphism, no excessive gradients
- Use shadcn/ui defaults as base, customize sparingly
- Type-based color coding for cards (subtle, not rainbow)
- Fast and snappy — no heavy animations

## Getting Started (Docker — Optional)
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data  # SQLite file persistence
```

## Getting Started (Local Dev)
```bash
pnpm install
pnpm dev
# App at http://localhost:3000
```

## MCP Config for Claude Code
```json
{
  "mcpServers": {
    "artifact-vault": {
      "command": "node",
      "args": ["/path/to/artifact-vault/dist/mcp/index.js"]
    }
  }
}
```

## Requirements
- All in one repo, one `pnpm install`
- SQLite file stored in `./data/artifacts.db`
- No external services required
- MCP server reads from the same SQLite DB
- Build produces both Next.js app and standalone MCP server entry point
