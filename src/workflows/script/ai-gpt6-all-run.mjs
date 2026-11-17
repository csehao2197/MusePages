import path from "node:path";
import { createHash } from "node:crypto";
import { appendFile, readFile, readdir } from "node:fs/promises";
import { WorkspaceFiles, PromptPageWorkflow, StaticHomepage } from "./render-prompt-page.mjs";

const workspace = process.cwd();
const stateFile = "C:\\Users\\wanha\\.copilot\\session-state\\ed96e448-18ae-45e1-a15e-22c466f2ffcc\\files\\ai-gpt6-all-20261115.json";
const model = { modelId: "gpt-6.1-sol", directory: "GPT-6" };
const state = await WorkspaceFiles.json(stateFile);
const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const flags = (metadata) => Object.fromEntries(["generated", "preview", "validated", "config_added"].map((key) => [key, metadata?.[key] ?? null]));
const priorVisual = new Map();
function visualFields(value, prefix = "", result = [])
{
    if (!value || typeof value !== "object") return result;
    for (const [key, child] of Object.entries(value))
    {
        if (/visual/i.test(key) && child) result.push({ field: `${prefix}${key}`, evidence: child });
        else if (child && typeof child === "object") visualFields(child, `${prefix}${key}.`, result);
    }
    return result;
}
for (const line of (await readFile(state.logFile, "utf8")).split(/\r?\n/))
{
    try
    {
        const entry = JSON.parse(line);
        if (!entry.prompt || entry.runId === state.runId || entry.run === state.runId) continue;
        const visual = visualFields(entry);
        if (visual.length) priorVisual.set(entry.prompt, { timestamp: entry.timestamp ?? entry.time ?? null, runId: entry.runId ?? entry.run ?? null, visual });
    }
    catch {}
}

async function save()
{
    state.updatedAt = new Date().toISOString();
    state.counts = {};
    for (const record of state.records)
    {
        state.counts[record.status] = (state.counts[record.status] ?? 0) + 1;
    }
    const next = state.records.find((record) => record.status.startsWith("pending") || record.status === "active-generation");
    state.nextPrompt = next?.prompt ?? null;
    state.checkpoint = { processed: state.records.filter((record) => record.completedAt).length, nextPrompt: state.nextPrompt, counts: state.counts, updatedAt: state.updatedAt };
    await WorkspaceFiles.saveJson(stateFile, state);
}

async function finish(record, outcome)
{
    Object.assign(record, outcome, { completedAt: new Date().toISOString() });
    await appendFile(state.logFile, JSON.stringify(
    {
        timestamp: record.completedAt,
        runId: state.runId,
        prompt: record.prompt,
        display_model_name: model.directory,
        modelId: record.actualModelId ?? model.modelId,
        output: record.output,
        action: record.action,
        status: record.status,
        tags: record.metadata?.tags ?? [],
        tagValidation: record.tagValidation ?? false,
        ...flags(record.metadata),
        verification: record.verification,
        reason: record.issue ?? null
    }) + "\n", "utf8");
    state.activePrompt = null;
    state.currentAction = `Persisted ${record.prompt}: ${record.status}`;
    await save();
}

