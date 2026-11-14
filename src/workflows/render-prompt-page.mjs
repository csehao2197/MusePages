export function escapeHtml(text)
{
    return text.replace(/[&<>"']/g, (character) => (
    {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[character]);
}

export function renderPromptPage(prompt, title, backHref = "../../index.html")
{
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | Prompt | MusePages</title>
  <style>
    :root{color-scheme:light;--paper:#f7f6f2;--ink:#203d37;--muted:#69756f;--line:#dce1d8}
    *{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 system-ui,sans-serif}
    main{max-width:1000px;margin:auto;padding:32px 24px}a{color:inherit;text-underline-offset:4px}a:focus-visible,pre:focus-visible{outline:3px solid #ae592d;outline-offset:4px}
    h1{font:normal clamp(28px,5vw,44px)/1.2 Georgia,serif;overflow-wrap:anywhere;margin:32px 0 16px}.intro{color:var(--muted)}
    .codebox{min-width:0;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff;margin-top:24px}
    .codebox h2{margin:0;padding:12px 20px;background:#edf2eb;font:600 13px/1.5 system-ui,sans-serif;border-bottom:1px solid var(--line)}
    pre{margin:0;padding:20px;max-height:70vh;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;tab-size:2}
    code{font:14px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace}
    @media(max-width:650px){main{padding:24px 16px}pre{padding:16px}code{font-size:13px}}
  </style>
</head>
<body>
  <main>
    <a href="${escapeHtml(backHref)}">Back to MusePages</a>
    <h1>${escapeHtml(title)}</h1>
    <p class="intro">The original prompt, shown as plain text. Select the text to copy it.</p>
    <section class="codebox" aria-labelledby="prompt-heading">
      <h2 id="prompt-heading">Prompt</h2>
      <pre tabindex="0" role="region" aria-label="Prompt text"><code>${escapeHtml(prompt)}</code></pre>
    </section>
  </main>
</body>
</html>
`;
}
