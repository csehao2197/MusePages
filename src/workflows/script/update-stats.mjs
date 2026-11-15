import
{
    createHash,
    randomUUID
}
from "node:crypto";
import
{
    readFile,
    rename,
    unlink,
    writeFile
}
from "node:fs/promises";
import path from "node:path";
import
{
    fileURLToPath
}
from "node:url";

const root = fileURLToPath(new URL("../../../", import.meta.url));

function counter()
{
    return {
        prompts: new Set(),
        pageCount: 0,
        enabledPageCount: 0,
        deployedPageCount: 0
    };
}

function countPage(counts, prompt, page)
{
    counts.prompts.add(prompt);
    counts.pageCount++;
    if (page.enabled) counts.enabledPageCount++;
    if (page.deployed === true) counts.deployedPageCount++;
}

function countsObject(counts)
{
    const
    {
        prompts,
        ...pages
    } = counts;
    return {
        promptCount: prompts.size,
        ...pages
    };
}

function namedCounter(map, name)
{
    const key = name.toLowerCase();
    if (!map.has(key)) map.set(key,
    {
        name,
        counts: counter()
    });
    return map.get(key).counts;
}

function namedCounts(map, sorted = false)
{
    const entries = [...map.values()];
    if (sorted) entries.sort((a, b) => b.counts.pageCount - a.counts.pageCount || a.name.localeCompare(b.name));
    return Object.fromEntries(entries.map(({ name, counts }) => [name, countsObject(counts)]));
}

export function summarizeDeployConfig(config)
{
    if (config?.version !== 2 || !config.pages || typeof config.pages !== "object" || Array.isArray(config.pages))
    {
        throw Error("Expected config version 2 and a pages object keyed by prompt filename");
    }
    const names = config.categories ?? [];
    if (!Array.isArray(names))
    {
        throw Error("Expected a categories array");
    }
    const categories = new Map();
    for (const name of names)
    {
        if (typeof name !== "string" || !name.trim() || categories.has(name.trim().toLowerCase()))
        {
            throw Error("Expected unique, nonempty category names");
        }
        namedCounter(categories, name.trim());
    }
    const totals = counter();
    const uncategorized = counter();
    const models = new Map();
    const tags = new Map();
    for (const [prompt, group] of Object.entries(config.pages))
    {
        if (!group || typeof group !== "object" || !Array.isArray(group.pages))
        {
            throw Error(`Expected a prompt object with a pages array for ${prompt}`);
        }
        const category = typeof group.category === "string" ? categories.get(group.category.toLowerCase())?.counts : null;
        const categoryCounts = category ?? uncategorized;
        totals.prompts.add(prompt);
        categoryCounts.prompts.add(prompt);
        const seenModels = new Set();
        for (const page of group.pages)
        {
            if (!page || typeof page.model !== "string" || !page.model.trim() ||
                typeof page.enabled !== "boolean" || (page.deployed !== undefined && typeof page.deployed !== "boolean") ||
                !Array.isArray(page.tags) || page.tags.some((tag) => typeof tag !== "string"))
            {
                throw Error(`Invalid model statistics fields for ${prompt}`);
            }
            const model = page.model.trim();
            if (seenModels.has(model.toLowerCase()))
            {
                throw Error(`Duplicate model for ${prompt}: ${model}`);
            }
            seenModels.add(model.toLowerCase());
            countPage(totals, prompt, page);
            countPage(categoryCounts, prompt, page);
            countPage(namedCounter(models, model), prompt, page);
            const seenTags = new Set();
            for (const value of page.tags)
            {
                const tag = value.trim();
                const key = tag.toLowerCase();
                if (!tag || seenTags.has(key)) continue;
                seenTags.add(key);
                countPage(namedCounter(tags, tag), prompt, page);
            }
        }
    }
    return {
        totals:
        {
            ...countsObject(totals),
            categoryCount: categories.size,
            modelCount: models.size,
            tagCount: tags.size
        },
        categories: namedCounts(categories),
        models: namedCounts(models, true),
        tags: namedCounts(tags, true),
        uncategorized: countsObject(uncategorized)
    };
}

export async function updateStats(workspace = root)
{
    const directory = path.join(workspace, "deploy");
    const configFile = path.join(directory, "config.json");
    const configBytes = await readFile(configFile);
    const stats =
    {
        version: 1,
        generatedAt: new Date().toISOString(),
        source: "config.json",
        configSha256: createHash("sha256").update(configBytes).digest("hex"),
        ...summarizeDeployConfig(JSON.parse(configBytes.toString("utf8")))
    };
    const temporary = path.join(directory, `.stats-${randomUUID()}.tmp`);
    await writeFile(temporary, JSON.stringify(stats, null, 4) + "\n",
    {
        flag: "wx"
    });
    try
    {
        if (!(await readFile(configFile)).equals(configBytes))
        {
            throw Error("Deployment config changed while calculating statistics; run again");
        }
        await rename(temporary, path.join(directory, "stats.json"));
    }
    finally
    {
        await unlink(temporary).catch((error) =>
        {
            if (error.code !== "ENOENT") throw error;
        });
    }
    return stats;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
{
    try
    {
        const stats = await updateStats();
        console.log(`Updated deploy\\stats.json: ${stats.totals.promptCount} prompts, ${stats.totals.pageCount} model pages.`);
    }
    catch (error)
    {
        console.error(`Statistics update failed: ${error.message}`);
        process.exitCode = 1;
    }
}
