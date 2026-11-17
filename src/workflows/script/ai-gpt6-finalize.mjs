import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { appendFile, readFile, readdir } from "node:fs/promises";
import { WorkspaceFiles, PromptPageWorkflow, StaticHomepage } from "./render-prompt-page.mjs";

const workspace = process.cwd();
const stateFile = "C:\\Users\\wanha\\.copilot\\session-state\\ed96e448-18ae-45e1-a15e-22c466f2ffcc\\files\\ai-gpt6-all-20261115.json";
const state = await WorkspaceFiles.json(stateFile);
const model = { modelId: "gpt-6.1-sol", directory: "GPT-6" };
const flagNames = ["generated", "preview", "validated", "config_added"];
const success = new Set(["audited-reused", "newly-generated", "poststep-completed"]);
const latest = new Map();
const hash = (value) => createHash("sha256").update(value).digest("hex");
for (const line of (await readFile(state.logFile, "utf8")).split(/\r?\n/))
{
    try
    {
        const event = JSON.parse(line);
        if (event.runId === state.runId && event.prompt) latest.set(event.prompt, event);
    }
    catch {}
}
assert.equal(state.records.length, 571);
assert.equal(new Set(state.records.map((record) => record.prompt)).size, 571);
assert.equal(state.ownedLock, null);
assert.equal(state.nextPrompt, null);
const counts = {};
const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
let metadataVerified = 0;
let staticVerified = 0;
let newOptionsDisabled = 0;
let poststepAssertions = 0;
const errors = [];
for (const record of state.records)
{
    assert.ok(record.completedAt, `Unprocessed: ${record.prompt}`);
    const event = latest.get(record.prompt);
    assert.ok(event, `Missing exact-prompt run journal: ${record.prompt}`);
    assert.equal(event.status, record.status, `Journal status: ${record.prompt}`);
    for (const flag of flagNames)
    {
        assert.equal(event[flag], record.metadata?.[flag] ?? null, `Journal ${flag}: ${record.prompt}`);
    }
    counts[record.status] = (counts[record.status] ?? 0) + 1;
    if (!success.has(record.status))
    {
        assert.ok(record.issue, `Missing precise blocker: ${record.prompt}`);
        errors.push({ prompt: record.prompt, status: record.status, reason: record.issue });
        continue;
    }
    await PromptPageWorkflow.withPromptLock(workspace, record.prompt, async () =>
    {
        const current = await PromptPageWorkflow.inspect(workspace, { id: record.prompt }, model);
        const metadata = current.metadata;
        assert.equal(metadata?.modelId, model.modelId, `Actual identity: ${record.prompt}`);
        for (const flag of flagNames) assert.equal(metadata[flag], true, `${record.prompt}: ${flag}`);
        assert.ok(metadata.tags.length && metadata.tags.every((tag) => tag === tag.trim() &&
            tag.length && !/^(?:GPT-6|placeholder|tag|default)$/i.test(tag)), `Tags: ${record.prompt}`);
        assert.equal(new Set(metadata.tags.map((tag) => tag.toLowerCase())).size, metadata.tags.length);
        metadataVerified++;
        if (record.status === "audited-reused") return;
        await StaticHomepage.checkSource(current.folder);
        const group = config.pages[record.prompt];
        const options = (Array.isArray(group) ? group : group?.pages ?? []).filter((option) => option.model === model.directory);
        assert.equal(options.length, 1, `Unique registration: ${record.prompt}`);
        const option = options[0];
        assert.equal(option.staticDir, metadata.staticDir);
        const exported = await WorkspaceFiles.inside(current.folder, ...metadata.staticDir.split("/"));
        const digest = await StaticHomepage.validateStaticOutput(exported, option.slug, model.directory);
        const image = await readFile(path.join(exported, "preview.png"));
        assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
        assert.equal(image.readUInt32BE(16), 1200);
        assert.equal(image.readUInt32BE(20), 900);
        assert.equal((await WorkspaceFiles.text(path.join(current.folder, ".generation-preview.sha256"))).trim(), `${digest} ${hash(image)}`);
        const original = await WorkspaceFiles.text(record.file);
        assert.equal((await WorkspaceFiles.text(path.join(current.folder, ".generation-input.sha256"))).trim(), hash(JSON.stringify([original, design])));
        const qa = await WorkspaceFiles.json(path.join(current.folder, ".checks", "qa.json"));
        assert.equal(qa.visualReviewed, true, `Actually viewed PNGs: ${record.prompt}`);
        assert.notEqual(qa.passed, false, `Actual QA: ${record.prompt}`);
        assert.ok(!Array.isArray(qa.errors) || !qa.errors.length, `Browser errors: ${record.prompt}`);
        const qaDigest = qa.finalStaticDigest ?? qa.staticDigest;
        if (qaDigest) assert.equal(qaDigest, digest, `Final QA static digest: ${record.prompt}`);
        if (record.status === "newly-generated" && option.enabled === false && option.deployed === false) newOptionsDisabled++;
        if (record.status === "poststep-completed")
        {
            assert.equal(qa.sourceRetained, true);
            assert.equal(qa.browserResourcesClosed, true);
            assert.equal(qa.staticDigest, digest);
            poststepAssertions += qa.functionalSuite.assertions;
            for (const name of ["resume-functional.mjs", "resume-visual.json"])
            {
                assert.equal(await WorkspaceFiles.info(path.join(current.folder, ".checks", name)), null, `Owned intermediate retained: ${name}`);
            }
        }
        staticVerified++;
    });
}
assert.deepEqual(counts, { blocked: 129, "audited-reused": 332, "poststep-completed": 7, "newly-generated": 103 });
const locks = await readdir(path.join(workspace, "out", ".generation-locks")).catch(() => []);
const now = new Date().toISOString();
state.status = "completed-with-blockers";
state.activePrompt = null;
state.currentAction = "All 571 processed; final exact-prompt journal join, metadata and new/poststep artifact verification passed";
state.counts = counts;
state.updatedAt = now;
state.completedAt = now;
state.errors = errors;
state.finalVerification =
{
    checkedAt: now,
    exactPromptJournalCoverage: latest.size,
    latestJournalFlagsAndStatusMatch: 571,
    currentSuccessfulMetadataVerified: metadataVerified,
    finalNewAndPoststepStaticInputPreviewDigestsVerified: staticVerified,
    newRegistrationsCurrentlyDisabledAndNotDeployed: newOptionsDisabled,
    poststepFunctionalAssertions: poststepAssertions,
    visualReview: "103 new pages reviewed by actual-model prompt workers; seven poststeps freshly opened by coordinator; unchanged audited pages reuse actual historical evidence",
    browserInteractions: "Actual new-page and seven poststep suites; no fresh interaction claim for unchanged audited pages",
    ownedHelpersAndLocks: "All owned browser/server/lock helpers completed and released",
    otherLocksRetained: locks,
    builds: "not run",
    deployments: "not run",
    remaining: 0
};
state.checkpoint = { processed: 571, nextPrompt: null, counts, updatedAt: now, summary: "332 reused, 103 generated, 7 existing-source poststeps completed; 117 changed-input confirmation blockers and 12 asset/lock/spec blockers retained. No builds or deployments." };
await WorkspaceFiles.saveJson(stateFile, state);
const milestone = `${now} [${state.runId}] All 571 strict-serial records processed with actual model gpt-6.1-sol / GPT-6: reused=332, newly-generated=103, poststep-completed=7, blocked=129 (117 input/DESIGN confirmation; 12 exact-asset/spec/lock), failed=0, retry-required=0, remaining=0. Final exact-prompt JSONL join verified 571; current successful metadata verified 442; final new/poststep static/input/preview digest checks 110; seven poststep functional assertions ${poststepAssertions}. Actual desktop/mobile image review saved; unchanged historical QA reused honestly. All owned resources closed, other locks retained. No builds/deployments/commits. State=${stateFile}; log=${state.logFile}\n`;
await appendFile(path.join(workspace, "task", "progress.log"), milestone, "utf8");
console.log(JSON.stringify({ status: state.status, counts, verification: state.finalVerification, stateFile, logFile: state.logFile }));