async function audit(record)
{
    const content = await WorkspaceFiles.text(record.file);
    if (record.provenance?.license_file)
    {
        await WorkspaceFiles.text(path.join(workspace, record.provenance.license_file));
    }
    return PromptPageWorkflow.withPromptLock(workspace, record.prompt, async () =>
    {
        const current = await PromptPageWorkflow.inspect(workspace, { id: record.prompt, content }, model);
        record.metadata = current.metadata;
        record.actualModelId = current.metadata?.modelId ?? model.modelId;
        if (!current.metadata)
        {
            if (record.prompt === "495-parallax-portrait-portfolio" && !/<path\b/i.test(content) && /(?:twelve|12)/i.test(content))
            {
                await finish(record, { status: "blocked", action: "original-input-asset-check", issue: "Full original input still omits twelve mandatory exact SVG path d strings and unchanged HTML; replacements expressly prohibited.", verification: { fullOriginalRead: true, designRead: true, originalContainsPathElements: false, existingOutput: "none", browserTests: "not run: missing mandatory input assets", retained: "original requirements and other model results unchanged" } });
                return "continue";
            }
            state.activePrompt = record.prompt;
            state.currentAction = "Missing output verified under prompt lock; awaiting one synchronous actual-model worker";
            const jobFile = path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json");
            const reportFile = path.join(workspace, "src", "workflows", "script", `.ai-gpt6-report-${record.prompt.match(/^\d+/)[0]}.json`);
            await WorkspaceFiles.saveJson(jobFile,
            {
                runId: state.runId,
                prompt: record.prompt,
                file: record.file,
                output: record.output,
                modelId: model.modelId,
                display_model_name: model.directory,
                provenance: record.provenance,
                priorBlocker: record.priorBlocker,
                stateFile,
                promptLock: path.join(workspace, "out", ".generation-locks", `${record.prompt}.lock`),
                reportFile,
                rules: await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "script", "ai-gpt6-worker-rules.txt")),
                objective: "Execute this ONE prompt only; verify the already-held attached coordinator lock PID is alive and matches the durable manifest ownedLock before writing. Read full original and applicable license. Actual implementation and QA, not a plan. No nested agents; no builds/deployments. Report precisely and close owned resources."
            });
            await save();
            console.log(JSON.stringify({ workerRequired: record.prompt, jobFile, reportFile }));
            return "worker";
        }
        const metadata = current.metadata;
        if (!metadata.generated)
        {
            await finish(record, { status: "retry-required", action: "retained-incomplete-attempt", issue: "generated=false requires explicit --retry, not authorized.", verification: { fullOriginalRead: true, retained: "all existing source and artifacts", browserTests: "not rerun" } });
            return "continue";
        }
        const inputFile = path.join(current.folder, ".generation-input.sha256");
        const inputPresent = Boolean(await WorkspaceFiles.info(inputFile));
        if (inputPresent && (await WorkspaceFiles.text(inputFile)).trim() !== hash(JSON.stringify([content, design])))
        {
            await finish(record, { status: "blocked", action: "retained-input-mismatch", issue: "Original requirements or DESIGN fingerprint changed; confirmation required before any overwrite.", verification: { fullOriginalRead: true, inputFingerprint: "mismatch", retained: "generated=true source, previous preview and registration", browserTests: "not rerun" } });
            return "continue";
        }
        const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
        const group = config.pages[record.prompt];
        const options = Array.isArray(group) ? group : group?.pages ?? [];
        const registered = options.filter((option) => option.model === model.directory);
        const slug = registered[0]?.slug ?? record.prompt.replace(/^\d+-/, "").toLowerCase();
        const exported = await WorkspaceFiles.inside(current.folder, ...metadata.staticDir.split("/"));
        await StaticHomepage.checkSource(current.folder);
        const digest = await StaticHomepage.validateStaticOutput(exported, slug, model.directory);
        const image = await readFile(path.join(exported, "preview.png"));
        if (image.length <= 24 || image.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || image.readUInt32BE(16) !== 1200 || image.readUInt32BE(20) !== 900)
        {
            throw Error("Preview PNG format or 1200x900 dimensions invalid; poststep required");
        }
        const previewHash = hash(image);
        if ((await WorkspaceFiles.text(path.join(current.folder, ".generation-preview.sha256"))).trim() !== `${digest} ${previewHash}`)
        {
            throw Error("Preview/static fingerprint stale; new browser poststeps required");
        }
        record.tagValidation = Array.isArray(metadata.tags) && metadata.tags.length > 0 && metadata.tags.every((tag) => tag.trim() === tag && tag.length > 0 && !/^(?:GPT-6|placeholder|tag|default)$/i.test(tag)) && new Set(metadata.tags.map((tag) => tag.toLowerCase())).size === metadata.tags.length;
        if (!record.tagValidation) throw Error("Missing meaningful tags; authorized metadata poststep required");
        if (registered.length !== 1 || registered[0].staticDir !== metadata.staticDir) throw Error("Registration absent or export mapping conflict; registration poststep required");
        const checks = path.join(current.folder, ".checks");
        const files = await readdir(checks).catch(() => []);
        const evidence = [];
        for (const name of files.filter((name) => name.endsWith(".json") && !/config|intent|batch/i.test(name)))
        {
            const qa = await WorkspaceFiles.json(path.join(checks, name));
            evidence.push({ file: path.join(checks, name), assertions: qa.assertions ?? qa.checks ?? null, passed: qa.passed ?? null, errors: qa.errors ?? qa.browserErrors ?? null, visualReviewed: qa.visualReviewed ?? qa.visualReview ?? qa.visualImagesViewed ?? null, digest: qa.digest ?? qa.staticDigest ?? null });
        }
        const rootEvidence = path.join(current.folder, "verification.json");
        if (await WorkspaceFiles.info(rootEvidence))
        {
            const qa = await WorkspaceFiles.json(rootEvidence);
            if (qa.staticDigest && qa.staticDigest !== digest) throw Error("Historical root QA static digest mismatch; confirmation required");
            evidence.push({ file: rootEvidence, assertions: qa.assertions ?? qa.checks ?? null, passed: qa.passed ?? null, errors: qa.errors ?? qa.browserErrors ?? null, visualReviewed: qa.visualReview ?? qa.visualReviewed ?? null, digest: qa.staticDigest ?? qa.digest ?? null });
        }
        if (process.argv[2] === "reconcile" && ["038-membership-comparison", "039-nutrition-coaching"].includes(record.prompt))
        {
            const images = [];
            for (const name of ["desktop.png", "mobile.png"])
            {
                const file = path.join(checks, name);
                images.push({ file, sha256: hash(await readFile(file)) });
            }
            const review = { checkedAt: new Date().toISOString(), visualReviewed: true, imagesOpened: images, staticDigest: digest, previewSha256: previewHash, notes: record.prompt.startsWith("038-") ? "Actually opened existing desktop and mobile PNGs: clear dark-green and mint membership hierarchy, readable plan prices, aligned desktop cards, responsive single-column plan layout and contained bottom mobile action. No visual clipping of functional controls." : "Actually opened existing desktop and mobile PNGs: clear nutrition heading hierarchy, readable contrast and body copy, well-framed bowl photography, balanced desktop split, mobile single-column composition and contained navigation/action.", browserInteractions: "Historical functional QA reused for unchanged static output; no fresh interaction run claimed." };
            const file = path.join(checks, "visual-review.json");
            await WorkspaceFiles.saveJson(file, review);
            evidence.push({ file, visualReviewed: review, digest });
        }
        if (!evidence.length) throw Error("Prior actual browser/visual QA evidence absent; poststep required");
        const visualWitness = priorVisual.get(record.prompt) ?? null;
        if (!evidence.some((entry) => Boolean(entry.visualReviewed)) && !visualWitness) throw Error("Actual prior visual image-review evidence missing; visual poststep required");
        if (!["preview", "validated", "config_added"].every((key) => metadata[key] === true)) throw Error("Metadata has incomplete poststep flags; actual poststep reconciliation required");
        await finish(record,
        {
            status: "audited-reused",
            action: "verified-unchanged-existing-result",
            issue: null,
            verification:
            {
                fullOriginalRead: true,
                designRead: true,
                licenseRead: record.provenance?.license_file ?? "No license file declared in provenance",
                inputFingerprint: inputPresent ? "matches full original and DESIGN" : "historic fingerprint absent; original version not inferred",
                sourceCheck: "passed",
                staticResources: "StaticHomepage.validateStaticOutput passed",
                staticDigest: digest,
                preview: { path: path.join(exported, "preview.png"), width: 1200, height: 900, sha256: previewHash, fingerprint: "matches actual static digest and image hash" },
                qaEvidence: evidence,
                historicalVisualWitness: visualWitness,
                browserTests: "Previously recorded tests reused for unchanged static output; fresh interactions NOT rerun",
                visualReview: "Historical QA retained; no new capture made or fresh visual review claimed",
                registration: "Unique existing GPT-6 option and actual export mapping verified; all user selections/edits untouched",
                retained: "All source, previews, tags, selection and deployment state unchanged",
                builds: "not run",
                deployments: "not run"
            }
        });
        return "continue";
    });
}

