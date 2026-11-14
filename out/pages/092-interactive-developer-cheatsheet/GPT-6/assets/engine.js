export function validate(sheet) {
  if (!sheet || sheet.version !== "snapshot-1" || !/^\d{4}-\d{2}-\d{2}$/.test(sheet.lastUpdated) || !Array.isArray(sheet.sections) || sheet.sections.length !== 8) throw new Error("Reference snapshot is invalid.");
  const sections = new Set(), items = new Set();
  for (const section of sheet.sections) {
    if (!/^[a-z][a-z0-9-]*$/.test(section.id) || sections.has(section.id) || !section.title || !Array.isArray(section.items) || !section.items.length) throw new Error("Section mapping is invalid.");
    sections.add(section.id);
    for (const item of section.items) {
      if (!/^[a-z][a-z0-9-]*$/.test(item.id) || items.has(item.id) || !item.key || !item.description || !item.explanation || (item.example !== null && typeof item.example !== "string")) throw new Error("Entry mapping is invalid.");
      const source = new URL(item.source);
      if (source.origin !== "https://code.claude.com" || !source.pathname.startsWith("/docs/en/") || source.username || source.password) throw new Error("Official source link is invalid.");
      items.add(item.id);
    }
  }
  return sheet;
}
export const copyText = (item) => item.example || item.key;
export function filterSections(sheet, { query = "", section = "", savedOnly = false, saved = new Set() } = {}) {
  const terms = query.normalize("NFKC").trim().toLowerCase().split(/\s+/).filter(Boolean);
  return sheet.sections.filter((group) => !section || group.id === section).map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      const text = `${group.title} ${item.key} ${item.description} ${item.explanation} ${item.example || ""}`.normalize("NFKC").toLowerCase();
      return (!savedOnly || saved.has(item.id)) && terms.every((term) => text.includes(term));
    }),
  })).filter((group) => group.items.length);
}
export function entryForHash(sheet, hash) {
  let id;
  try { id = decodeURIComponent(hash.replace(/^#/, "")); } catch { return null; }
  for (const section of sheet.sections) {
    const item = section.items.find((entry) => entry.id === id);
    if (item) return { section, item };
  }
  return null;
}
export function subscriptionDraft(email, consent) {
  const value = email.trim();
  if (value.length > 180 || !/^[^\s@<>]+@[^\s@<>.]+(?:\.[^\s@<>.]+)+$/.test(value)) throw new Error("Enter a valid email address.");
  if (!consent) throw new Error("Confirm you want a local draft file.");
  return `Claude Code field guide — LOCAL REQUEST DRAFT\nEmail: ${value}\nRequested: reference snapshot update notifications\nStatus: NOT SENT. No subscription or confirmation email was created.\n`;
}
