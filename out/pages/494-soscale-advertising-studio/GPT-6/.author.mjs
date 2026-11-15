import fs from "node:fs/promises";
const folder = "out\\pages\\494-soscale-advertising-studio\\GPT-6";
const prompt = await fs.readFile("data\\prompts\\494-soscale-advertising-studio\\494-soscale-advertising-studio.md", "utf8");
const blocks = [...prompt.matchAll(/^```(\w*)\r?\n([\s\S]*?)^```\s*$/gm)].map((match) => ({ language: match[1], content: match[2].trim() }));
const css = blocks.filter((block) => block.language === "css").map((block) => block.content).filter((block) => !block.startsWith("@font-face"));
const styles = css.map((block) =>
{
    if (block.includes("--layout:tablet")) return `@media (max-width:1074.98px),(max-height:537.98px)\n{\n${block}\n}`;
    if (block.includes("--layout:mobile")) return `@media (max-width:559.98px)\n{\n${block}\n}`;
    return block;
}).join("\n");
const pathBlock = blocks.find((block) => !block.language && block.content.startsWith("M-4 ")).content;
let html = blocks.find((block) => block.language === "html" && block.content.startsWith("<main")).content;
html = html.replace(/<video[\s\S]*?<\/video>/, '<img class="photo" id="photo" width="1920" height="1080" src="assets/hero.svg" alt="" aria-hidden="true">').replace("…WORDMARK PATH (section 9)…", pathBlock);
const scripts = blocks.filter((block) => block.language === "js").map((block) => block.content);
scripts[1] = scripts[1].replace("img.pause();", "if(img.pause) img.pause();");
const extraStyle = `
dialog
{
    margin: auto;
    padding: 32px;
    width: min(460px, calc(100% - 32px));
    background: #171217;
    color: white;
    border: 1px solid #dec1fc;
}
dialog::backdrop
{
    background: #000c;
    backdrop-filter: blur(8px);
}
dialog h2
{
    font-weight: 400;
    margin: 20px 0;
}
dialog p
{
    line-height: 1.6;
    margin-block: 16px;
}
dialog button
{
    background: #dec1fc;
    border: 0;
    color: #1a0b1f;
    padding: 10px 18px;
    font: inherit;
    cursor: pointer;
}
dialog .close
{
    float: right;
}
dialog label
{
    display: grid;
    gap: 8px;
    margin-block: 20px;
}
dialog input
{
    padding: 12px;
    color: white;
    background: #292129;
    border: 1px solid #dec1fc88;
    width: 100%;
}
`;
const dialogs = `<dialog id="consultation"><button class="close" aria-label="Close consultation">×</button><h2>Better ads start here.</h2><p>Preview a consultation request locally. Nothing is sent.</p><form><label>Your email<input type="email" name="email" required></label><label>Your brand<input name="brand" required></label><button type="submit">Preview consultation</button><p class="feedback" role="status"></p></form></dialog><dialog id="reviews"><button class="close" aria-label="Close reviews">×</button><h2>Reviews 14 • Excellent</h2><p>The brief specifies a 4.5 out of 5 Trustpilot rating. This is demonstration content from the source prompt, not a connected or independently verified review feed.</p></dialog>`;
const extraScript = `
document.querySelector(".cta").addEventListener("click", (event) =>
{
    event.preventDefault();
    document.getElementById("consultation").showModal();
});
document.querySelector(".tp").addEventListener("click", (event) =>
{
    event.preventDefault();
    document.getElementById("reviews").showModal();
});
document.querySelectorAll(".close").forEach((button) => button.onclick = () => button.closest("dialog").close());
document.querySelector("form").onsubmit = (event) =>
{
    event.preventDefault();
    document.querySelector(".feedback").textContent = "Consultation preview ready. Local demo only; nothing was sent.";
};
`;
const formatCss = (text) => text.replace(/;/g, ";\n").replace(/\{/g, "\n{\n").replace(/\}/g, "\n}\n").split("\n").map((line) => line.trim()).join("\n");
await fs.writeFile(`${folder}\\index.html`, `<!doctype html>\n<html lang="en">\n<head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n    <meta name="theme-color" content="#000000">\n    <title>SOSCALE — Your audience deserves better ads</title>\n    <link rel="icon" href="data:,">\n    <script>${scripts[0]}</script>\n    <style>\n${formatCss(styles)}\n${extraStyle}\n    </style>\n</head>\n<body>\n${html}\n${dialogs}\n<script>\n${scripts[1]}\n</script>\n<script>\n${scripts[2]}\n${extraScript}\n</script>\n</body>\n</html>\n`);
await fs.mkdir(`${folder}\\assets`, { recursive: true });
