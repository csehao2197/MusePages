export const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const safeCSS = (value) => /url\s*\(|@|\\|image\s*\(|image-set|expression|behavior|<\/style/i.test(value) ? "" : value;
const tags = new Set("div span section main header footer nav article aside h1 h2 h3 h4 h5 h6 p ul ol li dl dt dd strong em b i u s small code pre blockquote br hr table thead tbody tr th td button a img style svg g path rect circle ellipse line polyline polygon text tspan defs clipPath linearGradient radialGradient stop title desc".toLowerCase().split(" "));
const attributes = new Set("class id title alt aria-label role viewbox x y x1 y1 x2 y2 cx cy r rx ry width height d points fill stroke stroke-width stroke-linecap stroke-linejoin opacity transform font-size font-family font-weight text-anchor letter-spacing xmlns offset stop-color stop-opacity preserveaspectratio".split(" "));
export function sanitize(source) {
  const template = document.createElement("template");
  template.innerHTML = source;
  const clean = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
    if (node.nodeType !== Node.ELEMENT_NODE || !tags.has(node.localName.toLowerCase())) return null;
    const result = node.namespaceURI === "http://www.w3.org/2000/svg" ? document.createElementNS(node.namespaceURI, node.localName) : document.createElement(node.localName);
    if (node.localName.toLowerCase() === "style") { result.textContent = safeCSS(node.textContent); return result; }
    for (const attr of node.attributes) {
      if (attr.name === "style") { const css = safeCSS(attr.value); if (css) result.setAttribute("style", css); }
      else if (node.localName === "img" && attr.name === "src" && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(attr.value)) result.setAttribute("src", attr.value);
      else if (attributes.has(attr.name.toLowerCase()) && !/url\s*\(|\\|javascript:|https?:|data:/i.test(attr.value)) result.setAttribute(attr.name, attr.value);
    }
    if (node.localName === "button") { result.setAttribute("disabled", ""); result.setAttribute("type", "button"); }
    for (const child of node.childNodes) { const safe = clean(child); if (safe) result.append(safe); }
    return result;
  };
  const container = document.createElement("div");
  for (const child of template.content.childNodes) { const safe = clean(child); if (safe) container.append(safe); }
  return container.innerHTML;
}
function inline(value) { return escape(value).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>"); }
export function markdown(source) {
  const output = [], lines = source.split(/\r?\n/);
  let fenced = false, code = [], list = false;
  const endList = () => { if (list) { output.push("</ul>"); list = false; } };
  for (const line of lines) {
    if (line.startsWith("```")) { endList(); if (fenced) { output.push(`<pre><code>${escape(code.join("\n"))}</code></pre>`); code = []; } fenced = !fenced; continue; }
    if (fenced) { code.push(line); continue; }
    if (/^[-*] /.test(line)) { if (!list) { output.push("<ul>"); list = true; } output.push(`<li>${inline(line.slice(2))}</li>`); continue; }
    endList();
    const heading = /^(#{1,3}) (.+)$/.exec(line);
    if (heading) output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
    else if (line.trim()) output.push(`<p>${inline(line)}</p>`);
  }
  endList();
  if (fenced) output.push(`<pre><code>${escape(code.join("\n"))}</code></pre>`);
  return output.join("");
}
export function highlight(source) {
  return escape(source).replace(/\b(import|from|export|default|function|return|const|let|def|class|if|else|for|in|True|False|None|true|false|null)\b/g, '<span class="code-keyword">$1</span>');
}
export function previewDocument(record) {
  let body, extra = "";
  if (["html", "svg"].includes(record.type)) body = sanitize(record.content);
  else if (record.type === "css") { extra = safeCSS(record.content); body = '<p class="sample-label">CSS / SAFE SAMPLE CANVAS</p><button type="button" disabled>Keep this idea</button><button type="button" class="secondary" disabled>Not just yet</button>'; }
  else if (record.type === "markdown") body = `<main class="markdown">${markdown(record.content)}</main>`;
  else return null;
  const policy = "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'";
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><style>html,body{margin:0;min-height:100%;font-family:Arial,sans-serif}body{overflow-wrap:anywhere}svg{display:block;width:100%;height:auto}.markdown{padding:26px;background:#e8e4d7;color:#354535;min-height:100vh;box-sizing:border-box;font:14px/1.7 Arial,sans-serif}.markdown h1{font-size:27px;font-weight:500;letter-spacing:-1px}.markdown h2{font-size:16px;margin-top:24px}.markdown li{margin:7px 0}.markdown code{background:#d8dccb;padding:2px 4px}button:disabled{opacity:1}.sample-label{font:9px Arial,sans-serif;letter-spacing:2px;opacity:.5}${extra}</style></head><body>${body}</body></html>`;
}
