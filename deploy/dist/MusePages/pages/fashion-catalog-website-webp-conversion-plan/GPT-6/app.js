const $ = (id) => document.getElementById(id);
const original = [
    { id: 1, name: "Linen overshirt", publicId: "maison/products/linen-shirt", format: "jpg", kb: 420, refs: 2, join: "ProductImage.publicId", art: "shirt" },
    { id: 2, name: "Studio light", publicId: "maison/hero/studio", format: "png", kb: 810, refs: 1, join: "HeroBanner.imagePublicId", art: "studio" },
    { id: 3, name: "Objects in form", publicId: "maison/gallery/form", format: "avif", kb: 230, refs: 3, join: "GalleryImage.publicId", art: "vase" },
    { id: 4, name: "Atelier story", publicId: "maison/about/atelier", format: "webp", kb: 170, refs: 1, join: "AboutSection.imagePublicId", art: "studio" },
    { id: 5, name: "The essentials", publicId: "maison/categories/essentials", format: "png", kb: 580, refs: 1, join: "Category exact URL match", art: "shirt" },
    { id: 6, name: "Archive lookbook", publicId: "archive/lookbook", format: "jpg", kb: 640, refs: 1, join: "Outside scope", art: "vase" }
];
let assets = original.map((asset) => ({ ...asset }));
let selected = new Set();
let candidates = [];
let report = null;
const inScope = (asset) => asset.publicId.startsWith("maison/");
const eligible = (asset) => inScope(asset) && asset.format !== "webp";
const urlFor = (asset) => `https://res.cloudinary.com/demo/image/upload/${asset.publicId}.${asset.format}`;
function artwork(asset)
{
    const shape = asset.art === "shirt" ? '<path d="m70 28 35-12 15 13 15-13 35 12 27 38-25 19-16-18v92H84V67L68 85 43 66Z" fill="#c6bdab" stroke="#766e5c" stroke-width="1.4"/><path d="m105 16 15 13 15-13m-15 13v130M84 67v-22M156 67V45" fill="none" stroke="#8f8570"/><circle cx="125" cy="50" r="1.5" fill="#766e5c"/><circle cx="125" cy="72" r="1.5" fill="#766e5c"/><circle cx="125" cy="94" r="1.5" fill="#766e5c"/>' : asset.art === "vase" ? '<ellipse cx="120" cy="156" rx="68" ry="9" fill="#ccc1b1"/><path d="M100 45h40l-6 28c45 27 27 80-14 80S61 100 106 73Z" fill="#b08b75"/><ellipse cx="120" cy="45" rx="20" ry="5" fill="#755e4b"/><path d="m116 44-5-35m8 34 22-34m-25 21L94 14" stroke="#72755c" fill="none" stroke-width="2"/><ellipse cx="104" cy="17" rx="11" ry="4" transform="rotate(32 104 17)" fill="#a2a488"/>' : '<path d="M43 149V40l78-25 78 25v109Z" fill="#d9cfba" stroke="#968973"/><path d="M121 15v134M43 87h156M74 30v119M163 29v120" stroke="#a7977f"/><path d="m27 158 94-9 96 10" stroke="#91856f"/><rect x="69" y="106" width="38" height="43" fill="#aa9678"/><path d="M158 149v-39m-20 1h40l-9-33h-22Z" stroke="#7f7e64" fill="#b9b69b"/>';
    return `<svg viewBox="0 0 240 180" role="img" aria-label="Original ${asset.name} vector artwork">${shape}</svg>`;
}
function invalidate()
{
    candidates = [];
    report = null;
    $("reviewed").checked = false;
    $("reviewed").disabled = true;
    $("apply").disabled = true;
    $("export").disabled = true;
    $("report").textContent = "Selection changed. Generate a fresh dry-run report.";
    $("result").textContent = "0 Cloudinary writes · 0 database writes.";
}
function render()
{
    const search = $("search").value.trim().toLowerCase();
    const format = $("format").value;
    const shown = assets.filter((asset) => `${asset.name} ${asset.publicId}`.toLowerCase().includes(search) && (format === "all" || asset.format === format));
    $("assets").innerHTML = shown.map((asset) => `<article class="asset ${inScope(asset) ? "" : "outside"}"><input class="asset-check" type="checkbox" data-select="${asset.id}" aria-label="Select ${asset.name}" ${selected.has(asset.id) ? "checked" : ""} ${eligible(asset) ? "" : "disabled"}><span class="format">${asset.format.toUpperCase()}</span><button class="asset-preview" data-detail="${asset.id}" aria-label="Inspect ${asset.name}">${artwork(asset)}</button><h3>${asset.name}</h3><p>${inScope(asset) ? asset.format === "webp" ? "WEBP READY" : `${asset.kb} KB / SAMPLE SOURCE` : "OUTSIDE MAISON / PRESERVED"}</p></article>`).join("");
    $("empty").hidden = shown.length > 0;
    $("scoped").textContent = assets.filter(inScope).length;
    $("ready-count").textContent = assets.filter((asset) => inScope(asset) && asset.format === "webp").length;
    $("pending-count").textContent = assets.filter(eligible).length;
    $("selection-count").textContent = `${selected.size} selected`;
    $("dry-run").disabled = !assets.some((asset) => selected.has(asset.id) && eligible(asset));
}
$("assets").addEventListener("change", (event) =>
{
    const id = Number(event.target.dataset.select);
    const asset = assets.find((entry) => entry.id === id);
    if (!asset || !eligible(asset)) return;
    event.target.checked ? selected.add(id) : selected.delete(id);
    invalidate();
    render();
});
$("assets").addEventListener("click", (event) =>
{
    const detail = event.target.closest("[data-detail]");
    if (!detail) return;
    const asset = assets.find((entry) => entry.id === Number(detail.dataset.detail));
    $("asset-name").textContent = asset.name;
    $("asset-id").textContent = asset.publicId;
    $("asset-url").textContent = urlFor(asset);
    $("asset-join").textContent = asset.join;
    $("asset-status").textContent = !inScope(asset) ? "Outside scope. Always preserved." : asset.format === "webp" ? "Already WebP in the sample model. No further change." : "Eligible for a local format/URL rehearsal.";
    $("asset-art").innerHTML = artwork(asset);
    $("detail").showModal();
});
$("close").addEventListener("click", () => $("detail").close());
["search", "format"].forEach((id) => $(id).addEventListener("input", render));
$("select-all").addEventListener("click", () =>
{
    selected = new Set(assets.filter(eligible).map((asset) => asset.id));
    invalidate();
    render();
});
$("dry-run").addEventListener("click", () =>
{
    candidates = assets.filter((asset) => selected.has(asset.id) && eligible(asset)).map((asset) => ({ ...asset, fromUrl: urlFor(asset) }));
    report = { simulation: true, mode: "dry-run", prefix: "maison/", candidates, results: [], cloudinaryWrites: 0, databaseWrites: 0 };
    $("report").textContent = `DRY RUN — ${candidates.length} candidate(s)\n${candidates.map((asset) => `${asset.publicId}\n${asset.format} → webp · ${asset.refs} sample reference(s)`).join("\n")}\n\n0 real writes. All originals untouched.`;
    $("reviewed").disabled = false;
    $("reviewed").checked = false;
    $("apply").disabled = true;
    $("export").disabled = false;
    $("log").textContent += `\nDRY RUN: ${candidates.length} candidate(s) under maison/; 0 writes.`;
});
$("reviewed").addEventListener("change", () => $("apply").disabled = !$("reviewed").checked || !candidates.length);
$("apply").addEventListener("click", () =>
{
    if (!$("reviewed").checked || !candidates.length) return;
    let updated = 0;
    const results = candidates.map((candidate, index) =>
    {
        const fail = $("inject").checked && index === 0;
        const asset = assets.find((entry) => entry.id === candidate.id);
        if (!fail)
        {
            asset.format = "webp";
            updated += asset.refs;
            selected.delete(asset.id);
        }
        return { publicId: candidate.publicId, fromUrl: candidate.fromUrl, toUrl: fail ? null : urlFor(asset), error: fail ? "Injected sample failure; original record preserved" : null };
    });
    const failed = results.filter((result) => result.error).length;
    report.mode = "preview-applied-in-memory";
    report.results = results;
    report.sampleReferencesUpdated = updated;
    $("result").textContent = `LOCAL PREVIEW: ${results.length - failed} updated, ${failed} failed, ${updated} sample URL references. 0 real writes.`;
    $("log").textContent += `\n${$("result").textContent}\n${results.map((result) => `${result.error ? "FAILED / PRESERVED" : "SIMULATED"} ${result.publicId}`).join("\n")}`;
    candidates = [];
    $("reviewed").checked = false;
    $("reviewed").disabled = true;
    $("apply").disabled = true;
    render();
});
$("reset").addEventListener("click", () =>
{
    assets = original.map((asset) => ({ ...asset }));
    selected.clear();
    $("search").value = "";
    $("format").value = "all";
    $("inject").checked = false;
    invalidate();
    $("log").textContent += "\nRESET: sample library restored; activity retained.";
    render();
});
$("export").addEventListener("click", () =>
{
    if (!report) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "maison-webp-rehearsal.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
render();
