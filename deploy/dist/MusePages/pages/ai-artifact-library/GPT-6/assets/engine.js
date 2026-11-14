export const TYPES = ["html", "react", "svg", "mermaid", "code", "markdown", "json", "css", "text", "python", "typescript", "javascript", "shell"];
export const LIMIT = 20;
export const VERSION_LIMIT = 10;
const required = (value, min, max) => typeof value === "string" && value.trim().length >= min && value.length <= max;
export function autoTags(content, type) {
  const tags = [type];
  for (const [pattern, tag] of [[/\b(?:import\s+React|useState|useEffect)\b/i, "react"], [/\bdef\s+\w+\s*\(/, "python"], [/\bSELECT\s+[\s\S]+?\bFROM\b/i, "sql"], [/\bdashboard\b/i, "dashboard"], [/\bbackup\b/i, "backup"], [/\bapi\b/i, "api"], [/\b(?:color|background)\s*:/i, "ui"], [/\bchart\b/i, "chart"]]) if (pattern.test(content)) tags.push(tag);
  return [...new Set(tags)].slice(0, 6);
}
export function validateInput(input) {
  if (!required(input.name, 3, 80) || !required(input.description || "", 0, 260) || !required(input.project || "", 0, 36) || !required(input.content, 1, 30000) || !TYPES.includes(input.type) || !required(input.tags || "", 0, 180)) throw Error("Use a name of 3–80 characters, source of 1–30,000 characters and a supported type.");
  const tagText = input.tags || "";
  const tags = tagText.trim() ? [...new Set(tagText.split(",").map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-")).filter(Boolean))] : autoTags(input.content, input.type);
  if (!tags.length || tags.length > 6 || tags.some((tag) => !/^[a-z0-9][a-z0-9+#.-]{0,23}$/.test(tag))) throw Error("Use up to 6 comma-separated tags, each 1–24 letters, numbers, +, #, dots or hyphens.");
  if (input.type === "json") { try { JSON.parse(input.content); } catch { throw Error("This JSON is not valid. Fix the source or choose a text/code type."); } }
  return { name: input.name.trim(), description: (input.description || "").trim(), project: (input.project || "").trim(), content: input.content, type: input.type, tags };
}
export function makeArtifact(records, input, id, now) {
  if (records.length >= LIMIT) throw Error("This session holds 20 artifacts, including trash. Refresh restores the original samples.");
  const valid = validateInput(input);
  ensureName(records, valid);
  const base = valid.name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "artifact";
  let slug = base, suffix = 2;
  while (records.some((record) => record.slug === slug)) slug = `${base}-${suffix++}`;
  return { ...valid, id, slug, favorite: false, deleted: false, version: 1, createdAt: now, updatedAt: now, versions: [{ version: 1, content: valid.content, at: now }] };
}
function ensureName(records, valid, except) {
  if (records.some((record) => record.id !== except && record.name.toLowerCase() === valid.name.toLowerCase() && record.project.toLowerCase() === valid.project.toLowerCase())) throw Error("That name already exists in this collection, including trash. Choose a different name or collection.");
}
export function editArtifact(records, id, input, now) {
  const record = records.find((item) => item.id === id);
  if (!record || record.deleted) throw Error("This artifact is not editable.");
  const valid = validateInput(input);
  ensureName(records, valid, id);
  const changed = valid.content !== record.content;
  if (changed && record.version >= VERSION_LIMIT) throw Error("This artifact has 10 source versions. Metadata can still be edited; source history is preserved.");
  const version = record.version + Number(changed);
  return { ...record, ...valid, version, updatedAt: now, versions: changed ? [...record.versions, { version, content: valid.content, at: now }] : record.versions };
}
export function restoreVersion(record, version, now) {
  if (record.deleted) throw Error("Restore the artifact from trash before changing it.");
  const snapshot = record.versions.find((item) => item.version === version);
  if (!snapshot) throw Error("That source version is unavailable.");
  if (record.content === snapshot.content) throw Error("This source is already current.");
  if (record.version >= VERSION_LIMIT) throw Error("The 10-version source history limit has been reached.");
  if (record.type === "json") { try { JSON.parse(snapshot.content); } catch { throw Error("This old source is not valid JSON for the current type. Edit the type before restoring."); } }
  return { ...record, content: snapshot.content, version: record.version + 1, updatedAt: now, versions: [...record.versions, { version: record.version + 1, content: snapshot.content, at: now }] };
}
export function filterArtifacts(records, { view = "all", query = "", type = "", tag = "", project = "", sort = "recent" } = {}) {
  const q = query.trim().toLowerCase();
  const result = records.filter((record) => (view === "trash" ? record.deleted : !record.deleted && (view !== "favorites" || record.favorite)) && (!q || [record.name, record.description, record.content].join(" ").toLowerCase().includes(q)) && (!type || record.type === type) && (!tag || record.tags.includes(tag)) && (!project || record.project === project));
  return result.sort(sort === "name" ? (a, b) => a.name.localeCompare(b.name) : sort === "version" ? (a, b) => b.version - a.version || a.name.localeCompare(b.name) : (a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.name.localeCompare(b.name));
}
export function fixtures() {
  const inputs = [
    { id: "signal", name: "Signal dashboard", type: "html", project: "Experiments", tags: "html,dashboard,ui", favorite: true, description: "A compact analytics dashboard with a little room to breathe.", content: '<!doctype html><html><head><style>body{margin:0;padding:24px;background:#141a19;color:#eff4e8;font-family:Arial,sans-serif}.label{font-size:10px;color:#90aa93;letter-spacing:2px}.metric{font-size:42px;letter-spacing:-2px;margin:18px 0 0}.trend{color:#c1df93;font-size:12px}.bars{height:90px;display:flex;align-items:end;gap:8px;margin-top:24px}.bars div{flex:1;background:#8ba474;border-radius:4px 4px 0 0}.bars div:last-child{background:#d1edab}</style></head><body><div class="label">SIGNAL / WEEKLY OVERVIEW</div><div class="metric">24,806</div><div class="trend">+12.8% this week · sample data</div><div class="bars"><div style="height:25%"></div><div style="height:47%"></div><div style="height:37%"></div><div style="height:68%"></div><div style="height:58%"></div><div style="height:81%"></div><div style="height:96%"></div></div></body></html>' },
    { id: "orbit", name: "Orbit brand mark", type: "svg", project: "Design system", tags: "svg,identity", favorite: true, description: "A simple orbital identity study. Original vector artwork.", content: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360"><rect width="600" height="360" fill="#ddd7e8"/><g transform="translate(300 180)" fill="none" stroke="#514264" stroke-width="1.5"><ellipse rx="112" ry="48" transform="rotate(-35)"/><ellipse rx="112" ry="48" transform="rotate(35)"/><ellipse rx="112" ry="48" transform="rotate(90)"/><circle r="23" fill="#514264"/><circle cx="92" cy="-48" r="8" fill="#514264"/></g><text x="300" y="324" text-anchor="middle" fill="#514264" font-size="12" font-family="Arial" letter-spacing="7">ORBIT</text></svg>' },
    { id: "command", name: "Command palette", type: "react", project: "Design system", tags: "react,ui", favorite: false, description: "A tiny, keyboard-friendly component starting point. Source only.", content: 'import React, { useState } from "react";\n\nexport default function CommandPalette() {\n  const [query, setQuery] = useState("");\n  const actions = ["Create a note", "Find a project", "Open settings"];\n  return <section aria-label="Commands">\n    <input aria-label="Find a command" value={query}\n      onChange={event => setQuery(event.target.value)} />\n    <ul>{actions.filter(action => action.toLowerCase().includes(query.toLowerCase()))\n      .map(action => <li key={action}>{action}</li>)}</ul>\n  </section>;\n}' },
    { id: "buttons", name: "Quiet buttons", type: "css", project: "Design system", tags: "css,ui", favorite: false, description: "Tactile actions, modest corners and a focus ring that shows up.", content: 'body { background: #e9e7de; padding: 36px; font-family: Arial, sans-serif; }\nbutton { padding: 12px 22px; border: 1px solid #aeb8a1; border-radius: 9px; background: #294733; color: #eef4df; font: inherit; margin: 8px; }\nbutton.secondary { background: transparent; color: #294733; }\nbutton:focus-visible { outline: 3px solid #6f8b56; outline-offset: 4px; }' },
    { id: "checklist", name: "A calmer launch", type: "markdown", project: "Field notes", tags: "markdown,checklist", favorite: false, description: "A small launch checklist for the things worth checking twice.", content: '# A calmer launch\n\nGood work deserves a thoughtful send-off.\n\n## Before the big day\n- Check the keyboard journey.\n- Read every error message.\n- Try the smallest screen.\n- Keep a tested backup.\n\n**Ship deliberately.** Learn from what happens next.' },
    { id: "tokens", name: "Workspace tokens", type: "json", project: "Design system", tags: "json,tokens", favorite: false, description: "A restrained set of colors and spacing for an everyday workspace.", content: '{\n  "color": {\n    "paper": "#f2f1e9",\n    "ink": "#28352a",\n    "accent": "#bfd59f"\n  },\n  "space": [4, 8, 12, 16, 24, 32],\n  "radius": 8\n}' },
    { id: "backup", name: "Backup naming helper", type: "python", project: "Small tools", tags: "python,backup", favorite: false, description: "A pure filename helper. It does not read or write any files.", content: 'from datetime import date\n\ndef backup_name(project: str, day: date) -> str:\n    """Return a descriptive backup name without touching the filesystem."""\n    safe = "-".join(project.lower().split())\n    return f"{safe}-{day.isoformat()}.zip"\n\n# Example only: backup_name("Field Notes", date(2026, 6, 8))' },
    { id: "flow", name: "From idea to artifact", type: "mermaid", project: "Field notes", tags: "mermaid,workflow", favorite: false, description: "A source-only flowchart for the moments between draft and done.", content: 'flowchart LR\n  Idea --> Draft\n  Draft --> Review\n  Review -->|Refine| Draft\n  Review -->|Keep| Vault\n  Vault --> Reuse' }
  ];
  return inputs.map((input, index) => {
    const time = `2026-11-${String(12 - index).padStart(2, "0")}T10:00:00.000Z`;
    return { ...makeArtifact([], input, input.id, time), favorite: input.favorite };
  });
}