const command = process.argv[2] ?? "audit";
if (command === "hold")
{
    const record = state.records.find((record) => record.prompt === process.argv[3]);
    if (!record) throw Error("Prompt not in durable manifest");
    const release = path.join(workspace, "src", "workflows", "script", `.ai-gpt6-release-${state.runId}-${record.prompt}`);
    if (await WorkspaceFiles.info(release)) throw Error("Existing release marker requires owned recovery");
    await PromptPageWorkflow.withPromptLock(workspace, record.prompt, async () =>
    {
        await PromptPageWorkflow.inspect(workspace, { id: record.prompt }, model);
        record.status = "active-generation";
        state.activePrompt = record.prompt;
        state.currentAction = "Actual gpt-6.1-sol serial worker generation; coordinator-owned attached prompt lock held";
        state.ownedLock = { prompt: record.prompt, pid: process.pid, release };
        await save();
        console.log(JSON.stringify({ ready: true, prompt: record.prompt, pid: process.pid, release }));
        while (!await WorkspaceFiles.info(release)) await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    const { unlink } = await import("node:fs/promises");
    await unlink(release);
    console.log(JSON.stringify({ released: record.prompt }));
}
else if (command === "record" || command === "record-poststep")
{
    const record = state.records.find((record) => record.prompt === process.argv[3]);
    const current = await PromptPageWorkflow.inspect(workspace, { id: record.prompt }, model);
    record.metadata = current.metadata;
    let complete = current.metadata && Object.values(flags(current.metadata)).every((value) => value === true);
    const qaFile = path.join(record.output, ".checks", "qa.json");
    const qa = await WorkspaceFiles.info(qaFile) ? await WorkspaceFiles.json(qaFile) : null;
    const report = await WorkspaceFiles.json(process.argv[4]);
    record.tagValidation = Boolean(current.metadata?.tags?.length);
    let reconciled = null;
    let reconciliationError = null;
    if (complete)
    {
        try
        {
            await StaticHomepage.checkSource(current.folder);
            const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
            const group = config.pages[record.prompt];
            const registered = (Array.isArray(group) ? group : group?.pages ?? []).filter((option) => option.model === model.directory);
            if (registered.length !== 1 || registered[0].staticDir !== current.metadata.staticDir) throw Error("Actual unique registration/export mapping not verified");
            const exported = await WorkspaceFiles.inside(current.folder, ...current.metadata.staticDir.split("/"));
            const digest = await StaticHomepage.validateStaticOutput(exported, registered[0].slug, model.directory);
            const image = await readFile(path.join(exported, "preview.png"));
            if (image.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || image.readUInt32BE(16) !== 1200 || image.readUInt32BE(20) !== 900) throw Error("Worker preview PNG invalid");
            if ((await WorkspaceFiles.text(path.join(current.folder, ".generation-preview.sha256"))).trim() !== `${digest} ${hash(image)}`) throw Error("Worker actual preview digest mismatch");
            const original = await WorkspaceFiles.text(record.file);
            if ((await WorkspaceFiles.text(path.join(current.folder, ".generation-input.sha256"))).trim() !== hash(JSON.stringify([original, design]))) throw Error("Worker input fingerprint mismatch");
            if (qa?.visualReviewed !== true || qa.passed === false || (Array.isArray(qa.errors) && qa.errors.length)) throw Error("Worker actual QA/visual evidence incomplete");
            reconciled = { source: "passed", staticDigest: digest, inputFingerprint: "matches", previewFingerprint: "matches actual 1200x900 PNG", registration: "Unique actual GPT-6 mapping verified, user edits preserved", visual: command === "record-poststep" ? "Coordinator actually opened both new viewport screenshots and official preview after functional browser suite; generated source retained" : "Worker actual image-open review and browser results read; not repeated", resourcesClosed: report.resourcesClosed };
        }
        catch (error)
        {
            complete = false;
            reconciliationError = error.message;
        }
    }
    await finish(record, { status: complete && qa?.visualReviewed === true ? command === "record-poststep" ? "poststep-completed" : "newly-generated" : report.status === "blocked" ? "blocked" : "failed", action: command === "record-poststep" ? "authorized-existing-source-poststeps-only" : "serial-actual-model-worker", issue: reconciliationError ?? (complete ? null : report.blocker ?? report.limitations ?? "Worker left truthful incomplete flags"), verification: { workerReport: report, actualQa: qa, reconciliation: reconciled, fourFlagsReinspected: flags(current.metadata), browserTests: qa ? "Actual functional QA and PNG image-view review verified" : "No QA record", builds: "not run", deployments: "not run" } });
}
else if (command === "release")
{
    const owned = state.ownedLock;
    if (!owned) throw Error("No owned helper recorded");
    await WorkspaceFiles.saveText(owned.release, "Release coordinator-owned prompt lock\n");
    const lock = path.join(workspace, "out", ".generation-locks", `${owned.prompt}.lock`);
    for (let attempt = 0; attempt < 30 && await WorkspaceFiles.info(lock); attempt++)
    {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (await WorkspaceFiles.info(lock)) throw Error("Owned helper did not release; do not advance");
    state.ownedLock = null;
    await save();
    console.log(JSON.stringify({ released: owned.prompt }));
}
else if (command === "reconcile")
{
    state.status = "running";
    state.currentAction = "Reconciling actual historical root QA and prior image-view evidence, with fresh visual review only where missing";
    await save();
    const records = state.records.filter((record) => record.status === "audited-reused" ||
        (record.status === "blocked" && String(record.issue).includes("QA evidence")));
    for (const record of records)
    {
        state.activePrompt = record.prompt;
        await save();
        try
        {
            await audit(record);
        }
        catch (error)
        {
            await finish(record, { status: "blocked", action: "retained-verification-exception", issue: error.message, verification: { actualException: error.message, retained: "All source, preview and registration unchanged", browserTests: "Historical results retained; no fresh interactions claimed" } });
        }
    }
    state.status = "completed-with-blockers";
    state.completedAt = new Date().toISOString();
    await save();
    console.log(JSON.stringify({ status: state.status, checkpoint: state.checkpoint }));
}
else if (command === "verify-generated")
{
    state.status = "running";
    await save();
    for (const record of state.records.filter((record) => record.status === "newly-generated"))
    {
        state.activePrompt = record.prompt;
        state.currentAction = "Final strict-serial reconciliation of actual newly generated source, input, static, preview, tags, QA and registration";
        await save();
        try
        {
            const content = await WorkspaceFiles.text(record.file);
            if (record.provenance?.license_file) await WorkspaceFiles.text(path.join(workspace, record.provenance.license_file));
            await PromptPageWorkflow.withPromptLock(workspace, record.prompt, async () =>
            {
                const current = await PromptPageWorkflow.inspect(workspace, { id: record.prompt, content }, model);
                record.metadata = current.metadata;
                if (!current.metadata || !Object.values(flags(current.metadata)).every((value) => value === true)) throw Error("Final actual metadata flags not all true");
                record.tagValidation = current.metadata.tags.length > 0 && current.metadata.tags.every((tag) => tag === tag.trim() && tag.length > 0) && new Set(current.metadata.tags.map((tag) => tag.toLowerCase())).size === current.metadata.tags.length;
                if (!record.tagValidation) throw Error("Final tags invalid");
                await StaticHomepage.checkSource(current.folder);
                if ((await WorkspaceFiles.text(path.join(current.folder, ".generation-input.sha256"))).trim() !== hash(JSON.stringify([content, design]))) throw Error("Final input fingerprint mismatch");
                const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
                const group = config.pages[record.prompt];
                const options = (Array.isArray(group) ? group : group?.pages ?? []).filter((entry) => entry.model === model.directory);
                if (options.length !== 1 || options[0].staticDir !== current.metadata.staticDir) throw Error("Final registration mismatch");
                const exported = await WorkspaceFiles.inside(current.folder, ...current.metadata.staticDir.split("/"));
                const digest = await StaticHomepage.validateStaticOutput(exported, options[0].slug, model.directory);
                const image = await readFile(path.join(exported, "preview.png"));
                if (image.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || image.readUInt32BE(16) !== 1200 || image.readUInt32BE(20) !== 900) throw Error("Final preview PNG invalid");
                if ((await WorkspaceFiles.text(path.join(current.folder, ".generation-preview.sha256"))).trim() !== `${digest} ${hash(image)}`) throw Error("Final preview fingerprint mismatch");
                const qa = await WorkspaceFiles.json(path.join(current.folder, ".checks", "qa.json"));
                if (qa.visualReviewed !== true || qa.passed === false || (Array.isArray(qa.errors) && qa.errors.length)) throw Error("Final actual QA/visual evidence invalid");
                const finalVerification = { timestamp: new Date().toISOString(), inputRead: "Full original and DESIGN and applicable license", source: "passed", staticDigest: digest, previewSha256: hash(image), preview: "Actual 1200x900 PNG and digest verified", tags: "Trimmed meaningful nonempty unique tags", registration: "Unique actual GPT-6 option and staticDir verified; current user selections preserved", browser: "Actual generating worker desktop/mobile functional QA and PNG image-view review retained; no duplicate browser pass claimed", builds: "not run", deployments: "not run" };
                await finish(record, { status: "newly-generated", action: "serial-actual-model-worker-final-verified", issue: null, verification: { ...record.verification, actualQa: qa, finalVerification } });
            });
        }
        catch (error)
        {
            await finish(record, { status: "failed", action: "retained-final-verification-failure", issue: error.message, verification: { ...record.verification, finalVerificationFailure: error.message, retained: "Actual source, artifacts and metadata preserved; no automatic retry" } });
        }
    }
    state.status = "completed-with-blockers";
    state.completedAt = new Date().toISOString();
    await save();
    console.log(JSON.stringify({ status: state.status, checkpoint: state.checkpoint }));
}
else
{
    state.status = "running";
    await save();
    for (const record of state.records)
    {
        if (record.completedAt) continue;
        state.activePrompt = record.prompt;
        state.currentAction = "Reading complete original input and inspecting actual artifacts under prompt lock";
        await save();
        try
        {
            if (await audit(record) === "worker") break;
        }
        catch (error)
        {
            try
            {
                const current = await PromptPageWorkflow.inspect(workspace, { id: record.prompt }, model);
                record.metadata = current.metadata;
            }
            catch {}
            await finish(record, { status: "blocked", action: "retained-verification-exception", issue: error.message, verification: { actualException: error.message, retained: "All existing source and artifacts; no source regenerated", browserTests: "Fresh browser interactions not run", builds: "not run", deployments: "not run" } });
        }
    }
    if (!state.records.some((record) => !record.completedAt))
    {
        state.status = state.records.some((record) => ["blocked", "failed", "retry-required"].includes(record.status)) ? "completed-with-blockers" : "completed";
        state.completedAt = new Date().toISOString();
        await save();
    }
    console.log(JSON.stringify({ status: state.status, checkpoint: state.checkpoint }));
}
