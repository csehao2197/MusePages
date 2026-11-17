import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { appendFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { StaticHomepage } from "../workflows/script/render-prompt-page.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const directory = path.join(root, "out", "pages", "photo_equipment", "gpt-6.1-sol");
const output = path.join(directory, "out");
const report = JSON.parse(await readFile(path.join(root, "src", "prompt_test", "lumen-checks", "report.json"), "utf8"));
assert.equal(report.modelId, "gpt-6.1-sol");
assert.equal(report.checks.length, 12);
assert.deepEqual(report.errors, []);
assert.equal(await StaticHomepage.checkSource(directory), "html");
const digest = await StaticHomepage.validateStaticOutput(output, "photo_equipment", "gpt-6.1-sol");
const preview = await readFile(path.join(output, "preview.png"));
assert.equal(preview.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
assert.equal(preview.readUInt32BE(16), 1200);
assert.equal(preview.readUInt32BE(20), 900);
for (const file of ["index.html", "styles.css", "app.js"])
{
    const source = await readFile(path.join(directory, file), "utf8");
    assert.equal(source, await readFile(path.join(output, file), "utf8"), `${file}: output differs from source`);
    assert.equal(/[ \t]+$/m.test(source), false, `${file}: trailing whitespace`);
    assert.equal(source.includes("\t"), false, `${file}: tab indentation`);
}
await writeFile(path.join(directory, ".generation-preview.sha256"), `${digest} ${createHash("sha256").update(preview).digest("hex")}\n`);
const metadataPath = path.join(directory, "metadata.json");
const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
assert.equal(metadata.modelId, "gpt-6.1-sol");
metadata.preview = true;
metadata.validated = true;
await writeFile(metadataPath, JSON.stringify(metadata, null, 4) + "\n");
await appendFile(path.join(root, "task", "progress.log"), `${new Date().toISOString()} Generated photo_equipment/gpt-6.1-sol from user-authorized src\\prompt_test\\photo_equipment.md. Responsive static LUMEN storefront with local assets, camera exploration, lens collection, gallery, persistent cart, and demo order review. Twelve Playwright verification groups passed; desktop/mobile screenshots manually reviewed; repository static validation and 1200x900 preview passed. Source/output equality verified; preview fingerprint and model metadata saved. No build, shared config change, collection assembly, or publication. Missing canonical prompt and TASK.md explicitly authorized as local-input exception. Product photos and film are illustrative; checkout is a non-transactional demo.\n`);
console.log("Repository static validation passed; exact source/output match; preview fingerprint saved.");
console.log("Metadata: generated=true, preview=true, validated=true, config_added=false.");
