import fs from "node:fs/promises";
import path from "node:path";
import { PromptPageWorkflow as Workflow, WorkspaceFiles as Files } from "../workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const prompt = "495-parallax-portrait-portfolio";
const output = path.join(root, "out", "pages", prompt, "GPT-6");
const source = JSON.parse(await fs.readFile("src\\manifest.json", "utf8")).find((item) => item.id === 495);
const content = await fs.readFile(path.join("data", "prompts", source.filename), "utf8");
let existing = null;
await Workflow.withPromptLock(root, prompt, async () =>
{
    const inspected = await Workflow.inspect(root, { id: prompt, content }, { directory: "GPT-6", modelId: "gpt-6.1-sol" });
    existing = inspected.metadata;
    if (existing) throw Error("Unexpected concurrent output; preserve for parent review");
    if (/<path\b[^>]*\bd\s*=/.test(content)) throw Error("Exact path source exists; missing-path blocker no longer applies");
});
const result = {
    timestamp: new Date().toISOString(),
    runId: "ai-gpt6-resume-297a34d7-6a01-4e5f-afef-bf4cf20677cd",
    prompt,
    display_model_name: "GPT-6",
    modelId: "gpt-6.1-sol",
    output,
    action: "blocked-before-generation",
    status: "blocked",
    tags: [],
    tagsNonempty: false,
    metadata: existing,
    deployed: null,
    qa: {
        performed: false,
        evidence: "Read all 83 lines of the original Markdown. It repeatedly requires exactly twelve verbatim path d strings and an unchanged HTML document, but contains zero SVG path elements and no supplied HTML document.",
        sourcePathCount: (content.match(/<path\b/g) || []).length
    },
    limitations: "No placeholder, guessed ring geometry, false static validation or registration created. Original prompt and any other variants preserved.",
    error: "Required exact twelve SVG path d attributes and referenced HTML document are absent from the source prompt. Explicit prompt forbids approximating these paths; the requested exact geometry cannot be reconstructed truthfully."
};
await fs.mkdir("logs", { recursive: true });
await fs.appendFile("logs\\render-prompt-pages-ai.log", JSON.stringify(result) + "\n", "utf8");
const file = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-resume-2026-11-15.json";
const manifest = await Files.json(file);
Object.assign(manifest.records.find((item) => item.prompt === prompt), {
    status: "blocked",
    metadata: existing,
    tags: [],
    evidence: result.qa,
    error: result.error,
    completedAt: result.timestamp
});
await Files.saveJson(file, manifest);
console.log(JSON.stringify({ prompt, status: "blocked", error: result.error }));
